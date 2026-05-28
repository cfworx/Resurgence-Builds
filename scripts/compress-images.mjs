import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const IMG_DIR = path.join(ROOT, 'public', 'images');
const MAX_WIDTH = 1200; // OG image standard
const JPEG_QUALITY = 82;
const PNG_QUALITY = 85;
const WEBP_QUALITY = 82;

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
  
  // Skip small files (under 200KB)
  if (stat.size < 200 * 1024) {
    return null;
  }

  const basename = path.basename(filePath);
  const tempPath = filePath + '.tmp';
  
  try {
    let pipeline = sharp(filePath).resize({ width: MAX_WIDTH, withoutEnlargement: true });
    
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    } else {
      return null;
    }
    
    await pipeline.toFile(tempPath);
    
    const newStat = fs.statSync(tempPath);
    const newSizeMB = (newStat.size / 1024 / 1024).toFixed(2);
    const savings = ((1 - newStat.size / stat.size) * 100).toFixed(1);
    
    // Only replace if we actually saved space
    if (newStat.size < stat.size) {
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      console.log(`✅ ${basename}: ${sizeMB}MB → ${newSizeMB}MB (${savings}% saved)`);
      return { file: basename, before: stat.size, after: newStat.size };
    } else {
      fs.unlinkSync(tempPath);
      console.log(`⏭️  ${basename}: ${sizeMB}MB — already optimal`);
      return null;
    }
  } catch (err) {
    // Clean up temp file on error
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.log(`❌ ${basename}: ${err.message}`);
    return null;
  }
}

async function run() {
  const files = [];
  
  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(full);
      else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) files.push(full);
    }
  }
  
  walkDir(IMG_DIR);
  
  // Also compress public root images
  const publicDir = path.join(ROOT, 'public');
  for (const f of fs.readdirSync(publicDir)) {
    if (/\.(jpg|jpeg|png|webp)$/i.test(f)) {
      files.push(path.join(publicDir, f));
    }
  }
  
  console.log(`\nCompressing ${files.length} images...\n`);
  
  let totalBefore = 0;
  let totalAfter = 0;
  let compressed = 0;
  
  for (const file of files) {
    const result = await compressImage(file);
    if (result) {
      totalBefore += result.before;
      totalAfter += result.after;
      compressed++;
    }
  }
  
  if (compressed > 0) {
    const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(2);
    console.log(`\n🎯 Compressed ${compressed} images, saved ${savedMB}MB total`);
  } else {
    console.log('\n✅ All images already optimized!');
  }
}

run().catch(console.error);
