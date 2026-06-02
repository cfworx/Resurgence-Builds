import fs from 'fs';
import path from 'path';

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, results);
    else if (f === 'index.html') results.push(full);
  }
  return results;
}

const files = walk('dist');
let found = 0;

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const matches = html.match(/href="[^"]*\/undefined[/"]/g);
  if (matches) {
    found++;
    const rel = f.replace(/\\/g, '/').replace(/.*dist\//, '');
    console.log(rel, ':', matches.join(', '));
  }
}

if (!found) console.log('No /undefined links found in any built page.');
