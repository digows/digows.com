PRAGMA foreign_keys = ON;

DROP INDEX IF EXISTS newsletter_subscriptions_delivery_index;
DROP INDEX IF EXISTS newsletter_subscriptions_abuse_window_index;

CREATE INDEX newsletter_subscriptions_delivery_index
    ON newsletter_subscriptions(updated_at)
    WHERE status = 'active' AND provider_sync_status IN ('pending', 'failed');

CREATE INDEX newsletter_subscriptions_provider_contact_index
    ON newsletter_subscriptions(provider_contact_id, provider_status_updated_at)
    WHERE provider_contact_id IS NOT NULL;

CREATE TABLE newsletter_provider_segments
(
    provider TEXT PRIMARY KEY NOT NULL CHECK (provider = 'resend'),
    provider_segment_id TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CHECK (length(provider_segment_id) BETWEEN 1 AND 100)
);

INSERT INTO newsletter_provider_segments
    (provider, provider_segment_id, created_at, updated_at)
SELECT 'resend', provider_segment_id, created_at, updated_at
FROM newsletter_locale_segments
ORDER BY locale
LIMIT 1;

CREATE TABLE newsletter_locale_topics
(
    locale TEXT PRIMARY KEY NOT NULL CHECK (locale IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    provider_topic_id TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CHECK (length(provider_topic_id) BETWEEN 1 AND 100)
);

INSERT INTO newsletter_locale_topics
    (locale, provider_topic_id, created_at, updated_at)
SELECT locale, provider_topic_id, created_at, updated_at
FROM newsletter_locale_segments
WHERE provider_topic_id IS NOT NULL;

UPDATE newsletter_subscriptions
SET provider_sync_status = 'pending'
WHERE status = 'active' AND provider_sync_status = 'synced';

DROP TABLE newsletter_locale_segments;
