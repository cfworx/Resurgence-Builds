-- Comments database (Cloudflare D1, database "resurgence-comments").
-- Applied once with the Cloudflare D1 tools; every statement is safe to run again.
-- See COMMENTS.md for how the comment system and its moderation work.

-- One row per comment. Text is stored exactly as posted (after cleanup) and is always shown as plain text.
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,                -- random 12-character id
  path TEXT NOT NULL,                 -- page it belongs to, e.g. /builds/some-build/
  name TEXT NOT NULL,                 -- display name the visitor typed
  body TEXT NOT NULL,                 -- the comment
  created_at TEXT NOT NULL,           -- ISO 8601, UTC
  ip_hash TEXT NOT NULL,              -- salted SHA-256 of the IP (rate limits, spam waves); never shown
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'held', 'removed')),
  approved INTEGER NOT NULL DEFAULT 0, -- 1 once the daily review has approved it (reports can't hide it then)
  reviewed_at TEXT,                   -- last daily review; NULL means it is waiting for review
  flags TEXT,                         -- automatic notes, e.g. "ai:S10" from the safety filter
  moderation_note TEXT,               -- why it was held or removed
  reports INTEGER NOT NULL DEFAULT 0  -- distinct visitors who reported it
);
CREATE INDEX IF NOT EXISTS comments_by_page ON comments (path, status, created_at);
CREATE INDEX IF NOT EXISTS comments_by_ip ON comments (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS comments_by_review ON comments (reviewed_at, status);
CREATE INDEX IF NOT EXISTS comments_by_time ON comments (created_at);

-- One row per visitor per reported comment, so one person can only report a comment once.
CREATE TABLE IF NOT EXISTS comment_reports (
  comment_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (comment_id, ip_hash)
);
CREATE INDEX IF NOT EXISTS comment_reports_by_ip ON comment_reports (ip_hash, created_at);

-- Private settings. ip_salt is created by the API on first use and never leaves the database.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Visitors whose comments are held for review instead of posting (repeat offenders). Set by the daily review or the
-- owner; expires_at NULL means until removed. IPs change, so blocks normally expire after 30 days.
CREATE TABLE IF NOT EXISTS blocked_visitors (
  ip_hash TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);
