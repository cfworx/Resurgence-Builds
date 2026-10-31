// /api/comments/report: a visitor flags a comment (POST {"id": "..."}). Each visitor counts once per comment.
// A reported comment goes back into the review; one the review hasn't approved yet is hidden after
// LIMITS.reportsToHide reports. See COMMENTS.md.

import { ID_RE, LIMITS, allowedOrigin, isoMinutesAgo, json, readJson, visitorHash } from '../../../lib/comments.mjs';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return json(503, { error: 'Comments are offline right now. Try again later.' });
    if (!allowedOrigin(request)) return json(403, { error: 'Reports can only be sent from resurgencebuilds.com.' });
    const { data, status, error } = await readJson(request, 1024);
    if (error) return json(status, { error });
    const id = typeof data.id === 'string' ? data.id : '';
    if (!ID_RE.test(id)) return json(400, { error: 'Unknown comment.' });

    const ipHash = await visitorHash(request, env.DB);
    const now = new Date();
    const recent = await env.DB
      .prepare('SELECT COUNT(*) AS n FROM comment_reports WHERE ip_hash = ?1 AND created_at > ?2')
      .bind(ipHash, isoMinutesAgo(now, 1440))
      .first('n');
    if (recent >= LIMITS.reportsDayMax) {
      return json(429, { error: 'Thanks, that\'s plenty of reports for today. We review comments twice a day.' });
    }

    const found = await env.DB.prepare("SELECT id FROM comments WHERE id = ?1 AND status != 'removed'").bind(id).first('id');
    if (!found) return json(200, { ok: true });

    const added = await env.DB
      .prepare('INSERT OR IGNORE INTO comment_reports (comment_id, ip_hash, created_at) VALUES (?1, ?2, ?3)')
      .bind(id, ipHash, now.toISOString())
      .run();
    if (added.meta?.changes === 1) {
      // SQLite evaluates every SET expression against the row as it was, so "reports + 1" is the new count throughout.
      await env.DB.prepare(
        `UPDATE comments SET
           reports = reports + 1,
           reviewed_at = NULL,
           moderation_note = CASE WHEN status = 'visible' AND approved = 0 AND reports + 1 >= ?2
             THEN 'Hidden after ' || (reports + 1) || ' reports' ELSE moderation_note END,
           status = CASE WHEN status = 'visible' AND approved = 0 AND reports + 1 >= ?2 THEN 'held' ELSE status END
         WHERE id = ?1`,
      ).bind(id, LIMITS.reportsToHide).run();
    }
    return json(200, { ok: true });
  } catch {
    return json(500, { error: 'Something broke on our end. Try again in a minute.' });
  }
}
