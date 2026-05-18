const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/builds');

const titleMap = {
  'cover-shooter-sniper.md': 'Vanguard — The Cross-Map Coward (Sniper)',
  'vampire-bulwark-tank.md': 'Bulwark — The Unkillable Mosquito (Tank)',
  'lockdown-tech-op.md': 'Tech Operator — The Flashbang Salesman',
  'demolitionist-explosive-chaos.md': "Demolitionist — Michael Bay's Wet Dream",
  'legendary-healer-field-medic.md': 'Field Medic — Babysitting Idiots 101',
  'dark-zone-pvp-vanguard-lady-death.md': 'Vanguard — The Hate Mail Generator',
  'conflict-pvp-fearless-warlord.md': 'Vanguard — The 24-0 Spawn Trapper',
  'skill-meta-jackpot-chemical.md': 'Field Medic — Pure Environmental Terrorism',
  'pve-meta-vanguard-shotgun.md': 'Vanguard — The Alt-F4 Shotgun Button'
};

for (const [file, newTitle] of Object.entries(titleMap)) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace the frontmatter title
    content = content.replace(/title:\s*".*"/, `title: "${newTitle}"`);
    
    // Replace the h1 title
    content = content.replace(/^#\s+.+$/m, `# ${newTitle}`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
