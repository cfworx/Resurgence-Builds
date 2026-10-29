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
      manifest[main.url] = { width: main.width, height: main.height, srcset, small: srcset[0][1] };
    }
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + '\n');
  console.log(`${Object.keys(manifest).length} post images, ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
