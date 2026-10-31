// Shared code for the reader votes behind the tier lists (functions/api/votes.js). Plain ES module with no
// dependencies, so the Pages Function bundles it and Node can unit-test it (tests/votes.test.mjs). VOTES.md explains
// the whole system.
//
// In short: a reader ranks a build or an OS Protocol S, A, B, C or D. Each tier is worth points (S 5 down to D 1), the
// average sets the item's tier (one vote is enough), and items in a tier are ordered by that average. One vote per
// reader per item; voting again changes it.

export const TIERS = ['S', 'A', 'B', 'C', 'D'];
export const TIER_POINTS = { S: 5, A: 4, B: 3, C: 2, D: 1 };

// What can be voted on, and the page each item has to exist as (the API asks the site's own files).
export const KINDS = {
  build: (id) => `/builds/${id}/`,
  os: (id) => `/database/os-protocols/${id}/`,
};

export const VOTE_LIMITS = {
  requestBytes: 1024,
  minElapsedMs: 3000,     // the page has to be open this long before a vote counts
  perNetworkPerItem: 3,   // new readers on one network (IP address) who count on the same item in
  networkWindowDays: 30,  // ...this many days; more are kept out of the tally
  itemsPerHour: 120,      // items one network can vote on or change in an hour
  changeGapMs: 1500,      // the same reader changing the same vote: at most once per 1.5 seconds
  cacheSeconds: 20,       // the tier lists' totals are cached this long at Cloudflare and in the browser
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function checkKind(raw) {
  return typeof raw === 'string' && Object.hasOwn(KINDS, raw) ? raw : null;
}

export function checkItem(raw) {
  return typeof raw === 'string' && raw.length <= 120 && SLUG_RE.test(raw) ? raw : null;
}

export function checkTier(raw) {
  if (typeof raw !== 'string') return null;
  const t = raw.trim().toUpperCase();
  return TIERS.includes(t) ? t : null;
}

// Average points to a tier. Halfway rounds up: an S and an A average 4.5, which is S.
export function tierFor(avg) {
  if (!(avg > 0)) return null;
  if (avg >= 4.5) return 'S';
  if (avg >= 3.5) return 'A';
  if (avg >= 2.5) return 'B';
  if (avg >= 1.5) return 'C';
  return 'D';
}

// A tally row ({ s, a, b, c, d }) to what the page shows. n = 0 means unranked.
export function summarize(row) {
  const counts = TIERS.map((t) => Math.max(0, Number(row?.[t.toLowerCase()]) || 0));
  const n = counts.reduce((x, y) => x + y, 0);
  const points = counts.reduce((sum, c, i) => sum + c * TIER_POINTS[TIERS[i]], 0);
  const avg = n ? points / n : 0;
  return {
    n,
    s: counts[0], a: counts[1], b: counts[2], c: counts[3], d: counts[4],
    avg: Math.round(avg * 100) / 100,
    tier: tierFor(avg),
  };
}

// Order inside a tier list: higher average first, then more votes, then name.
export function compareItems(x, y) {
  return (y.avg - x.avg) || (y.n - x.n) || String(x.name ?? '').localeCompare(String(y.name ?? ''));
}

// The part of an IP address that identifies a network: the whole IPv4 address, or the /64 prefix of an IPv6 address
// (one home or phone gets a whole /64, and can switch addresses inside it at will).
export function networkOf(ip) {
  if (typeof ip !== 'string' || ip === '') return '0.0.0.0';
  const s = ip.trim().toLowerCase();
  if (!s.includes(':')) return s;
  const mapped = s.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];
  const [head, tail] = s.split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = s.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, '') || '0').join(':')}::/64`;
}

// --- The voter cookie -----------------------------------------------------------------------------------------------
// rb_voter = a random id plus an HMAC of it, so ids can only come from this API. HttpOnly and sent only to /api/votes.

export const COOKIE_NAME = 'rb_voter';
const COOKIE_MAX_AGE = 400 * 24 * 3600; // browsers cap cookie lifetimes at 400 days
const VOTER_RE = /^[0-9a-f]{24}$/;

async function sign(id, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(`voter:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(id));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export function newVoterId() {
  return [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function voterCookie(id, secret, secure = true) {
  const value = `${id}.${await sign(id, secret)}`;
  return `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/api/votes; HttpOnly;${secure ? ' Secure;' : ''} SameSite=Lax`;
}

// The voter id from the request's cookie, or null when there is none or it wasn't made by this API.
export async function readVoter(request, secret) {
  const header = request.headers.get('Cookie') || '';
  const m = header.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([0-9a-f]{24})\\.([0-9a-f]{32})(?:;|$)`));
  if (!m || !VOTER_RE.test(m[1])) return null;
  const expected = await sign(m[1], secret);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ m[2].charCodeAt(i);
  return diff === 0 ? m[1] : null;
}

// The tier lists' totals can be cached: they're the same for everyone.
export function publicJson(data, seconds) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${seconds}`,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}
