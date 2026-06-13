const fs = require('fs');
const path = require('path');

// We need to require sharp, which we installed globally or locally
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../public/images');
const buildsDir = path.join(__dirname, '../src/content/builds');
const newImagePath = './input.jpg'; // Set input image path here

async function optimizeImages() {
  console.log("Starting image optimization...");

  const buildImages = [
    { md: 'vampire-bulwark-tank.md', img: 'division-resurgence-bulwark-vampire-lmg-tank-build' },
    { md: 'conflict-pvp-fearless-warlord.md', img: 'division-resurgence-conflict-pvp-fearless-warrior-build' },
    { md: 'dark-zone-pvp-vanguard-lady-death.md', img: 'division-resurgence-dark-zone-pvp-lady-death-build' },
    { md: 'demolitionist-explosive-chaos.md', img: 'division-resurgence-demolitionist-explosive-solo-build' },
    { md: 'skill-meta-jackpot-chemical.md', img: 'division-resurgence-field-medic-chemical-trap-skill-build' },
    { md: 'lockdown-tech-op.md', img: 'division-resurgence-tech-operator-striker-drone-build' },
    { md: 'pve-meta-vanguard-shotgun.md', img: 'division-resurgence-vanguard-double-barrel-shotgun-pve-build' }
  ];

  for (const item of buildImages) {
    const originalPath = path.join(imagesDir, item.img + '.jpg');
    const newPath = path.join(imagesDir, item.img + '.webp');
    
    if (fs.existsSync(originalPath)) {
      console.log(`Converting ${item.img}.jpg to webp...`);
      await sharp(originalPath).webp({ quality: 80 }).toFile(newPath);
      // Remove original
      fs.unlinkSync(originalPath);
    }
  }

  // Handle the new Sniper image
  const sniperImgName = 'division-resurgence-vanguard-sniper-build';
  const sniperWebpPath = path.join(imagesDir, sniperImgName + '.webp');
  
  if (fs.existsSync(newImagePath)) {
    console.log("Converting new sniper image to webp...");
    await sharp(newImagePath).webp({ quality: 80 }).toFile(sniperWebpPath);
  }

  // Update markdown files to point to .webp
  const mdFiles = fs.readdirSync(buildsDir).filter(f => f.endsWith('.md'));
  for (const file of mdFiles) {
    const mdPath = path.join(buildsDir, file);
    let content = fs.readFileSync(mdPath, 'utf8');
    
    let modified = false;
    // Replace .jpg with .webp in featuredImage
    if (content.includes('.jpg"')) {
      content = content.replace(/\.jpg"/g, '.webp"');
      modified = true;
    }
    
    if (content.includes('.png"')) {
      content = content.replace(/\.png"/g, '.webp"');
      modified = true;
    }
    
    // Update sniper image specifically
    if (file === 'cover-shooter-sniper.md') {
      content = content.replace(/featuredImage:\s*".*"/, `featuredImage: "/images/${sniperImgName}.webp"`);
      content = content.replace(/imageAlt:\s*".*"/, `imageAlt: "Vanguard Cover Shooter Sniper Build"`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(mdPath, content);
      console.log(`Updated frontmatter in ${file}`);
    }
  }

  console.log("Done!");
}

optimizeImages().catch(console.error);
