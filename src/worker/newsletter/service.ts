import { getSiteRoutePath } from "../../i18n/routes";
import type { Locale } from "../../i18n/locales";
import type { Environment } from "../contracts";
import type {
  NewsletterRequestResult,
  NewsletterSubscriptionRecord,
  NewsletterSubscriptionRequest,
} from "./contracts";
import { createWelcomeEmail } from "./copy";
import {
  ensureNewsletterSegment,
  ensureNewsletterTopic,
  type NewsletterProviderChannel,
  retrieveContactTopics,
  sendNewsletterWelcome,
  synchronizeNewsletterContact,
} from "./resend";

const rateLimitWindowMilliseconds = 60 * 60 * 1000;
const maximumRequestsPerWindow = 5;
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
    return { status: "rate_limited", subscriptionId: null };
  }

  const existingSubscription = await environment.SITE_DATABASE.prepare(`
    SELECT id, email, locale, status, provider_sync_status, provider_contact_id, source,
           source_path, consent_version, requested_at, confirmed_at, welcome_delivery_status,
           welcome_sent_at, updated_at
    FROM newsletter_subscriptions
    WHERE email = ? AND locale = ?
    LIMIT 1
  `).bind(request.email, request.locale).first<NewsletterSubscriptionRecord>();

  if (existingSubscription?.status === "active")
  {
    return { status: "already_subscribed", subscriptionId: null };
  }

  if (existingSubscription?.status === "suppressed")
  {
    return { status: "suppressed", subscriptionId: null };
  }

  const subscriptionId = existingSubscription?.id ?? crypto.randomUUID();
  const subscriptionStatement = existingSubscription === null
    ? environment.SITE_DATABASE.prepare(`
        INSERT INTO newsletter_subscriptions
        (
          id, email, locale, status, provider_sync_status, provider_contact_id, source,
          source_path, consent_version, requested_at, confirmed_at, unsubscribed_at, updated_at,
          submission_fingerprint, welcome_delivery_status, welcome_sent_at
        )
        VALUES (?, ?, ?, 'active', 'pending', NULL, ?, ?, ?, ?, ?, NULL, ?, ?, 'pending', NULL)
      `).bind(
        subscriptionId,
        request.email,
        request.locale,
        request.source,
        request.sourcePath,
        request.consentVersion,
        now,
        now,
        now,
        request.submissionFingerprint,
      )
    : environment.SITE_DATABASE.prepare(`
        UPDATE newsletter_subscriptions
        SET status = 'active', provider_sync_status = 'pending', source = ?, source_path = ?,
            consent_version = ?, requested_at = ?, confirmed_at = ?, unsubscribed_at = NULL,
            updated_at = ?, submission_fingerprint = ?, welcome_delivery_status = 'pending',
            welcome_sent_at = NULL
        WHERE id = ?
      `).bind(
        request.source,
        request.sourcePath,
        request.consentVersion,
        now,
        now,
        now,
        request.submissionFingerprint,
        subscriptionId,
      );

  await environment.SITE_DATABASE.batch([
    subscriptionStatement,
    createEventStatement(environment, subscriptionId, "requested", now),
    createEventStatement(environment, subscriptionId, "confirmed", now),
  ]);

  return { status: "subscribed", subscriptionId };
}

export async function reconcileNewsletterSubscriptions(environment: Environment): Promise<void>
{
  const subscriptions = await environment.SITE_DATABASE.prepare(`
    SELECT id
    FROM newsletter_subscriptions
    WHERE status = 'active'
      AND (
        provider_sync_status IN ('pending', 'failed')
        OR welcome_delivery_status IN ('pending', 'failed')
      )
    ORDER BY updated_at ASC
    LIMIT ?
  `).bind(maximumReconciliationBatchSize).all<{ readonly id: string }>();

  for (const { id } of subscriptions.results)
  {
    await completeNewsletterSubscription(environment, id);
  }

  const now = Date.now();
  await environment.SITE_DATABASE.batch([
    environment.SITE_DATABASE.prepare(`
      DELETE FROM interaction_rate_limits WHERE updated_at < ?
    `).bind(now - 30 * 24 * 60 * 60 * 1000),
    environment.SITE_DATABASE.prepare(`
      DELETE FROM newsletter_webhook_events WHERE received_at < ?
    `).bind(now - 90 * 24 * 60 * 60 * 1000),
  ]);
}

export async function completeNewsletterSubscription(
  environment: Environment,
  subscriptionId: string,
): Promise<void>
{
  await Promise.all([
    deliverNewsletterWelcome(environment, subscriptionId),
    synchronizeNewsletterSubscription(environment, subscriptionId),
  ]);
}

async function deliverNewsletterWelcome(environment: Environment, subscriptionId: string): Promise<void>
{
  const record = await environment.SITE_DATABASE.prepare(`
    SELECT id, email, locale, status, provider_sync_status, provider_contact_id, source,
           source_path, consent_version, requested_at, confirmed_at, welcome_delivery_status,
           welcome_sent_at, updated_at
    FROM newsletter_subscriptions
    WHERE id = ?
    LIMIT 1
  `).bind(subscriptionId).first<NewsletterSubscriptionRecord>();

  if (
    record === null
    || record.status !== "active"
    || !["pending", "failed"].includes(record.welcome_delivery_status)
  )
  {
    return;
  }

  try
  {
    const newsletterUrl = new URL(getSiteRoutePath("newsletter", record.locale), environment.SITE_ORIGIN);
    const email = createWelcomeEmail(record.locale, newsletterUrl.toString());
    await sendNewsletterWelcome(environment, {
      email: record.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      deliveryId: `${record.id}/${record.requested_at}`,
      locale: record.locale,
    });

    const sentAt = Date.now();
    await environment.SITE_DATABASE.prepare(`
      UPDATE newsletter_subscriptions
      SET welcome_delivery_status = 'sent', welcome_sent_at = ?, updated_at = ?
      WHERE id = ? AND status = 'active'
    `).bind(sentAt, sentAt, record.id).run();
  }
  catch (error)
  {
    const failedAt = Date.now();
    try
    {
      await environment.SITE_DATABASE.prepare(`
        UPDATE newsletter_subscriptions
        SET welcome_delivery_status = 'failed', updated_at = ?
        WHERE id = ? AND status = 'active'
      `).bind(failedAt, record.id).run();
    }
    catch (persistenceError)
    {
      console.error(JSON.stringify({
        event: "newsletter_welcome_failure_state_persistence_failed",
        subscriptionId: record.id,
        errorName: persistenceError instanceof Error ? persistenceError.name : "UnknownError",
      }));
    }

    console.error(JSON.stringify({
      event: "newsletter_welcome_delivery_failed",
      subscriptionId: record.id,
      errorName: error instanceof Error ? error.name : "UnknownError",
    }));
  }
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
           source_path, consent_version, requested_at, confirmed_at, welcome_delivery_status,
           welcome_sent_at, updated_at
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
