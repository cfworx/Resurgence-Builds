import fs from 'fs';
import path from 'path';

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, results);
    else if (p.endsWith('.md') || p.endsWith('.astro') || p.endsWith('.json')) results.push(p);
  }
  return results;
}

const files = walk('src');
let count = 0;

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  if (!c.includes('\uFFFD')) continue;
  
  // Replace the broken replacement character with a simple dash/hyphen
  const fixed = c.replaceAll('\uFFFD', '-');
  fs.writeFileSync(f, fixed);
  count++;
  
  // Count occurrences
  const matches = c.split('\uFFFD').length - 1;
  console.log(`Fixed ${matches} broken char(s) in: ${f}`);
}

console.log(`\nTotal: ${count} files fixed`);
