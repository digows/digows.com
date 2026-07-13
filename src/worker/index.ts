import type { Environment } from "./contracts";
import { handleCommentsRequest } from "./comments";
import { handleContactRequest } from "./contact";
import { jsonResponse } from "./http";
import { handleCommentModerationRequest } from "./moderation";
import { handleReactionsRequest } from "./reactions";
import { legacyRedirects } from "./legacy-redirects";

export default {
  async fetch(request, environment, executionContext): Promise<Response>
  {
    const url = new URL(request.url);

    const redirectPath = legacyRedirects.get(url.pathname);

    if (redirectPath !== undefined || url.hostname === "www.digows.com" || url.hostname === "blog.digows.com")
    {
      url.hostname = "digows.com";
      url.pathname = redirectPath ?? url.pathname;
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/moderate/comment")
    {
      try
      {
        return await handleCommentModerationRequest(request, environment);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "comment_moderation_failed",
          message: error instanceof Error ? error.message : "Unknown error",
          rayId: request.headers.get("CF-Ray"),
        }));
        return new Response("Unable to moderate this comment.", { status: 500 });
      }
    }

    if (url.pathname === "/api/comments")
    {
      try
      {
        return await handleCommentsRequest(request, environment, executionContext);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "comments_api_failed",
          message: error instanceof Error ? error.message : "Unknown error",
          rayId: request.headers.get("CF-Ray"),
        }));
        return jsonResponse({ error: "internal_error" }, 500, { "Cache-Control": "no-store" });
      }
    }

    if (url.pathname === "/api/contact")
    {
      try
      {
        return await handleContactRequest(request, environment, executionContext);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "contact_api_failed",
          message: error instanceof Error ? error.message : "Unknown error",
          rayId: request.headers.get("CF-Ray"),
        }));
        return jsonResponse({ error: "internal_error" }, 500, { "Cache-Control": "no-store" });
      }
    }

    if (url.pathname === "/api/reactions")
    {
      try
      {
        return await handleReactionsRequest(request, environment);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "reactions_api_failed",
          message: error instanceof Error ? error.message : "Unknown error",
          rayId: request.headers.get("CF-Ray"),
        }));
        return jsonResponse({ error: "internal_error" }, 500, { "Cache-Control": "no-store" });
      }
    }

    if (url.pathname.startsWith("/api/"))
    {
      return jsonResponse({ error: "not_found" }, 404, { "Cache-Control": "no-store" });
    }

    return environment.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Environment>;
