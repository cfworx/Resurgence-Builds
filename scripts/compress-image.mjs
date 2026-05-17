import sharp from 'sharp';
import fs from 'fs';

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error('Usage: node compress-image.mjs <input> <output>');
  process.exit(1);
}

sharp(input)
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(output)
  .then(() => {
    console.log(`Successfully optimized image: ${output}`);
    const stats = fs.statSync(output);
    console.log(`New size: ${Math.round(stats.size / 1024)} KB`);
  })
  .catch(console.error);
