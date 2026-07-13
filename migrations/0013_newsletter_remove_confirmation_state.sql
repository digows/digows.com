PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS newsletter_confirmation_tokens;

ALTER TABLE newsletter_subscriptions
    DROP COLUMN confirmation_sent_at;
