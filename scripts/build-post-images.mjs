// Builds the featured images for posts (builds, guides, news, patch notes) from in-game masters.
//
// Source: research/screenshots/masters/<folder>/<name>.webp (or .png): frames from our own screen
// recordings of the game (made by research/screenshots/make_hero.py) or in-game screenshots the
// owner captured. Site rule: post images are in-game pictures only (see CLAUDE.md).
// Output: public/images/<folder>/<name>-<width>.webp at 480, 800, 1200 and 1600 px wide (never
// upscaled) and src/data/post-images.json, keyed by the 1200 px copy, with each image's real width,
// height and srcset. A post's featuredImage points at the 1200 px copy (good for og:image); the
// cards and post layouts read the manifest through src/utils/post-images.ts and add srcset/sizes,
// so a phone downloads the 480 or 800 px copy instead of the full one.
//
// Each image also gets <name>-thumb.webp, a 144 x 144 px centre crop (what object-fit: cover shows in
// a square), stored as `thumb` in the manifest, for the 48 px thumbnails on the tier boards.
//
// Second pass, older images: a featuredImage in src/content/{builds,guides,news,patch-notes} that has
// no master (so no manifest entry yet) and exists under public/ gets <name>-480.webp and
// <name>-800.webp beside it, plus <name>-1200.webp when the original is a JPG or PNG (never upscaled),
// and the thumbnail. Its manifest entry stays under the original path, so no front matter changes, no
// post date moves and og:image stays the same file. These entries carry `legacy: true`: cards keep
// cropping them to 16:9 as before instead of switching wide ones to the letterboxed look. When a post
// moves to a new in-game master, this pass stops making an entry for the old file.
//
// Run by hand when a master is added or changed, then commit the images and the manifest:
//   node scripts/build-post-images.mjs
// It is not part of `npm run build`. /images/* is cached for 30 days as immutable, so a changed
// picture needs a new master file name.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MASTERS = path.join(ROOT, 'research', 'screenshots', 'masters');
const OUT = path.join(ROOT, 'public', 'images');
const MANIFEST = path.join(ROOT, 'src', 'data', 'post-images.json');
const WIDTHS = [480, 800, 1200, 1600];
const WEBP = { quality: 80, effort: 6, smartSubsample: true };
const THUMB = 144;
const CONTENT = path.join(ROOT, 'src', 'content');
const LEGACY_SECTIONS = ['builds', 'guides', 'news', 'patch-notes'];

const rel = (abs) => '/' + path.relative(path.join(ROOT, 'public'), abs).split(path.sep).join('/');

async function main() {
  const manifest = {};
  let files = 0;
  let bytes = 0;
  for (const folder of fs.readdirSync(MASTERS).sort()) {
    const dir = path.join(MASTERS, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).filter((x) => /\.(webp|png|jpe?g)$/i.test(x)).sort()) {
      const input = path.join(dir, f);
      const name = f.replace(/\.(webp|png|jpe?g)$/i, '');
      const meta = await sharp(input).metadata();
      const sizes = [...new Set(WIDTHS.map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
      const outDir = path.join(OUT, folder);
      fs.mkdirSync(outDir, { recursive: true });
      const srcset = [];
      let main = null;
      for (const w of sizes) {
        const file = path.join(outDir, `${name}-${w}.webp`);
        const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp(WEBP).toFile(file);
        srcset.push([info.width, rel(file)]);
        files++;
        bytes += info.size;
        if (w === Math.min(1200, meta.width)) main = { url: rel(file), width: info.width, height: info.height };
      }
      const thumb = await writeThumb(input, path.join(outDir, `${name}-thumb.webp`));
      files++;
      bytes += thumb.size;
      manifest[main.url] = { width: main.width, height: main.height, srcset, small: srcset[0][1], thumb: thumb.url };
    }
  }

  // Second pass: older featured images that have no master.
  let legacy = 0;
  for (const src of legacyImages()) {
    if (manifest[src]) continue;
    const input = path.join(ROOT, 'public', ...src.split('/').filter(Boolean));
    if (!fs.existsSync(input)) continue;
    const meta = await sharp(input).metadata();
    const isWebp = /\.webp$/i.test(src);
    const base = input.replace(/\.(webp|png|jpe?g)$/i, '');
    const widths = [...new Set((isWebp ? [480, 800] : [480, 800, 1200]).map((w) => Math.min(w, meta.width)))]
      .filter((w) => !(isWebp && w >= meta.width))
      .sort((a, b) => a - b);
    const srcset = [];
    for (const w of widths) {
      const file = `${base}-${w}.webp`;
      const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp(WEBP).toFile(file);
      srcset.push([info.width, rel(file)]);
      files++;
      bytes += info.size;
    }
    // A WebP original is its own largest copy.
    if (isWebp) srcset.push([meta.width, src]);
    const thumb = await writeThumb(input, `${base}-thumb.webp`);
    files++;
    bytes += thumb.size;
    manifest[src] = { width: meta.width, height: meta.height, srcset, small: srcset[0][1], thumb: thumb.url, legacy: true };
    legacy++;
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + '\n');
  console.log(`${Object.keys(manifest).length} post images (${legacy} older ones without a master), ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
}

async function writeThumb(input, file) {
  const info = await sharp(input).resize({ width: THUMB, height: THUMB, fit: 'cover', position: 'centre' }).webp(WEBP).toFile(file);
  return { url: rel(file), size: info.size };
}

// featuredImage (or image) paths from the front matter of every post, in a stable order.
function legacyImages() {
  const out = new Set();
  for (const section of LEGACY_SECTIONS) {
    const dir = path.join(CONTENT, section);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => /\.mdx?$/.test(x)).sort()) {
      const fm = fs.readFileSync(path.join(dir, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fm) continue;
      const m = fm[1].match(/^(?:featuredImage|image):\s*["']?(\/images\/[^"'\s]+\.(?:webp|png|jpe?g))["']?\s*$/m);
      if (m) out.add(m[1]);
    }
  }
  return [...out];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
