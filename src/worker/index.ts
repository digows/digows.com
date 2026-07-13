import type { Environment } from "./contracts";
import { handleCommentsRequest } from "./comments";
import { handleContactRequest } from "./contact";
import { jsonResponse } from "./http";
import { handleCommentModerationRequest } from "./moderation";
import { handleReactionsRequest } from "./reactions";
import { handleNewsletterSubscriptionRequest } from "./newsletter/handler";
import { reconcileNewsletterSubscriptions } from "./newsletter/service";
import { handleResendWebhookRequest } from "./newsletter/webhook";

export default {
  async fetch(request, environment, executionContext): Promise<Response>
  {
    const url = new URL(request.url);

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

    if (url.pathname === "/api/newsletter/subscriptions")
    {
      try
      {
        return await handleNewsletterSubscriptionRequest(request, environment, executionContext);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "newsletter_subscription_api_failed",
          message: error instanceof Error ? error.message : "Unknown error",
          rayId: request.headers.get("CF-Ray"),
        }));
        return jsonResponse({ error: "internal_error" }, 500, { "Cache-Control": "no-store" });
      }
    }

    if (url.pathname === "/api/webhooks/resend")
    {
      try
      {
        return await handleResendWebhookRequest(request, environment);
      }
      catch (error)
      {
        console.error(JSON.stringify({
          event: "resend_webhook_failed",
          errorName: error instanceof Error ? error.name : "UnknownError",
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

  async scheduled(_controller, environment, executionContext): Promise<void>
  {
    executionContext.waitUntil(reconcileNewsletterSubscriptions(environment));
  },
} satisfies ExportedHandler<Environment>;
