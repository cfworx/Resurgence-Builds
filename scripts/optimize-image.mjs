import sharp from 'sharp';
import { resolve } from 'path';

// The user needs to place their source image here
const INPUT = resolve('public/images/legendary-healer-source.jpg');
const OUTPUT_HERO = resolve('public/images/legendary-healer-field-medic.webp');
const OUTPUT_THUMB = resolve('public/images/legendary-healer-field-medic-thumb.webp');
const OUTPUT_OG = resolve('public/images/legendary-healer-field-medic-og.jpg');

async function run() {
  const meta = await sharp(INPUT).metadata();
  console.log(`Source: ${meta.width}x${meta.height}, ${meta.format}`);

  // Hero image: 1200x630, crop from center-top to keep the soldier
  // This crop ratio naturally removes the bottom edge where the watermark sits
  await sharp(INPUT)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .webp({ quality: 82 })
    .toFile(OUTPUT_HERO);
  const heroStat = await sharp(OUTPUT_HERO).metadata();
  console.log(`Hero: ${heroStat.width}x${heroStat.height}, ${(heroStat.size/1024).toFixed(0)}KB`);

  // Thumbnail: 600x315 for post cards
  await sharp(INPUT)
    .resize(600, 315, { fit: 'cover', position: 'top' })
    .webp({ quality: 75 })
    .toFile(OUTPUT_THUMB);
  const thumbStat = await sharp(OUTPUT_THUMB).metadata();
  console.log(`Thumb: ${thumbStat.width}x${thumbStat.height}, ${(thumbStat.size/1024).toFixed(0)}KB`);

  // OG image: 1200x630 JPG for social sharing (some platforms don't support WebP)
  await sharp(INPUT)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 80 })
    .toFile(OUTPUT_OG);
  const ogStat = await sharp(OUTPUT_OG).metadata();
  console.log(`OG:   ${ogStat.width}x${ogStat.height}, ${(ogStat.size/1024).toFixed(0)}KB`);

  console.log('\nDone! All images optimized.');
}

run().catch(console.error);
