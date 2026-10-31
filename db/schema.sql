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

-- Reader votes behind the tier lists (see VOTES.md). One row per reader per item: kind 'build' (a build guide) or
-- 'os' (an OS Protocol), item = the page's slug. Voting again changes the row.
CREATE TABLE IF NOT EXISTS votes (
  kind TEXT NOT NULL CHECK (kind IN ('build', 'os')),
  item TEXT NOT NULL,                 -- slug, e.g. tactical-pharma-season-2-build-ggreborn or cover-shooter
  voter TEXT NOT NULL,                -- random id from the reader's rb_voter cookie
  tier TEXT NOT NULL CHECK (tier IN ('S', 'A', 'B', 'C', 'D')),
  ip_hash TEXT NOT NULL,              -- salted SHA-256 of the network (IPv4 address or IPv6 /64); never shown
  ua_hash TEXT NOT NULL,              -- salted SHA-256 of the browser's user agent
  counted INTEGER NOT NULL DEFAULT 1, -- 0 = kept out of the tally (past the per-network cap, or a blocked visitor)
  created_at TEXT NOT NULL,           -- ISO 8601, UTC
  updated_at TEXT NOT NULL,
  changes INTEGER NOT NULL DEFAULT 0, -- how many times this reader changed the vote
  PRIMARY KEY (kind, item, voter)
);
CREATE INDEX IF NOT EXISTS votes_by_item ON votes (kind, item, counted, tier);
CREATE INDEX IF NOT EXISTS votes_by_item_net ON votes (kind, item, ip_hash, ua_hash);
CREATE INDEX IF NOT EXISTS votes_by_net ON votes (ip_hash, updated_at);

-- Each item's totals, rebuilt from votes after every vote so the tier lists read a handful of rows.
CREATE TABLE IF NOT EXISTS vote_tallies (
  kind TEXT NOT NULL,
  item TEXT NOT NULL,
  s INTEGER NOT NULL DEFAULT 0,
  a INTEGER NOT NULL DEFAULT 0,
  b INTEGER NOT NULL DEFAULT 0,
  c INTEGER NOT NULL DEFAULT 0,
  d INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (kind, item)
);
