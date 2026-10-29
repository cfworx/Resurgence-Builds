/**
 * Post-build script: adds <image:image> entries to the sitemap.
 * Run after `astro build` and after `inject-lastmod.mjs`.
 *
 * For every page in the sitemap it reads the built HTML and lists the content images
 * inside <main> (the <img src>, which is always the largest size of a responsive image),
 * plus the page's og:image. Small interface icons and the site logo are skipped.
 * Only <image:loc> is written: Google ignores the old title and caption tags.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(DIST, 'sitemap-0.xml');
const SITE_URL = 'https://resurgencebuilds.com';

const SKIP = [/^\/images\/icons\//, /^\/images\/ui\//, /resurgence-builds-official-logo\./, /^\/favicon/, /\.svg$/i];
const MAX_PER_PAGE = 50;

const escXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pageImages(html) {
  const found = [];
  const add = (src) => {
    if (!src) return;
    let p = src.startsWith(SITE_URL) ? src.slice(SITE_URL.length) : src;
    if (!p.startsWith('/images/')) return;
    p = p.split(/[?#]/)[0];
    if (SKIP.some((re) => re.test(p))) return;
    if (!found.includes(p)) found.push(p);
  };
  add(html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]);
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] || '';
  for (const m of main.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) add(m[1]);
  return found.slice(0, MAX_PER_PAGE);
}

function run() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.log('sitemap-0.xml not found, skipping image injection');
    return;
  }
  let xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  let pages = 0;
  let images = 0;
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const pathname = new URL(loc).pathname;
    const file = path.join(DIST, pathname, 'index.html');
    if (!fs.existsSync(file)) continue;
    const imgs = pageImages(fs.readFileSync(file, 'utf8'));
    if (!imgs.length) continue;
    const locTag = `<loc>${loc}</loc>`;
    const at = xml.indexOf(locTag);
    const close = at === -1 ? -1 : xml.indexOf('</url>', at);
    if (close === -1) continue;
    const block = imgs.map((p) => `<image:image><image:loc>${escXml(SITE_URL + p)}</image:loc></image:image>`).join('');
    xml = xml.slice(0, close) + block + xml.slice(close);
    pages++;
    images += imgs.length;
  }
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`Image sitemap: ${images} images on ${pages} pages`);
}

run();
