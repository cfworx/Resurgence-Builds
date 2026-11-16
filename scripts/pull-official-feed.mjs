// Copies Ubisoft's newest announcements for the game (the official Steam announcements feed) into
// src/data/official-feed.json, so /patch-notes/ and /news/ can show "Ubisoft's latest posts" without waiting for the
// daily run. Only titles, dates and links are kept: the posts stay on Steam and we link to them.
//
// Runs as a step of `npm run build`, so every deploy redraws the list. (A watcher that commits the file when a new
// post appears, so the site republishes within the hour, is drafted in AUTOMATION.md and waits for the owner's OK.)
//
// It never fails a build: if the feed can't be reached or looks wrong, the saved file is kept. The file carries no
// "fetched at" time on purpose, so it only changes when Ubisoft actually posts.
import { readFile, writeFile } from 'node:fs/promises';

const FEED = 'https://steamcommunity.com/games/3749720/rss/';
const FILE = new URL('../src/data/official-feed.json', import.meta.url);
const KEEP = 8;
const LINK_RE = /^https:\/\/steamcommunity\.com\/games\/3749720\/announcements\/detail\/\d+$/;

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};

async function pull() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(FEED, { signal: ctrl.signal, headers: { Accept: 'application/rss+xml, application/xml, text/xml' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const title = tag(m[1], 'title');
      const url = tag(m[1], 'link');
      const when = new Date(tag(m[1], 'pubDate'));
      // Titles become text on our pages, never markup. Anything odd is skipped instead of shown.
      if (!title || title.length > 160 || /[<>]/.test(title)) continue;
      if (!LINK_RE.test(url) || Number.isNaN(when.getTime())) continue;
      items.push({ title, url, date: when.toISOString() });
    }
    if (!items.length) throw new Error('no posts in the feed');
    items.sort((a, b) => b.date.localeCompare(a.date));
    return items.slice(0, KEEP);
  } finally {
    clearTimeout(timer);
  }
}

try {
  const items = await pull();
  const prev = JSON.parse(await readFile(FILE, 'utf8').catch(() => '{}'));
  const next = {
    _about:
      "Ubisoft's newest announcements for the game, copied from the official Steam announcements feed by scripts/pull-official-feed.mjs (titles, dates and links only). Do not edit by hand: the build rewrites it.",
    source: 'https://steamcommunity.com/games/3749720/announcements/',
    items,
  };
  const same = JSON.stringify(prev.items || []) === JSON.stringify(items);
  if (!same) await writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`pull-official-feed: newest official post "${items[0].title}" (${items[0].date.slice(0, 10)})${same ? ', unchanged' : ', file updated'}.`);
} catch (err) {
  console.log(`pull-official-feed: kept the saved list (${err?.name === 'AbortError' ? 'timed out' : err?.message || err}).`);
}
