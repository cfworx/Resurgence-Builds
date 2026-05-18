const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const contentConfigPath = path.join(srcDir, 'content.config.ts');

let configContent = fs.readFileSync(contentConfigPath, 'utf8');

// Add pizzaTitle and pizzaText to schemas
if (!configContent.includes('pizzaTitle: z.string().optional()')) {
  configContent = configContent.replace(/author: z\.string\(\),/g, 'author: z.string(),\\n    pizzaTitle: z.string().optional(),\\n    pizzaText: z.string().optional(),');
  // Handle optional author case in guides
  configContent = configContent.replace(/author: z\.string\(\)\.optional\(\),/g, 'author: z.string().optional(),\\n    pizzaTitle: z.string().optional(),\\n    pizzaText: z.string().optional(),');
  fs.writeFileSync(contentConfigPath, configContent);
  console.log('Updated content.config.ts');
}

const callouts = {
  // Builds
  'cover-shooter-sniper.md': { dir: 'builds', title: "Support my extreme cowardice", text: "I spent hours hiding in a corner testing the exact maximum range of this sniper just so you wouldn't have to. Funding my pizza habit ensures I never have to go outside and interact with real people." },
  'vampire-bulwark-tank.md': { dir: 'builds', title: "Bulwarks need calories too", text: "You think holding down the trigger and never dying is easy? It requires immense focus and a caloric surplus. Buy me a pizza so I can maintain my peak physical condition." },
  'lockdown-tech-op.md': { dir: 'builds', title: "Compensate me for the motion sickness", text: "I got a migraine testing this build so you could give the AI permanent vertigo. Toss a few bucks my way to help me pay for the aspirin." },
  'demolitionist-explosive-chaos.md': { dir: 'builds', title: "Explosions are expensive", text: "The sheer amount of collateral damage this build causes is a liability. Help me fund my legal defense team (or just buy me a pizza) before the authorities catch on." },
  'legendary-healer-field-medic.md': { dir: 'builds', title: "Tip your healers", text: "I literally do all the work while you just point your gun and get the credit. The least you can do is buy me a slice for keeping your dumb ass alive." },
  'dark-zone-pvp-vanguard-lady-death.md': { dir: 'builds', title: "Blood Money", text: "We both know you're going to use this build to ruin someone's day in the Dark Zone. Give me a cut of the profits so I don't feel guilty about unleashing you on the server." },
  'conflict-pvp-fearless-warlord.md': { dir: 'builds', title: "Sponsor my toxicity", text: "Going 24-0 and spawn-trapping the enemy team requires fuel. Your donation directly funds the sheer disrespect this build brings to Conflict matches." },
  'skill-meta-jackpot-chemical.md': { dir: 'builds', title: "Hazardous Materials Fee", text: "Handling this much corrosive acid is terrible for my skin. Consider your donation a hazardous materials handling fee to keep this environmental terrorism going." },
  'pve-meta-vanguard-shotgun.md': { dir: 'builds', title: "Deleting enemies is hungry work", text: "Pressing the 'Delete' button on an elite's health bar burns a surprising amount of calories. Buy me a pizza to keep the Alt-F4 engine running smoothly." },
  // News
  'april-developer-stream-summary.md': { dir: 'news', title: "I watched the stream so you didn't have to", text: "I sat through 45 minutes of corporate PR speak and 'we hear you's just to extract the actual useful information. A pizza is the only way I can recover my lost brain cells." },
  'pc-early-access-launch.md': { dir: 'news', title: "My PC is crying", text: "Testing cross-play functionality requires me to simultaneously run the game on a phone, an emulator, and a potato PC. Buy me a pizza to replace the melted thermal paste." },
  'phase-2-season-1-live.md': { dir: 'news', title: "The grind never stops", text: "I've been awake for 36 hours trying to figure out if the new season pass is actually worth your time. The answer is maybe, but what I definitively need right now is pizza." },
  'season-1-2-3-roadmap.md': { dir: 'news', title: "Translating dev roadmaps", text: "Deciphering 'soon', 'later this year', and 'in the works' is basically a full-time job. Toss a pizza my way to keep my crystal ball functioning." },
  'community-sentiment-phase-2.md': { dir: 'news', title: "Reddit is a toxic wasteland", text: "I waded through 3,000 salty Reddit comments about the matchmaking to bring you this clean, objective summary. My sanity is currently hanging by a thread. A pizza is the only known cure for extreme internet exposure." },
  // Patch Notes
  'hotfix-1-1-1.md': { dir: 'patch-notes', title: "Emergency Hotfix for my Hunger", text: "The devs fixed the crashes, but they didn't patch the hole in my stomach from staying up until 3 AM reading undocumented changes. A pizza would be a fantastic stealth buff." },
  'patch-1-1-2.md': { dir: 'patch-notes', title: "Reading the fine print", text: "I test every single 'minor bug fix' to see if they accidentally broke the entire game again. Buy me a pizza to fund the inevitable therapy." },
  'phase-2-patch-notes.md': { dir: 'patch-notes', title: "Patch Note Archaeologist", text: "Digging through 10 pages of weapon rebalancing data is exhausting work. If this summary saved you from reading a novel, consider tipping your local data miner with a slice." }
};

for (const [file, data] of Object.entries(callouts)) {
  const filePath = path.join(srcDir, 'content', data.dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove old bmc-callout html
    if (content.includes('<div class="bmc-callout"')) {
      content = content.split('<div class="bmc-callout"')[0];
      // remove trailing dashes and whitespace if any from the split
      content = content.replace(/\\s*---\\s*$/, '');
    }
    
    // Insert into frontmatter
    if (!content.includes('pizzaTitle:')) {
      const escapeQuotes = (str) => str.replace(/"/g, '\\\\\"');
      const frontmatterInjection = `pizzaTitle: "${escapeQuotes(data.title)}"\\npizzaText: "${escapeQuotes(data.text)}"\\n`;
      content = content.replace(/^---$/, `---\n${frontmatterInjection}`);
      content = content.replace(/---\n---\n/, '---\n');
    }
    
    fs.writeFileSync(filePath, content.trim() + '\\n');
    console.log(`Migrated ${file}`);
  }
}
