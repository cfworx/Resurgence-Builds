#!/usr/bin/env node
// Tells Bing (and through IndexNow: Yandex, Naver, Seznam, Yep) which pages changed, so they recrawl in
// minutes instead of days. Bing's index is also what ChatGPT, Copilot and DuckDuckGo search, so this is
// how a new post or a fix reaches those assistants. Google does not use IndexNow.
//
// Run it AFTER the deploy is live (the engines fetch the page as soon as they are told):
//   node scripts/indexnow.mjs            pages whose sitemap date is within the last 3 days
//   node scripts/indexnow.mjs --days 7   a different window
//   node scripts/indexnow.mjs --all      every page in the sitemap (only after a site-wide change)
//   node scripts/indexnow.mjs /guides/x/ /builds/y/   these pages as well, whatever their date
//   add --dry to print the list without sending it
//
// The key is the 32-character file name in public/ (public/<key>.txt holds the same key): IndexNow
// checks that file on the live site to confirm the request comes from the site's owner.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Behind a proxy (the cloud workspace the daily run uses), Node's fetch only goes through it when
// NODE_USE_ENV_PROXY is set: start again with it on.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const again = spawnSync(process.execPath, process.argv.slice(1), { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(again.status ?? 1);
}

const SITE = 'https://resurgencebuilds.com';
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const daysArg = args.indexOf('--days');
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 3;
const extra = args.filter((a) => a.startsWith('/') || a.startsWith(SITE));

const keyFile = fs.readdirSync(path.resolve('public')).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) { console.error('No IndexNow key file in public/ (a 32-character hex name ending .txt).'); process.exit(1); }
const key = keyFile.replace('.txt', '');

async function sitemapEntries() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`, { cache: 'no-store' })).text();
  const files = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const entries = [];
  for (const file of files) {
    const xml = await (await fetch(file, { cache: 'no-store' })).text();
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
      const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || '';
      if (loc) entries.push({ loc, lastmod });
    }
  }
  return entries;
}

const entries = await sitemapEntries();
const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const picked = new Set(entries.filter((e) => flag('--all') || (e.lastmod && e.lastmod.slice(0, 10) >= cutoff)).map((e) => e.loc));
for (const u of extra) picked.add(u.startsWith('/') ? SITE + u : u);
const urlList = [...picked];

console.log(`${urlList.length} page(s)${flag('--all') ? ' (whole sitemap)' : ` changed since ${cutoff}`}${extra.length ? `, ${extra.length} named` : ''}:`);
urlList.slice(0, 40).forEach((u) => console.log('  ' + u));
if (urlList.length > 40) console.log(`  ... and ${urlList.length - 40} more`);
if (!urlList.length || flag('--dry')) process.exit(0);

const live = await fetch(`${SITE}/${keyFile}`, { cache: 'no-store' });
if (!live.ok || (await live.text()).trim() !== key) {
  console.error(`The key file is not live yet at ${SITE}/${keyFile}. Deploy first, then run this again.`);
  process.exit(1);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
// 200 and 202 both mean accepted (202: the key is still being checked).
console.log(`IndexNow answered ${res.status}${res.status === 200 || res.status === 202 ? ': accepted' : ': NOT accepted'}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
