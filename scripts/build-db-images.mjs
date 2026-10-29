// Builds the in-game card images for the database pages.
//
// Source: research/build-database/evidence/<section>/<slug>.webp, the cards stitched from
// Cory's own screen recordings of the game's Build-Making Database and Armory (Oct 28, 2026).
// Output: public/images/db/<section>/<file>-<width>.webp in two or three widths (a phone size,
// a desktop size for the wide ones, and the full size, never upscaled) plus the manifest src/data/db-images.json with each image's real
// width, height and srcset. Pages read the manifest through src/components/GameImage.astro.
//
// Run by hand when new evidence lands, then commit the images and the manifest:
//   node scripts/build-db-images.mjs            (every section)
//   node scripts/build-db-images.mjs armory     (just the named sections; the rest of the manifest is kept)
// It is not part of `npm run build`, so deploys don't pay for it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVIDENCE = path.join(ROOT, 'research', 'build-database', 'evidence');
const OUT = path.join(ROOT, 'public', 'images', 'db');
const MANIFEST = path.join(ROOT, 'src', 'data', 'db-images.json');

// kind: words for the file name. widths: target widths (capped at the source width).
const SECTIONS = {
  'exotic-weapons': { kind: 'exotic-weapon-card', widths: [290, 580], hero: true },
  'os-protocols': { kind: 'os-protocol-card', widths: [290, 580] },
  'gear-set-effects': { kind: 'gear-set', widths: [640, 960, 1305] },
  // Evidence files keep the slug from when they were recorded; the page slug is on the right.
  'weapon-talents': {
    kind: 'weapon-talent-card',
    widths: [480, 969],
    rename: { 'precision-support': 'precise-support' },
    // Exotic-only talents: no weapon talent page; the exotic's own card shows them.
    skip: ['agonizing-bite', 'anarchy', 'big-game-hunter', 'septicemia'],
  },
  'skill-mod-combos': { kind: 'skill-mod-combo-card', widths: [480, 969] },
  'backpack-talents': { kind: 'backpack-talent-card', widths: [480, 969] },
  'body-armor-talents': { kind: 'body-armor-talent-card', widths: [480, 969] },
  // Armory screens, one per weapon class and tier (the gear screens have no pages to go on).
  // Each weapon page shows the screen it sits on; the manifest lists the weapons on each.
  armory: {
    kind: 'armory',
    widths: [800, 1200, 1700],
    only: /^(assault-rifle|lmg|marksman-rifle|rifle|shotgun|smg)-t[0-2]$/,
    names: true,
  },
  // Not bonus-attributes: those cards are a line of text plus the recording player's own
  // current value, which would read like a cap.
};

const WEBP = { quality: 82, effort: 6, smartSubsample: true };

// Browsers keep /images/* for 30 days (public/_headers), so a re-recorded card saved under the
// same file name could show the old picture to returning visitors. When a section's evidence is
// re-recorded after a patch, set its suffix here (e.g. 'exotic-weapons': '-2026-11') so every
// file in it gets a new name; the manifest and pages pick the new names up automatically.
const NAME_SUFFIX = {};

const rel = (abs) => '/' + path.relative(path.join(ROOT, 'public'), abs).split(path.sep).join('/');

async function writeVariants(input, dir, base, widths, srcWidth) {
  const sizes = [...new Set(widths.map((w) => Math.min(w, srcWidth)))].sort((a, b) => a - b);
  const srcset = [];
  let height = 0;
  for (const w of sizes) {
    const file = path.join(dir, `${base}-${w}.webp`);
    const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp(WEBP).toFile(file);
    srcset.push([info.width, rel(file)]);
    if (w === sizes[sizes.length - 1]) height = info.height;
  }
  const [maxW, maxSrc] = srcset[srcset.length - 1];
  return { src: maxSrc, width: maxW, height, srcset };
}

// Exotic cards are tall; the hero is the red header with the weapon render, which ends where
// the dark stat bar starts. Found per card from the pixel rows instead of a fixed height.
async function heroHeight(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const row = (y) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let x = 0; x < width; x += 4) {
      const i = (y * width + x) * channels;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
    return [r / n, g / n, b / n];
  };
  for (let y = 120; y < Math.min(height - 5, 420); y++) {
    let dark = true;
    for (let k = 0; k < 5; k++) {
      const [r, g] = row(y + k);
      if (!(r - g < 12 && r < 60)) { dark = false; break; }
    }
    if (dark) return y;
  }
  return 260;
}

// Weapon names on each Armory screen, in the order they were transcribed.
function armoryNames() {
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'research', 'build-database', 'armory-weapons.json'), 'utf8'));
  const out = {};
  for (const r of rows) {
    if (r.exotic || !r.evidence) continue;
    const key = path.basename(r.evidence, '.webp');
    (out[key] ||= []).push(r.name);
  }
  return out;
}

async function main() {
  const only = process.argv.slice(2);
  const manifest = only.length && fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  for (const key of Object.keys(manifest)) if (only.includes(key.split('/')[0])) delete manifest[key];
  const names = armoryNames();
  let files = 0;
  for (const [section, cfg] of Object.entries(SECTIONS)) {
    if (only.length && !only.includes(section)) continue;
    const srcDir = path.join(EVIDENCE, section);
    if (!fs.existsSync(srcDir)) continue;
    const outDir = path.join(OUT, section);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    for (const name of fs.readdirSync(srcDir).filter((f) => f.endsWith('.webp')).sort()) {
      const evidenceSlug = name.replace(/\.webp$/, '');
      if (cfg.skip?.includes(evidenceSlug)) continue;
      if (cfg.only && !cfg.only.test(evidenceSlug)) continue;
      const slug = cfg.rename?.[evidenceSlug] ?? evidenceSlug;
      const input = path.join(srcDir, name);
      const meta = await sharp(input).metadata();
      const entry = {};
      const suffix = NAME_SUFFIX[section] || '';
      entry.card = await writeVariants(input, outDir, `${slug}-${cfg.kind}-division-resurgence${suffix}`, cfg.widths, meta.width);
      files += entry.card.srcset.length;
      if (cfg.hero) {
        const h = await heroHeight(input);
        const crop = await sharp(input).extract({ left: 0, top: 0, width: meta.width, height: h }).toBuffer();
        entry.hero = await writeVariants(crop, outDir, `${slug}-exotic-weapon-division-resurgence${suffix}`, cfg.widths, meta.width);
        files += entry.hero.srcset.length;
      }
      if (cfg.names) entry.names = names[evidenceSlug] || [];
      manifest[`${section}/${slug}`] = entry;
    }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
  const bytes = (dir) => fs.readdirSync(dir, { recursive: true }).reduce((s, f) => {
    const p = path.join(dir, f);
    return fs.statSync(p).isFile() ? s + fs.statSync(p).size : s;
  }, 0);
  console.log(`${Object.keys(manifest).length} images, ${files} files, ${(bytes(OUT) / 1048576).toFixed(1)} MB in public/images/db`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
