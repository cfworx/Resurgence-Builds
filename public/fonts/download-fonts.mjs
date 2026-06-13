// Script to download Google Fonts woff2 files for self-hosting
// Run: node public/fonts/download-fonts.mjs

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, headers).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // 1. Fetch the CSS from Google Fonts (woff2 user-agent)
  const cssUrl = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap';
  console.log('Fetching Google Fonts CSS...');
  const cssBuffer = await httpsGet(cssUrl, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const css = cssBuffer.toString('utf-8');
  console.log('CSS received, parsing font URLs...\n');

  // 2. Parse all @font-face blocks
  const blocks = css.match(/@font-face\s*\{[^}]+\}/g) || [];
  const fonts = [];

  for (const block of blocks) {
    const familyMatch = block.match(/font-family:\s*'([^']+)'/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+)/);

    if (!familyMatch || !weightMatch || !urlMatch) continue;

    const family = familyMatch[1];
    const weight = weightMatch[1];
    const url = urlMatch[1];
    const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : '';

    // We only want latin subset (the primary one)
    // Latin range typically includes U+0000-00FF or similar
    // Skip non-latin subsets to keep file sizes small
    const isLatin = unicodeRange.includes('U+0000') || unicodeRange.includes('U+0100') || !unicodeRange;

    if (isLatin) {
      fonts.push({ family, weight, url, unicodeRange });
    }
  }

  // Dedupe: for each family+weight, prefer the block with U+0000 (latin base)
  const seen = new Map();
  for (const f of fonts) {
    const key = `${f.family}-${f.weight}`;
    const existing = seen.get(key);
    if (!existing || f.unicodeRange.includes('U+0000')) {
      seen.set(key, f);
    }
  }

  const toDownload = [...seen.values()];
  console.log(`Found ${toDownload.length} font files to download:\n`);

  // 3. Download each font
  for (const font of toDownload) {
    const filename = font.family.toLowerCase().replace(/\s+/g, '-') + '-' + font.weight + '.woff2';
    const filePath = path.join(__dirname, filename);
    console.log(`  Downloading ${font.family} ${font.weight} -> ${filename}`);
    const data = await httpsGet(font.url);
    fs.writeFileSync(filePath, data);
    console.log(`    Saved (${data.length} bytes)`);
  }

  console.log('\nAll fonts downloaded successfully!');
}

main().catch(err => { console.error(err); process.exit(1); });
