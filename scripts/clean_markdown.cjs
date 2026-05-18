const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/content');

const callouts = {
  // Builds
  'cover-shooter-sniper.md': { dir: 'builds', title: "Support my extreme cowardice", text: "I spent hours hiding in a corner testing the exact maximum range of this sniper just so you wouldn't have to. Funding my pizza habit ensures I never have to go outside and interact with real people.", shareTitle: "Expose my cowardice", shareText: "Tweet this to let the world know you prefer hiding 50m away from danger." },
  'vampire-bulwark-tank.md': { dir: 'builds', title: "Bulwarks need calories too", text: "You think holding down the trigger and never dying is easy? It requires immense focus and a caloric surplus. Buy me a pizza so I can maintain my peak physical condition.", shareTitle: "Spread the tank propaganda", shareText: "Share this so your teammates finally understand what 'taking aggro' actually means." },
  'lockdown-tech-op.md': { dir: 'builds', title: "Compensate me for the motion sickness", text: "I got a migraine testing this build so you could give the AI permanent vertigo. Toss a few bucks my way to help me pay for the aspirin.", shareTitle: "Radicalize other agents", shareText: "Send this to someone who hates letting the AI have a turn to play." },
  'demolitionist-explosive-chaos.md': { dir: 'builds', title: "Explosions are expensive", text: "The sheer amount of collateral damage this build causes is a liability. Help me fund my legal defense team (or just buy me a pizza) before the authorities catch on.", shareTitle: "Share the Michael Bay experience", shareText: "Warning: sharing this build on X may flag your account for digital terrorism." },
  'legendary-healer-field-medic.md': { dir: 'builds', title: "Tip your healers", text: "I literally do all the work while you just point your gun and get the credit. The least you can do is buy me a slice for keeping your dumb ass alive.", shareTitle: "Guilt trip your DPS", shareText: "Share this to remind your friends that they owe you their miserable lives." },
  'dark-zone-pvp-vanguard-lady-death.md': { dir: 'builds', title: "Blood Money", text: "We both know you're going to use this build to ruin someone's day in the Dark Zone. Give me a cut of the profits so I don't feel guilty about unleashing you on the server.", shareTitle: "Ruin more days", shareText: "Tweet this so more players try it and immediately get ganked by a 4-stack." },
  'conflict-pvp-fearless-warlord.md': { dir: 'builds', title: "Sponsor my toxicity", text: "Going 24-0 and spawn-trapping the enemy team requires fuel. Your donation directly funds the sheer disrespect this build brings to Conflict matches.", shareTitle: "Farm hate mail", shareText: "Share this to let everyone know you thrive entirely on unfiltered gamer rage." },
  'skill-meta-jackpot-chemical.md': { dir: 'builds', title: "Hazardous Materials Fee", text: "Handling this much corrosive acid is terrible for my skin. Consider your donation a hazardous materials handling fee to keep this environmental terrorism going.", shareTitle: "Spread the infection", shareText: "Help popularize war crimes by sharing this incredibly toxic setup." },
  'pve-meta-vanguard-shotgun.md': { dir: 'builds', title: "Deleting enemies is hungry work", text: "Pressing the 'Delete' button on an elite's health bar burns a surprising amount of calories. Buy me a pizza to keep the Alt-F4 engine running smoothly.", shareTitle: "Share the Alt-F4 engine", shareText: "Tweet this so the devs see it and nerf us into the ground next patch." },
  // News
  'april-developer-stream-summary.md': { dir: 'news', title: "I watched the stream so you didn't have to", text: "I sat through 45 minutes of corporate PR speak and 'we hear you's just to extract the actual useful information. A pizza is the only way I can recover my lost brain cells.", shareTitle: "Save a life", shareText: "Share this summary to save another agent from 45 minutes of corporate jargon." },
  'pc-early-access-launch.md': { dir: 'news', title: "My PC is crying", text: "Testing cross-play functionality requires me to simultaneously run the game on a phone, an emulator, and a potato PC. Buy me a pizza to replace the melted thermal paste.", shareTitle: "Flex on console players", shareText: "Tweet this to let the timeline know your PC is currently melting." },
  'phase-2-season-1-live.md': { dir: 'news', title: "The grind never stops", text: "I've been awake for 36 hours trying to figure out if the new season pass is actually worth your time. The answer is maybe, but what I definitively need right now is pizza.", shareTitle: "Enable the grind", shareText: "Share this to peer pressure your friends into buying the season pass." },
  'season-1-2-3-roadmap.md': { dir: 'news', title: "Translating dev roadmaps", text: "Deciphering 'soon', 'later this year', and 'in the works' is basically a full-time job. Toss a pizza my way to keep my crystal ball functioning.", shareTitle: "Share the hopium", shareText: "Tweet this to convince your followers the game is definitely saved this time." },
  'community-sentiment-phase-2.md': { dir: 'news', title: "Reddit is a toxic wasteland", text: "I waded through 3,000 salty Reddit comments about the matchmaking to bring you this clean, objective summary. My sanity is currently hanging by a thread. A pizza is the only known cure for extreme internet exposure.", shareTitle: "Spread the salt", shareText: "Share this to let X know that Reddit is still an irredeemable dumpster fire." },
  // Patch Notes
  'hotfix-1-1-1.md': { dir: 'patch-notes', title: "Emergency Hotfix for my Hunger", text: "The devs fixed the crashes, but they didn't patch the hole in my stomach from staying up until 3 AM reading undocumented changes. A pizza would be a fantastic stealth buff.", shareTitle: "Share the copium", shareText: "Tweet this so people finally stop asking if the servers are back up." },
  'patch-1-1-2.md': { dir: 'patch-notes', title: "Reading the fine print", text: "I test every single 'minor bug fix' to see if they accidentally broke the entire game again. Buy me a pizza to fund the inevitable therapy.", shareTitle: "Warn the timeline", shareText: "Share this to let your squad know their favorite gun just got stealth-nerfed." },
  'phase-2-patch-notes.md': { dir: 'patch-notes', title: "Patch Note Archaeologist", text: "Digging through 10 pages of weapon rebalancing data is exhausting work. If this summary saved you from reading a novel, consider tipping your local data miner with a slice.", shareTitle: "Save them from reading", shareText: "Tweet this summary so your friends don't have to read a 10-page novel." }
};

for (const [file, data] of Object.entries(callouts)) {
  const filePath = path.join(srcDir, data.dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Nuke any literal \npizzaTitle:, \nshareTitle:, ---\n from the bottom
    content = content.replace(/(\\\\n|\n)?pizzaTitle:.*$/s, '');
    content = content.replace(/(\\\\n|\n)?---\\\\[n]?$/s, '');
    content = content.replace(/---\\n$/s, '');
    content = content.replace(/---$/s, '');
    
    // Also remove them from the top so we can cleanly re-inject
    content = content.replace(/^pizzaTitle:.*?\n/gm, '');
    content = content.replace(/^pizzaText:.*?\n/gm, '');
    content = content.replace(/^shareTitle:.*?\n/gm, '');
    content = content.replace(/^shareText:.*?\n/gm, '');
    
    // Find the second "---" closing the frontmatter
    const lines = content.split('\n');
    let secondDashIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        secondDashIndex = i;
        break;
      }
    }
    
    if (secondDashIndex !== -1) {
      const escapeQuotes = (str) => str.replace(/"/g, '\\"');
      const inject = `pizzaTitle: "${escapeQuotes(data.title)}"\npizzaText: "${escapeQuotes(data.text)}"\nshareTitle: "${escapeQuotes(data.shareTitle)}"\nshareText: "${escapeQuotes(data.shareText)}"`;
      lines.splice(secondDashIndex, 0, inject);
      content = lines.join('\n');
    }
    
    fs.writeFileSync(filePath, content.trim() + '\n');
    console.log(`Fully fixed ${file}`);
  }
}
