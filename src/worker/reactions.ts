import type { Environment } from "./contracts";
import { isSameOrigin, jsonResponse, methodNotAllowed } from "./http";
import { createSubmissionFingerprint, createVisitorFingerprint } from "./security";

const reactionTypes = ["apply", "perspective", "disagree", "follow_up"] as const;
type ReactionType = typeof reactionTypes[number];

const maximumRequestBytes = 2_048;
const rateWindowMilliseconds = 60 * 60 * 1000;
const maximumChangesPerWindow = 80;

interface ReactionSubmission
{
  readonly contentId?: unknown;
  readonly reactionType?: unknown;
  readonly visitorId?: unknown;
  readonly active?: unknown;
}

interface ReactionQueryRecord
{
  readonly reaction_type: string;
  readonly reaction_count?: number;
}

export async function handleReactionsRequest(request: Request, environment: Environment): Promise<Response>
{
  if (request.method === "GET")
  {
    return listReactions(request, environment);
  }

  if (request.method === "POST")
  {
    return saveReaction(request, environment);
  }

  return methodNotAllowed(["GET", "POST"]);
}

async function listReactions(request: Request, environment: Environment): Promise<Response>
{
  const url = new URL(request.url);
  const contentId = normalizeContentId(url.searchParams.get("content"));
  const visitorId = normalizeVisitorId(url.searchParams.get("visitor"));

  if (contentId === null || visitorId === null)
  {
    return jsonResponse({ error: "invalid_request" }, 400, { "Cache-Control": "no-store" });
  }

  if (!(await isKnownContent(contentId, environment)))
  {
    return jsonResponse({ error: "invalid_post" }, 400, { "Cache-Control": "no-store" });
  }

  const visitorFingerprint = await createVisitorFingerprint(visitorId, environment);
  const [countsResult, selectedResult] = await environment.SITE_DATABASE.batch<ReactionQueryRecord>([
    environment.SITE_DATABASE.prepare(`
      SELECT reaction_type, COUNT(*) AS reaction_count
      FROM article_reactions
      WHERE translation_key = ?
      GROUP BY reaction_type
    `).bind(contentId),
    environment.SITE_DATABASE.prepare(`
      SELECT reaction_type
      FROM article_reactions
      WHERE translation_key = ? AND visitor_fingerprint = ?
    `).bind(contentId, visitorFingerprint),
  ]);

  const counts = Object.fromEntries(reactionTypes.map((reactionType) => [reactionType, 0])) as Record<ReactionType, number>;

  for (const record of countsResult.results)
  {
    if (isReactionType(record.reaction_type) && typeof record.reaction_count === "number" && Number.isInteger(record.reaction_count) && record.reaction_count >= 0)
    {
      counts[record.reaction_type] = record.reaction_count;
    }
  }

  const selected = selectedResult.results
    .map((record) => record.reaction_type)
    .filter(isReactionType);

  return jsonResponse({ counts, selected }, 200, { "Cache-Control": "no-store" });
}

async function saveReaction(request: Request, environment: Environment): Promise<Response>
{
  if (!isSameOrigin(request, environment.SITE_ORIGIN))
  {
    return jsonResponse({ error: "invalid_origin" }, 403, { "Cache-Control": "no-store" });
  }

  const submission = await readSubmission(request);

  if (submission === null)
  {
    return jsonResponse({ error: "invalid_submission" }, 400, { "Cache-Control": "no-store" });
  }

  const contentId = normalizeContentId(submission.contentId);
  const visitorId = normalizeVisitorId(submission.visitorId);
  const reactionType = reactionTypes.find((candidate) => candidate === submission.reactionType);

  if (contentId === null || visitorId === null || reactionType === undefined || typeof submission.active !== "boolean")
  {
    return jsonResponse({ error: "invalid_submission" }, 400, { "Cache-Control": "no-store" });
  }

  if (!(await isKnownContent(contentId, environment)))
  {
    return jsonResponse({ error: "invalid_post" }, 400, { "Cache-Control": "no-store" });
  }

  const now = Date.now();
  const requestFingerprint = await createSubmissionFingerprint(request, environment, now);
  const windowStartedAt = Math.floor(now / rateWindowMilliseconds) * rateWindowMilliseconds;
  const rateLimitResult = await environment.SITE_DATABASE.prepare(`
    INSERT INTO interaction_rate_limits
      (request_fingerprint, action, window_started_at, event_count, updated_at)
    VALUES (?, 'reaction', ?, 1, ?)
    ON CONFLICT(request_fingerprint, action, window_started_at)
    DO UPDATE SET event_count = event_count + 1, updated_at = excluded.updated_at
    RETURNING event_count
  `).bind(requestFingerprint, windowStartedAt, now).first<{ readonly event_count: number }>();

  if ((rateLimitResult?.event_count ?? maximumChangesPerWindow + 1) > maximumChangesPerWindow)
  {
    return jsonResponse({ error: "rate_limited" }, 429, {
      "Cache-Control": "no-store",
      "Retry-After": `${Math.ceil((windowStartedAt + rateWindowMilliseconds - now) / 1000)}`,
    });
  }

  if (crypto.getRandomValues(new Uint8Array(1))[0] === 0)
  {
    await environment.SITE_DATABASE.prepare(`
      DELETE FROM interaction_rate_limits WHERE updated_at < ?
    `).bind(now - 30 * 24 * 60 * 60 * 1000).run();
  }

  const visitorFingerprint = await createVisitorFingerprint(visitorId, environment);

  if (submission.active)
  {
    await environment.SITE_DATABASE.prepare(`
      INSERT INTO article_reactions
        (translation_key, reaction_type, visitor_fingerprint, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(translation_key, reaction_type, visitor_fingerprint)
      DO UPDATE SET updated_at = excluded.updated_at
    `).bind(contentId, reactionType, visitorFingerprint, now, now).run();
  }
  else
  {
    await environment.SITE_DATABASE.prepare(`
      DELETE FROM article_reactions
      WHERE translation_key = ? AND reaction_type = ? AND visitor_fingerprint = ?
    `).bind(contentId, reactionType, visitorFingerprint).run();
  }

  return listReactions(new Request(`${environment.SITE_ORIGIN}/api/reactions?content=${encodeURIComponent(contentId)}&visitor=${encodeURIComponent(visitorId)}`), environment);
}

async function readSubmission(request: Request): Promise<ReactionSubmission | null>
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

    return JSON.parse(text) as ReactionSubmission;
  }
  catch
  {
    return null;
  }
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

function isReactionType(value: string): value is ReactionType
{
  return reactionTypes.some((reactionType) => reactionType === value);
}

function normalizeVisitorId(value: unknown): string | null
{
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}

async function isKnownContent(contentId: string, environment: Environment): Promise<boolean>
{
  const post = await environment.SITE_DATABASE.prepare(`
    SELECT translation_key FROM site_posts WHERE translation_key = ? AND is_active = 1 LIMIT 1
  `).bind(contentId).first<{ readonly translation_key: string }>();
  return post !== null;
}
