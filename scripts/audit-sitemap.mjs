import fs from 'fs';
import path from 'path';

// Count all HTML pages in dist
function walkHtml(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walkHtml(full, results);
    else if (f === 'index.html') {
      const rel = '/' + path.relative('dist', path.dirname(full)).replace(/\\/g, '/') + '/';
      results.push(rel.replace('//', '/'));
    }
  }
  return results;
}

const allPages = walkHtml('dist').sort();

// Parse sitemap URLs
const xml = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => {
  return new URL(m[1]).pathname;
});
const sitemapSet = new Set(sitemapUrls);

// Categorise
const skipDirs = ['/_astro/', '/css/', '/js/', '/icons/', '/images/', '/pagefind/', '/api/'];
const contentPages = allPages.filter(p => !skipDirs.some(s => p.startsWith(s)));

const inSitemap = contentPages.filter(p => sitemapSet.has(p));
const missingFromSitemap = contentPages.filter(p => !sitemapSet.has(p));

// Section breakdown
const sections = {};
for (const url of sitemapUrls) {
  const section = url.split('/').filter(Boolean)[0] || 'root';
  sections[section] = (sections[section] || 0) + 1;
}

console.log('=== Sitemap Coverage Report ===\n');
console.log('Sitemap file:  /sitemap-index.xml → /sitemap-0.xml');
console.log(`Total URLs in sitemap: ${sitemapUrls.length}`);
console.log(`Total HTML pages built: ${contentPages.length}`);
console.log(`Pages IN sitemap: ${inSitemap.length}`);
console.log(`Pages NOT in sitemap: ${missingFromSitemap.length}\n`);

console.log('--- Section Breakdown ---');
Object.entries(sections).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
  console.log(`  /${s}/: ${c} URLs`);
});

if (missingFromSitemap.length > 0) {
  console.log('\n--- Pages NOT in sitemap ---');
  missingFromSitemap.forEach(p => {
    // Classify why
    let reason = '';
    if (p.includes('/build-planner/')) reason = '(redirect)';
    else if (p.includes('/cdn-cgi/')) reason = '(redirect)';
    else if (p.match(/\/tag\/v\d/)) reason = '(redirect)';
    else if (p.includes('/tag/general/')) reason = '(redirect)';
    else if (p.includes('/map/')) reason = '(static embed)';
    console.log(`  ${p} ${reason}`);
  });
}
