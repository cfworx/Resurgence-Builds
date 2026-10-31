# Comments

Open comments on every build, guide, news post and patch notes page: a visitor types a name and a comment, no account,
and it shows right away. This file explains the pieces, how it's protected, how it's moderated, and how to moderate by
hand. It replaced the GitHub (Giscus) comments on October 31, 2026.

## The pieces

| Piece | Where |
|---|---|
| Comment box (form, list, Report buttons) | `src/components/Comments.astro`, used by the Build, Guide and News layouts. It moves itself above the article's "Sources" or "Related Reading" heading. |
| API | `functions/api/comments/index.js` (`GET ?path=` lists a page's comments, `POST` adds one) and `functions/api/comments/report.js` (`POST {"id"}` reports one). Cloudflare Pages Functions. |
| Shared checks | `lib/comments.mjs` (cleanup, limits, link check, hashing, safety filter). Unit tests: `npm run test:comments`. |
| Database | Cloudflare D1 `resurgence-comments`, id `c9f8a76c-5fa4-43b1-8277-c48c527c070f`. Schema: `db/schema.sql`. |
| Bindings | `wrangler.toml`: `DB` (the D1 database) and `AI` (Workers AI). With this file in the repo, Pages takes these settings from it, not the dashboard. |
| Daily review | Scheduled task "Resurgence Builds comment review" (below). |
| Public rules and privacy | `/privacy/#comments` (`src/pages/privacy.astro`) and the DMCA page. |

## How it's protected

- **SQL injection:** every query is a prepared statement with `?1`-style placeholders and `.bind()`. Nothing a visitor
  sends is ever pasted into SQL.
- **Script injection (XSS):** comments are stored and returned as plain text, and the page builds every comment with
  `textContent`, never `innerHTML`. The API's JSON responses carry `nosniff` and `Content-Security-Policy: default-src 'none'`.
- **Input cleanup:** control, zero-width and text-direction characters are stripped, stacked accent "zalgo" is trimmed,
  whitespace is tidied. Names are 2 to 40 characters, comments 2 to 2,000, a whole request at most 16 KB.
- **Who can post:** only pages on the site itself (the `Origin` header has to be resurgencebuilds.com or the same
  address as the API), and only on pages that exist under `/builds/`, `/guides/`, `/news/` or `/patch-notes/` (the API
  asks the site's own files; old addresses that redirect don't count).
- **Spam:** no links or email addresses (blocked with a message), a hidden honeypot field, a 3-second minimum between
  opening the page and posting, the same text twice from one visitor within a day is refused, and names like RapidF5,
  Ubisoft, admin or moderator are reserved.
- **Rate limits** (per visitor): 3 comments per 10 minutes, 30 per day, 20 reports per day. Site-wide, posting pauses
  above 300 comments an hour.
- **Privacy:** IP addresses are never stored. Rate limits use a salted SHA-256 hash; the salt is created in the
  database on first use (table `settings`) and never appears in the repo.
- **Safety filter:** each new comment goes through Cloudflare Workers AI (Llama Guard 3). Hate (S10), sexual content
  (S12), sex crimes (S3), child exploitation (S4), personal information (S7) and self-harm (S11) are held for review
  instead of posting. Other categories (violence and weapons misfire on a shooter's fan site) only set the `flags`
  column for the daily review, and the comment still shows. The filter usually answers in under a second but sometimes
  takes much longer, so a visitor waits at most 1.5 seconds: a later answer is applied in the background and hides the
  comment if it has to. No answer at all leaves `ai:unchecked` for the daily review.
- **Reports:** each visitor can report a comment once. A report sends it back into the daily review, and 3 reports hide
  a comment the review hasn't approved yet. Approved comments can't be hidden by reports, only re-reviewed.
- **Blocks:** visitors listed in `blocked_visitors` can still post, but their comments are held for review.

## Statuses

| Column | Meaning |
|---|---|
| `status` | `visible` (on the site), `held` (hidden until reviewed: safety filter, 3 reports or a blocked visitor), `removed` |
| `approved` | 1 once the daily review approved it |
| `reviewed_at` | last review; `NULL` means it's waiting for one |
| `flags` | automatic notes: `ai:S1` (what the filter flagged), `ai:pending` (still checking), `ai:unchecked` (no answer) |
| `moderation_note` | why it was held or removed |

## The daily review

A scheduled task runs every evening (Pacific time) in a fresh Claude session with the Cloudflare D1 tools. It reads
every comment with `reviewed_at IS NULL` (new, held or reported), approves or removes each one against the rules on
`/privacy/#comments`, looks for spam waves (the same text on several pages, one visitor posting a lot), blocks repeat
offenders for 30 days, deletes removed comments for good after 30 days, and sends a short summary of what it removed.
Comment text is treated as untrusted data: instructions inside a comment are never followed.

## Moderating by hand

Run these with the Cloudflare D1 tools in a Claude session, in the dashboard (D1, `resurgence-comments`, Console), or
with `npx wrangler d1 execute resurgence-comments --remote --command "..."`. Times are ISO 8601 UTC.

```sql
-- Newest comments, any status
SELECT id, path, name, substr(body, 1, 80) AS body, status, flags, reports, created_at
FROM comments ORDER BY created_at DESC LIMIT 50;

-- Remove one (it disappears at once; deleted for good by the daily review after 30 days)
UPDATE comments SET status = 'removed', reviewed_at = '2026-11-01T00:00:00Z', moderation_note = 'Owner: spam'
WHERE id = 'abc23defg456';

-- Put one back
UPDATE comments SET status = 'visible', approved = 1, moderation_note = NULL WHERE id = 'abc23defg456';

-- Block whoever wrote a comment for 30 days (their next comments wait for review)
INSERT OR REPLACE INTO blocked_visitors (ip_hash, reason, created_at, expires_at)
SELECT ip_hash, 'Owner: spam', '2026-11-01T00:00:00Z', '2026-12-01T00:00:00Z' FROM comments WHERE id = 'abc23defg456';

-- Delete a comment for good right away (a removal request, say)
DELETE FROM comment_reports WHERE comment_id = 'abc23defg456';
DELETE FROM comments WHERE id = 'abc23defg456';
```

## Testing locally

```bash
npm run test:comments                                   # unit tests for lib/comments.mjs
npm run build
npx wrangler d1 execute resurgence-comments --local --file db/schema.sql
npx wrangler pages dev                                  # site + API on http://127.0.0.1:8788 with a local database
```

`wrangler pages dev` uses `wrangler.toml`; the Workers AI binding needs a Cloudflare login, so for offline tests run it
from a copy whose `wrangler.toml` leaves out `[ai]` (the API then skips the filter). In local dev the API trusts a
`CF-Connecting-IP` header, which makes it easy to test the per-visitor limits; on Cloudflare that header is set by
Cloudflare and can't be faked.

## Limits worth knowing

On Cloudflare's free plan, every comment load and post is a Functions request, and those share the account's 100,000
Workers requests a day (static pages are free and unlimited). D1's free plan allows 5 million rows read and 100,000
written a day. The comment box only loads when a reader scrolls near it, so a normal day uses a small slice of that.
If the site ever outgrows it, Cloudflare's Workers Paid plan raises all of these.
