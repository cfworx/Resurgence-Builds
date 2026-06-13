import sharp from 'sharp';
import { resolve } from 'path';

// Use the image you just uploaded
const INPUT = resolve('./input.jpg'); // Set input image path here
const OUTPUT_HERO = resolve('public/images/legendary-healer-field-medic.webp');
const OUTPUT_THUMB = resolve('public/images/legendary-healer-field-medic-thumb.webp');
const OUTPUT_OG = resolve('public/images/legendary-healer-field-medic-og.jpg');

async function run() {
  const meta = await sharp(INPUT).metadata();
  console.log(`Source: ${meta.width}x${meta.height}, ${meta.format}`);

  // The source is 1024x558. We will first extract the image excluding the bottom 40 pixels and right 40 pixels to ensure the watermark is gone.
  // Then we will resize to 1200x630 (upscaling slightly)
  const cropWidth = meta.width - 40;
  const cropHeight = meta.height - 40;

  const cropped = sharp(INPUT).extract({ left: 0, top: 0, width: cropWidth, height: cropHeight });

  // Hero image: 1200x630
  await cropped.clone()
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .webp({ quality: 82 })
    .toFile(OUTPUT_HERO);
  const heroStat = await sharp(OUTPUT_HERO).metadata();
  console.log(`Hero: ${heroStat.width}x${heroStat.height}, ${(heroStat.size/1024).toFixed(0)}KB`);

  // Thumbnail: 600x315
  await cropped.clone()
    .resize(600, 315, { fit: 'cover', position: 'top' })
    .webp({ quality: 75 })
    .toFile(OUTPUT_THUMB);
  const thumbStat = await sharp(OUTPUT_THUMB).metadata();
  console.log(`Thumb: ${thumbStat.width}x${thumbStat.height}, ${(thumbStat.size/1024).toFixed(0)}KB`);

  // OG image: 1200x630 JPG
  await cropped.clone()
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 80 })
    .toFile(OUTPUT_OG);
  const ogStat = await sharp(OUTPUT_OG).metadata();
  console.log(`OG:   ${ogStat.width}x${ogStat.height}, ${(ogStat.size/1024).toFixed(0)}KB`);

  console.log('\nDone! All images optimized and watermark cropped out.');
}

run().catch(console.error);
