import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '..', 'public', 'images', 'hero-banner.jpg');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'hero-banner.webp');

console.log('Compressing hero banner...');

try {
  if (fs.existsSync(inputPath)) {
    await sharp(inputPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
      
    console.log('Successfully created hero-banner.webp');
    
    // Optionally delete the old one
    fs.unlinkSync(inputPath);
    console.log('Deleted old hero-banner.jpg');
  } else {
    console.log('Input file not found. It may have already been compressed.');
  }
} catch (error) {
  console.error('Error compressing image:', error);
}
