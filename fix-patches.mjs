import fs from 'fs';
import path from 'path';

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, results);
    else if (p.endsWith('.astro')) results.push(p);
  }
  return results;
}

const files = walk('src');
let count = 0;

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('Patch 1.2.1')) continue;
  const orig = c;
  c = c.replaceAll('Last verified for <strong>Patch 1.2.1</strong>', 'Last verified for <strong>Patch 1.1.2.2</strong>');
  c = c.replaceAll('Verified for Patch 1.2.1', 'Verified for Patch 1.1.2.2');
  c = c.replaceAll('Updated for Patch 1.2.1', 'Updated for Patch 1.1.2.2');
  c = c.replaceAll('verified in-game for Patch 1.2.1', 'verified in-game for Patch 1.1.2.2');
  c = c.replaceAll('lastVerified="Patch 1.2.1"', 'lastVerified="Patch 1.1.2.2"');
  c = c.replaceAll('Patch 1.2.1 Meta', 'Patch 1.1.2.2 Meta');
  if (c !== orig) {
    fs.writeFileSync(f, c);
    count++;
    console.log('Updated:', f);
  }
}
console.log(`Total: ${count} files updated`);
