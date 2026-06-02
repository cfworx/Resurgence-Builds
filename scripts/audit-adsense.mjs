import fs from 'fs';
import path from 'path';

const pages = [
  { name: 'Build (Milkshake)', file: 'dist/builds/milkshake-machine-strawberry-milkshake-lmg-build/index.html' },
  { name: 'Guide (Exotics)', file: 'dist/guides/division-resurgence-exotic-weapons-list-2026/index.html' },
  { name: 'Tier List', file: 'dist/tier-list/index.html' },
  { name: 'Exotic Weapon (Warlord)', file: 'dist/database/exotic-weapons/warlord/index.html' },
  { name: 'Weapon (AK-47)', file: 'dist/database/weapons/ak-47/index.html' },
  { name: 'About (noAds)', file: 'dist/about/index.html' },
  { name: 'Sitemap (noAds)', file: 'dist/sitemap/index.html' },
  { name: 'Privacy (noAds)', file: 'dist/privacy/index.html' },
  { name: 'Homepage', file: 'dist/index.html' },
  { name: 'Contact (noAds)', file: 'dist/contact/index.html' },
];

console.log('=== AdSense Pipeline Audit ===\n');
console.log('Component chain:');
console.log('  1. Loader script in <head> (pagead2.googlesyndication.com)');
console.log('  2. <ins class="adsbygoogle"> tags (ad slots)');
console.log('  3. push({}) calls (activate each slot)');
console.log('  4. In-content ads (rehype plugin, after 3rd/8th paragraph)\n');
console.log('-'.repeat(90));
console.log(
  'Page'.padEnd(30),
  'Loader'.padEnd(8),
  'ins'.padEnd(5),
  'push'.padEnd(6),
  'Rehype'.padEnd(8),
  'Match'.padEnd(6),
  'Status'
);
console.log('-'.repeat(90));

let allGood = true;

pages.forEach(p => {
  if (!fs.existsSync(p.file)) {
    console.log(p.name.padEnd(30), 'FILE NOT FOUND');
    return;
  }
  const html = fs.readFileSync(p.file, 'utf8');
  
  const hasLoader = html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  const insCount = (html.match(/class="adsbygoogle"/g) || []).length;
  const pushCount = (html.match(/\.push\(\{\}\)/g) || []).length;
  const rehypeCount = (html.match(/ad-slot--in-content/g) || []).length;
  const match = insCount === pushCount;
  
  const isNoAds = p.name.includes('noAds');
  let status = '';
  
  if (isNoAds) {
    if (!hasLoader && insCount === 0 && pushCount === 0) {
      status = '✅ No ads (correct)';
    } else {
      status = '❌ LEAKING ADS';
      allGood = false;
    }
  } else {
    if (hasLoader && insCount > 0 && match) {
      status = '✅ Ready';
    } else if (!hasLoader) {
      status = '❌ MISSING LOADER';
      allGood = false;
    } else if (!match) {
      status = '❌ INS/PUSH MISMATCH';
      allGood = false;
    } else {
      status = '⚠️ No ad slots';
    }
  }
  
  console.log(
    p.name.padEnd(30),
    (hasLoader ? 'YES' : 'NO').padEnd(8),
    String(insCount).padEnd(5),
    String(pushCount).padEnd(6),
    String(rehypeCount).padEnd(8),
    (match ? 'YES' : 'NO').padEnd(6),
    status
  );
});

console.log('-'.repeat(90));
console.log('\nClient ID check:');
const sample = fs.readFileSync(pages[0].file, 'utf8');
const clientMatch = sample.match(/ca-pub-\d+/g);
const uniqueClients = [...new Set(clientMatch || [])];
console.log('  Client IDs found:', uniqueClients.join(', '));
console.log('  All same client:', uniqueClients.length === 1 ? '✅ YES' : '❌ NO');

console.log('\nOverall:', allGood ? '✅ ALL PAGES READY FOR ADSENSE APPROVAL' : '❌ ISSUES FOUND');
