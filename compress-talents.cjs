const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join('images_to_grab', 'weapon talents');
const outputDir = path.join('public', 'images', 'ui', 'talents');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(async (file) => {
  if (file.endsWith('.png')) {
    let outName = file.toLowerCase().replace(/[']/g, '');
    if (outName === 'swift-aim-2.png') outName = 'swift-aim2.png';
    outName = outName.replace('.png', '.webp');
    
    const inPath = path.join(inputDir, file);
    const outPath = path.join(outputDir, outName);
    
    await sharp(inPath).webp({ quality: 90 }).toFile(outPath);
    console.log('Optimized: ' + outName);
  }
});
