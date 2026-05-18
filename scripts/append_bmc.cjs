const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/builds');

const callouts = {
  'cover-shooter-sniper.md': {
    title: "Support my extreme cowardice",
    text: "I spent hours hiding in a corner testing the exact maximum range of this sniper just so you wouldn't have to. Funding my pizza habit ensures I never have to go outside and interact with real people."
  },
  'vampire-bulwark-tank.md': {
    title: "Bulwarks need calories too",
    text: "You think holding down the trigger and never dying is easy? It requires immense focus and a caloric surplus. Buy me a pizza so I can maintain my peak physical condition."
  },
  'lockdown-tech-op.md': {
    title: "Compensate me for the motion sickness",
    text: "I got a migraine testing this build so you could give the AI permanent vertigo. Toss a few bucks my way to help me pay for the aspirin."
  },
  'demolitionist-explosive-chaos.md': {
    title: "Explosions are expensive",
    text: "The sheer amount of collateral damage this build causes is a liability. Help me fund my legal defense team (or just buy me a pizza) before the authorities catch on."
  },
  'legendary-healer-field-medic.md': {
    title: "Tip your healers",
    text: "I literally do all the work while you just point your gun and get the credit. The least you can do is buy me a slice for keeping your dumb ass alive."
  },
  'dark-zone-pvp-vanguard-lady-death.md': {
    title: "Blood Money",
    text: "We both know you're going to use this build to ruin someone's day in the Dark Zone. Give me a cut of the profits so I don't feel guilty about unleashing you on the server."
  },
  'conflict-pvp-fearless-warlord.md': {
    title: "Sponsor my toxicity",
    text: "Going 24-0 and spawn-trapping the enemy team requires fuel. Your donation directly funds the sheer disrespect this build brings to Conflict matches."
  },
  'skill-meta-jackpot-chemical.md': {
    title: "Hazardous Materials Fee",
    text: "Handling this much corrosive acid is terrible for my skin. Consider your donation a hazardous materials handling fee to keep this environmental terrorism going."
  },
  'pve-meta-vanguard-shotgun.md': {
    title: "Deleting enemies is hungry work",
    text: "Pressing the 'Delete' button on an elite's health bar burns a surprising amount of calories. Buy me a pizza to keep the Alt-F4 engine running smoothly."
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
  const filePath = path.join(dir, file);
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
