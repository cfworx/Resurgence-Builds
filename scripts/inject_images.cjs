const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/builds');

const imageMap = {
  'vampire-bulwark-tank.md': { img: '/images/division-resurgence-bulwark-vampire-lmg-tank-build.jpg', alt: 'Vampire Bulwark LMG Tank Build' },
  'conflict-pvp-fearless-warlord.md': { img: '/images/division-resurgence-conflict-pvp-fearless-warrior-build.jpg', alt: 'Fearless Warrior Warlord PVP Build' },
  'dark-zone-pvp-vanguard-lady-death.md': { img: '/images/division-resurgence-dark-zone-pvp-lady-death-build.jpg', alt: 'Vanguard Lady Death Dark Zone Build' },
  'demolitionist-explosive-chaos.md': { img: '/images/division-resurgence-demolitionist-explosive-solo-build.jpg', alt: 'Demolitionist Explosive Chaos Build' },
  'skill-meta-jackpot-chemical.md': { img: '/images/division-resurgence-field-medic-chemical-trap-skill-build.jpg', alt: 'Field Medic Chemical Trap Skill Build' },
  'lockdown-tech-op.md': { img: '/images/division-resurgence-tech-operator-striker-drone-build.jpg', alt: 'Tech Operator Striker Drone Build' },
  'pve-meta-vanguard-shotgun.md': { img: '/images/division-resurgence-vanguard-double-barrel-shotgun-pve-build.jpg', alt: 'Vanguard Double Barrel Shotgun Build' },
  'legendary-healer-field-medic.md': { img: '/images/legendary-healer-field-medic.webp', alt: 'Legendary Healer Field Medic Build' },
  'cover-shooter-sniper.md': { img: '/images/cover-shooter-sniper.png', alt: 'Cover Shooter Sniper Build' }
};

for (const [file, data] of Object.entries(imageMap)) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('featuredImage:')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        const insert = `featuredImage: "${data.img}"\nimageAlt: "${data.alt}"\n`;
        parts[1] = parts[1] + insert;
        content = parts.join('---');
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}
