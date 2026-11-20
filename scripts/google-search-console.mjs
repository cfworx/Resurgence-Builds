#!/usr/bin/env node
// Google's side of "the site changed", through the Search Console API. Run it after a deploy is live;
// the GitHub workflow .github/workflows/google-search-console.yml does that after every push to main.
//
//   1. Resubmits the sitemap when Google hasn't seen the newest version: the live sitemap lists a
//      different number of pages than Google's last read of it, or carries dates newer than its last
//      download. An unchanged sitemap is left alone (submitting is only a hint, and repeating it adds
//      nothing). --force resubmits anyway.
//   2. Asks the URL Inspection API what Google knows about the pages that changed and prints it:
//      indexed or not, the last crawl, the canonical Google chose, rich result errors. Read-only: no API
//      makes Google index an ordinary page. Each row links to the page in Search Console, where the
//      owner can press "Request indexing" by hand.
//
// It never calls the Indexing API. Google only accepts that API for job posting pages and livestream
// videos, runs every submission through spam detection and can revoke access when it is misused
// (developers.google.com/search/apis/indexing-api/v3/quickstart, updated November 7, 2026).
// Resurgence Builds has neither kind of page, and the service account is shared with a job site that
// does depend on the Indexing API, so misuse here could cost that site its access.
//
// Credentials: a Google Cloud service account, with the Google Search Console API enabled in its
// project, added to the resurgencebuilds.com property in Search Console as a Full user (Settings, Users
// and permissions, Add user). Its JSON key belongs in the GitHub secret GOOGLE_SERVICE_ACCOUNT_JSON and
// never in this repo, which is public. To run it by hand:
//   GOOGLE_SERVICE_ACCOUNT_JSON="$(cat key.json)" node scripts/google-search-console.mjs
//   (or GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json)
//
//   node scripts/google-search-console.mjs                  inspects pages dated in the last 2 days
//   node scripts/google-search-console.mjs --days 7         a different window
//   node scripts/google-search-console.mjs --since <sha>    also the posts and guides whose file changed since that commit
//   node scripts/google-search-console.mjs /guides/x/       also these pages
//   node scripts/google-search-console.mjs --inspect 40     up to 40 pages (default 20; Google allows 2,000 a day per site)
//   node scripts/google-search-console.mjs --wait-for <sha> first waits (up to 20 minutes) until the live site serves that commit
//   add --force to resubmit the sitemap whatever its dates, --dry to print what it would do without calling Google
import fs from 'node:fs';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

// Behind a proxy (the cloud workspace), Node's fetch only goes through it when NODE_USE_ENV_PROXY is set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const again = spawnSync(process.execPath, process.argv.slice(1), { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(again.status ?? 1);
}

const SITE = 'https://resurgencebuilds.com';
const HOST = new URL(SITE).host;
const SITEMAP = `${SITE}/sitemap-index.xml`;
const SCOPE = 'https://www.googleapis.com/auth/webmasters';
// The two overrides exist only for testing against a local mock.
const WEBMASTERS = process.env.GSC_TEST_WEBMASTERS || 'https://www.googleapis.com/webmasters/v3';
const INSPECT = process.env.GSC_TEST_INSPECT || 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const days = Number(option('--days', 2));
const maxInspect = Number(option('--inspect', 20));
const since = option('--since', '');
const waitFor = option('--wait-for', '');
const dry = flag('--dry');
const asUrl = (a) => (a.startsWith('/') ? SITE + a : a);
const isPage = (a) => a.startsWith('/') || a.startsWith(SITE + '/');
const named = [...args, ...(process.env.EXTRA_PATHS || '').split(/\s+/)].filter((a) => a && isPage(a)).map(asUrl);

const inActions = Boolean(process.env.GITHUB_ACTIONS);
const warn = (message) => console.log(inActions ? `::warning::${message}` : `Warning: ${message}`);
const fail = (message) => {
  console.log(inActions ? `::error::${message}` : `Error: ${message}`);
  summary.push(`**Error:** ${message}`);
  writeSummary();
  process.exit(1);
};
const summary = ['### Google Search Console', ''];
function writeSummary() {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
}

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const hasCommit = (sha) => {
  try {
    git('cat-file', '-e', `${sha}^{commit}`);
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------------------------------
// 1. Wait for the deploy (the build writes the commit to /build.txt; scripts/write-build-stamp.mjs)
// ---------------------------------------------------------------------------------------------------
function includes(newer, older) {
  if (!hasCommit(newer)) {
    try {
      git('fetch', '--quiet', '--filter=blob:none', '--depth=100', 'origin', 'main');
    } catch {
      return false;
    }
  }
  try {
    git('merge-base', '--is-ancestor', older, newer);
    return true;
  } catch {
    return false;
  }
}

async function waitForDeploy(sha) {
  const deadline = Date.now() + 20 * 60 * 1000;
  let seen = '';
  while (Date.now() < deadline) {
    const res = await fetch(`${SITE}/build.txt?t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
    const live = res && res.ok ? (await res.text()).trim() : '';
    if (live === sha) {
      console.log(`The live site serves ${sha.slice(0, 7)}.`);
      return;
    }
    if (live && live !== seen) {
      seen = live;
      if (includes(live, sha)) {
        console.log(`The live site serves ${live.slice(0, 7)}, a later commit that includes ${sha.slice(0, 7)}.`);
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 15000));
  }
  warn(`The live site didn't serve ${sha.slice(0, 7)} within 20 minutes (it shows ${seen ? seen.slice(0, 7) : 'no build stamp'}), so the deploy may have failed or been skipped. Carrying on with what is live.`);
}

// ---------------------------------------------------------------------------------------------------
// 2. What is live: the sitemap's pages and dates
// ---------------------------------------------------------------------------------------------------
async function liveSitemap() {
  const index = await (await fetch(`${SITEMAP}?t=${Date.now()}`, { cache: 'no-store' })).text();
  const files = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = [];
  for (const file of files) {
    const xml = await (await fetch(`${file}?t=${Date.now()}`, { cache: 'no-store' })).text();
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
      const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || '';
      if (loc) pages.push({ loc, lastmod });
    }
  }
  return pages;
}

// Posts, guides and translations whose markdown file changed since a commit. Pages built from data
// files (the database) aren't mapped; they keep their sitemap dates.
function changedSince(sha) {
  if (!sha || /^0+$/.test(sha)) return [];
  if (!hasCommit(sha)) {
    warn(`Commit ${sha.slice(0, 7)} isn't in this checkout, so pages changed since then aren't listed.`);
    return [];
  }
  const urls = [];
  for (const file of git('diff', '--name-only', '--no-renames', '--diff-filter=AM', sha, 'HEAD').split('\n')) {
    let m;
    if ((m = file.match(/^src\/content\/(builds|guides|news|patch-notes|reviews)\/([^/_][^/]*)\.mdx?$/))) urls.push(`${SITE}/${m[1]}/${m[2]}/`);
    else if ((m = file.match(/^src\/content\/translations\/([a-z-]+)\/([^/_][^/]*)\.mdx?$/))) urls.push(`${SITE}/${m[1]}/guides/${m[2]}/`);
  }
  return urls;
}

// ---------------------------------------------------------------------------------------------------
// 3. Google: credentials, token, API calls
// ---------------------------------------------------------------------------------------------------
function credentials() {
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
  if (!raw && process.env.GOOGLE_APPLICATION_CREDENTIALS) raw = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8');
  raw = raw.trim();
  if (!raw) return null;
  if (!raw.startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8'); // a base64-encoded key works too
  let cred;
  try {
    cred = JSON.parse(raw);
  } catch {
    fail('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste the whole key file, braces included, into the secret.');
  }
  if (cred.type !== 'service_account' || !cred.client_email || !cred.private_key) {
    fail('GOOGLE_SERVICE_ACCOUNT_JSON is not a service account key (it needs "type": "service_account", client_email and private_key).');
  }
  return cred;
}

const b64url = (data) => Buffer.from(data).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function accessToken(cred) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = cred.token_uri || 'https://oauth2.googleapis.com/token';
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: cred.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 }));
  const signature = b64url(crypto.createSign('RSA-SHA256').update(`${head}.${claims}`).sign(cred.private_key));
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${signature}` }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    fail(`Google turned down the service account key (${res.status} ${body.error || ''}). The key may have been deleted or disabled in Google Cloud: make a new one and replace the secret.`);
  }
  return body.access_token;
}

async function api(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {}
  return { ok: res.ok, status: res.status, json, message: json.error?.message || text.slice(0, 300) };
}

const notEnabled = (r) => r.status === 403 && /has not been used|is disabled|SERVICE_DISABLED|accessNotConfigured/i.test(r.message + JSON.stringify(r.json));
const day = (v) => (v ? String(v).slice(0, 10) : '');

// ---------------------------------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------------------------------
if (waitFor) await waitForDeploy(waitFor);

const pages = await liveSitemap();
const liveSet = new Set(pages.map((p) => p.loc));
const newest = pages.reduce((max, p) => (p.lastmod > max ? p.lastmod : max), '');
const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const gitPages = changedSince(since).filter((u) => liveSet.has(u));
const dated = pages.filter((p) => p.lastmod && p.lastmod.slice(0, 10) >= cutoff).map((p) => p.loc);
const toInspect = [...new Set([...named, ...gitPages, ...dated])].slice(0, maxInspect);
console.log(`Live sitemap: ${pages.length} pages, newest date ${newest || 'none'}.`);
console.log(`Pages to inspect (${toInspect.length}): ${toInspect.length ? '' : 'none'}`);
toInspect.forEach((u) => console.log('  ' + u.replace(SITE, '')));

const cred = credentials();
if (!cred) {
  const how =
    'No Google credentials, so nothing was sent to Google. To turn this on: enable the Google Search Console API in the ' +
    "service account's Google Cloud project; add the service account to the resurgencebuilds.com property in Search Console " +
    '(Settings, Users and permissions, Add user, Full); then create a JSON key for it and save the whole file as the ' +
    'repository secret GOOGLE_SERVICE_ACCOUNT_JSON (GitHub: Settings, Secrets and variables, Actions).';
  warn(how);
  summary.push(how);
  writeSummary();
  process.exit(0);
}
if (dry) {
  console.log('--dry: stopping before any call to Google.');
  process.exit(0);
}

const token = await accessToken(cred);

// The property: a Domain property (sc-domain:) if the account can see one, else the URL-prefix one.
const sites = await api(token, 'GET', `${WEBMASTERS}/sites`);
if (notEnabled(sites)) fail("The Google Search Console API is turned off in the service account's Google Cloud project. Enable it (APIs & Services, Library, Google Search Console API), then run this again.");
if (!sites.ok) fail(`Search Console wouldn't list the properties (${sites.status}): ${sites.message}`);
const entries = sites.json.siteEntry || [];
const property =
  entries.find((e) => e.siteUrl === `sc-domain:${HOST}`) || entries.find((e) => e.siteUrl === `${SITE}/`) || entries.find((e) => e.siteUrl.includes(HOST));
if (!property) {
  fail(`The service account can't see ${HOST} in Search Console yet. Add it to the property: Settings, Users and permissions, Add user, permission Full.`);
}
const level = { siteOwner: 'Owner', siteFullUser: 'Full user', siteRestrictedUser: 'Restricted user', siteUnverifiedUser: 'unverified' }[property.permissionLevel] || property.permissionLevel;
console.log(`Property: ${property.siteUrl} (${level})`);
summary.push(`Property: \`${property.siteUrl}\` (${level})`, '');
const site = encodeURIComponent(property.siteUrl);

// Sitemap: resubmit only when Google hasn't seen the newest version.
const listed = await api(token, 'GET', `${WEBMASTERS}/sites/${site}/sitemaps`);
const known = (listed.json.sitemap || []).find((s) => s.path === SITEMAP);
const googleCount = known ? (known.contents || []).filter((c) => c.type === 'web').reduce((n, c) => n + Number(c.submitted || 0), 0) : 0;
let reason = '';
if (!known) reason = "Google has no record of this sitemap in the property yet";
else if (known.isPending) reason = '';
else if (googleCount && googleCount !== pages.length) reason = `the sitemap lists ${pages.length} pages and Google's last read of it had ${googleCount}`;
else if (newest && known.lastDownloaded && newest > day(known.lastDownloaded)) reason = `pages are dated ${newest}, after Google's last download (${day(known.lastDownloaded)})`;
if (!reason && flag('--force')) reason = 'asked to (--force)';

let sitemapLine;
if (reason) {
  const put = await api(token, 'PUT', `${WEBMASTERS}/sites/${site}/sitemaps/${encodeURIComponent(SITEMAP)}`);
  if (!put.ok) {
    warn(`Search Console didn't take the sitemap (${put.status}): ${put.message}${property.permissionLevel === 'siteRestrictedUser' ? ' A Restricted user can\'t submit sitemaps: make the service account a Full user.' : ''}`);
    sitemapLine = `Sitemap: **not submitted** (${put.status}: ${put.message})`;
  } else {
    sitemapLine = `Sitemap: **resubmitted**, because ${reason}.`;
  }
} else if (known?.isPending) {
  sitemapLine = 'Sitemap: left alone, Google is still processing the last submission.';
} else {
  sitemapLine = `Sitemap: left alone, Google last downloaded it on ${day(known.lastDownloaded) || 'an unknown date'} and nothing in it is newer.`;
}
console.log(sitemapLine.replace(/\*\*/g, ''));
summary.push(sitemapLine, '');
if (known && ((known.errors && Number(known.errors) > 0) || (known.warnings && Number(known.warnings) > 0))) {
  warn(`Search Console reports ${known.errors || 0} error(s) and ${known.warnings || 0} warning(s) on the sitemap. Open the Sitemaps report to see them.`);
}

// URL Inspection: what Google knows about each changed page.
const rows = [];
for (const url of toInspect) {
  const r = await api(token, 'POST', INSPECT, { inspectionUrl: url, siteUrl: property.siteUrl, languageCode: 'en-US' });
  if (r.status === 429) {
    warn('URL Inspection quota reached for now; the remaining pages were skipped.');
    break;
  }
  if (!r.ok) {
    rows.push({ url, coverage: `not inspected (${r.status}: ${r.message.slice(0, 120)})`, crawl: '', note: '', link: '' });
    continue;
  }
  const result = r.json.inspectionResult || {};
  const s = result.indexStatusResult || {};
  const notes = [];
  if (s.googleCanonical && s.userCanonical && s.googleCanonical !== s.userCanonical) notes.push(`Google picked ${s.googleCanonical} as canonical`);
  if (s.robotsTxtState && s.robotsTxtState !== 'ALLOWED') notes.push(`robots.txt: ${s.robotsTxtState}`);
  if (s.pageFetchState && !['SUCCESSFUL', 'PAGE_FETCH_STATE_UNSPECIFIED'].includes(s.pageFetchState)) notes.push(`fetch: ${s.pageFetchState}`);
  for (const item of result.richResultsResult?.detectedItems || []) {
    for (const it of item.items || []) {
      for (const issue of it.issues || []) if (issue.severity === 'ERROR') notes.push(`${item.richResultType}: ${issue.issueMessage}`);
    }
  }
  rows.push({ url, coverage: s.coverageState || s.verdict || 'unknown', crawl: day(s.lastCrawlTime), note: notes.join('; '), link: result.inspectionResultLink || '' });
}

if (rows.length) {
  console.log('');
  for (const row of rows) console.log(`${row.url.replace(SITE, '')}\n    ${row.coverage}${row.crawl ? `, last crawled ${row.crawl}` : ''}${row.note ? `\n    ${row.note}` : ''}`);
  summary.push('| Page | Google says | Last crawl | Notes |', '|---|---|---|---|');
  for (const row of rows) {
    const page = row.url.replace(SITE, '');
    summary.push(`| ${row.link ? `[${page}](${row.link})` : page} | ${row.coverage} | ${row.crawl || '-'} | ${row.note.replace(/\|/g, '/') || ''} |`);
  }
  summary.push('', 'Each page links to its Search Console report, where "Request indexing" is.');
} else {
  summary.push('No changed pages to inspect.');
}
writeSummary();
