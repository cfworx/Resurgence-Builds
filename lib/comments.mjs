// Shared code for the comment API (functions/api/comments/*). Plain ES module with no dependencies, so the Pages
// Functions bundle it and Node can unit-test it (tests/comments.test.mjs). See COMMENTS.md for the whole system.
//
// Security model, in short:
// - Every database call is a prepared statement with bound parameters. Nothing a visitor sends is ever pasted into SQL.
// - Comments are stored and served as plain text. The page renders them with textContent, never as HTML.
// - Input is cleaned (control, zero-width and bidi characters removed) and size-limited before anything else.
// - IPs are never stored: only a salted SHA-256 hash, used for rate limits. The salt lives only in the database.

export const LIMITS = {
  nameMin: 2,
  nameMax: 40,
  bodyMin: 2,
  bodyMax: 2000,
  requestBytes: 16384,     // a whole POST body; a 2,000-character comment is far below this
  minElapsedMs: 3000,      // the form has to be open this long before it can post
  burstWindowMin: 10,      // per visitor: at most `burstMax` comments in this many minutes
  burstMax: 3,
  dayMax: 30,              // per visitor per 24 hours
  siteHourMax: 300,        // whole site per hour: above this, posting pauses (flood protection)
  reportsDayMax: 20,       // reports per visitor per 24 hours
  reportsToHide: 3,        // distinct reports that hide a comment the daily review hasn't approved yet
  listMax: 300,            // comments returned for one page
};

// Pages that have a comment section (src/layouts: Build, Guide and News layouts).
const PATH_RE = /^\/(builds|guides|news|patch-notes)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;

export function checkPath(raw) {
  if (typeof raw !== 'string' || raw.length > 160) return null;
  return PATH_RE.test(raw) ? raw : null;
}

// Characters that are invisible or can reorder text (zero-width, bidi controls, BOM, soft hyphen). The zero-width
// joiner (U+200D) stays: emoji sequences need it.
const INVISIBLE_RE = /[­​‌‎‏‪-‮⁠-⁤⁦-⁯﻿]/g;
const CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;

export function cleanText(raw, multiline) {
  if (typeof raw !== 'string') return '';
  let s = raw.normalize('NFC').replace(/\r\n?/g, '\n').replace(/\t/g, ' ');
  s = s.replace(CONTROL_RE, '').replace(INVISIBLE_RE, '');
  s = s.replace(/(\p{M}{2})\p{M}+/gu, '$1');            // "zalgo" text: keep at most two stacked marks
  if (!multiline) s = s.replace(/\n/g, ' ');
  s = s.split('\n').map((line) => line.replace(/[   -   　]+/g, ' ').trim()).join('\n');
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

// Names nobody but the site can use: the site's and Ubisoft's names anywhere in the name, and staff titles as words.
const RESERVED_PARTS = ['rapidf5', 'resurgencebuild', 'ubisoft', 'thedivmobile', 'massiveentertainment'];
const RESERVED_WORDS = new Set(['admin', 'administrator', 'moderator', 'mod', 'mods', 'staff', 'official', 'webmaster']);

export function isReservedName(name) {
  const lower = name.normalize('NFKC').toLowerCase();
  const squashed = lower.replace(/[^\p{L}\p{N}]/gu, '');
  if (RESERVED_PARTS.some((part) => squashed.includes(part))) return true;
  return lower.split(/[^\p{L}\p{N}]+/u).some((word) => RESERVED_WORDS.has(word));
}

export function cleanName(raw) {
  const value = cleanText(raw, false);
  if ([...value].length < LIMITS.nameMin) return { error: 'Add a name (at least 2 characters).' };
  if ([...value].length > LIMITS.nameMax) return { error: `Keep your name under ${LIMITS.nameMax} characters.` };
  if (!/[\p{L}\p{N}]/u.test(value)) return { error: 'Your name needs at least one letter or number.' };
  if (isReservedName(value)) return { error: 'That name is reserved. Pick another one.' };
  return { value };
}

export function cleanBody(raw) {
  const value = cleanText(raw, true);
  if ([...value.matchAll(/[\p{L}\p{N}]/gu)].length < LIMITS.bodyMin) return { error: 'Write a little more than that.' };
  if ([...value].length > LIMITS.bodyMax) return { error: `Keep it under ${LIMITS.bodyMax.toLocaleString('en-US')} characters.` };
  if (/(.)\1{29,}/su.test(value)) return { error: 'Easy on the repeated characters.' };
  return { value };
}

// Links and email addresses are the main thing spam is made of, so comments can't have any. Bare domains are matched
// in lowercase only and only for the endings spam uses most, so a missing space ("great build.Me too") isn't a link.
const URL_RE = /(?:https?:\/\/|www\.)\S/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
const TLDS = 'com|net|org|io|gg|ru|cn|xyz|top|info|biz|site|online|shop|store|click|link|live|vip|bet|casino|' +
  'ws|su|pw|icu|buzz|cyou|sbs|tk|ml|ga|cf|gq|ly';
const DOMAIN_RE = new RegExp(`\\b[a-z0-9-]{2,}\\.(?:${TLDS})\\b`);

export function hasLink(text) {
  return URL_RE.test(text) || EMAIL_RE.test(text) || DOMAIN_RE.test(text);
}

const ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'; // 32 characters: no 0/o or 1/l lookalikes

export function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let id = '';
  for (const b of bytes) id += ID_ALPHABET[b & 31];
  return id;
}

export const ID_RE = /^[a-z2-9]{12}$/;

export function randomHex(byteCount) {
  return [...crypto.getRandomValues(new Uint8Array(byteCount))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

let saltCache = null;

// The salt is made on first use and kept in the database, so it never appears in the repository.
export async function getSalt(db) {
  if (saltCache) return saltCache;
  const read = () => db.prepare("SELECT value FROM settings WHERE key = 'ip_salt'").first('value');
  let salt = await read();
  if (!salt) {
    await db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('ip_salt', ?1)").bind(randomHex(32)).run();
    salt = await read();
  }
  saltCache = salt;
  return salt;
}

export async function visitorHash(request, db) {
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  return hashIp(ip, await getSalt(db));
}

// Posting is only allowed from the site's own pages (and its preview and local addresses, which are same-origin).
const SITE_HOSTS = new Set(['resurgencebuilds.com', 'www.resurgencebuilds.com']);

export function allowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  let o;
  try {
    o = new URL(origin);
  } catch {
    return false;
  }
  if (o.host === new URL(request.url).host) return true;
  return o.protocol === 'https:' && SITE_HOSTS.has(o.hostname);
}

// Reads a JSON body with a size cap. Returns { data } or { status, error }.
export async function readJson(request, maxBytes) {
  const type = (request.headers.get('Content-Type') || '').toLowerCase();
  if (!type.startsWith('application/json')) return { status: 415, error: 'Send JSON.' };
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > maxBytes) return { status: 413, error: 'That is too long.' };
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return { status: 413, error: 'That is too long.' };
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { status: 400, error: 'Something went wrong. Reload the page and try again.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { status: 400, error: 'Something went wrong. Reload the page and try again.' };
  }
  return { data };
}

export function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

// --- Safety filter (Cloudflare Workers AI, Llama Guard 3) ---------------------------------------------------------
// Categories that hold a comment back until the daily review: sex-related crimes, child sexual exploitation, hate,
// sexual content. Other categories (violence, weapons...) misfire on a shooter's fan site, so they only flag the
// comment for the daily review and it still shows.
export const HOLD_CATEGORIES = new Set(['S3', 'S4', 'S10', 'S12']);

export function parseGuard(result) {
  if (!result || typeof result !== 'object') return null;
  const r = result.response !== undefined ? result.response : result.result?.response;
  const codes = (list) => [...new Set(list.map((c) => String(c).toUpperCase().match(/S\d{1,2}/)?.[0]).filter(Boolean))];
  if (r && typeof r === 'object' && typeof r.safe === 'boolean') {
    return { safe: r.safe, categories: Array.isArray(r.categories) ? codes(r.categories) : [] };
  }
  if (typeof r === 'string') {
    const t = r.trim().toLowerCase();
    if (t.startsWith('safe')) return { safe: true, categories: [] };
    if (t.startsWith('unsafe')) return { safe: false, categories: codes(r.split(/[\s,]+/)) };
  }
  return null;
}

// Returns { safe, categories } or null when the filter isn't available (then the comment posts and the daily review
// is the check). Never throws.
export async function safetyCheck(ai, name, body, timeoutMs = 5000) {
  if (!ai || typeof ai.run !== 'function') return null;
  let timer;
  try {
    const run = ai.run('@cf/meta/llama-guard-3-8b', {
      messages: [{ role: 'user', content: `Comment posted by "${name}" on a video game fan site:\n\n${body}` }],
      max_tokens: 32,
      temperature: 0,
    });
    const timeout = new Promise((resolve) => { timer = setTimeout(() => resolve(null), timeoutMs); });
    return parseGuard(await Promise.race([run, timeout]));
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function isoMinutesAgo(now, minutes) {
  return new Date(now.getTime() - minutes * 60000).toISOString();
}
