import fs from 'fs';
import path from 'path';

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, results);
    else if (p.endsWith('.astro') || p.endsWith('.md') || p.endsWith('.json') || p.endsWith('.ts') || p.endsWith('.js')) results.push(p);
  }
  return results;
}

const files = walk('src');
let count = 0;
const changes = [];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;

  // Fix "Recalibration Library" -> "recalibration station" (TD2 mechanic)
  c = c.replaceAll('Recalibration Library', 'recalibration station');
  c = c.replaceAll('recalibration Library', 'recalibration station');

  // Fix "extract the talent" / "Extract" pattern for recalibration (TD2 mechanic)
  // "extract the talent at the Recalibration Station" -> "re-roll the talent at the recalibration station"
  c = c.replaceAll('Extract the talent', 'Re-roll the talent');
  c = c.replaceAll('extract the talent', 're-roll the talent');
  c = c.replaceAll('Extract it from', 'Use it as a source at');

  // Fix "saves permanently" / "saved permanently" / "stored permanently" in recal context
  // These imply a library system that doesn't exist in Resurgence
  c = c.replaceAll('saves permanently in your recalibration station', 'can be used as a re-roll source at the recalibration station');
  c = c.replaceAll('saved permanently in your recalibration station', 'available as a re-roll source at the recalibration station');
  c = c.replaceAll('it saves permanently in your recalibration station', 'you can use it as a re-roll source at the recalibration station');

  // Fix "Extract {talent.name} from any" pattern
  c = c.replace(/Extract ([^—]+) from any (backpack|chest|weapon|gear piece) that has it — it saves permanently in your recalibration station/g, 
    'You can re-roll the talent on any $2 at the recalibration station');
  c = c.replace(/Extract ([^—]+) from any (backpack|chest|weapon|gear piece) that has it — saves permanently in your recalibration station/g,
    'You can re-roll the talent on any $2 at the recalibration station');

  // Fix "extract it at the Recalibration Station" (already partially handled by earlier template fix)
  c = c.replaceAll('extract it at the recalibration station', 're-roll the talent at the recalibration station');

  // Fix "Scout Recon" -> "Recon" (wrong focus name)
  c = c.replaceAll('Scout Recon', 'Recon');
  c = c.replaceAll('scout Recon', 'Recon');

  // Fix "Striker\'s Battlegear" -> "Fury Strike" (TD2 gear set)
  c = c.replaceAll("Striker's Battlegear", 'Fury Strike');
  c = c.replaceAll("Striker\\'s Battlegear", 'Fury Strike');

  // Fix "Providence Defense" -> "Phalanx Attack" (TD2 gear set)
  c = c.replaceAll('Providence Defense', 'Phalanx Attack');

  // Fix "Hard Wired" -> "Mechanical Expert" (TD2 gear set)
  c = c.replaceAll('Hard Wired', 'Mechanical Expert');

  // Fix "Foundry Bulwark" -> remove or replace (TD2 gear set)
  c = c.replaceAll('Foundry Bulwark', 'Fearless Warrior');

  // Fix "Negotiator\'s Dilemma" -> "Fury Strike" (TD2 gear set)  
  c = c.replaceAll("Negotiator's Dilemma", 'Fury Strike');
  c = c.replaceAll("Negotiator\\'s Dilemma", 'Fury Strike');

  // Fix "Summit" as endgame mode (TD2 mode) - careful not to replace in URLs or unrelated contexts
  c = c.replaceAll('Farm T2 drops from Heroic missions, Summit, or Countdown', 'Farm T2 drops from Heroic missions, weekly bounties, or DZ extractions');
  c = c.replaceAll('the Summit', 'Heroic missions');

  // Fix "Countdown" (TD2 mode)
  c = c.replaceAll(', Countdown,', ', weekly bounties,');

  // Fix "Striker or" pattern (TD2 gear set partial refs)
  c = c.replaceAll('like Striker or Phalanx Attack', 'like Fury Strike or Phalanx Attack');

  if (c !== orig) {
    fs.writeFileSync(f, c);
    count++;
    changes.push(f);
    console.log('Updated:', f);
  }
}
console.log(`\nTotal: ${count} files updated`);
