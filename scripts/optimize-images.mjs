/**
 * optimize-images.mjs — Build-time image optimizer for Resurgence Builds
 * 
 * Walks public/images/ and for every .png/.jpg over 30 KB:
 *   1. Generates .webp sibling at display width (capped at source width)
 *   2. Never overwrites or deletes originals
 *   3. Skips files already processed (manifest-based)
 *   4. Emits a manifest at public/images/.optimized.json
 * 
 * AVIF generation is skipped for now (Sharp AVIF encoding is very slow
 * at build time and Cloudflare auto-serves AVIF via Polish/Image Resizing).
 * WebP gives 70-85% of the savings at 10x the speed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_IMAGES = path.join(__dirname, '..', 'public', 'images');
const MANIFEST_PATH = path.join(PUBLIC_IMAGES, '.optimized.json');
const SIZE_THRESHOLD = 30 * 1024; // 30 KB
const MAX_WIDTH = 1200; // Max display width for content images
const WEBP_QUALITY = 80;

// Map of specific files to their actual display widths
const DISPLAY_WIDTHS = {
  'workbench-bg.png': 1200,         // Background
  'builder-bg.png': 1200,           // Background
  '404-mj.png': 800,                // 404 art
  'resurgence-builds-official-logo.png': 512, // OG/schema only
  'resurgence-youtube-banner.png': 1200,
  'division-resurgence-interactive-map-og.png': 1200, // OG image
  'build-planner-og.png': 1200,     // OG image
};

async function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

function walkImages(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkImages(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const stat = fs.statSync(fullPath);
      if (stat.size >= SIZE_THRESHOLD) {
        results.push({ path: fullPath, size: stat.size, mtime: stat.mtimeMs });
      }
    }
  }
  return results;
}

async function optimizeImage(filePath, manifest) {
  const relativePath = path.relative(PUBLIC_IMAGES, filePath).replace(/\\/g, '/');
  const stat = fs.statSync(filePath);
  
  // Skip if already processed and source hasn't changed
  if (manifest[relativePath] && manifest[relativePath].mtime === stat.mtimeMs) {
    return null;
  }

  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  const webpPath = filePath.replace(ext, '.webp');

  // Don't overwrite an existing webp that might be the intended source
  if (fs.existsSync(webpPath) && !manifest[relativePath]) {
    return null;
  }

  try {
    const metadata = await sharp(filePath).metadata();
    const targetWidth = DISPLAY_WIDTHS[basename] || Math.min(metadata.width, MAX_WIDTH);

    // Generate WebP
    const pipeline = sharp(filePath);
    if (metadata.width > targetWidth) {
      pipeline.resize(targetWidth, null, { withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(webpPath);

    const webpStat = fs.statSync(webpPath);
    const savings = Math.round((1 - webpStat.size / stat.size) * 100);

    manifest[relativePath] = {
      mtime: stat.mtimeMs,
      originalSize: stat.size,
      webpSize: webpStat.size,
      width: metadata.width,
      height: metadata.height,
      targetWidth,
      savings: `${savings}%`,
    };

    return {
      file: relativePath,
      originalKB: Math.round(stat.size / 1024),
      webpKB: Math.round(webpStat.size / 1024),
      savings: `${savings}%`,
    };
  } catch (err) {
    console.error(`  ⚠️ Failed to optimize ${relativePath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Optimizing images...');
  
  const manifest = await loadManifest();
  const images = walkImages(PUBLIC_IMAGES);
  
  console.log(`  Found ${images.length} PNG/JPG files over ${SIZE_THRESHOLD / 1024} KB`);

  let optimized = 0;
  let totalSaved = 0;

  for (const img of images) {
    const result = await optimizeImage(img.path, manifest);
    if (result) {
      optimized++;
      totalSaved += result.originalKB - result.webpKB;
      console.log(`  ✅ ${result.file}: ${result.originalKB} KB → ${result.webpKB} KB (${result.savings})`);
    }
  }

  saveManifest(manifest);

  if (optimized > 0) {
    console.log(`\n✅ Optimized ${optimized} images, saved ~${totalSaved} KB total`);
  } else {
    console.log('  All images already optimized (no changes).');
  }
}

main().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
