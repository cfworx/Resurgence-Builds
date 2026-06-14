const fs = require('fs');
const path = './src/data/skill-mod-combos.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Remove all Bulwark entries
const filtered = data.filter(x => x.specialization !== 'Bulwark');

// Correct 18 Bulwark entries from screenshots
const bulwark = [
  { id: "smc-37", name: "Reciprocal Charge", specialization: "Bulwark", bonus2: "Max Health+[4.0%~8.0%]", bonus3: "When Health is below 50%, Shockwave Spike Mk.3 hits restore Health equal to 0.80% Max Health. When Health is above 50%, Shockwave Spike Mk.3 hits grant +12% Weapon Critical Hit Damage." },
  { id: "smc-38", name: "Pack-a-Punch", specialization: "Bulwark", bonus2: "Max Health+[4.0%~8.0%]", bonus3: "Shockwave Spike Mk.3 hits grant +1.60% Weapon Damage for 5 second(s), up to 5 stack(s)." },
  { id: "smc-39", name: "King of the Pit", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "Shockwave Spike Mk.3 hits grant +4% Weapon Critical Hit Chance for 10 second(s), up to 4 stack(s)." },
  { id: "smc-40", name: "Field Repairs", specialization: "Bulwark", bonus2: "Skill Health+[4.0%~8.0%]", bonus3: "Deploying the Phalanx Shield grants +4% Rate of Fire. Hits restore 0.60% Shield Health. Talent Cooldown: 1 second(s)." },
  { id: "smc-41", name: "Impenetrable Wall", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "Grants +12% Toughness while the Phalanx Shield is deployed." },
  { id: "smc-42", name: "Positive Feedback", specialization: "Bulwark", bonus2: "Max Health+[4.0%~8.0%]", bonus3: "Within 6 second(s) of deploying the Breach Combo, hits have a 40% chance of restoring 1 bullet(s). Critical Hits increase duration to 0.50 second(s) (capped at 2 second(s))." },
  { id: "smc-43", name: "Optimal Range", specialization: "Bulwark", bonus2: "Skill Health+[4.0%~8.0%]", bonus3: "Deploying the Breach Combo grants +12% Rate of Fire. Hits on enemies within 10 meter(s) restore 1 bullets (capped at 3 bullets). Talent Cooldown: 1 second(s)." },
  { id: "smc-44", name: "Berserker", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "During Breach Combo, grants +100% Weapon Critical Hit Chance if there are at least 1 enemie(s) within 20 meter(s)." },
  { id: "smc-45", name: "Attention Seeker", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "Shockwave Spike Mk.3 hits grant +1.20% Damage Reduction, up to 5 stack(s), but nearby enemies focus the Agent in priority." },
  { id: "smc-46", name: "Schadenfreude", specialization: "Bulwark", bonus2: "Skill Duration+[3.2%~6.4%]", bonus3: "Shockwave Spike Mk.3 hits grant +0.80% Max Health for 20 second(s), up to 5 stack(s). Shockwave Spike Mk.3 deals additional damage equal to 0.60% Max Health." },
  { id: "smc-47", name: "Camp Fire", specialization: "Bulwark", bonus2: "Skill Duration+[3.2%~6.4%]", bonus3: "Grants +14% Armor while located within 10 meter(s) of the Shockwave Spike Mk.3." },
  { id: "smc-48", name: "Provocateur", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "Enemies within 20 meter(s) focus the Agent in priority when deploying the Phalanx Shield. Grants +3.20% Damage Reduction for 10 second(s) for each enemy who is targeting the Agent, up to 5 stack(s). Talent Cooldown: 20 second(s)." },
  { id: "smc-49", name: "Rational Distribution", specialization: "Bulwark", bonus2: "Rate of Fire+[4.0%~8.0%]", bonus3: "Grants Extra Shield Health equal to 9.20% Max Health." },
  { id: "smc-50", name: "Last Moment", specialization: "Bulwark", bonus2: "Skill Health+[4.0%~8.0%]", bonus3: "Reaching 10% Phalanx Shield Health restores 15% Max Shield Health. Talent Cooldown: 30 second(s)." },
  { id: "smc-51", name: "Anchored", specialization: "Bulwark", bonus2: "Weapon Damage+[2.0%~4.0%]", bonus3: "Breach Combo hits restore Shield Health and Health equal to 4.20% Max Health." },
  { id: "smc-52", name: "Heavy Weight", specialization: "Bulwark", bonus2: "Max Health+[4.0%~8.0%]", bonus3: "Breach Combo hits deal additional damage equal to 10% Max Health." },
  { id: "smc-53", name: "Tough Times", specialization: "Bulwark", bonus2: "Skill Health+[4.0%~8.0%]", bonus3: "Breach Combo hits grant +33.80% Armor for 15 second(s), up to 5 stack(s)." },
  { id: "smc-54", name: "Adaptive Armor", specialization: "Bulwark", bonus2: "Skill Health+[4.0%~8.0%]", bonus3: "Grants +9.60% Weapon Critical Hit Damage when Shield Health is above 50%. Grants +4.80% Shield Damage Reduction when Shield Health is below 50%." },
];

// Find where Bulwark should be inserted (after Tech Operator, before Vanguard)
const vanguardIdx = filtered.findIndex(x => x.specialization === 'Vanguard');
const result = [...filtered.slice(0, vanguardIdx), ...bulwark, ...filtered.slice(vanguardIdx)];

// Re-number all IDs
result.forEach((x, i) => x.id = `smc-${i + 1}`);

fs.writeFileSync(path, JSON.stringify(result, null, 2) + '\n');
console.log(`Done. Total entries: ${result.length}`);
console.log(`Bulwark entries: ${result.filter(x => x.specialization === 'Bulwark').length}`);
