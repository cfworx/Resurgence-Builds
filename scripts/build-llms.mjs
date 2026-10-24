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
  '/database/drop-rates/',
  '/division-resurgence-interactive-map/',
  '/patch-notes/',
  '/news/',
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
  '# ResurgenceBuilds.com: Division Resurgence Builds, Database & Guides',
  '',
  '> Independent fan site for Tom Clancy\'s The Division Resurgence (Ubisoft; iOS and Android since March 31, 2026, PC on Steam and Ubisoft Connect since August 5, 2026). Builds, tier lists, the official cache drop rates, an interactive map, gear and weapon databases, OS Protocol rankings, patch notes and guides. Game facts are checked against Ubisoft\'s official notes; creator builds are credited and labeled when we have not re-tested them. Not affiliated with Ubisoft.',
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
// Legacy filename some crawlers request; keep it identical so it can never go stale.
fs.writeFileSync(path.join(dist, 'llm.txt'), content, 'utf8');
console.log(`Generated ${outPath}`);
console.log(`  Priority pages: ${priorityEntries.length}`);
console.log(`  Total URLs: ${sitemapUrls.length}`);
console.log(`  Size: ${Buffer.byteLength(content)} bytes`);
