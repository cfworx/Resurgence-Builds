import fs from 'fs';
import path from 'path';

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, results);
    else if (p.endsWith('.md') || p.endsWith('.astro')) results.push(p);
  }
  return results;
}

const files = walk('src');
const badChars = [0xFFFD]; // Unicode replacement character

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  for (let i = 0; i < c.length; i++) {
    const code = c.charCodeAt(i);
    if (badChars.includes(code)) {
      const line = c.substring(0, i).split('\n').length;
      const start = Math.max(0, i - 30);
      const end = Math.min(c.length, i + 30);
      const ctx = c.substring(start, end).replace(/\n/g, '\\n');
      console.log(`${f}:${line} - U+${code.toString(16).toUpperCase()} - ...${ctx}...`);
    }
  }
}
console.log('Scan complete.');
