PRAGMA defer_foreign_keys = ON;

CREATE TABLE site_post_localizations
(
    content_id TEXT NOT NULL REFERENCES site_posts(translation_key) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    canonical_path TEXT NOT NULL UNIQUE,
    PRIMARY KEY (content_id, locale),
    CHECK (substr(canonical_path, 1, 1) = '/'),
    CHECK (substr(canonical_path, -1, 1) = '/')
);

INSERT INTO site_post_localizations (content_id, locale, canonical_path)
SELECT
    translation_key,
    original_language,
    CASE original_language
        WHEN 'en' THEN '/en' || comment_path
        WHEN 'pt-BR' THEN '/pt-br' || comment_path
    END
FROM site_posts;

CREATE INDEX site_post_localizations_locale_path_index
    ON site_post_localizations(locale, canonical_path);

CREATE TABLE comments_next
(
    id TEXT PRIMARY KEY NOT NULL,
    content_id TEXT NOT NULL REFERENCES site_posts(translation_key) ON DELETE RESTRICT,
    parent_id TEXT REFERENCES comments_next(id) ON DELETE SET NULL,
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
    CHECK (length(content_id) BETWEEN 3 AND 300),
    CHECK (length(author_name) BETWEEN 2 AND 80),
    CHECK (length(body_text) BETWEEN 1 AND 5000),
    CHECK (author_url IS NULL OR length(author_url) <= 500),
    CHECK (
        (anchor_id IS NULL AND anchor_locale IS NULL AND anchor_quote IS NULL)
        OR (anchor_id IS NOT NULL AND anchor_locale IS NOT NULL AND anchor_quote IS NOT NULL)
    )
);

INSERT INTO comments_next
(
    id, content_id, parent_id, legacy_id, source, status, author_name, author_url,
    body_text, language, created_at, updated_at, approved_at, moderation_reason,
    submission_fingerprint, anchor_locale, anchor_id, anchor_quote, discussion_prompt_key
)
SELECT
    comments.id, site_posts.translation_key, comments.parent_id, comments.legacy_id,
    comments.source, comments.status, comments.author_name, comments.author_url,
    comments.body_text, comments.language, comments.created_at, comments.updated_at,
    comments.approved_at, comments.moderation_reason, comments.submission_fingerprint,
    comments.anchor_locale, comments.anchor_id, comments.anchor_quote,
    comments.discussion_prompt_key
FROM comments
INNER JOIN site_posts ON site_posts.comment_path = comments.post_path;

DROP TABLE comments;
ALTER TABLE comments_next RENAME TO comments;

CREATE UNIQUE INDEX comments_wordpress_legacy_id_unique
    ON comments(legacy_id)
    WHERE legacy_id IS NOT NULL;

CREATE INDEX comments_public_feed_index
    ON comments(content_id, status, created_at, id);

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

CREATE TABLE contact_messages_next
(
    id TEXT PRIMARY KEY NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'spam')),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_website TEXT,
    message_text TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'pt-BR', 'es', 'fr', 'zh-Hans')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    submission_fingerprint TEXT NOT NULL,
    CHECK (length(sender_name) BETWEEN 2 AND 100),
    CHECK (length(sender_email) BETWEEN 3 AND 254),
    CHECK (sender_website IS NULL OR length(sender_website) <= 500),
    CHECK (length(message_text) BETWEEN 10 AND 10000)
);

INSERT INTO contact_messages_next
SELECT * FROM contact_messages;

DROP TABLE contact_messages;
ALTER TABLE contact_messages_next RENAME TO contact_messages;

CREATE INDEX contact_messages_inbox_index
    ON contact_messages(status, created_at DESC, id);

CREATE INDEX contact_messages_abuse_window_index
    ON contact_messages(submission_fingerprint, created_at);

PRAGMA defer_foreign_keys = OFF;
