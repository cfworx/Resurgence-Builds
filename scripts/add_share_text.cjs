const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const callouts = {
  // Builds
  'cover-shooter-sniper.md': { dir: 'builds', shareTitle: "Expose my cowardice", shareText: "Tweet this to let the world know you prefer hiding 50m away from danger." },
  'vampire-bulwark-tank.md': { dir: 'builds', shareTitle: "Spread the tank propaganda", shareText: "Share this so your teammates finally understand what 'taking aggro' actually means." },
  'lockdown-tech-op.md': { dir: 'builds', shareTitle: "Radicalize other agents", shareText: "Send this to someone who hates letting the AI have a turn to play." },
  'demolitionist-explosive-chaos.md': { dir: 'builds', shareTitle: "Share the Michael Bay experience", shareText: "Warning: sharing this build on X may flag your account for digital terrorism." },
  'legendary-healer-field-medic.md': { dir: 'builds', shareTitle: "Guilt trip your DPS", shareText: "Share this to remind your friends that they owe you their miserable lives." },
  'dark-zone-pvp-vanguard-lady-death.md': { dir: 'builds', shareTitle: "Ruin more days", shareText: "Tweet this so more players try it and immediately get ganked by a 4-stack." },
  'conflict-pvp-fearless-warlord.md': { dir: 'builds', shareTitle: "Farm hate mail", shareText: "Share this to let everyone know you thrive entirely on unfiltered gamer rage." },
  'skill-meta-jackpot-chemical.md': { dir: 'builds', shareTitle: "Spread the infection", shareText: "Help popularize war crimes by sharing this incredibly toxic setup." },
  'pve-meta-vanguard-shotgun.md': { dir: 'builds', shareTitle: "Share the Alt-F4 engine", shareText: "Tweet this so the devs see it and nerf us into the ground next patch." },
  // News
  'april-developer-stream-summary.md': { dir: 'news', shareTitle: "Save a life", shareText: "Share this summary to save another agent from 45 minutes of corporate jargon." },
  'pc-early-access-launch.md': { dir: 'news', shareTitle: "Flex on console players", shareText: "Tweet this to let the timeline know your PC is currently melting." },
  'phase-2-season-1-live.md': { dir: 'news', shareTitle: "Enable the grind", shareText: "Share this to peer pressure your friends into buying the season pass." },
  'season-1-2-3-roadmap.md': { dir: 'news', shareTitle: "Share the hopium", shareText: "Tweet this to convince your followers the game is definitely saved this time." },
  'community-sentiment-phase-2.md': { dir: 'news', shareTitle: "Spread the salt", shareText: "Share this to let X know that Reddit is still an irredeemable dumpster fire." },
  // Patch Notes
  'hotfix-1-1-1.md': { dir: 'patch-notes', shareTitle: "Share the copium", shareText: "Tweet this so people finally stop asking if the servers are back up." },
  'patch-1-1-2.md': { dir: 'patch-notes', shareTitle: "Warn the timeline", shareText: "Share this to let your squad know their favorite gun just got stealth-nerfed." },
  'phase-2-patch-notes.md': { dir: 'patch-notes', shareTitle: "Save them from reading", shareText: "Tweet this summary so your friends don't have to read a 10-page novel." }
};

for (const [file, data] of Object.entries(callouts)) {
  const filePath = path.join(srcDir, 'content', data.dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if shareTitle already in frontmatter
    if (!content.includes('shareTitle:')) {
      const lines = content.split('\\n');
      let secondDashIndex = -1;
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
          secondDashIndex = i;
          break;
        }
      }
      
      if (secondDashIndex !== -1) {
        const escapeQuotes = (str) => str.replace(/"/g, '\\\\\"');
        const inject = `shareTitle: "${escapeQuotes(data.shareTitle)}"\\nshareText: "${escapeQuotes(data.shareText)}"`;
        
        lines.splice(secondDashIndex, 0, inject);
        content = lines.join('\\n');
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Added share to ${file}`);
  }
}
