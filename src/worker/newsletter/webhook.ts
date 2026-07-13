import type { Environment } from "../contracts";
import { jsonResponse, methodNotAllowed } from "../http";
import {
  normalizeNewsletterEmail,
  synchronizeNewsletterProviderPreferences,
} from "./service";

const maximumWebhookBytes = 65_536;
const signatureToleranceSeconds = 5 * 60;

interface ResendWebhookEvent
{
  readonly type: string;
  readonly created_at: string;
  readonly data: Record<string, unknown>;
}

interface ProviderSubscriptionRecord
{
  readonly id: string;
  readonly provider_status_updated_at: number | null;
}

export async function handleResendWebhookRequest(
  request: Request,
  environment: Environment,
): Promise<Response>
{
  if (request.method !== "POST")
  {
    return methodNotAllowed(["POST"]);
  }

  const webhookSecret = environment.RESEND_WEBHOOK_SECRET;

  if (!webhookSecret.startsWith("whsec_"))
  {
    console.error(JSON.stringify({ event: "resend_webhook_not_configured" }));
    return new Response("Webhook unavailable.", { status: 503 });
  }

  const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);

  if (contentLength > maximumWebhookBytes)
  {
    return new Response("Payload too large.", { status: 413 });
  }

  const rawBody = await request.text();

  if (new TextEncoder().encode(rawBody).byteLength > maximumWebhookBytes)
  {
    return new Response("Payload too large.", { status: 413 });
  }

  const signatureIsValid = await verifyResendWebhookSignature(rawBody, {
    id: request.headers.get("svix-id"),
    timestamp: request.headers.get("svix-timestamp"),
    signature: request.headers.get("svix-signature"),
  }, webhookSecret);

  if (!signatureIsValid)
  {
    return new Response("Invalid webhook signature.", { status: 401 });
  }

  const event = parseWebhookEvent(rawBody);

  if (event === null)
  {
    return new Response("Invalid webhook payload.", { status: 400 });
  }

  const eventId = request.headers.get("svix-id") as string;
  const eventCreatedAt = Date.parse(event.created_at);
  const receivedAt = Date.now();
  await environment.SITE_DATABASE.prepare(`
    INSERT OR IGNORE INTO newsletter_webhook_events
      (event_id, event_type, event_created_at, received_at, processed_at)
    VALUES (?, ?, ?, ?, NULL)
  `).bind(eventId, event.type, eventCreatedAt, receivedAt).run();

  const storedEvent = await environment.SITE_DATABASE.prepare(`
    SELECT processed_at FROM newsletter_webhook_events WHERE event_id = ? LIMIT 1
  `).bind(eventId).first<{ readonly processed_at: number | null }>();

  if (storedEvent !== null && storedEvent.processed_at !== null)
  {
    return jsonResponse({ received: true }, 200, { "Cache-Control": "no-store" });
  }

  if (storedEvent === null)
  {
    throw new Error("Unable to persist the Resend webhook event.");
  }

  await processWebhookEvent(environment, event, eventCreatedAt);
  await environment.SITE_DATABASE.prepare(`
    UPDATE newsletter_webhook_events SET processed_at = ? WHERE event_id = ?
  `).bind(Date.now(), eventId).run();
  return jsonResponse({ received: true }, 200, { "Cache-Control": "no-store" });
}

export async function verifyResendWebhookSignature(
  payload: string,
  headers: {
    readonly id: string | null;
    readonly timestamp: string | null;
    readonly signature: string | null;
  },
  secret: string,
  currentTimestampSeconds = Math.floor(Date.now() / 1000),
): Promise<boolean>
{
  if (
    headers.id === null
    || headers.id.length < 1
    || headers.id.length > 200
    || headers.timestamp === null
    || !/^\d{1,12}$/u.test(headers.timestamp)
    || headers.signature === null
    || headers.signature.length > 1_000
    || !secret.startsWith("whsec_")
  )
  {
    return false;
  }

  const timestamp = Number.parseInt(headers.timestamp, 10);

  if (Math.abs(currentTimestampSeconds - timestamp) > signatureToleranceSeconds)
  {
    return false;
  }

  let signingKey: Uint8Array;

  try
  {
    signingKey = Uint8Array.from(atob(secret.slice("whsec_".length)), (character) => character.charCodeAt(0));
  }
  catch
  {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    signingKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${headers.id}.${timestamp}.${payload}`),
  );
  const expectedSignature = btoa(
    Array.from(new Uint8Array(signature), (byte) => String.fromCharCode(byte)).join(""),
  );

  return headers.signature.split(" ").some((candidate) =>
  {
    const [version, value] = candidate.split(",", 2);
    return version === "v1" && value !== undefined && constantTimeEqual(value, expectedSignature);
  });
}

async function processWebhookEvent(
  environment: Environment,
  event: ResendWebhookEvent,
  eventCreatedAt: number,
): Promise<void>
{
  if (event.type === "contact.updated")
  {
    const contactId = normalizeProviderIdentifier(event.data.id);
    const email = normalizeNewsletterEmail(event.data.email);

    if (contactId === null || email === null || typeof event.data.unsubscribed !== "boolean")
    {
      throw new Error("Invalid contact.updated webhook data.");
    }

    if (event.data.unsubscribed)
    {
      await applyProviderStatus(environment, contactId, email, "unsubscribed", eventCreatedAt);
    }
    else
    {
      await synchronizeNewsletterProviderPreferences(environment, contactId, eventCreatedAt);
    }

    return;
  }

  if (event.type === "contact.deleted")
  {
    const contactId = normalizeProviderIdentifier(event.data.id);
    const email = normalizeNewsletterEmail(event.data.email);

    if (contactId === null || email === null)
    {
      throw new Error("Invalid contact.deleted webhook data.");
    }

    await applyProviderStatus(environment, contactId, email, "suppressed", eventCreatedAt);
    return;
  }

  if (["email.bounced", "email.complained", "email.suppressed"].includes(event.type))
  {
    const recipient = Array.isArray(event.data.to) ? normalizeNewsletterEmail(event.data.to[0]) : null;

    if (recipient !== null)
    {
      await applyProviderStatus(environment, null, recipient, "suppressed", eventCreatedAt);
    }
  }
}

async function applyProviderStatus(
  environment: Environment,
  providerContactId: string | null,
  email: string,
  status: "unsubscribed" | "suppressed",
  providerEventTimestamp: number,
): Promise<void>
{
  const subscriptions = await environment.SITE_DATABASE.prepare(`
    SELECT id, provider_status_updated_at
    FROM newsletter_subscriptions
    WHERE (provider_contact_id = ? OR email = ?)
      AND status IN ('pending', 'active', 'unsubscribed')
      AND (provider_status_updated_at IS NULL OR provider_status_updated_at <= ?)
  `).bind(providerContactId, email, providerEventTimestamp).all<ProviderSubscriptionRecord>();

  if (subscriptions.results.length === 0)
  {
    return;
  }

  const now = Date.now();
  const statements: D1PreparedStatement[] = [];

  for (const subscription of subscriptions.results)
  {
    statements.push(
      environment.SITE_DATABASE.prepare(`
        UPDATE newsletter_subscriptions
        SET status = ?, provider_sync_status = 'synced', unsubscribed_at = ?,
            provider_status_updated_at = ?, updated_at = ?
        WHERE id = ? AND (provider_status_updated_at IS NULL OR provider_status_updated_at <= ?)
      `).bind(status, now, providerEventTimestamp, now, subscription.id, providerEventTimestamp),
      environment.SITE_DATABASE.prepare(`
        INSERT INTO newsletter_events (id, subscription_id, event_type, provider_event_id, created_at)
        VALUES (?, ?, ?, NULL, ?)
      `).bind(crypto.randomUUID(), subscription.id, status, now),
    );
  }

  await environment.SITE_DATABASE.batch(statements);
}

function parseWebhookEvent(rawBody: string): ResendWebhookEvent | null
{
  try
  {
    const event = JSON.parse(rawBody) as Partial<ResendWebhookEvent>;
    const createdAt = typeof event.created_at === "string" ? Date.parse(event.created_at) : Number.NaN;

    return typeof event.type === "string"
      && event.type.length <= 100
      && Number.isFinite(createdAt)
      && typeof event.data === "object"
      && event.data !== null
      && !Array.isArray(event.data)
      ? event as ResendWebhookEvent
      : null;
  }
  catch
  {
    return null;
  }
}

function normalizeProviderIdentifier(value: unknown): string | null
{
  return typeof value === "string" && /^[0-9a-f-]{36}$/iu.test(value) ? value : null;
}

function constantTimeEqual(left: string, right: string): boolean
{
  const maximumLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < maximumLength; index += 1)
  {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}
