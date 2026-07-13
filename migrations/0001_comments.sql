PRAGMA foreign_keys = ON;

CREATE TABLE comments
(
    id TEXT PRIMARY KEY NOT NULL,
    post_path TEXT NOT NULL,
    parent_id TEXT REFERENCES comments(id) ON DELETE SET NULL,
    legacy_id INTEGER,
    source TEXT NOT NULL DEFAULT 'site' CHECK (source IN ('site', 'wordpress')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    author_name TEXT NOT NULL,
    author_url TEXT,
    body_text TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('pt-BR', 'en')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    approved_at INTEGER,
    moderation_reason TEXT,
    submission_fingerprint TEXT,
    CHECK (length(post_path) BETWEEN 3 AND 300),
    CHECK (substr(post_path, 1, 1) = '/'),
    CHECK (length(author_name) BETWEEN 2 AND 80),
    CHECK (length(body_text) BETWEEN 1 AND 5000),
    CHECK (author_url IS NULL OR length(author_url) <= 500)
);

CREATE UNIQUE INDEX comments_wordpress_legacy_id_unique
    ON comments(legacy_id)
    WHERE legacy_id IS NOT NULL;

CREATE INDEX comments_public_feed_index
    ON comments(post_path, status, created_at, id);

CREATE INDEX comments_parent_index
    ON comments(parent_id, status);

CREATE INDEX comments_moderation_queue_index
    ON comments(status, created_at, id);

CREATE INDEX comments_abuse_window_index
    ON comments(submission_fingerprint, created_at)
    WHERE submission_fingerprint IS NOT NULL;
