import type { Environment } from "./contracts";
import type { Locale } from "../i18n/locales";

const moderationPath = "/moderate/comment";
const moderationLinkLifetimeMilliseconds = 7 * 24 * 60 * 60 * 1000;
const maximumFormBytes = 1_024;

interface ModerationComment
{
  readonly id: string;
  readonly content_id: string;
  readonly canonical_path: string;
  readonly status: "pending" | "approved" | "spam" | "trash";
  readonly author_name: string;
  readonly author_url: string | null;
  readonly body_text: string;
  readonly language: Locale;
  readonly created_at: number;
}

export async function createCommentModerationUrl(
  commentId: string,
  environment: Environment,
  intent: "approve" | "reject",
): Promise<string>
{
  const expiresAt = Date.now() + moderationLinkLifetimeMilliseconds;
  const signature = await signModerationToken(commentId, expiresAt, environment.COMMENT_MODERATION_SECRET);
  const url = new URL(moderationPath, environment.SITE_ORIGIN);
  url.searchParams.set("id", commentId);
  url.searchParams.set("expires", `${expiresAt}`);
  url.searchParams.set("signature", signature);
  url.searchParams.set("intent", intent);
  return url.href;
}

export async function handleCommentModerationRequest(
  request: Request,
  environment: Environment,
): Promise<Response>
{
  if (request.method !== "GET" && request.method !== "POST")
  {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  const url = new URL(request.url);
  const commentId = url.searchParams.get("id") ?? "";
  const expiresAt = Number.parseInt(url.searchParams.get("expires") ?? "", 10);
  const signature = url.searchParams.get("signature") ?? "";

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(commentId)
    || !Number.isSafeInteger(expiresAt)
    || !/^[0-9a-f]{64}$/i.test(signature)
    || !(await verifyModerationToken(commentId, expiresAt, signature, environment.COMMENT_MODERATION_SECRET))
  )
  {
    return moderationPage("Invalid moderation link", "This moderation link is invalid.", null, 403);
  }

  if (expiresAt < Date.now())
  {
    return moderationPage("Expired moderation link", "This moderation link has expired.", null, 410);
  }

  const comment = await loadComment(commentId, environment);

  if (comment === null)
  {
    return moderationPage("Comment not found", "The requested comment does not exist.", null, 404);
  }

  if (request.method === "POST")
  {
    const fetchSite = request.headers.get("Sec-Fetch-Site");
    const contentType = request.headers.get("Content-Type") ?? "";
    const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);

    if (
      (fetchSite !== null && fetchSite !== "same-origin")
      || !contentType.toLowerCase().startsWith("application/x-www-form-urlencoded")
      || contentLength > maximumFormBytes
    )
    {
      return moderationPage("Invalid request", "The moderation request was rejected.", comment, 400);
    }

    const requestText = await request.text();

    if (new TextEncoder().encode(requestText).byteLength > maximumFormBytes)
    {
      return moderationPage("Invalid request", "The moderation request was too large.", comment, 413);
    }

    const action = new URLSearchParams(requestText).get("action");

    if (action !== "approve" && action !== "reject")
    {
      return moderationPage("Invalid action", "Choose approve or reject.", comment, 400);
    }

    const now = Date.now();
    const status = action === "approve" ? "approved" : "trash";
    const result = await environment.SITE_DATABASE.prepare(`
      UPDATE comments
      SET status = ?, approved_at = ?, updated_at = ?, moderation_reason = 'email-link'
      WHERE id = ? AND status = 'pending'
    `).bind(status, action === "approve" ? now : null, now, commentId).run();
    const updatedComment = await loadComment(commentId, environment);
    const message = result.meta.changes === 1
      ? action === "approve" ? "The comment is now public." : "The comment was rejected."
      : `No change was made because the comment is already ${updatedComment?.status ?? comment.status}.`;

    console.log(JSON.stringify({
      event: "comment_moderated",
      commentId,
      action,
      changed: result.meta.changes === 1,
    }));

    return moderationPage(
      action === "approve" ? "Comment approved" : "Comment rejected",
      message,
      updatedComment,
      200,
    );
  }

  return moderationPage("Moderate comment", "Review the comment before choosing an action.", comment, 200);
}

async function loadComment(commentId: string, environment: Environment): Promise<ModerationComment | null>
{
  return environment.SITE_DATABASE.prepare(`
    SELECT comments.id, comments.content_id, site_post_localizations.canonical_path,
           comments.status, comments.author_name, comments.author_url, comments.body_text,
           comments.language, comments.created_at
    FROM comments
    INNER JOIN site_post_localizations
      ON site_post_localizations.content_id = comments.content_id
      AND site_post_localizations.locale = comments.language
    WHERE id = ? AND source = 'site'
    LIMIT 1
  `).bind(commentId).first<ModerationComment>();
}

async function signModerationToken(
  commentId: string,
  expiresAt: number,
  secret: string,
): Promise<string>
{
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${commentId}|${expiresAt}`),
  );
  return bytesToHex(new Uint8Array(signature));
}

async function verifyModerationToken(
  commentId: string,
  expiresAt: number,
  providedSignature: string,
  secret: string,
): Promise<boolean>
{
  const expectedSignature = await signModerationToken(commentId, expiresAt, secret);
  return crypto.subtle.timingSafeEqual(hexToBytes(providedSignature), hexToBytes(expectedSignature));
}

function bytesToHex(bytes: Uint8Array): string
{
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string): Uint8Array
{
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
}

function moderationPage(
  title: string,
  message: string,
  comment: ModerationComment | null,
  status: number,
): Response
{
  const commentMarkup = comment === null ? "" : `
    <dl>
      <dt>Status</dt><dd>${escapeHtml(comment.status)}</dd>
      <dt>Author</dt><dd>${escapeHtml(comment.author_name)}</dd>
      <dt>Language</dt><dd>${escapeHtml(comment.language)}</dd>
      <dt>Content ID</dt><dd>${escapeHtml(comment.content_id)}</dd>
      <dt>Article</dt><dd><a href="${escapeHtml(comment.canonical_path)}">${escapeHtml(comment.canonical_path)}</a></dd>
      <dt>Received</dt><dd>${escapeHtml(new Date(comment.created_at).toISOString())}</dd>
    </dl>
    <blockquote>${escapeHtml(comment.body_text)}</blockquote>
    ${comment.status === "pending" ? `
      <form method="post">
        <button class="approve" name="action" value="approve" type="submit">Approve and publish</button>
        <button class="reject" name="action" value="reject" type="submit">Reject</button>
      </form>
    ` : ""}
  `;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>${escapeHtml(title)} | digows.com</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { max-width: 48rem; margin: 0 auto; padding: 3rem 1.25rem; line-height: 1.6; }
    main { border: 1px solid color-mix(in srgb, currentColor 20%, transparent); border-radius: 1rem; padding: 1.5rem; }
    dl { display: grid; grid-template-columns: 7rem 1fr; gap: .4rem 1rem; }
    dt { font-weight: 700; }
    dd { margin: 0; overflow-wrap: anywhere; }
    blockquote { margin: 1.5rem 0; padding: 1rem; border-left: .25rem solid #4f8b65; white-space: pre-wrap; }
    form { display: flex; flex-wrap: wrap; gap: .75rem; }
    button { border: 0; border-radius: .6rem; padding: .75rem 1rem; color: white; cursor: pointer; font: inherit; font-weight: 700; }
    .approve { background: #28633f; }
    .reject { background: #8d3434; }
  </style>
</head>
<body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${commentMarkup}</main></body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; style-src 'unsafe-inline'",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

function escapeHtml(value: string): string
{
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
