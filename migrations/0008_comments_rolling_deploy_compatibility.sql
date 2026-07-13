PRAGMA defer_foreign_keys = ON;

CREATE TABLE comments_compatible
(
    id TEXT PRIMARY KEY NOT NULL,
    post_path TEXT NOT NULL,
    content_id TEXT REFERENCES site_posts(translation_key) ON DELETE RESTRICT,
    parent_id TEXT REFERENCES comments_compatible(id) ON DELETE SET NULL,
    legacy_id INTEGER,
    source TEXT NOT NULL DEFAULT 'site' CHECK (source IN ('site', 'wordpress')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    author_name TEXT NOT NULL,
    author_url TEXT,
    body_text TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    approved_at INTEGER,
    moderation_reason TEXT,
    submission_fingerprint TEXT,
    anchor_locale TEXT CHECK (anchor_locale IS NULL OR anchor_locale IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    anchor_id TEXT,
    anchor_quote TEXT,
    discussion_prompt_key TEXT,
    CHECK (length(post_path) BETWEEN 3 AND 300),
    CHECK (substr(post_path, 1, 1) = '/'),
    CHECK (content_id IS NULL OR length(content_id) BETWEEN 3 AND 300),
    CHECK (length(author_name) BETWEEN 2 AND 80),
    CHECK (length(body_text) BETWEEN 1 AND 5000),
    CHECK (author_url IS NULL OR length(author_url) <= 500),
    CHECK (
        (anchor_id IS NULL AND anchor_locale IS NULL AND anchor_quote IS NULL)
        OR (anchor_id IS NOT NULL AND anchor_locale IS NOT NULL AND anchor_quote IS NOT NULL)
    )
);

INSERT INTO comments_compatible
(
    id, post_path, content_id, parent_id, legacy_id, source, status, author_name,
    author_url, body_text, language, created_at, updated_at, approved_at,
    moderation_reason, submission_fingerprint, anchor_locale, anchor_id,
    anchor_quote, discussion_prompt_key
)
SELECT
    comments.id,
    site_posts.comment_path,
    comments.content_id,
    comments.parent_id,
    comments.legacy_id,
    comments.source,
    comments.status,
    comments.author_name,
    comments.author_url,
    comments.body_text,
    comments.language,
    comments.created_at,
    comments.updated_at,
    comments.approved_at,
    comments.moderation_reason,
    comments.submission_fingerprint,
    comments.anchor_locale,
    comments.anchor_id,
    comments.anchor_quote,
    comments.discussion_prompt_key
FROM comments
INNER JOIN site_posts ON site_posts.translation_key = comments.content_id;

DROP TABLE comments;
ALTER TABLE comments_compatible RENAME TO comments;

CREATE TRIGGER comments_backfill_content_id_after_legacy_insert
AFTER INSERT ON comments
WHEN NEW.content_id IS NULL
BEGIN
    UPDATE comments
    SET content_id = (
        SELECT translation_key
        FROM site_posts
        WHERE comment_path = NEW.post_path AND is_active = 1
        LIMIT 1
    )
    WHERE id = NEW.id;
END;

CREATE UNIQUE INDEX comments_wordpress_legacy_id_unique
    ON comments(legacy_id)
    WHERE legacy_id IS NOT NULL;

CREATE INDEX comments_public_feed_index
    ON comments(content_id, status, created_at, id);

CREATE INDEX comments_legacy_public_feed_index
    ON comments(post_path, status, created_at, id);

CREATE INDEX comments_parent_index
    ON comments(parent_id, status);

CREATE INDEX comments_moderation_queue_index
    ON comments(status, created_at, id);

CREATE INDEX comments_abuse_window_index
    ON comments(submission_fingerprint, created_at)
    WHERE submission_fingerprint IS NOT NULL;

CREATE INDEX comments_anchor_feed_index
    ON comments(content_id, anchor_locale, anchor_id, status, created_at, id)
    WHERE anchor_id IS NOT NULL;

PRAGMA defer_foreign_keys = OFF;
