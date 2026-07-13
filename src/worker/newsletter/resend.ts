import type { Environment } from "../contracts";

const resendApiOrigin = "https://api.resend.com";
const requestTimeoutMilliseconds = 15_000;
const userAgent = "digows.com-newsletter-worker/1.0";

interface ResendContact
{
  readonly id: string;
  readonly email: string;
  readonly unsubscribed: boolean;
}

interface ResendCreatedContact
{
  readonly id: string;
}

interface ResendCreatedTopic
{
  readonly id: string;
  readonly object: "topic";
}

interface ResendSegment
{
  readonly id: string;
  readonly name: string;
}

interface ResendTopic
{
  readonly id: string;
  readonly name: string;
}

export interface ResendTopicSubscription
{
  readonly id: string;
  readonly subscription: "opt_in" | "opt_out";
}

export interface NewsletterProviderChannel
{
  readonly segmentId: string;
  readonly topicId: string;
}

interface ResendListResponse<T>
{
  readonly data: readonly T[];
}

export class ResendApiError extends Error
{
  public readonly status: number;
  public readonly retryable: boolean;

  public constructor(operation: string, status: number)
  {
    super(`Resend ${operation} failed with HTTP ${status}.`);
    this.name = "ResendApiError";
    this.status = status;
    this.retryable = status === 408 || status === 429 || status >= 500;
  }
}

export async function sendNewsletterWelcome(
  environment: Environment,
  message: {
    readonly email: string;
    readonly subject: string;
    readonly html: string;
    readonly text: string;
    readonly deliveryId: string;
    readonly locale: string;
  },
): Promise<void>
{
  await resendRequest(
    environment.RESEND_API_KEY,
    "/emails",
    {
      method: "POST",
      headers: {
        "Idempotency-Key": `newsletter-welcome/${message.deliveryId}`,
      },
      body: JSON.stringify({
        from: environment.NEWSLETTER_EMAIL_FROM,
        to: [message.email],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: environment.NEWSLETTER_REPLY_TO,
        tags: [
          { name: "message_type", value: "newsletter_welcome" },
          { name: "locale", value: message.locale.replace(/[^a-zA-Z0-9_-]/gu, "_") },
        ],
      }),
    },
    "send welcome email",
  );
}

export async function ensureNewsletterSegment(
  environment: Environment,
  segmentName: string,
): Promise<string>
{
  const segments = await resendRequest<ResendListResponse<ResendSegment>>(
    environment.RESEND_MANAGEMENT_API_KEY,
    "/segments?limit=100",
    { method: "GET" },
    "list segments",
  );
  const existingSegment = segments.data.find((segment) => segment.name === segmentName);

  if (existingSegment !== undefined)
  {
    return existingSegment.id;
  }

  const createdSegment = await resendRequest<ResendSegment>(
    environment.RESEND_MANAGEMENT_API_KEY,
    "/segments",
    {
      method: "POST",
      body: JSON.stringify({ name: segmentName }),
    },
    "create segment",
  );
  return createdSegment.id;
}

export async function ensureNewsletterTopic(
  environment: Environment,
  topicName: string,
  topicDescription: string,
): Promise<string>
{
  const topics = await resendRequest<ResendListResponse<ResendTopic>>(
    environment.RESEND_MANAGEMENT_API_KEY,
    "/topics?limit=100",
    { method: "GET" },
    "list topics",
  );
  const existingTopic = topics.data.find((topic) => topic.name === topicName);

  if (existingTopic !== undefined)
  {
    return existingTopic.id;
  }

  const createdTopic = await resendRequest<ResendCreatedTopic>(
    environment.RESEND_MANAGEMENT_API_KEY,
    "/topics",
    {
      method: "POST",
      body: JSON.stringify({
        name: topicName,
        description: topicDescription,
        default_subscription: "opt_out",
      }),
    },
    "create topic",
  );
  return createdTopic.id;
}

export async function synchronizeNewsletterContact(
  environment: Environment,
  email: string,
  channel: NewsletterProviderChannel,
  inactiveTopicIds: readonly string[],
): Promise<string>
{
  const encodedEmail = encodeURIComponent(email);
  const existingContact = await retrieveContact(environment, encodedEmail);

  if (existingContact === null)
  {
    const createdContact = await resendRequest<ResendCreatedContact>(
      environment.RESEND_MANAGEMENT_API_KEY,
      "/contacts",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          unsubscribed: false,
          segments: [{ id: channel.segmentId }],
          topics: [{ id: channel.topicId, subscription: "opt_in" }],
        }),
      },
      "create contact",
    );
    return createdContact.id;
  }

  if (existingContact.unsubscribed)
  {
    await resendRequest(
      environment.RESEND_MANAGEMENT_API_KEY,
      `/contacts/${encodedEmail}`,
      { method: "PATCH", body: JSON.stringify({ unsubscribed: false }) },
      "reactivate contact after explicit opt-in",
    );
  }

  await resendRequest(
    environment.RESEND_MANAGEMENT_API_KEY,
    `/contacts/${encodedEmail}/segments/${encodeURIComponent(channel.segmentId)}`,
    { method: "POST" },
    "add contact to segment",
  );

  await resendRequest(
    environment.RESEND_MANAGEMENT_API_KEY,
    `/contacts/${encodedEmail}/topics`,
    {
      method: "PATCH",
      body: JSON.stringify({
        topics: [
          { id: channel.topicId, subscription: "opt_in" },
          ...inactiveTopicIds.map((topicId) => ({ id: topicId, subscription: "opt_out" })),
        ],
      }),
    },
    "update contact topic preferences",
  );

  return existingContact.id;
}

export async function retrieveContactTopics(
  environment: Environment,
  providerContactId: string,
): Promise<readonly ResendTopicSubscription[]>
{
  const response = await resendRequest<ResendListResponse<ResendTopicSubscription>>(
    environment.RESEND_MANAGEMENT_API_KEY,
    `/contacts/${encodeURIComponent(providerContactId)}/topics?limit=100`,
    { method: "GET" },
    "retrieve contact topics",
  );
  return response.data;
}

async function retrieveContact(environment: Environment, encodedEmail: string): Promise<ResendContact | null>
{
  try
  {
    return await resendRequest<ResendContact>(
      environment.RESEND_MANAGEMENT_API_KEY,
      `/contacts/${encodedEmail}`,
      { method: "GET" },
      "retrieve contact",
    );
  }
  catch (error)
  {
    if (error instanceof ResendApiError && error.status === 404)
    {
      return null;
    }

    throw error;
  }
}

async function resendRequest<T = unknown>(
  apiKey: string,
  path: string,
  request: RequestInit,
  operation: string,
): Promise<T>
{
  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);
  headers.set("Accept", "application/json");
  headers.set("User-Agent", userAgent);

  if (request.body !== undefined)
  {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try
  {
    response = await fetch(`${resendApiOrigin}${path}`, {
      ...request,
      headers,
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });
  }
  catch
  {
    throw new ResendApiError(operation, 503);
  }

  if (!response.ok)
  {
    await response.body?.cancel();
    throw new ResendApiError(operation, response.status);
  }

  if (response.status === 204)
  {
    return undefined as T;
  }

  return response.json<T>();
}
