// /api/comments: list a page's comments (GET) and post a new one (POST).
// Cloudflare Pages Function, D1 binding DB, Workers AI binding AI. Shared code and the security notes are in
// lib/comments.mjs; how the whole system works (and how it's moderated) is in COMMENTS.md.

import {
  LIMITS, HOLD_CATEGORIES, allowedOrigin, checkPath, cleanBody, cleanName, hasLink, isoMinutesAgo, json, newId,
  readJson, safetyCheck, visitorHash,
} from '../../../lib/comments.mjs';

const OFFLINE = { error: 'Comments are offline right now. Try again later.' };
const BROKE = { error: 'Something broke on our end. Try again in a minute.' };
const HELD = { held: true, message: 'Thanks! Your comment is waiting for a quick review before it shows up.' };

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) return json(503, OFFLINE);
    const path = checkPath(new URL(request.url).searchParams.get('path'));
    if (!path) return json(400, { error: 'Comments aren\'t open on this page.' });
    const { results } = await env.DB
      .prepare("SELECT id, name, body, created_at FROM comments WHERE path = ?1 AND status = 'visible' ORDER BY created_at DESC LIMIT ?2")
      .bind(path, LIMITS.listMax)
      .all();
    const comments = results.map((r) => ({ id: r.id, name: r.name, body: r.body, createdAt: r.created_at }));
    return json(200, { comments });
  } catch {
    return json(500, BROKE);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return json(503, OFFLINE);
    if (!allowedOrigin(request)) return json(403, { error: 'Comments can only be posted from resurgencebuilds.com.' });

    const { data, status, error } = await readJson(request, LIMITS.requestBytes);
    if (error) return json(status, { error });

    // Honeypot: a field people never see. Bots that fill it get a polite answer and nothing is saved.
    if (typeof data.website === 'string' && data.website.trim() !== '') return json(202, HELD);

    const elapsed = Number(data.elapsed);
    if (!Number.isFinite(elapsed) || elapsed < LIMITS.minElapsedMs) {
      return json(400, { error: 'Whoa, speedy. Give it a few seconds and try again.' });
    }

    const path = checkPath(data.path);
    if (!path) return json(400, { error: 'Comments aren\'t open on this page.' });
    const name = cleanName(data.name);
    if (name.error) return json(400, { error: name.error, field: 'name' });
    const body = cleanBody(data.body);
    if (body.error) return json(400, { error: body.error, field: 'body' });
    if (hasLink(name.value) || hasLink(body.value)) {
      return json(400, { error: 'No links or email addresses in comments, please. Spam bots love them; we don\'t.', field: 'body' });
    }

    // The page has to exist on the site (old addresses that redirect don't count).
    const page = await env.ASSETS.fetch(new URL(path, request.url));
    page.body?.cancel();
    if (page.status !== 200) return json(400, { error: 'Comments aren\'t open on this page.' });

    const ipHash = await visitorHash(request, env.DB);
    const now = new Date();
    const counts = await env.DB.prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN ip_hash = ?1 AND created_at > ?2 THEN 1 ELSE 0 END), 0) AS burst,
         COALESCE(SUM(CASE WHEN ip_hash = ?1 THEN 1 ELSE 0 END), 0) AS day,
         COALESCE(SUM(CASE WHEN created_at > ?3 THEN 1 ELSE 0 END), 0) AS site_hour,
         COALESCE(SUM(CASE WHEN ip_hash = ?1 AND body = ?4 THEN 1 ELSE 0 END), 0) AS dupes
       FROM comments WHERE created_at > ?5`,
    ).bind(ipHash, isoMinutesAgo(now, LIMITS.burstWindowMin), isoMinutesAgo(now, 60), body.value,
      isoMinutesAgo(now, 1440)).first();
    if (counts.dupes > 0) return json(409, { error: 'You already posted that one.' });
    if (counts.burst >= LIMITS.burstMax) {
      return json(429, { error: 'You\'re on a roll. Give it a few minutes before the next one.' });
    }
    if (counts.day >= LIMITS.dayMax) return json(429, { error: 'That\'s the daily comment limit. Come back tomorrow.' });
    if (counts.site_hour >= LIMITS.siteHourMax) return json(503, { error: 'Comments are paused for a bit. Try again later.' });

    // Visitors blocked for breaking the rules can still type, but what they post waits for the daily review.
    let state = 'visible';
    let flags = null;
    let note = null;
    const blocked = await env.DB
      .prepare('SELECT reason FROM blocked_visitors WHERE ip_hash = ?1 AND (expires_at IS NULL OR expires_at > ?2)')
      .bind(ipHash, now.toISOString())
      .first('reason');
    if (blocked) {
      state = 'held';
      note = 'Blocked visitor';
    }

    // Safety filter. If it's unavailable the comment posts and the daily review checks it.
    const verdict = blocked ? null : await safetyCheck(env.AI, name.value, body.value);
    if (verdict && !verdict.safe) {
      flags = `ai:${verdict.categories.join(',') || 'unsafe'}`;
      if (verdict.categories.length === 0 || verdict.categories.some((c) => HOLD_CATEGORIES.has(c))) {
        state = 'held';
        note = 'Held by the safety filter';
      }
    }

    const id = newId();
    const createdAt = now.toISOString();
    await env.DB.prepare(
      'INSERT INTO comments (id, path, name, body, created_at, ip_hash, status, flags, moderation_note) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)',
    ).bind(id, path, name.value, body.value, createdAt, ipHash, state, flags, note).run();

    if (state === 'held') return json(202, HELD);
    return json(201, { comment: { id, name: name.value, body: body.value, createdAt } });
  } catch {
    return json(500, BROKE);
  }
}
