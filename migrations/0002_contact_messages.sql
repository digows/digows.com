CREATE TABLE contact_messages
(
    id TEXT PRIMARY KEY NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'spam')),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_website TEXT,
    message_text TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('pt-BR', 'en')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    submission_fingerprint TEXT NOT NULL,
    CHECK (length(sender_name) BETWEEN 2 AND 100),
    CHECK (length(sender_email) BETWEEN 3 AND 254),
    CHECK (sender_website IS NULL OR length(sender_website) <= 500),
    CHECK (length(message_text) BETWEEN 10 AND 10000)
);

CREATE INDEX contact_messages_inbox_index
    ON contact_messages(status, created_at DESC, id);

CREATE INDEX contact_messages_abuse_window_index
    ON contact_messages(submission_fingerprint, created_at);
