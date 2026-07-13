PRAGMA foreign_keys = ON;

ALTER TABLE newsletter_subscriptions
    ADD COLUMN welcome_delivery_status TEXT NOT NULL DEFAULT 'not_ready'
        CHECK (welcome_delivery_status IN ('not_ready', 'pending', 'sent', 'failed'));

ALTER TABLE newsletter_subscriptions
    ADD COLUMN welcome_sent_at INTEGER;

DROP INDEX IF EXISTS newsletter_subscriptions_delivery_index;

CREATE INDEX newsletter_subscriptions_delivery_index
    ON newsletter_subscriptions(updated_at)
    WHERE status = 'active'
      AND (
        provider_sync_status IN ('pending', 'failed')
        OR welcome_delivery_status IN ('pending', 'failed')
      );

UPDATE newsletter_subscriptions
SET welcome_delivery_status = 'sent',
    welcome_sent_at = COALESCE(confirmation_sent_at, confirmed_at, updated_at)
WHERE status = 'active';

DELETE FROM newsletter_subscriptions
WHERE status = 'pending';

DELETE FROM newsletter_confirmation_tokens;
