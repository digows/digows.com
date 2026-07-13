PRAGMA foreign_keys = ON;

ALTER TABLE newsletter_locale_segments ADD COLUMN provider_topic_id TEXT;

CREATE UNIQUE INDEX newsletter_locale_topics_provider_id_index
    ON newsletter_locale_segments(provider_topic_id)
    WHERE provider_topic_id IS NOT NULL;

ALTER TABLE newsletter_subscriptions ADD COLUMN provider_status_updated_at INTEGER;

CREATE TABLE newsletter_webhook_events
(
    event_id TEXT PRIMARY KEY NOT NULL,
    event_type TEXT NOT NULL,
    event_created_at INTEGER NOT NULL,
    received_at INTEGER NOT NULL,
    processed_at INTEGER,
    CHECK (length(event_id) BETWEEN 1 AND 200),
    CHECK (length(event_type) BETWEEN 1 AND 100)
);

CREATE INDEX newsletter_webhook_events_received_index
    ON newsletter_webhook_events(received_at);
