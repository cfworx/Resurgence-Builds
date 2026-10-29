// Builds the in-game card images for the database pages.
//
// Source: research/build-database/evidence/<section>/<slug>.webp, the cards stitched from
// Cory's own screen recordings of the game's Build-Making Database and Armory (Oct 28, 2026).
// Output: public/images/db/<section>/<file>-<width>.webp in two or three widths (a phone size,
// a desktop size for the wide ones, and the full size, never upscaled) plus the manifest
// src/data/db-images.json with each image's real width, height and srcset. Pages read the
// manifest through src/components/GameImage.astro.
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

// Pixels cut off each side of the stitched frames, so only the card itself is left: the white
// corner brackets of the game's scroll frame and the strip of screen showing behind the popup.
// On Armory shots the top 120 px go: tab labels cut in half by the recording, a half-cut
// "Recommended" line and the recording player's own proficiency bar. No weapon sits that high.
const TRIM = {
  narrowCard: { left: 12, right: 10, top: 12, bottom: 0 }, // 580 px: exotics, OS Protocols
  wideCard: { left: 6, right: 8, top: 1, bottom: 0 }, // 969 px: talents, skill mod combos
  gearSet: { left: 6, right: 12, top: 1, bottom: 1 }, // 1305 px gear set panels
  armory: { left: 0, right: 0, top: 120, bottom: 0 }, // 1700 px Armory screens
};

// kind: words for the file name. widths: target widths (capped at the source width).
const SECTIONS = {
  // hero: the card's top (name bar, weapon art and the attribute bar the weapon tucks under),
  // used as the exotic's main picture; the whole card goes behind a "full card" toggle.
  'exotic-weapons': { kind: 'exotic-weapon-card', widths: [290, 580], trim: TRIM.narrowCard, hero: true },
  'os-protocols': { kind: 'os-protocol-card', widths: [290, 580], trim: TRIM.narrowCard },
  'gear-set-effects': { kind: 'gear-set', widths: [640, 960, 1305], trim: TRIM.gearSet },
  // Evidence files keep the slug from when they were recorded; the page slug is on the right.
  'weapon-talents': {
    kind: 'weapon-talent-card',
    widths: [480, 969],
    trim: TRIM.wideCard,
    rename: { 'precision-support': 'precise-support' },
    // Exotic-only talents: no weapon talent page; the exotic's own card shows them.
    skip: ['agonizing-bite', 'anarchy', 'big-game-hunter', 'septicemia'],
  },
  'skill-mod-combos': { kind: 'skill-mod-combo-card', widths: [480, 969], trim: TRIM.wideCard },
  'backpack-talents': { kind: 'backpack-talent-card', widths: [480, 969], trim: TRIM.wideCard },
  'body-armor-talents': { kind: 'body-armor-talent-card', widths: [480, 969], trim: TRIM.wideCard },
  // Armory screens, one per weapon class and tier (the gear screens have no pages to go on).
  // Each weapon page shows the screen it sits on; the manifest lists the weapons on each.
  armory: {
    kind: 'armory',
    widths: [800, 1200, 1700],
    trim: TRIM.armory,
    only: /^(assault-rifle|lmg|marksman-rifle|rifle|shotgun|smg)-t[0-2]$/,
    names: true,
  },
  // Not bonus-attributes: those cards are a line of text plus the recording player's own
  // current value, which would read like a cap.
};

const WEBP = { quality: 82, effort: 6, smartSubsample: true };

// Browsers keep /images/* for 30 days as immutable (public/_headers), so a changed picture must
// get a new file name or returning visitors keep the old one. Bump a section's suffix whenever
// its images change (re-recorded after a patch, or cropped differently). The manifest and the
// pages pick the new names up automatically.
//   -v2 (Oct 29, 2026): frame edges trimmed; exotic headers end below the attribute bar.
const NAME_SUFFIX = Object.fromEntries(Object.keys(SECTIONS).map((s) => [s, '-v2']));

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

// Mean and spread of each pixel row between x0 and x1, from the raw pixels.
async function rowStats(file, x0, x1) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rows = [];
  for (let y = 0; y < height; y++) {
    let r = 0, g = 0, lum = 0, lum2 = 0, n = 0;
    for (let x = Math.max(0, x0); x < Math.min(width, x1); x += 2) {
      const i = (y * width + x) * channels;
      const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
      r += data[i]; g += data[i + 1]; lum += l; lum2 += l * l; n++;
    }
    const mean = lum / n;
    rows.push({ r: r / n, g: g / n, mean, std: Math.sqrt(Math.max(0, lum2 / n - mean * mean)) });
  }
  return rows;
}

// Exotic cards are tall. The hero runs from the name bar down through the weapon art and the
// attribute bar (+0 / +0 / +0) the weapon tucks under, and stops just above the thin divider line
// that comes next, so the picture ends on the card's own edge instead of cutting through the gun.
async function heroBottom(file, width, trim) {
  const rows = await rowStats(file, trim.left, width - trim.right);
  // 1. Where the red art area ends: five dark, non-red rows in a row.
  let headerEnd = 260;
  for (let y = 120; y < Math.min(rows.length - 5, 420); y++) {
    if (rows.slice(y, y + 5).every((s) => s.r - s.g < 12 && s.r < 60)) { headerEnd = y; break; }
  }
  // 2. The divider under the attribute bar: a light, perfectly even row.
  for (let y = headerEnd + 30; y < Math.min(rows.length, headerEnd + 120); y++) {
    if (rows[y].mean > 40 && rows[y].std < 6) return y;
  }
  return headerEnd + 62;
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
    const suffix = NAME_SUFFIX[section] || '';
    const t = cfg.trim || { left: 0, right: 0, top: 0, bottom: 0 };
    for (const name of fs.readdirSync(srcDir).filter((f) => f.endsWith('.webp')).sort()) {
      const evidenceSlug = name.replace(/\.webp$/, '');
      if (cfg.skip?.includes(evidenceSlug)) continue;
      if (cfg.only && !cfg.only.test(evidenceSlug)) continue;
      const slug = cfg.rename?.[evidenceSlug] ?? evidenceSlug;
      const input = path.join(srcDir, name);
      const meta = await sharp(input).metadata();
      const width = meta.width - t.left - t.right;
      let card = await sharp(input)
        .extract({ left: t.left, top: t.top, width, height: meta.height - t.top - t.bottom })
        .toBuffer();
      let hero = null;
      if (cfg.hero) {
        // Where the stitched card's top part ends: the divider under the attribute bar.
        const bottom = await heroBottom(input, meta.width, t);
        const rest = () => sharp(input).extract({ left: t.left, top: bottom, width, height: meta.height - bottom - t.bottom }).toBuffer();
        // evidence/<section>/headers/<slug>.webp: one clean frame of the card at the top of its
        // scroll, straight from the recording. The stitched cards can show a seam just under the
        // name bar (it stays put while the rest scrolls), so the clean top replaces it on both
        // the hero and the full card. Cards without one fall back to the stitched top.
        const headerFile = path.join(srcDir, 'headers', name);
        if (fs.existsSync(headerFile)) {
          const hdr = await sharp(headerFile).metadata();
          if (hdr.width !== width) throw new Error(`${headerFile} is ${hdr.width} px wide, expected ${width}`);
          hero = await sharp(headerFile).toBuffer();
          const below = meta.height - bottom - t.bottom;
          card = await sharp({ create: { width, height: hdr.height + below, channels: 3, background: '#0c0c0c' } })
            .composite([{ input: hero, top: 0, left: 0 }, { input: await rest(), top: hdr.height, left: 0 }])
            .png()
            .toBuffer();
        } else {
          hero = await sharp(input).extract({ left: t.left, top: t.top, width, height: bottom - t.top }).toBuffer();
        }
      }
      const entry = {};
      entry.card = await writeVariants(card, outDir, `${slug}-${cfg.kind}-division-resurgence${suffix}`, cfg.widths, width);
      files += entry.card.srcset.length;
      if (hero) {
        entry.hero = await writeVariants(hero, outDir, `${slug}-exotic-weapon-division-resurgence${suffix}`, cfg.widths, width);
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
