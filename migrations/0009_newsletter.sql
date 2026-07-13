PRAGMA foreign_keys = ON;

CREATE TABLE newsletter_subscriptions
(
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE,
    locale TEXT NOT NULL CHECK (locale IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'unsubscribed', 'suppressed')),
    provider_sync_status TEXT NOT NULL DEFAULT 'not_ready'
        CHECK (provider_sync_status IN ('not_ready', 'pending', 'synced', 'failed')),
    provider_contact_id TEXT,
    source TEXT NOT NULL
        CHECK (source IN ('home', 'article', 'newsletter_page', 'contact', 'comment')),
    source_path TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    requested_at INTEGER NOT NULL,
    confirmation_sent_at INTEGER,
    confirmed_at INTEGER,
    unsubscribed_at INTEGER,
    updated_at INTEGER NOT NULL,
    submission_fingerprint TEXT NOT NULL,
    UNIQUE (email, locale),
    CHECK (length(email) BETWEEN 3 AND 254),
    CHECK (length(source_path) BETWEEN 1 AND 500),
    CHECK (substr(source_path, 1, 1) = '/'),
    CHECK (length(consent_version) BETWEEN 1 AND 64),
    CHECK (provider_contact_id IS NULL OR length(provider_contact_id) <= 100)
);

CREATE INDEX newsletter_subscriptions_delivery_index
    ON newsletter_subscriptions(status, provider_sync_status, locale, updated_at);

CREATE INDEX newsletter_subscriptions_abuse_window_index
    ON newsletter_subscriptions(submission_fingerprint, requested_at);

CREATE TABLE newsletter_confirmation_tokens
(
    token_hash TEXT PRIMARY KEY NOT NULL,
    subscription_id TEXT NOT NULL REFERENCES newsletter_subscriptions(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    consumed_at INTEGER,
    CHECK (length(token_hash) = 64),
    CHECK (expires_at > created_at)
);

CREATE INDEX newsletter_confirmation_tokens_subscription_index
    ON newsletter_confirmation_tokens(subscription_id, consumed_at, expires_at);

CREATE TABLE newsletter_locale_segments
(
    locale TEXT PRIMARY KEY NOT NULL CHECK (locale IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    provider_segment_id TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CHECK (length(provider_segment_id) BETWEEN 1 AND 100)
);

CREATE TABLE newsletter_events
(
    id TEXT PRIMARY KEY NOT NULL,
    subscription_id TEXT NOT NULL REFERENCES newsletter_subscriptions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'requested',
            'confirmation_failed',
            'confirmation_sent',
            'confirmed',
            'provider_synced',
            'provider_sync_failed',
            'unsubscribed',
            'suppressed'
        )
    ),
    provider_event_id TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    CHECK (provider_event_id IS NULL OR length(provider_event_id) <= 200)
);

CREATE INDEX newsletter_events_subscription_index
    ON newsletter_events(subscription_id, created_at, id);
