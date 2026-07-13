PRAGMA foreign_keys = ON;

ALTER TABLE comments ADD COLUMN anchor_locale TEXT;
ALTER TABLE comments ADD COLUMN anchor_id TEXT;
ALTER TABLE comments ADD COLUMN anchor_quote TEXT;
ALTER TABLE comments ADD COLUMN discussion_prompt_key TEXT;

CREATE INDEX comments_anchor_feed_index
    ON comments(post_path, anchor_locale, anchor_id, status, created_at, id)
    WHERE anchor_id IS NOT NULL;

CREATE TABLE article_reactions
(
    translation_key TEXT NOT NULL REFERENCES site_posts(translation_key) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('apply', 'perspective', 'disagree', 'follow_up')),
    visitor_fingerprint TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (translation_key, reaction_type, visitor_fingerprint)
);

CREATE INDEX article_reactions_count_index
    ON article_reactions(translation_key, reaction_type);

CREATE TABLE interaction_rate_limits
(
    request_fingerprint TEXT NOT NULL,
    action TEXT NOT NULL,
    window_started_at INTEGER NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (request_fingerprint, action, window_started_at)
);

CREATE INDEX interaction_rate_limits_cleanup_index
    ON interaction_rate_limits(updated_at);
