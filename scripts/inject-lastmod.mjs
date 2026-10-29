// Sets each sitemap <lastmod> to the date the page itself declares, so the sitemap, the
// page's structured data (dateModified) and its article:modified_time can never disagree.
//
//   1. Pages that declare a date (builds, guides, news, patch notes, database pages, class
//      hubs, tier lists, the map): article:modified_time, else the JSON-LD dateModified,
//      else article:published_time.
//   2. Listing pages (home, section hubs, tag archives, author page): the newest date among
//      the sitemap pages they link to from <main>, since a listing changes when its items do.
//   3. Everything else (about, legal pages, the planner) keeps the fallback date that
//      astro.config.mjs wrote (SITE_LAST_UPDATED).
//
// Also sets the sitemap index <lastmod> to the newest date in the sitemap.
// Runs after `astro build`, before inject-sitemap-images.mjs.

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://resurgencebuilds.com';
const dist = path.resolve('dist');
const sitemapPath = path.join(dist, 'sitemap-0.xml');
const indexPath = path.join(dist, 'sitemap-index.xml');

if (!fs.existsSync(sitemapPath)) {
  console.log('Sitemap not found at dist/sitemap-0.xml. Skipping lastmod injection.');
  process.exit(0);
}

const LISTING = [/^\/$/, /^\/(builds|guides|news|patch-notes)\/$/, /^\/tag\/[^/]+\/$/, /^\/author\/[^/]+\/$/];
const isListing = (p) => LISTING.some((re) => re.test(p));

const day = (v) => (/^\d{4}-\d{2}-\d{2}/.test(v || '') ? v.slice(0, 10) : null);

function readPage(pathname) {
  const file = path.join(dist, pathname, 'index.html');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

function declaredDate(html) {
  const meta = (prop) => html.match(new RegExp(`<meta property="${prop}" content="([^"]+)"`))?.[1];
  return (
    day(meta('article:modified_time')) ||
    day(html.match(/"dateModified":"([^"]+)"/)?.[1]) ||
    day(meta('article:published_time'))
  );
}

function mainLinks(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] || '';
  const out = new Set();
  for (const m of main.matchAll(/href="([^"#?]+)/g)) {
    let href = m[1];
    if (href.startsWith(SITE)) href = href.slice(SITE.length);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!href.endsWith('/') && !/\.[a-z0-9]+$/i.test(href)) href += '/';
    out.add(href);
  }
  return out;
}

let xml = fs.readFileSync(sitemapPath, 'utf8');
const blocks = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]*)<\/lastmod>)?/g)];
const entries = blocks.map((m) => ({ full: m[0], loc: m[1], pathname: new URL(m[1]).pathname, old: m[2] || '' }));

// Pass 1: dates the pages declare themselves
const declared = new Map();
for (const e of entries) {
  const html = readPage(e.pathname);
  e.html = html;
  const d = html && !isListing(e.pathname) ? declaredDate(html) : null;
  if (d) declared.set(e.pathname, d);
}

// Pass 2: listing pages take the newest date among the pages they list
const counts = { declared: 0, listing: 0, fallback: 0 };
for (const e of entries) {
  let d = declared.get(e.pathname) || null;
  if (d) counts.declared++;
  else if (e.html && isListing(e.pathname)) {
    const dates = [...mainLinks(e.html)].map((p) => declared.get(p)).filter(Boolean).sort();
    d = dates.length ? dates[dates.length - 1] : null;
    if (d) counts.listing++;
  }
  if (!d) {
    d = day(e.old);
    counts.fallback++;
  }
  e.lastmod = d;
}

for (const e of entries) {
  if (!e.lastmod) continue;
  xml = xml.replace(e.full, `<url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod>`);
}
fs.writeFileSync(sitemapPath, xml, 'utf8');

const newest = entries.map((e) => e.lastmod).filter(Boolean).sort().pop();
if (newest && fs.existsSync(indexPath)) {
  const idx = fs.readFileSync(indexPath, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${newest}</lastmod>`);
  fs.writeFileSync(indexPath, idx, 'utf8');
}

console.log(
  `lastmod: ${counts.declared} from the page's own date, ${counts.listing} listing pages from their newest item, ` +
    `${counts.fallback} kept the fallback. Sitemap index lastmod ${newest}.`
);
