import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://resurgencebuilds.com';
const dist = path.resolve('dist');

/* ── Helpers ─────────────────────────────────────────────── */

/** Recursively collect every index.html under dist, returning pathname-style paths */
function walkHtml(dir, results = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walkHtml(full, results);
    } else if (entry === 'index.html') {
      const rel = '/' + path.relative(dist, path.dirname(full)).replace(/\\/g, '/') + '/';
      results.push(rel.replace('//', '/'));
    }
  }
  return results;
}

/** Paths to skip for content-page checks */
const SKIP_PREFIXES = [
  '/404/', '/api/', '/pagefind/', '/_astro/', '/images/', '/css/', '/js/', '/map/',
  '/.well-known/', '/ai.txt/', '/build-planner/', '/cdn-cgi/',
  '/database/gear/' // noindexed thin stub
];

/**
 * Check if a path is a content page worth auditing.
 * Non-content pages (APIs, static assets, aliases) are excluded.
 */
function isContentPage(p) {
  if (SKIP_PREFIXES.some(s => p.startsWith(s))) return false;
  return true;
}

/* ── 0. Gather data ─────────────────────────────────────── */

const allPages = walkHtml(dist).sort();
const contentPages = allPages.filter(isContentPage);
const contentSet = new Set(contentPages);

// Parse sitemap
const sitemapPath = path.join(dist, 'sitemap-0.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('FATAL: dist/sitemap-0.xml not found');
  process.exit(1);
}
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const sitemapSet = new Set(sitemapUrls);

// Pre-read all content page HTML into a Map<pathname, html> for O(n²) inlink check
const pageHtmlMap = new Map();
for (const p of contentPages) {
  const htmlPath = path.join(dist, p.slice(1), 'index.html');
  if (fs.existsSync(htmlPath)) {
    pageHtmlMap.set(p, fs.readFileSync(htmlPath, 'utf8'));
  }
}

let pass = 0;
let fail = 0;
const failures = [];

function check(label, ok, detail = '') {
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push(detail ? `${label}: ${detail}` : label);
  }
}

/* ── 1. Every dist content page (non-noindex) is in sitemap ─ */

console.log('\n=== 1. Dist pages → sitemap coverage ===');
// Pages with noindex are intentionally excluded from sitemap — skip them
const indexablePages = contentPages.filter(p => {
  const html = pageHtmlMap.get(p) || '';
  return !/name="robots"\s+content="[^"]*noindex/i.test(html);
});
const missingFromSitemap = indexablePages.filter(p => !sitemapSet.has(p));
check('All indexable content pages in sitemap', missingFromSitemap.length === 0,
  `${missingFromSitemap.length} pages missing from sitemap`);
if (missingFromSitemap.length > 0) {
  console.log('  Missing from sitemap:');
  missingFromSitemap.forEach(p => console.log(`    ✗ ${p}`));
}
console.log(`  Indexable pages: ${indexablePages.length}, in sitemap: ${indexablePages.length - missingFromSitemap.length}`);

/* ── 2. Every sitemap URL has a matching dist page ───────── */

console.log('\n=== 2. Sitemap URLs → dist page match ===');
const orphanSitemapUrls = sitemapUrls.filter(p => !contentSet.has(p));
check('All sitemap URLs have dist pages', orphanSitemapUrls.length === 0,
  `${orphanSitemapUrls.length} sitemap URLs without dist pages`);
if (orphanSitemapUrls.length > 0) {
  console.log('  Sitemap URLs without dist pages:');
  orphanSitemapUrls.forEach(p => console.log(`    ✗ ${p}`));
}
console.log(`  Sitemap URLs: ${sitemapUrls.length}, with dist pages: ${sitemapUrls.length - orphanSitemapUrls.length}`);

/* ── 3. Every page has a self-referencing canonical ──────── */

console.log('\n=== 3. Self-referencing canonical tags ===');
let canonicalPass = 0;
let canonicalFail = 0;
const canonicalIssues = [];

for (const [pagePath, html] of pageHtmlMap) {
  // Pages with noindex often canonicalize to their parent hub — that's intentional
  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
    canonicalPass++;
    continue;
  }

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
    || html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  const expectedCanonical = SITE + pagePath;

  if (!canonicalMatch) {
    canonicalFail++;
    canonicalIssues.push(`  ✗ ${pagePath} — missing canonical tag`);
  } else if (canonicalMatch[1] !== expectedCanonical) {
    canonicalFail++;
    canonicalIssues.push(`  ✗ ${pagePath} — canonical="${canonicalMatch[1]}" (expected ${expectedCanonical})`);
  } else {
    canonicalPass++;
  }
}

check('All pages have self-referencing canonical', canonicalFail === 0,
  `${canonicalFail} pages with canonical issues`);
if (canonicalIssues.length > 0) {
  canonicalIssues.slice(0, 20).forEach(i => console.log(i));
  if (canonicalIssues.length > 20) console.log(`  ... and ${canonicalIssues.length - 20} more`);
}
console.log(`  Canonical pass: ${canonicalPass}, fail: ${canonicalFail}`);

/* ── 4. No noindex page is in the sitemap ────────────────── */

console.log('\n=== 4. Noindex pages not in sitemap ===');
let noindexInSitemap = 0;
const noindexIssues = [];

for (const [pagePath, html] of pageHtmlMap) {
  const hasNoindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(html)
    || /<meta\s+[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
  if (hasNoindex && sitemapSet.has(pagePath)) {
    noindexInSitemap++;
    noindexIssues.push(`  ✗ ${pagePath} — noindex but IN sitemap`);
  }
}

// This is a warning, not a failure — runtime noindex decisions (like isVague)
// can't be filtered at Astro sitemap generation time.
if (noindexInSitemap > 0) {
  console.log(`  ⚠ WARNING: ${noindexInSitemap} noindex page(s) found in sitemap (review but not blocking):`);
  noindexIssues.forEach(i => console.log(i));
} else {
  console.log(`  Noindex-in-sitemap violations: 0`);
}
// Count as pass — this is informational only
pass++;

/* ── 5. Every URL in llms.txt is also in the sitemap ─────── */

console.log('\n=== 5. llms.txt → sitemap coverage ===');
const llmsPath = path.join(dist, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  const llmsUrls = [...llmsContent.matchAll(/https?:\/\/[^\s)>\]]+/g)]
    .map(m => m[0])
    .filter(u => u.startsWith(SITE))
    .map(u => new URL(u).pathname)
    .filter(p => p.endsWith('/'));

  const uniqueLlmsUrls = [...new Set(llmsUrls)];
  const llmsMissing = uniqueLlmsUrls.filter(p => !sitemapSet.has(p));

  check('All llms.txt URLs in sitemap', llmsMissing.length === 0,
    `${llmsMissing.length} llms.txt URLs not in sitemap`);
  if (llmsMissing.length > 0) {
    console.log('  llms.txt URLs missing from sitemap:');
    llmsMissing.forEach(p => console.log(`    ✗ ${p}`));
  }
  console.log(`  llms.txt URLs: ${uniqueLlmsUrls.length}, in sitemap: ${uniqueLlmsUrls.length - llmsMissing.length}`);
} else {
  check('llms.txt exists', false, 'dist/llms.txt not found');
  console.log('  Skipped — dist/llms.txt not found');
}

/* ── 6. Internal inlink check (orphan detection) ─────────── */

console.log('\n=== 6. Internal inlink check ===');
const EXEMPT_PATHS = new Set(['/', '/privacy/', '/terms/', '/dmca/', '/contact/']);

// Build inlink counts from pre-read HTML map
const inlinkCount = new Map();
for (const p of contentPages) {
  inlinkCount.set(p, 0);
}

// For each page, find all internal href links and increment target inlink counts
for (const [, html] of pageHtmlMap) {
  // Match href attributes pointing to internal paths
  const hrefMatches = [...html.matchAll(/href=["'](\/[^"']*?)["']/g)];
  const linkedPaths = new Set();

  for (const m of hrefMatches) {
    let href = m[1];
    // Strip hash/query
    href = href.split('#')[0].split('?')[0];
    // Ensure trailing slash
    if (!href.endsWith('/')) href += '/';
    // Normalize double slashes
    href = href.replace(/\/+/g, '/');
    linkedPaths.add(href);
  }

  // Also match full absolute internal links
  const absMatches = [...html.matchAll(new RegExp(`href=["']${SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\/[^"']*?)["']`, 'g'))];
  for (const m of absMatches) {
    let href = m[1];
    href = href.split('#')[0].split('?')[0];
    if (!href.endsWith('/')) href += '/';
    href = href.replace(/\/+/g, '/');
    linkedPaths.add(href);
  }

  for (const target of linkedPaths) {
    if (inlinkCount.has(target)) {
      inlinkCount.set(target, inlinkCount.get(target) + 1);
    }
  }
}

const orphanPages = [];
for (const [pagePath, count] of inlinkCount) {
  if (EXEMPT_PATHS.has(pagePath)) continue;
  if (count < 1) {
    orphanPages.push(pagePath);
  }
}

check('All content pages have ≥1 internal inlink', orphanPages.length === 0,
  `${orphanPages.length} pages with zero inlinks`);
if (orphanPages.length > 0) {
  console.log('  Orphan pages (zero inlinks):');
  orphanPages.sort().slice(0, 30).forEach(p => console.log(`    ✗ ${p}`));
  if (orphanPages.length > 30) console.log(`  ... and ${orphanPages.length - 30} more`);
}
console.log(`  Content pages checked: ${contentPages.length - EXEMPT_PATHS.size}, orphans: ${orphanPages.length}`);

/* ── Summary ─────────────────────────────────────────────── */

console.log('\n' + '='.repeat(50));
console.log(`AUDIT COMPLETE — ✓ ${pass} passed, ✗ ${fail} failed`);
console.log('='.repeat(50));

if (fail > 0) {
  console.log('\nFailed checks:');
  failures.forEach(f => console.log(`  ✗ ${f}`));
  console.log('');
  process.exit(1);
} else {
  console.log('\nAll checks passed! 🎉\n');
}
