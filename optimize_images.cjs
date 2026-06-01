const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'images_to_grab');
const outputDir = path.join(__dirname, 'public', 'images', 'os-protocols');
const jsonPath = path.join(__dirname, 'src', 'data', 'os-protocols.json');

async function run() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let protocols = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

  for (const file of files) {
    const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
    const slug = nameWithoutExt.toLowerCase();

    // Find the matching protocol
    const protocolIndex = protocols.findIndex(p => p.name.replace(/ /g, '-').toLowerCase() === slug);
    if (protocolIndex === -1) {
      console.log(`Could not find protocol for image: ${file}`);
      continue;
    }

    const protocol = protocols[protocolIndex];
    const outFileName = `${slug}-os-protocol-division-resurgence.webp`;
    const outPath = path.join(outputDir, outFileName);

    console.log(`Optimizing ${file} -> ${outFileName}...`);
    await sharp(path.join(imagesDir, file))
      .webp({ quality: 80 })
      .toFile(outPath);

    protocol.image = `/images/os-protocols/${outFileName}`;
    protocol.imageAlt = `${protocol.name} OS Protocol in Division Resurgence showing the ${protocol.mainStat || 'Engineering'} gear mod with glow effect and ${(protocol.mainStat || 'engineering').toLowerCase()} class icon`;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(protocols, null, 2), 'utf8');
  console.log('Done mapping and optimizing images.');
}

run().catch(console.error);
