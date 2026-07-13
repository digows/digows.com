import { getSiteRoutePath } from "../../i18n/routes";
import type { Locale } from "../../i18n/locales";
import type { Environment } from "../contracts";
import type {
  NewsletterConfirmationResult,
  NewsletterRequestResult,
  NewsletterSubscriptionRecord,
  NewsletterSubscriptionRequest,
} from "./contracts";
import { createConfirmationEmail } from "./copy";
import { createConfirmationToken, hashConfirmationToken } from "./crypto";
import {
  ensureNewsletterSegment,
  ensureNewsletterTopic,
  type NewsletterProviderChannel,
  retrieveContactTopics,
  sendNewsletterConfirmation,
  synchronizeNewsletterContact,
} from "./resend";

const rateLimitWindowMilliseconds = 60 * 60 * 1000;
const maximumRequestsPerWindow = 5;
const pendingRequestCooldownMilliseconds = 10 * 60 * 1000;
const confirmationValidityMilliseconds = 48 * 60 * 60 * 1000;
const maximumReconciliationBatchSize = 5;

const providerTopicCopy: Readonly<Record<Locale, { readonly name: string; readonly description: string }>> = {
  en: {
    name: "digows.com — English",
    description: "Essays and field notes from digows.com in English.",
  },
  "pt-BR": {
    name: "digows.com — Português",
    description: "Ensaios e notas de campo do digows.com em português.",
  },
  es: {
    name: "digows.com — Español",
    description: "Ensayos y notas de campo de digows.com en español.",
  },
  fr: {
    name: "digows.com — Français",
    description: "Essais et notes de terrain de digows.com en français.",
  },
  "zh-Hans": {
    name: "digows.com — 简体中文",
    description: "digows.com 的简体中文文章与现场笔记。",
  },
};

interface ConfirmationRecord extends NewsletterSubscriptionRecord
{
  readonly token_hash: string;
  readonly expires_at: number;
  readonly consumed_at: number | null;
}

export function normalizeNewsletterEmail(value: unknown): string | null
{
  if (typeof value !== "string")
  {
    return null;
  }

  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) ? email : null;
}

export function normalizeNewsletterSourcePath(value: unknown): string | null
{
  if (typeof value !== "string" || value.length > 500 || !value.startsWith("/") || value.startsWith("//"))
  {
    return null;
  }

  try
  {
    const url = new URL(value, "https://digows.invalid");
    return url.origin === "https://digows.invalid" && url.pathname.length <= 500
      ? url.pathname
      : null;
  }
  catch
  {
    return null;
  }
}

export async function requestNewsletterSubscription(
  environment: Environment,
  request: NewsletterSubscriptionRequest,
): Promise<NewsletterRequestResult>
{
  const now = Date.now();
  const rateLimit = await incrementRateLimit(environment, request.submissionFingerprint, now);

  if (!rateLimit.allowed)
  {
    return { status: "rate_limited" };
  }

  const existingSubscription = await environment.SITE_DATABASE.prepare(`
    SELECT id, email, locale, status, provider_sync_status, provider_contact_id, source,
           source_path, consent_version, requested_at, confirmation_sent_at, confirmed_at, updated_at
    FROM newsletter_subscriptions
    WHERE email = ? AND locale = ?
    LIMIT 1
  `).bind(request.email, request.locale).first<NewsletterSubscriptionRecord>();

  if (existingSubscription?.status === "active")
  {
    return { status: "already_subscribed" };
  }

  if (existingSubscription?.status === "suppressed")
  {
    return { status: "suppressed" };
  }

  if (
    existingSubscription?.status === "pending"
    && existingSubscription.confirmation_sent_at !== null
    && existingSubscription.confirmation_sent_at >= now - pendingRequestCooldownMilliseconds
  )
  {
    return { status: "already_pending" };
  }

  const subscriptionId = existingSubscription?.id ?? crypto.randomUUID();
  const token = createConfirmationToken();
  const tokenHash = await hashConfirmationToken(token);
  const expiresAt = now + confirmationValidityMilliseconds;
  const subscriptionStatement = existingSubscription === null
    ? environment.SITE_DATABASE.prepare(`
        INSERT INTO newsletter_subscriptions
        (
          id, email, locale, status, provider_sync_status, provider_contact_id, source,
          source_path, consent_version, requested_at, confirmation_sent_at, confirmed_at,
          unsubscribed_at, updated_at, submission_fingerprint
        )
        VALUES (?, ?, ?, 'pending', 'not_ready', NULL, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?)
      `).bind(
        subscriptionId,
        request.email,
        request.locale,
        request.source,
        request.sourcePath,
        request.consentVersion,
        now,
        now,
        request.submissionFingerprint,
      )
    : environment.SITE_DATABASE.prepare(`
        UPDATE newsletter_subscriptions
        SET status = 'pending', provider_sync_status = 'not_ready', source = ?, source_path = ?,
            consent_version = ?, requested_at = ?, confirmation_sent_at = NULL,
            confirmed_at = NULL, unsubscribed_at = NULL, updated_at = ?, submission_fingerprint = ?
        WHERE id = ?
      `).bind(
        request.source,
        request.sourcePath,
        request.consentVersion,
        now,
        now,
        request.submissionFingerprint,
        subscriptionId,
      );

  await environment.SITE_DATABASE.batch([
    subscriptionStatement,
    environment.SITE_DATABASE.prepare(`
      DELETE FROM newsletter_confirmation_tokens
      WHERE subscription_id = ? AND consumed_at IS NULL
    `).bind(subscriptionId),
    environment.SITE_DATABASE.prepare(`
      INSERT INTO newsletter_confirmation_tokens
        (token_hash, subscription_id, created_at, expires_at, consumed_at)
      VALUES (?, ?, ?, ?, NULL)
    `).bind(tokenHash, subscriptionId, now, expiresAt),
    createEventStatement(environment, subscriptionId, "requested", now),
  ]);

  try
  {
    await sendConfirmationEmail(environment, subscriptionId, token);
  }
  catch (error)
  {
    await recordNewsletterEvent(environment, subscriptionId, "confirmation_failed", Date.now());
    throw error;
  }

  return { status: "confirmation_sent" };
}

export async function confirmNewsletterSubscription(
  environment: Environment,
  token: string,
): Promise<NewsletterConfirmationResult>
{
  const now = Date.now();
  const tokenHash = await hashConfirmationToken(token);
  const record = await environment.SITE_DATABASE.prepare(`
    SELECT s.id, s.email, s.locale, s.status, s.provider_sync_status, s.provider_contact_id,
           s.source, s.source_path, s.consent_version, s.requested_at, s.confirmation_sent_at,
           s.confirmed_at, s.updated_at, t.token_hash, t.expires_at, t.consumed_at
    FROM newsletter_confirmation_tokens t
    INNER JOIN newsletter_subscriptions s ON s.id = t.subscription_id
    WHERE t.token_hash = ?
    LIMIT 1
  `).bind(tokenHash).first<ConfirmationRecord>();

  if (record === null)
  {
    return { status: "invalid", subscriptionId: null };
  }

  if (record.consumed_at !== null || record.status === "active")
  {
    return {
      status: "already_confirmed",
      subscriptionId: record.provider_sync_status === "synced" ? null : record.id,
    };
  }

  if (record.expires_at < now || record.status !== "pending")
  {
    return { status: "expired", subscriptionId: null };
  }

  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_confirmation_tokens
      SET consumed_at = COALESCE(consumed_at, ?)
      WHERE token_hash = ? AND expires_at >= ?
    `).bind(now, tokenHash, now),
    environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_subscriptions
      SET status = 'active', provider_sync_status = 'pending', confirmed_at = COALESCE(confirmed_at, ?),
          unsubscribed_at = NULL, updated_at = ?
      WHERE id = ? AND status = 'pending'
    `).bind(now, now, record.id),
    createEventStatement(environment, record.id, "confirmed", now),
  ]);

  return { status: "confirmed", subscriptionId: record.id };
}

export async function reconcileNewsletterSubscriptions(environment: Environment): Promise<void>
{
  const subscriptions = await environment.SITE_DATABASE.prepare(`
    SELECT id
    FROM newsletter_subscriptions
    WHERE status = 'active' AND provider_sync_status IN ('pending', 'failed')
    ORDER BY updated_at ASC
    LIMIT ?
  `).bind(maximumReconciliationBatchSize).all<{ readonly id: string }>();

  for (const { id } of subscriptions.results)
  {
    await synchronizeNewsletterSubscription(environment, id);
  }

  const now = Date.now();
  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      DELETE FROM newsletter_confirmation_tokens
      WHERE consumed_at IS NULL AND expires_at < ?
    `).bind(now - 7 * 24 * 60 * 60 * 1000),
    environment.SITE_DATABASE.prepare(`
      DELETE FROM interaction_rate_limits WHERE updated_at < ?
    `).bind(now - 30 * 24 * 60 * 60 * 1000),
    environment.SITE_DATABASE.prepare(`
      DELETE FROM newsletter_webhook_events WHERE received_at < ?
    `).bind(now - 90 * 24 * 60 * 60 * 1000),
  ]);
}

async function sendConfirmationEmail(
  environment: Environment,
  subscriptionId: string,
  token: string,
): Promise<void>
{
  const tokenHash = await hashConfirmationToken(token);
  const now = Date.now();
  const record = await environment.SITE_DATABASE.prepare(`
    SELECT s.id, s.email, s.locale, s.status, s.provider_sync_status, s.provider_contact_id,
           s.source, s.source_path, s.consent_version, s.requested_at, s.confirmation_sent_at,
           s.confirmed_at, s.updated_at, t.token_hash, t.expires_at, t.consumed_at
    FROM newsletter_subscriptions s
    INNER JOIN newsletter_confirmation_tokens t ON t.subscription_id = s.id
    WHERE s.id = ? AND t.token_hash = ?
    LIMIT 1
  `).bind(subscriptionId, tokenHash).first<ConfirmationRecord>();

  if (record === null || record.status !== "pending" || record.consumed_at !== null || record.expires_at < now)
  {
    return;
  }

  const confirmationUrl = new URL(getSiteRoutePath("newsletter", record.locale), environment.SITE_ORIGIN);
  confirmationUrl.hash = new URLSearchParams({ confirm: token }).toString();
  const email = createConfirmationEmail(record.locale, confirmationUrl.toString());
  await sendNewsletterConfirmation(environment, {
    email: record.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    subscriptionId: `${record.id}/${tokenHash.slice(0, 16)}`,
    locale: record.locale,
  });

  const sentAt = Date.now();

  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_subscriptions
      SET confirmation_sent_at = COALESCE(confirmation_sent_at, ?), updated_at = ?
      WHERE id = ?
    `).bind(sentAt, sentAt, record.id),
    createEventStatement(environment, record.id, "confirmation_sent", sentAt),
  ]);
}

export async function synchronizeNewsletterSubscription(
  environment: Environment,
  subscriptionId: string,
): Promise<void>
{
  try
  {
    await synchronizeNewsletterSubscriptionWithProvider(environment, subscriptionId);
  }
  catch (error)
  {
    await markProviderSyncFailed(environment, subscriptionId);
    console.error(JSON.stringify({
      event: "newsletter_provider_sync_failed",
      subscriptionId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    }));
  }
}

async function synchronizeNewsletterSubscriptionWithProvider(
  environment: Environment,
  subscriptionId: string,
): Promise<void>
{
  const subscription = await environment.SITE_DATABASE.prepare(`
    SELECT id, email, locale, status, provider_sync_status, provider_contact_id, source,
           source_path, consent_version, requested_at, confirmation_sent_at, confirmed_at, updated_at
    FROM newsletter_subscriptions
    WHERE id = ?
    LIMIT 1
  `).bind(subscriptionId).first<NewsletterSubscriptionRecord>();

  if (subscription === null || subscription.status !== "active")
  {
    return;
  }

  const channel = await getOrCreateProviderChannel(environment, subscription.locale);
  const inactiveTopicResult = await environment.SITE_DATABASE.prepare(`
    SELECT t.provider_topic_id
    FROM newsletter_locale_topics t
    LEFT JOIN newsletter_subscriptions s ON s.locale = t.locale AND s.email = ?
    WHERE t.locale <> ?
      AND (s.status IS NULL OR s.status <> 'active')
  `).bind(subscription.email, subscription.locale).all<{
    readonly provider_topic_id: string;
  }>();
  const inactiveTopicIds = inactiveTopicResult.results.map((record) => record.provider_topic_id);
  const providerContactId = await synchronizeNewsletterContact(
    environment,
    subscription.email,
    channel,
    inactiveTopicIds,
  );
  const now = Date.now();

  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_subscriptions
      SET provider_sync_status = 'synced', provider_contact_id = ?,
          provider_status_updated_at = ?, updated_at = ?
      WHERE id = ? AND status = 'active'
    `).bind(providerContactId, now, now, subscription.id),
    createEventStatement(environment, subscription.id, "provider_synced", now),
  ]);
}

async function getOrCreateProviderChannel(
  environment: Environment,
  locale: Locale,
): Promise<NewsletterProviderChannel>
{
  const existingChannel = await environment.SITE_DATABASE.prepare(`
    SELECT
      (SELECT provider_segment_id FROM newsletter_provider_segments WHERE provider = 'resend')
        AS provider_segment_id,
      (SELECT provider_topic_id FROM newsletter_locale_topics WHERE locale = ?)
        AS provider_topic_id
  `).bind(locale).first<{
    readonly provider_segment_id: string | null;
    readonly provider_topic_id: string | null;
  }>();

  if (
    existingChannel !== null
    && existingChannel.provider_segment_id !== null
    && existingChannel.provider_topic_id !== null
  )
  {
    return {
      segmentId: existingChannel.provider_segment_id,
      topicId: existingChannel.provider_topic_id,
    };
  }

  const providerSegmentId = existingChannel?.provider_segment_id
    ?? await ensureNewsletterSegment(environment, "digows.com subscribers");
  const topicCopy = providerTopicCopy[locale];
  const providerTopicId = existingChannel?.provider_topic_id
    ?? await ensureNewsletterTopic(environment, topicCopy.name, topicCopy.description);
  const now = Date.now();
  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      INSERT INTO newsletter_provider_segments
        (provider, provider_segment_id, created_at, updated_at)
      VALUES ('resend', ?, ?, ?)
      ON CONFLICT(provider) DO UPDATE SET
        provider_segment_id = excluded.provider_segment_id,
        updated_at = excluded.updated_at
    `).bind(providerSegmentId, now, now),
    environment.SITE_DATABASE.prepare(`
      INSERT INTO newsletter_locale_topics
        (locale, provider_topic_id, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(locale) DO UPDATE SET
        provider_topic_id = excluded.provider_topic_id,
        updated_at = excluded.updated_at
    `).bind(locale, providerTopicId, now, now),
  ]);
  return { segmentId: providerSegmentId, topicId: providerTopicId };
}

export async function synchronizeNewsletterProviderPreferences(
  environment: Environment,
  providerContactId: string,
  providerEventTimestamp: number,
): Promise<void>
{
  const [topicSubscriptions, localSubscriptions] = await Promise.all([
    retrieveContactTopics(environment, providerContactId),
    environment.SITE_DATABASE.prepare(`
      SELECT s.id, s.status, s.provider_status_updated_at, c.provider_topic_id
      FROM newsletter_subscriptions s
      INNER JOIN newsletter_locale_topics c ON c.locale = s.locale
      WHERE s.provider_contact_id = ? AND c.provider_topic_id IS NOT NULL
    `).bind(providerContactId).all<{
      readonly id: string;
      readonly status: NewsletterSubscriptionRecord["status"];
      readonly provider_status_updated_at: number | null;
      readonly provider_topic_id: string;
    }>(),
  ]);
  const preferences = new Map(topicSubscriptions.map((topic) => [topic.id, topic.subscription]));
  const now = Date.now();
  const statements: D1PreparedStatement[] = [];

  for (const subscription of localSubscriptions.results)
  {
    const preference = preferences.get(subscription.provider_topic_id);

    if (
      preference === undefined
      || providerEventTimestamp < (subscription.provider_status_updated_at ?? 0)
      || subscription.status === "suppressed"
    )
    {
      continue;
    }

    if (preference === "opt_out" && subscription.status === "active")
    {
      statements.push(
        environment.SITE_DATABASE.prepare(`
          UPDATE newsletter_subscriptions
          SET status = 'unsubscribed', provider_sync_status = 'synced', unsubscribed_at = ?,
              provider_status_updated_at = ?, updated_at = ?
          WHERE id = ? AND (provider_status_updated_at IS NULL OR provider_status_updated_at <= ?)
        `).bind(now, providerEventTimestamp, now, subscription.id, providerEventTimestamp),
        createEventStatement(environment, subscription.id, "unsubscribed", now),
      );
    }
    else if (preference === "opt_in" && subscription.status === "unsubscribed")
    {
      statements.push(
        environment.SITE_DATABASE.prepare(`
          UPDATE newsletter_subscriptions
          SET status = 'active', provider_sync_status = 'synced', unsubscribed_at = NULL,
              confirmed_at = COALESCE(confirmed_at, ?), provider_status_updated_at = ?, updated_at = ?
          WHERE id = ? AND (provider_status_updated_at IS NULL OR provider_status_updated_at <= ?)
        `).bind(now, providerEventTimestamp, now, subscription.id, providerEventTimestamp),
        createEventStatement(environment, subscription.id, "provider_synced", now),
      );
    }
  }

  if (statements.length > 0)
  {
    await environment.SITE_DATABASE.batch(statements);
  }
}

async function markProviderSyncFailed(environment: Environment, subscriptionId: string): Promise<void>
{
  const now = Date.now();
  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_subscriptions
      SET provider_sync_status = 'failed', updated_at = ?
      WHERE id = ? AND status = 'active'
    `).bind(now, subscriptionId),
    createEventStatement(environment, subscriptionId, "provider_sync_failed", now),
  ]);
}

async function incrementRateLimit(
  environment: Environment,
  fingerprint: string,
  now: number,
): Promise<{ readonly allowed: boolean; readonly retryAfterSeconds: number }>
{
  const windowStartedAt = Math.floor(now / rateLimitWindowMilliseconds) * rateLimitWindowMilliseconds;
  const result = await environment.SITE_DATABASE.prepare(`
    INSERT INTO interaction_rate_limits
      (request_fingerprint, action, window_started_at, event_count, updated_at)
    VALUES (?, 'newsletter_subscription', ?, 1, ?)
    ON CONFLICT(request_fingerprint, action, window_started_at)
    DO UPDATE SET event_count = event_count + 1, updated_at = excluded.updated_at
    RETURNING event_count
  `).bind(fingerprint, windowStartedAt, now).first<{ readonly event_count: number }>();

  return {
    allowed: (result?.event_count ?? maximumRequestsPerWindow + 1) <= maximumRequestsPerWindow,
    retryAfterSeconds: Math.ceil((windowStartedAt + rateLimitWindowMilliseconds - now) / 1000),
  };
}

function createEventStatement(
  environment: Environment,
  subscriptionId: string,
  eventType: string,
  createdAt: number,
): D1PreparedStatement
{
  return environment.SITE_DATABASE.prepare(`
    INSERT INTO newsletter_events (id, subscription_id, event_type, provider_event_id, created_at)
    VALUES (?, ?, ?, NULL, ?)
  `).bind(crypto.randomUUID(), subscriptionId, eventType, createdAt);
}

async function recordNewsletterEvent(
  environment: Environment,
  subscriptionId: string,
  eventType: string,
  createdAt: number,
): Promise<void>
{
  try
  {
    await createEventStatement(environment, subscriptionId, eventType, createdAt).run();
  }
  catch (error)
  {
    console.error(JSON.stringify({
      event: "newsletter_audit_event_failed",
      eventType,
      errorName: error instanceof Error ? error.name : "UnknownError",
    }));
  }
}
