import type { Environment } from "./contracts";
import { isLocale, type Locale } from "../i18n/locales";
import { isSameOrigin, jsonResponse, methodNotAllowed } from "./http";
import { sendContactNotification } from "./notifications";
import { createSubmissionFingerprint } from "./security";
import { verifyTurnstile } from "./turnstile";
import { newsletterConsentVersion } from "./newsletter/contracts";
import {
  normalizeNewsletterSourcePath,
  requestNewsletterSubscription,
} from "./newsletter/service";

const maximumRequestBytes = 24_576;
const abuseWindowMilliseconds = 60 * 60 * 1000;
const maximumSubmissionsPerWindow = 3;

interface ContactSubmission
{
  readonly name?: unknown;
  readonly email?: unknown;
  readonly website?: unknown;
  readonly message?: unknown;
  readonly language?: unknown;
  readonly turnstileToken?: unknown;
  readonly company?: unknown;
  readonly newsletterOptIn?: unknown;
  readonly newsletterConsentVersion?: unknown;
  readonly sourcePath?: unknown;
}

interface ValidatedContactSubmission
{
  readonly name: string;
  readonly email: string;
  readonly website: string | null;
  readonly message: string;
  readonly language: Locale;
  readonly turnstileToken: string;
  readonly newsletterOptIn: boolean;
  readonly sourcePath: string | null;
}

type ContactSubmissionValidation =
  | { readonly valid: true; readonly submission: ValidatedContactSubmission }
  | { readonly valid: false; readonly invalidFields: readonly string[] };

type NewsletterOptInPublicStatus = "accepted" | "unavailable";

export async function handleContactRequest(
  request: Request,
  environment: Environment,
  executionContext: ExecutionContext,
): Promise<Response>
{
  if (request.method !== "POST")
  {
    return methodNotAllowed(["POST"]);
  }

  if (!isSameOrigin(request, environment.SITE_ORIGIN))
  {
    return jsonResponse({ error: "invalid_origin" }, 403, { "Cache-Control": "no-store" });
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);

  if (!contentType.toLowerCase().startsWith("application/json"))
  {
    return jsonResponse({ error: "unsupported_media_type" }, 415, { "Cache-Control": "no-store" });
  }

  if (contentLength > maximumRequestBytes)
  {
    return jsonResponse({ error: "request_too_large" }, 413, { "Cache-Control": "no-store" });
  }

  let submission: ContactSubmission;

  try
  {
    const requestText = await request.text();

    if (new TextEncoder().encode(requestText).byteLength > maximumRequestBytes)
    {
      return jsonResponse({ error: "request_too_large" }, 413, { "Cache-Control": "no-store" });
    }

    submission = JSON.parse(requestText) as ContactSubmission;
  }
  catch
  {
    return jsonResponse({ error: "invalid_json" }, 400, { "Cache-Control": "no-store" });
  }

  if (typeof submission.company === "string" && submission.company.trim() !== "")
  {
    return acceptedResponse();
  }

  const validation = validateSubmission(submission);

  if (!validation.valid)
  {
    console.warn(JSON.stringify({
      event: "contact_submission_rejected",
      invalidFields: validation.invalidFields,
      rayId: request.headers.get("CF-Ray"),
    }));
    return jsonResponse(
      { error: "invalid_submission", fields: validation.invalidFields },
      400,
      { "Cache-Control": "no-store" },
    );
  }

  const validatedSubmission = validation.submission;

  const messageId = crypto.randomUUID();
  const turnstileIsValid = await verifyTurnstile(
    request,
    environment,
    validatedSubmission.turnstileToken,
    messageId,
    "contact_submit",
  );

  if (!turnstileIsValid)
  {
    return jsonResponse({ error: "turnstile_failed" }, 400, { "Cache-Control": "no-store" });
  }

  const now = Date.now();
  const submissionFingerprint = await createSubmissionFingerprint(request, environment, now);
  const recentSubmission = await environment.SITE_DATABASE
    .prepare(`
      SELECT COUNT(*) AS submission_count
      FROM contact_messages
      WHERE submission_fingerprint = ? AND created_at >= ?
    `)
    .bind(submissionFingerprint, now - abuseWindowMilliseconds)
    .first<{ readonly submission_count: number }>();

  if ((recentSubmission?.submission_count ?? 0) >= maximumSubmissionsPerWindow)
  {
    return jsonResponse(
      { error: "rate_limited" },
      429,
      { "Cache-Control": "no-store", "Retry-After": "3600" },
    );
  }

  await environment.SITE_DATABASE
    .prepare(`
      INSERT INTO contact_messages
      (
        id, status, sender_name, sender_email, sender_website, message_text,
        language, created_at, updated_at, submission_fingerprint
      )
      VALUES (?, 'unread', ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      messageId,
      validatedSubmission.name,
      validatedSubmission.email,
      validatedSubmission.website,
      validatedSubmission.message,
      validatedSubmission.language,
      now,
      now,
      submissionFingerprint,
    )
    .run();

  executionContext.waitUntil(sendContactNotification(environment, {
    id: messageId,
    name: validatedSubmission.name,
    email: validatedSubmission.email,
    website: validatedSubmission.website,
    message: validatedSubmission.message,
    language: validatedSubmission.language,
    createdAt: now,
  }));

  let newsletterStatus: NewsletterOptInPublicStatus | undefined;

  if (validatedSubmission.newsletterOptIn && validatedSubmission.sourcePath !== null)
  {
    try
    {
      const result = await requestNewsletterSubscription(environment, {
        email: validatedSubmission.email,
        locale: validatedSubmission.language,
        source: "contact",
        sourcePath: validatedSubmission.sourcePath,
        consentVersion: newsletterConsentVersion,
        submissionFingerprint,
      });
      newsletterStatus = result.status === "rate_limited" || result.status === "suppressed"
        ? "unavailable"
        : "accepted";
    }
    catch (error)
    {
      newsletterStatus = "unavailable";
      console.error(JSON.stringify({
        event: "contact_newsletter_opt_in_failed",
        errorName: error instanceof Error ? error.name : "UnknownError",
      }));
    }
  }

  return acceptedResponse(newsletterStatus);
}

function validateSubmission(submission: ContactSubmission): ContactSubmissionValidation
{
  const name = typeof submission.name === "string" ? submission.name.replace(/\s+/g, " ").trim() : "";
  const email = typeof submission.email === "string" ? submission.email.trim().toLowerCase() : "";
  const message = typeof submission.message === "string" ? submission.message.replace(/\r\n?/g, "\n").trim() : "";
  const website = normalizeWebsite(submission.website);
  const language = isLocale(submission.language) ? submission.language : null;
  const turnstileToken = typeof submission.turnstileToken === "string" ? submission.turnstileToken.trim() : "";
  const newsletterOptIn = submission.newsletterOptIn === true;
  const sourcePath = newsletterOptIn ? normalizeNewsletterSourcePath(submission.sourcePath) : null;
  const invalidFields: string[] = [];

  if (name.length < 2 || name.length > 100)
  {
    invalidFields.push("name");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
  {
    invalidFields.push("email");
  }

  if (website === undefined)
  {
    invalidFields.push("website");
  }

  if (message.length < 10 || message.length > 10_000)
  {
    invalidFields.push("message");
  }

  if (language === null)
  {
    invalidFields.push("language");
  }

  if (turnstileToken.length < 10 || turnstileToken.length > 2_048)
  {
    invalidFields.push("verification");
  }

  if (
    submission.newsletterOptIn !== undefined
    && typeof submission.newsletterOptIn !== "boolean"
  )
  {
    invalidFields.push("newsletter");
  }

  if (
    newsletterOptIn
    && (submission.newsletterConsentVersion !== newsletterConsentVersion || sourcePath === null)
  )
  {
    invalidFields.push("newsletter");
  }

  if (invalidFields.length > 0 || website === undefined || language === null)
  {
    return { valid: false, invalidFields };
  }

  return {
    valid: true,
    submission: {
      name,
      email,
      website,
      message,
      language,
      turnstileToken,
      newsletterOptIn,
      sourcePath,
    },
  };
}

function normalizeWebsite(value: unknown): string | null | undefined
{
  if (value === undefined || value === null)
  {
    return null;
  }

  if (typeof value !== "string")
  {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === "")
  {
    return null;
  }

  if (trimmedValue.length > 500)
  {
    return undefined;
  }

  try
  {
    const valueWithProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;
    const url = new URL(valueWithProtocol);
    const isSupportedUrl = (url.protocol === "http:" || url.protocol === "https:")
      && url.hostname !== ""
      && url.href.length <= 500;

    return isSupportedUrl ? url.href : undefined;
  }
  catch
  {
    return undefined;
  }
}

function acceptedResponse(newsletterStatus?: NewsletterOptInPublicStatus): Response
{
  return jsonResponse(
    {
      accepted: true,
      ...(newsletterStatus === undefined ? {} : { newsletter: newsletterStatus }),
    },
    202,
    { "Cache-Control": "no-store" },
  );
}
