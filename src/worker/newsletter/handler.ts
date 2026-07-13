import { isLocale } from "../../i18n/locales";
import type { Environment } from "../contracts";
import { isSameOrigin, jsonResponse, methodNotAllowed } from "../http";
import { createSubmissionFingerprint } from "../security";
import { verifyTurnstile } from "../turnstile";
import {
  newsletterConsentVersion,
  newsletterSources,
  type NewsletterSource,
} from "./contracts";
import { isConfirmationToken } from "./crypto";
import {
  confirmNewsletterSubscription,
  normalizeNewsletterEmail,
  normalizeNewsletterSourcePath,
  requestNewsletterSubscription,
  synchronizeNewsletterSubscription,
} from "./service";

const maximumRequestBytes = 4_096;
const publicNewsletterSources: readonly NewsletterSource[] = ["home", "article", "newsletter_page"];

interface NewsletterSubscriptionSubmission
{
  readonly email?: unknown;
  readonly locale?: unknown;
  readonly source?: unknown;
  readonly sourcePath?: unknown;
  readonly consentVersion?: unknown;
  readonly turnstileToken?: unknown;
  readonly company?: unknown;
}

interface NewsletterConfirmationSubmission
{
  readonly token?: unknown;
}

export async function handleNewsletterSubscriptionRequest(
  request: Request,
  environment: Environment,
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

  const submission = await readJson<NewsletterSubscriptionSubmission>(request);

  if (submission === null)
  {
    return jsonResponse({ error: "invalid_submission" }, 400, { "Cache-Control": "no-store" });
  }

  if (typeof submission.company === "string" && submission.company.trim() !== "")
  {
    return acceptedResponse();
  }

  const email = normalizeNewsletterEmail(submission.email);
  const locale = isLocale(submission.locale) ? submission.locale : null;
  const source = newsletterSources.find((candidate) => candidate === submission.source);
  const sourcePath = normalizeNewsletterSourcePath(submission.sourcePath);
  const turnstileToken = typeof submission.turnstileToken === "string" ? submission.turnstileToken.trim() : "";

  if (
    email === null
    || locale === null
    || source === undefined
    || !publicNewsletterSources.includes(source)
    || sourcePath === null
    || submission.consentVersion !== newsletterConsentVersion
    || turnstileToken.length < 10
    || turnstileToken.length > 2_048
  )
  {
    return jsonResponse({ error: "invalid_submission" }, 400, { "Cache-Control": "no-store" });
  }

  const requestId = crypto.randomUUID();
  const turnstileIsValid = await verifyTurnstile(
    request,
    environment,
    turnstileToken,
    requestId,
    "newsletter_subscribe",
  );

  if (!turnstileIsValid)
  {
    return jsonResponse({ error: "turnstile_failed" }, 400, { "Cache-Control": "no-store" });
  }

  const now = Date.now();
  const submissionFingerprint = await createSubmissionFingerprint(request, environment, now);
  const result = await requestNewsletterSubscription(environment, {
    email,
    locale,
    source,
    sourcePath,
    consentVersion: newsletterConsentVersion,
    submissionFingerprint,
  });

  if (result.status === "rate_limited")
  {
    return jsonResponse({ error: "rate_limited" }, 429, {
      "Cache-Control": "no-store",
      "Retry-After": "3600",
    });
  }

  return acceptedResponse();
}

export async function handleNewsletterConfirmationRequest(
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

  const submission = await readJson<NewsletterConfirmationSubmission>(request);

  if (submission === null || !isConfirmationToken(submission.token))
  {
    return jsonResponse({ status: "invalid" }, 400, { "Cache-Control": "no-store" });
  }

  const result = await confirmNewsletterSubscription(environment, submission.token);

  if (result.subscriptionId !== null)
  {
    executionContext.waitUntil(synchronizeNewsletterSubscription(environment, result.subscriptionId));
  }

  const responseStatus = result.status === "invalid" ? 400 : result.status === "expired" ? 410 : 200;
  return jsonResponse({ status: result.status }, responseStatus, { "Cache-Control": "no-store" });
}

async function readJson<T>(request: Request): Promise<T | null>
{
  const contentType = request.headers.get("Content-Type") ?? "";
  const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);

  if (!contentType.toLowerCase().startsWith("application/json") || contentLength > maximumRequestBytes)
  {
    return null;
  }

  try
  {
    const text = await request.text();

    if (new TextEncoder().encode(text).byteLength > maximumRequestBytes)
    {
      return null;
    }

    return JSON.parse(text) as T;
  }
  catch
  {
    return null;
  }
}

function acceptedResponse(): Response
{
  return jsonResponse(
    { accepted: true, status: "confirmation_required" },
    202,
    { "Cache-Control": "no-store" },
  );
}
