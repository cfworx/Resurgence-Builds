import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://resurgencebuilds.com';
const dist = path.resolve('dist');
const sitemapPath = path.join(dist, 'sitemap-0.xml');
const outPath = path.join(dist, 'llms.txt');

/* ── Parse sitemap ──────────────────────────────────────── */

if (!fs.existsSync(sitemapPath)) {
  console.error('FATAL: dist/sitemap-0.xml not found. Run the build first.');
  process.exit(1);
}

const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

/* ── Title extraction ───────────────────────────────────── */

function titleFromUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return 'Division Resurgence Builds & Guides';
  // Take last non-empty segment
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  // Replace hyphens with spaces, title-case
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Priority pages ─────────────────────────────────────── */

const PRIORITY_PATHS = [
  '/',
  '/builds/',
  '/tier-list/',
  '/tier-list/os-protocols/',
  '/database/os-protocols/',
  '/database/weapons/',
  '/database/exotic-weapons/',
  '/database/gear-set-effects/',
  '/database/skill-mod-combos/',
  '/patch-notes/',
  '/guides/',
];

const sitemapPathSet = new Set(sitemapUrls.map(u => new URL(u).pathname));

const priorityEntries = PRIORITY_PATHS
  .filter(p => sitemapPathSet.has(p))
  .map(p => {
    const fullUrl = SITE + p;
    const title = titleFromUrl(fullUrl);
    return `- [${title}](${fullUrl})`;
  });

/* ── Build output ───────────────────────────────────────── */

const lines = [];
const add = (...args) => args.forEach(l => lines.push(l));

add(
  '# ResurgenceBuilds.com — Division Resurgence Wiki & Build Database',
  '',
  '> The #1 community resource for Tom Clancy\'s The Division Resurgence (Ubisoft, 2025). Builds, tier lists, gear databases, weapon stats, OS Protocol rankings, and guides — all verified in-game.',
  '',
  '---',
  '',
);

add('## Priority Pages', '');
priorityEntries.forEach(e => add(e));
add('');

add('---', '');
add('## Full Canonical URL Inventory', '');

for (const url of sitemapUrls) {
  const title = titleFromUrl(url);
  add(`- [${title}](${url})`);
}

add('');

/* ── Write ──────────────────────────────────────────────── */

const content = lines.join('\n');
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${outPath}`);
console.log(`  Priority pages: ${priorityEntries.length}`);
console.log(`  Total URLs: ${sitemapUrls.length}`);
console.log(`  Size: ${Buffer.byteLength(content)} bytes`);
