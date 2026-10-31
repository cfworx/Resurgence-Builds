// Copies the live player votes into src/data/vote-snapshot.json before the site is built, so the tier lists, vote bars
// and badges are drawn with the latest totals even before the page's script loads them (and for anyone without
// JavaScript). Runs as part of `npm run build`. If the API can't be reached (local builds, an outage), the snapshot
// already in the folder is kept and the build carries on: this never fails a build. See VOTES.md.
import { readFile, writeFile } from 'node:fs/promises';
import { summarize } from '../lib/votes.mjs';

const BASE = process.env.VOTES_URL || 'https://resurgencebuilds.com';
const FILE = new URL('../src/data/vote-snapshot.json', import.meta.url);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function pull(kind) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(`${BASE}/api/votes?kind=${kind}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.items !== 'object' || Array.isArray(data.items)) throw new Error('unexpected reply');
    const items = {};
    let votes = 0;
    for (const [id, row] of Object.entries(data.items)) {
      if (!SLUG_RE.test(id) || id.length > 120) continue;
      const sum = summarize(row);
      if (!sum.n) continue;
      items[id] = { s: sum.s, a: sum.a, b: sum.b, c: sum.c, d: sum.d, n: sum.n, avg: sum.avg, tier: sum.tier };
      votes += sum.n;
    }
    const updated = typeof data.updated === 'string' && !Number.isNaN(Date.parse(data.updated)) ? data.updated : null;
    return { items, votes, updated };
  } finally {
    clearTimeout(timer);
  }
}

try {
  const [build, os] = await Promise.all([pull('build'), pull('os')]);
  const next = { fetchedAt: new Date().toISOString(), build, os };
  const prev = JSON.parse(await readFile(FILE, 'utf8').catch(() => '{}'));
  const same = JSON.stringify({ ...prev, fetchedAt: null }) === JSON.stringify({ ...next, fetchedAt: null });
  if (!same) await writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`pull-votes: ${build.votes} build votes on ${Object.keys(build.items).length} builds, ${os.votes} OS Protocol votes on ${Object.keys(os.items).length} protocols${same ? ' (unchanged)' : ''}.`);
} catch (err) {
  console.log(`pull-votes: kept the saved snapshot (${err?.name === 'AbortError' ? 'timed out' : err?.message || err}).`);
}
