const fs = require('fs');
const path = require('path');

const newsDir = path.join(__dirname, '../src/content/news');
const patchDir = path.join(__dirname, '../src/content/patch-notes');

const callouts = {
  // News
  'april-developer-stream-summary.md': {
    dir: newsDir,
    title: "I watched the stream so you didn't have to",
    text: "I sat through 45 minutes of corporate PR speak and 'we hear you's just to extract the actual useful information. A pizza is the only way I can recover my lost brain cells."
  },
  'pc-early-access-launch.md': {
    dir: newsDir,
    title: "My PC is crying",
    text: "Testing cross-play functionality requires me to simultaneously run the game on a phone, an emulator, and a potato PC. Buy me a pizza to replace the melted thermal paste."
  },
  'phase-2-season-1-live.md': {
    dir: newsDir,
    title: "The grind never stops",
    text: "I've been awake for 36 hours trying to figure out if the new season pass is actually worth your time. The answer is maybe, but what I definitively need right now is pizza."
  },
  'season-1-2-3-roadmap.md': {
    dir: newsDir,
    title: "Translating dev roadmaps",
    text: "Deciphering 'soon', 'later this year', and 'in the works' is basically a full-time job. Toss a pizza my way to keep my crystal ball functioning."
  },
  // Patch Notes
  'hotfix-1-1-1.md': {
    dir: patchDir,
    title: "Emergency Hotfix for my Hunger",
    text: "The devs fixed the crashes, but they didn't patch the hole in my stomach from staying up until 3 AM reading undocumented changes. A pizza would be a fantastic stealth buff."
  },
  'patch-1-1-2.md': {
    dir: patchDir,
    title: "Reading the fine print",
    text: "I test every single 'minor bug fix' to see if they accidentally broke the entire game again. Buy me a pizza to fund the inevitable therapy."
  },
  'phase-2-patch-notes.md': {
    dir: patchDir,
    title: "Patch Note Archaeologist",
    text: "Digging through 10 pages of weapon rebalancing data is exhausting work. If this summary saved you from reading a novel, consider tipping your local data miner with a slice."
  }
};

const getHtml = (title, text) => `
---

<div class="bmc-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface); border: 1px solid var(--accent); border-radius: 8px; text-align: center;">
  <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--accent);">${title}</h3>
  <p style="margin: 0 auto 1rem; font-size: 0.875rem; color: var(--ink-muted);">${text}</p>
  <div style="display: flex; justify-content: center;">
    <a href="https://buymeacoffee.com/resurgencebuilds" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; background-color: #ff6d10; color: #000000; font-family: 'Cookie', cursive, sans-serif; font-size: 24px; text-decoration: none; padding: 5px 15px; border-radius: 5px; font-weight: bold; box-shadow: 0px 1px 2px rgba(0,0,0,0.2); transition: transform 0.2s;">
      <span style="margin-right: 8px; font-size: 24px;">🍕</span> Buy me a pizza
    </a>
  </div>
</div>
`;

for (const [file, data] of Object.entries(callouts)) {
  const filePath = path.join(data.dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove old bmc-callout if it exists
    if (content.includes('<div class="bmc-callout"')) {
      content = content.split('---').slice(0, -1).join('---').trim();
    }
    
    // Append the new html
    content = content.trim() + '\\n' + getHtml(data.title, data.text);
    
    fs.writeFileSync(filePath, content);
    console.log(`Added callout to ${file}`);
  }
}
