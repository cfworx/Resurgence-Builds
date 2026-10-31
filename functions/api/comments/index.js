// /api/comments: list a page's comments (GET) and post a new one (POST).
// Cloudflare Pages Function, D1 binding DB, Workers AI binding AI. Shared code and the security notes are in
// lib/comments.mjs; how the whole system works (and how it's moderated) is in COMMENTS.md.

import {
  LIMITS, allowedOrigin, applyVerdict, checkPath, cleanBody, cleanName, hasLink, isoMinutesAgo, json, newId, readJson,
  safetyCheck, visitorHash,
} from '../../../lib/comments.mjs';

const QUICK_MS = 1500;   // how long a visitor waits for the safety filter
const FILTER_MS = 25000; // how long the filter gets in total (the rest runs after the reply; Cloudflare allows 30 s)
const PENDING = Symbol('pending');

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

export async function onRequestPost({ request, env, waitUntil }) {
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

    // Safety filter. Workers AI usually answers in well under a second but sometimes takes many seconds, so the
    // visitor waits at most QUICK_MS: a slower answer is applied in the background (the comment shows meanwhile and is
    // hidden as soon as the filter says so). No answer at all leaves "ai:unchecked" for the daily review.
    const id = newId();
    const createdAt = now.toISOString();
    let pending = null;
    if (!blocked) {
      const check = safetyCheck(env.AI, name.value, body.value, FILTER_MS);
      const quick = await Promise.race([check, new Promise((resolve) => setTimeout(() => resolve(PENDING), QUICK_MS))]);
      if (quick === PENDING) {
        pending = check;
        flags = 'ai:pending';
      } else {
        ({ state, flags, note } = applyVerdict(quick, state, note));
      }
    }

    await env.DB.prepare(
      'INSERT INTO comments (id, path, name, body, created_at, ip_hash, status, flags, moderation_note) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)',
    ).bind(id, path, name.value, body.value, createdAt, ipHash, state, flags, note).run();

    if (pending) {
      waitUntil(pending.then((verdict) => {
        const v = applyVerdict(verdict, 'visible', null);
        return env.DB.prepare(
          `UPDATE comments SET flags = ?1,
             status = CASE WHEN ?2 = 'held' AND status = 'visible' THEN 'held' ELSE status END,
             moderation_note = CASE WHEN ?2 = 'held' AND status = 'visible' THEN ?3 ELSE moderation_note END
           WHERE id = ?4`,
        ).bind(v.flags, v.state, v.note, id).run();
      }).catch(() => {}));
    }

    if (state === 'held') return json(202, HELD);
    return json(201, { comment: { id, name: name.value, body: body.value, createdAt } });
  } catch {
    return json(500, BROKE);
  }
}
