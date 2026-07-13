import type { CommentRecord, Environment } from "./contracts";
import { isLocale, type Locale } from "../i18n/locales";
import { isSameOrigin, jsonResponse, methodNotAllowed } from "./http";
import { sendCommentNotification } from "./notifications";
import { createSubmissionFingerprint } from "./security";
import { verifyTurnstile } from "./turnstile";
import { newsletterConsentVersion } from "./newsletter/contracts";
import {
  completeNewsletterSubscription,
  normalizeNewsletterEmail,
  normalizeNewsletterSourcePath,
  requestNewsletterSubscription,
} from "./newsletter/service";

const defaultPageSize = 30;
const maximumPageSize = 100;
const maximumRequestBytes = 16_384;
const abuseWindowMilliseconds = 15 * 60 * 1000;
const maximumSubmissionsPerWindow = 5;

interface CommentSubmission
{
  readonly contentId?: unknown;
  readonly parentId?: unknown;
  readonly authorName?: unknown;
  readonly authorUrl?: unknown;
  readonly body?: unknown;
  readonly language?: unknown;
  readonly turnstileToken?: unknown;
  readonly website?: unknown;
  readonly anchorId?: unknown;
  readonly anchorQuote?: unknown;
  readonly anchorLocale?: unknown;
  readonly discussionPromptKey?: unknown;
  readonly newsletterOptIn?: unknown;
  readonly newsletterEmail?: unknown;
  readonly newsletterConsentVersion?: unknown;
  readonly sourcePath?: unknown;
}

interface CommentCursor
{
  readonly createdAt: number;
  readonly id: string;
}

type NewsletterOptInPublicStatus = "accepted" | "unavailable";

export async function handleCommentsRequest(
  request: Request,
  environment: Environment,
  executionContext: ExecutionContext,
): Promise<Response>
{
  if (request.method === "GET")
  {
    return listComments(request, environment);
  }

  if (request.method === "POST")
  {
    return submitComment(request, environment, executionContext);
  }

  return methodNotAllowed(["GET", "POST"]);
}

async function listComments(request: Request, environment: Environment): Promise<Response>
{
  const url = new URL(request.url);
  const contentId = normalizeContentId(url.searchParams.get("content"));

  if (contentId === null || !(await isKnownContent(contentId, environment)))
  {
    return jsonResponse({ error: "invalid_post" }, 400, { "Cache-Control": "no-store" });
  }

  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? `${defaultPageSize}`, 10);
  const pageSize = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), maximumPageSize)
    : defaultPageSize;
  const cursor = decodeCursor(url.searchParams.get("cursor"));
  const language = normalizeLanguage(url.searchParams.get("language"));

  if (language === null)
  {
    return jsonResponse({ error: "invalid_language" }, 400, { "Cache-Control": "no-store" });
  }
  const queryLimit = pageSize + 1;

  const statement = cursor === null
    ? environment.SITE_DATABASE.prepare(`
        SELECT id, content_id, parent_id, author_name, author_url, body_text, language, created_at,
               anchor_locale, anchor_id, anchor_quote, discussion_prompt_key
        FROM comments
        WHERE content_id = ? AND status = 'approved'
          AND (anchor_id IS NULL OR anchor_locale = ?)
        ORDER BY created_at ASC, id ASC
        LIMIT ?
      `).bind(contentId, language, queryLimit)
    : environment.SITE_DATABASE.prepare(`
        SELECT id, content_id, parent_id, author_name, author_url, body_text, language, created_at,
               anchor_locale, anchor_id, anchor_quote, discussion_prompt_key
        FROM comments
        WHERE content_id = ?
          AND status = 'approved'
          AND (anchor_id IS NULL OR anchor_locale = ?)
          AND (created_at > ? OR (created_at = ? AND id > ?))
        ORDER BY created_at ASC, id ASC
        LIMIT ?
      `).bind(contentId, language, cursor.createdAt, cursor.createdAt, cursor.id, queryLimit);

  const result = await statement.all<CommentRecord>();
  const comments = result.results.slice(0, pageSize);
  const lastComment = comments.at(-1);
  const nextCursor = result.results.length > pageSize && lastComment !== undefined
    ? encodeCursor({ createdAt: lastComment.created_at, id: lastComment.id })
    : null;

  return jsonResponse(
    {
      comments: comments.map(toPublicComment),
      nextCursor,
    },
    200,
    { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300" },
  );
}

async function submitComment(
  request: Request,
  environment: Environment,
  executionContext: ExecutionContext,
): Promise<Response>
{
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

  let submission: CommentSubmission;

  try
  {
    const requestText = await request.text();

    if (new TextEncoder().encode(requestText).byteLength > maximumRequestBytes)
    {
      return jsonResponse({ error: "request_too_large" }, 413, { "Cache-Control": "no-store" });
    }

    submission = JSON.parse(requestText) as CommentSubmission;
  }
  catch
  {
    return jsonResponse({ error: "invalid_json" }, 400, { "Cache-Control": "no-store" });
  }

  if (typeof submission.website === "string" && submission.website.trim() !== "")
  {
    return acceptedResponse();
  }

  const validatedSubmission = validateSubmission(submission);

  const contentRegistration = validatedSubmission === null
    ? null
    : await getContentRegistration(validatedSubmission.contentId, environment);

  if (validatedSubmission === null || contentRegistration === null)
  {
    return jsonResponse({ error: "invalid_submission" }, 400, { "Cache-Control": "no-store" });
  }

  const commentId = crypto.randomUUID();
  const turnstileIsValid = await verifyTurnstile(
    request,
    environment,
    validatedSubmission.turnstileToken,
    commentId,
    "comment_submit",
  );

  if (!turnstileIsValid)
  {
    return jsonResponse({ error: "turnstile_failed" }, 400, { "Cache-Control": "no-store" });
  }

  let effectiveAnchor = {
    locale: validatedSubmission.anchorLocale,
    id: validatedSubmission.anchorId,
    quote: validatedSubmission.anchorQuote,
    promptKey: validatedSubmission.discussionPromptKey,
  };

  if (validatedSubmission.parentId !== null)
  {
    const parentComment = await environment.SITE_DATABASE
      .prepare(`
        SELECT id, anchor_locale, anchor_id, anchor_quote, discussion_prompt_key
        FROM comments
        WHERE id = ? AND content_id = ? AND status = 'approved'
        LIMIT 1
      `)
      .bind(validatedSubmission.parentId, validatedSubmission.contentId)
      .first<{
        readonly id: string;
        readonly anchor_locale: Locale | null;
        readonly anchor_id: string | null;
        readonly anchor_quote: string | null;
        readonly discussion_prompt_key: string | null;
      }>();

    if (parentComment === null || (parentComment.anchor_id !== null && parentComment.anchor_locale !== validatedSubmission.language))
    {
      return jsonResponse({ error: "invalid_parent" }, 400, { "Cache-Control": "no-store" });
    }

    if (parentComment.anchor_id !== null)
    {
      effectiveAnchor = {
        locale: parentComment.anchor_locale,
        id: parentComment.anchor_id,
        quote: parentComment.anchor_quote,
        promptKey: parentComment.discussion_prompt_key,
      };
    }
  }

  const now = Date.now();
  const submissionFingerprint = await createSubmissionFingerprint(request, environment, now);
  const recentSubmission = await environment.SITE_DATABASE
    .prepare(`
      SELECT COUNT(*) AS submission_count
      FROM comments
      WHERE submission_fingerprint = ? AND created_at >= ?
    `)
    .bind(submissionFingerprint, now - abuseWindowMilliseconds)
    .first<{ readonly submission_count: number }>();

  if ((recentSubmission?.submission_count ?? 0) >= maximumSubmissionsPerWindow)
  {
    return jsonResponse(
      { error: "rate_limited" },
      429,
      { "Cache-Control": "no-store", "Retry-After": "900" },
    );
  }

  await environment.SITE_DATABASE
    .prepare(`
      INSERT INTO comments
      (
        id, content_id, post_path, parent_id, source, status, author_name, author_url,
        body_text, language, created_at, updated_at, submission_fingerprint,
        anchor_locale, anchor_id, anchor_quote, discussion_prompt_key
      )
      VALUES (?, ?, ?, ?, 'site', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      commentId,
      validatedSubmission.contentId,
      contentRegistration.commentPath,
      validatedSubmission.parentId,
      validatedSubmission.authorName,
      validatedSubmission.authorUrl,
      validatedSubmission.body,
      validatedSubmission.language,
      now,
      now,
      submissionFingerprint,
      effectiveAnchor.locale,
      effectiveAnchor.id,
      effectiveAnchor.quote,
      effectiveAnchor.promptKey,
    )
    .run();

  executionContext.waitUntil(sendCommentNotification(environment, {
    id: commentId,
    contentId: validatedSubmission.contentId,
    canonicalPath: await getCanonicalPath(validatedSubmission.contentId, validatedSubmission.language, environment),
    parentId: validatedSubmission.parentId,
    authorName: validatedSubmission.authorName,
    authorUrl: validatedSubmission.authorUrl,
    body: validatedSubmission.body,
    language: validatedSubmission.language,
    anchorQuote: effectiveAnchor.quote,
    createdAt: now,
  }));

  let newsletterStatus: NewsletterOptInPublicStatus | undefined;

  if (
    validatedSubmission.newsletterOptIn
    && validatedSubmission.newsletterEmail !== null
    && validatedSubmission.sourcePath !== null
  )
  {
    try
    {
      const result = await requestNewsletterSubscription(environment, {
        email: validatedSubmission.newsletterEmail,
        locale: validatedSubmission.language,
        source: "comment",
        sourcePath: validatedSubmission.sourcePath,
        consentVersion: newsletterConsentVersion,
        submissionFingerprint,
      });
      newsletterStatus = result.status === "rate_limited" || result.status === "suppressed"
        ? "unavailable"
        : "accepted";

      if (result.subscriptionId !== null)
      {
        executionContext.waitUntil(completeNewsletterSubscription(environment, result.subscriptionId));
      }
    }
    catch (error)
    {
      newsletterStatus = "unavailable";
      console.error(JSON.stringify({
        event: "comment_newsletter_opt_in_failed",
        errorName: error instanceof Error ? error.name : "UnknownError",
      }));
    }
  }

  return acceptedResponse(newsletterStatus);
}

function validateSubmission(submission: CommentSubmission): {
  readonly contentId: string;
  readonly parentId: string | null;
  readonly authorName: string;
  readonly authorUrl: string | null;
  readonly body: string;
  readonly language: Locale;
  readonly turnstileToken: string;
  readonly anchorLocale: Locale | null;
  readonly anchorId: string | null;
  readonly anchorQuote: string | null;
  readonly discussionPromptKey: string | null;
  readonly newsletterOptIn: boolean;
  readonly newsletterEmail: string | null;
  readonly sourcePath: string | null;
} | null
{
  const contentId = normalizeContentId(submission.contentId);
  const authorName = normalizeSingleLineText(submission.authorName);
  const body = normalizeCommentBody(submission.body);
  const authorUrl = normalizeAuthorUrl(submission.authorUrl);
  const parentId = typeof submission.parentId === "string" && submission.parentId.trim() !== ""
    ? submission.parentId.trim()
    : null;
  const language = normalizeLanguage(submission.language);
  const turnstileToken = typeof submission.turnstileToken === "string" ? submission.turnstileToken.trim() : "";
  const anchorId = normalizeAnchorId(submission.anchorId);
  const anchorQuote = normalizeAnchorQuote(submission.anchorQuote);
  const anchorLocale = normalizeLanguage(submission.anchorLocale);
  const discussionPromptKey = normalizePromptKey(submission.discussionPromptKey);
  const hasAnyAnchorField = submission.anchorId !== undefined
    || submission.anchorQuote !== undefined
    || submission.anchorLocale !== undefined;
  const newsletterOptIn = submission.newsletterOptIn === true;
  const newsletterEmail = newsletterOptIn ? normalizeNewsletterEmail(submission.newsletterEmail) : null;
  const sourcePath = newsletterOptIn ? normalizeNewsletterSourcePath(submission.sourcePath) : null;

  if (
    contentId === null
    || authorName === null
    || body === null
    || authorUrl === undefined
    || language === null
    || turnstileToken.length < 10
    || turnstileToken.length > 2_048
    || (parentId !== null && !/^[0-9a-f-]{36}$/i.test(parentId))
    || (hasAnyAnchorField && (anchorId === null || anchorQuote === null || anchorLocale !== language))
    || discussionPromptKey === undefined
    || (submission.newsletterOptIn !== undefined && typeof submission.newsletterOptIn !== "boolean")
    || (
      newsletterOptIn
      && (
        newsletterEmail === null
        || sourcePath === null
        || submission.newsletterConsentVersion !== newsletterConsentVersion
      )
    )
  )
  {
    return null;
  }

  return {
    contentId,
    parentId,
    authorName,
    authorUrl,
    body,
    language,
    turnstileToken,
    anchorLocale: hasAnyAnchorField ? anchorLocale : null,
    anchorId: hasAnyAnchorField ? anchorId : null,
    anchorQuote: hasAnyAnchorField ? anchorQuote : null,
    discussionPromptKey,
    newsletterOptIn,
    newsletterEmail,
    sourcePath,
  };
}

function normalizeLanguage(value: unknown): Locale | null
{
  return isLocale(value) ? value : null;
}

function normalizeAnchorId(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const normalized = value.trim();
  return /^paragraph-[a-f0-9]{12}(?:-\d+)?$/.test(normalized) ? normalized : null;
}

function normalizeAnchorQuote(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length >= 3 && normalized.length <= 500 ? normalized : null;
}

function normalizePromptKey(value: unknown): string | null | undefined
{
  if (value === undefined || value === null || value === "")
  {
    return null;
  }

  if (typeof value !== "string")
  {
    return undefined;
  }

  const normalized = value.trim();
  return /^[a-z0-9][a-z0-9._-]{2,79}$/.test(normalized) ? normalized : undefined;
}

function normalizeContentId(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const normalized = value.trim();
  return /^(?:page\/[a-z0-9-]+|\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+)$/.test(normalized) ? normalized : null;
}

async function isKnownContent(contentId: string, environment: Environment): Promise<boolean>
{
  return (await getContentRegistration(contentId, environment)) !== null;
}

async function getContentRegistration(
  contentId: string,
  environment: Environment,
): Promise<{ readonly contentId: string; readonly commentPath: string } | null>
{
  const post = await environment.SITE_DATABASE
    .prepare("SELECT translation_key, comment_path FROM site_posts WHERE translation_key = ? AND is_active = 1 LIMIT 1")
    .bind(contentId)
    .first<{ readonly translation_key: string; readonly comment_path: string }>();

  return post === null ? null : { contentId: post.translation_key, commentPath: post.comment_path };
}

async function getCanonicalPath(contentId: string, locale: Locale, environment: Environment): Promise<string>
{
  const localization = await environment.SITE_DATABASE.prepare(`
    SELECT canonical_path
    FROM site_post_localizations
    WHERE content_id = ? AND locale = ?
    LIMIT 1
  `).bind(contentId, locale).first<{ readonly canonical_path: string }>();

  return localization?.canonical_path ?? `/${contentId}/`;
}

function normalizeSingleLineText(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length >= 2 && normalized.length <= 80 ? normalized : null;
}

function normalizeCommentBody(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const normalized = value.replace(/\r\n?/g, "\n").trim();
  return normalized.length >= 3 && normalized.length <= 5_000 ? normalized : null;
}

function normalizeAuthorUrl(value: unknown): string | null | undefined
{
  if (value === undefined || value === null || value === "")
  {
    return null;
  }

  if (typeof value !== "string" || value.length > 500)
  {
    return undefined;
  }

  try
  {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  }
  catch
  {
    return undefined;
  }
}

function encodeCursor(cursor: CommentCursor): string
{
  return btoa(JSON.stringify(cursor)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeCursor(value: string | null): CommentCursor | null
{
  if (value === null || value.length > 300)
  {
    return null;
  }

  try
  {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(padded)) as Partial<CommentCursor>;
    return typeof parsed.createdAt === "number" && typeof parsed.id === "string" && parsed.id.length <= 64
      ? { createdAt: parsed.createdAt, id: parsed.id }
      : null;
  }
  catch
  {
    return null;
  }
}

function toPublicComment(comment: CommentRecord): Record<string, unknown>
{
  return {
    id: comment.id,
    parentId: comment.parent_id,
    authorName: comment.author_name,
    authorUrl: comment.author_url,
    body: comment.body_text,
    language: comment.language,
    createdAt: new Date(comment.created_at).toISOString(),
    anchorLocale: comment.anchor_locale,
    anchorId: comment.anchor_id,
    anchorQuote: comment.anchor_quote,
    discussionPromptKey: comment.discussion_prompt_key,
  };
}

function acceptedResponse(newsletterStatus?: NewsletterOptInPublicStatus): Response
{
  return jsonResponse(
    {
      accepted: true,
      message: "Your comment is awaiting moderation.",
      ...(newsletterStatus === undefined ? {} : { newsletter: newsletterStatus }),
    },
    202,
    { "Cache-Control": "no-store" },
  );
}
