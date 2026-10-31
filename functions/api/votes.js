// /api/votes: the reader-ranked tier lists. GET ?kind=build|os returns every item's vote totals; POST
// {"kind", "id", "tier", "elapsed"} casts or changes one reader's vote. Cloudflare Pages Function, D1 binding DB.
// Shared code is in lib/votes.mjs (and lib/comments.mjs for origin checks, hashing and JSON); VOTES.md explains
// the whole system, its spam protection and how to fix things by hand.

import { allowedOrigin, getSalt, hashIp, isoMinutesAgo, json, readJson } from '../../lib/comments.mjs';
import {
  KINDS, VOTE_LIMITS, checkItem, checkKind, checkTier, networkOf, newVoterId, publicJson, readVoter, summarize, voterCookie,
} from '../../lib/votes.mjs';

const OFFLINE = { error: 'Voting is taking a quick nap. Try again later.' };
const BROKE = { error: 'Something broke on our end. Try again in a minute.' };

// One cache entry per list, whatever query string the page added.
const cacheKey = (url, kind) => new Request(`${url.origin}/api/votes?kind=${kind}`, { method: 'GET' });
const edgeCache = () => (typeof caches !== 'undefined' && caches.default) || null;

export async function onRequestGet({ request, env, waitUntil }) {
  try {
    if (!env.DB) return json(503, OFFLINE);
    const url = new URL(request.url);
    const kind = checkKind(url.searchParams.get('kind'));
    if (!kind) return json(400, { error: 'Unknown tier list.' });

    const cache = edgeCache();
    const key = cacheKey(url, kind);
    if (cache) {
      const hit = await cache.match(key).catch(() => null);
      if (hit) return hit;
    }

    const { results } = await env.DB
      .prepare('SELECT item, s, a, b, c, d, updated_at FROM vote_tallies WHERE kind = ?1')
      .bind(kind)
      .all();
    const items = {};
    let updated = null;
    let votes = 0;
    for (const r of results) {
      const sum = summarize(r);
      if (!sum.n) continue;
      items[r.item] = sum;
      votes += sum.n;
      if (!updated || r.updated_at > updated) updated = r.updated_at;
    }
    const res = publicJson({ kind, items, votes, updated }, VOTE_LIMITS.cacheSeconds);
    if (cache) waitUntil(cache.put(key, res.clone()).catch(() => {}));
    return res;
  } catch {
    return json(500, BROKE);
  }
}

export async function onRequestPost({ request, env, waitUntil }) {
  try {
    if (!env.DB) return json(503, OFFLINE);
    if (!allowedOrigin(request)) return json(403, { error: 'Votes only count from resurgencebuilds.com.' });

    const { data, status, error } = await readJson(request, VOTE_LIMITS.requestBytes);
    if (error) return json(status, { error });
    const kind = checkKind(data.kind);
    const item = checkItem(data.id);
    if (!kind || !item) return json(400, { error: 'Voting isn\'t open on this page.' });
    const tier = checkTier(data.tier);
    if (!tier) return json(400, { error: 'Pick S, A, B, C or D.' });
    const elapsed = Number(data.elapsed);
    if (!Number.isFinite(elapsed) || elapsed < VOTE_LIMITS.minElapsedMs) {
      return json(400, { error: 'Whoa, speedy. Give it a few seconds first.' });
    }

    // The item has to be a page on the site (old addresses that redirect don't count).
    const page = await env.ASSETS.fetch(new URL(KINDS[kind](item), request.url));
    page.body?.cancel();
    if (page.status !== 200) return json(400, { error: 'Voting isn\'t open on this page.' });

    const db = env.DB;
    const salt = await getSalt(db);
    const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
    const ipHash = await hashIp(ip, salt);                                // same hash as comments: blocks apply
    const netHash = await hashIp(`net:${networkOf(ip)}`, salt);          // a home or phone network
    const uaHash = await hashIp(`ua:${(request.headers.get('User-Agent') || '').slice(0, 400)}`, salt);
    const now = new Date();
    const nowIso = now.toISOString();

    // Who's voting. The cookie first. Without one (cleared cookies, a private window), the same network and browser
    // that already voted on this item is the same reader, so they change that vote instead of adding another.
    const cookieVoter = await readVoter(request, salt);
    let voter = cookieVoter;
    let existing = null;
    if (voter) {
      existing = await db
        .prepare('SELECT voter, tier, counted, updated_at FROM votes WHERE kind = ?1 AND item = ?2 AND voter = ?3')
        .bind(kind, item, voter)
        .first();
    } else {
      existing = await db
        .prepare('SELECT voter, tier, counted, updated_at FROM votes WHERE kind = ?1 AND item = ?2 AND ip_hash = ?3 AND ua_hash = ?4 ORDER BY updated_at DESC LIMIT 1')
        .bind(kind, item, netHash, uaHash)
        .first();
      voter = existing ? existing.voter : newVoterId();
    }
    const headers = {};
    if (voter !== cookieVoter) {
      headers['Set-Cookie'] = await voterCookie(voter, salt, new URL(request.url).protocol === 'https:');
    }

    const tallyRow = () => db
      .prepare('SELECT s, a, b, c, d FROM vote_tallies WHERE kind = ?1 AND item = ?2')
      .bind(kind, item)
      .first();
    const reply = async (code, body) => {
      const res = json(code, body);
      for (const [k, v] of Object.entries(headers)) res.headers.append(k, v);
      return res;
    };

    if (existing) {
      if (existing.tier === tier) return reply(200, { ok: true, mine: tier, changed: false, item: summarize(await tallyRow()) });
      if (now.getTime() - Date.parse(existing.updated_at) < VOTE_LIMITS.changeGapMs) {
        return reply(429, { error: 'Easy on the button, champ.' });
      }
    }

    const recent = await db
      .prepare('SELECT COUNT(*) AS n FROM votes WHERE ip_hash = ?1 AND updated_at > ?2')
      .bind(netHash, isoMinutesAgo(now, 60))
      .first('n');
    if (recent >= VOTE_LIMITS.itemsPerHour) {
      return reply(429, { error: 'That\'s a lot of ranking for one hour. Hydrate, then come back.' });
    }

    // Votes that don't count toward the tier list (kept so a reader can still see and change their pick): visitors
    // blocked for spam in the comments, and readers past the per-network cap on this item.
    const blocked = await db
      .prepare('SELECT 1 AS b FROM blocked_visitors WHERE ip_hash = ?1 AND (expires_at IS NULL OR expires_at > ?2)')
      .bind(ipHash, nowIso)
      .first('b');
    let counted = blocked ? 0 : 1;
    if (!existing && counted) {
      const sameNetwork = await db
        .prepare('SELECT COUNT(*) AS n FROM votes WHERE kind = ?1 AND item = ?2 AND ip_hash = ?3 AND counted = 1 AND created_at > ?4')
        .bind(kind, item, netHash, isoMinutesAgo(now, VOTE_LIMITS.networkWindowDays * 1440))
        .first('n');
      if (sameNetwork >= VOTE_LIMITS.perNetworkPerItem) counted = 0;
    }

    const write = existing
      ? db.prepare(
        `UPDATE votes SET tier = ?4, updated_at = ?5, changes = changes + 1, ip_hash = ?6, ua_hash = ?7,
           counted = CASE WHEN ?8 = 0 THEN 0 ELSE counted END
         WHERE kind = ?1 AND item = ?2 AND voter = ?3`,
      ).bind(kind, item, voter, tier, nowIso, netHash, uaHash, counted)
      : db.prepare(
        `INSERT INTO votes (kind, item, voter, tier, ip_hash, ua_hash, counted, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)
         ON CONFLICT (kind, item, voter) DO UPDATE SET tier = excluded.tier, updated_at = excluded.updated_at,
           changes = changes + 1`,
      ).bind(kind, item, voter, tier, netHash, uaHash, counted, nowIso);

    // Rebuild this item's totals from its votes, in the same transaction.
    const recount = db.prepare(
      `INSERT INTO vote_tallies (kind, item, s, a, b, c, d, updated_at)
       SELECT ?1, ?2,
         COALESCE(SUM(tier = 'S'), 0), COALESCE(SUM(tier = 'A'), 0), COALESCE(SUM(tier = 'B'), 0),
         COALESCE(SUM(tier = 'C'), 0), COALESCE(SUM(tier = 'D'), 0), ?3
       FROM votes WHERE kind = ?1 AND item = ?2 AND counted = 1
       ON CONFLICT (kind, item) DO UPDATE SET s = excluded.s, a = excluded.a, b = excluded.b, c = excluded.c,
         d = excluded.d, updated_at = excluded.updated_at`,
    ).bind(kind, item, nowIso);
    const read = db.prepare('SELECT s, a, b, c, d FROM vote_tallies WHERE kind = ?1 AND item = ?2').bind(kind, item);
    const [, , after] = await db.batch([write, recount, read]);

    // This data center's cached copy of the list is stale now.
    const cache = edgeCache();
    if (cache) waitUntil(cache.delete(cacheKey(new URL(request.url), kind)).catch(() => {}));

    return reply(200, { ok: true, mine: tier, changed: !!existing, item: summarize(after.results?.[0]) });
  } catch {
    return json(500, BROKE);
  }
}
