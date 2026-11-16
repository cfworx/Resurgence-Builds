// Checks every translated guide (src/content/translations) against the English guide it was made from:
// the same outside links, the same number of FAQs and sources, no em or en dashes, and a known language folder.
// Errors stop the build. A translation that is older than its English guide is listed as a warning: the page
// itself tells readers it may be behind. Rules: TRANSLATIONS.md.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const T_DIR = path.join(ROOT, 'src/content/translations');
const G_DIR = path.join(ROOT, 'src/content/guides');

const split = (file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no front matter`);
  return { fm: m[1], body: m[2] };
};
const field = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, 'm')) || [])[1];
const count = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\n((?:[ \\t]+.*\\n?|\\n)*)`, 'm'));
  return m ? (m[1].match(/^  - /gm) || []).length : 0;
};
const externalLinks = (text) => [...new Set([...text.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)].map((x) => x[0].replace(/[.,;:]+$/, '')))];
const day = (v) => (v ? String(v).slice(0, 10) : '');

let errors = 0, warnings = 0, files = 0;
const err = (f, msg) => { errors++; console.error(`  ✗ ${f}: ${msg}`); };
const warn = (f, msg) => { warnings++; console.warn(`  ! ${f}: ${msg}`); };

if (fs.existsSync(T_DIR)) {
  for (const lang of fs.readdirSync(T_DIR)) {
    const dir = path.join(T_DIR, lang);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.md') && !n.startsWith('_'))) {
      files++;
      const rel = `${lang}/${name}`;
      const t = split(path.join(dir, name));
      const source = field(t.fm, 'source');
      if (field(t.fm, 'lang') !== lang) err(rel, `lang is "${field(t.fm, 'lang')}", the folder is "${lang}"`);
      if (source !== name.replace(/\.md$/, '')) err(rel, `source "${source}" does not match the file name`);
      const gFile = path.join(G_DIR, `${source}.md`);
      if (!fs.existsSync(gFile)) { err(rel, `no English guide "${source}"`); continue; }
      const g = split(gFile);

      for (const key of ['faqs', 'sources']) {
        if (count(t.fm, key) !== count(g.fm, key)) err(rel, `${key}: ${count(t.fm, key)} here, ${count(g.fm, key)} in the English guide`);
      }
      const have = new Set(externalLinks(t.fm + '\n' + t.body));
      for (const url of externalLinks(g.fm + '\n' + g.body)) {
        if (url.includes('resurgencebuilds.com')) continue;
        if (!have.has(url)) err(rel, `missing link ${url}`);
      }
      if (/[—–]/.test(t.fm + t.body)) err(rel, 'contains an em or en dash');
      // internal links must exist as English guides, patch notes, news, or as a translation in the same language
      for (const m of t.body.matchAll(/\]\((\/[^)#\s]*)/g)) {
        const href = m[1];
        const own = href.match(/^\/([a-z-]+)\/guides\/([^/]+)\/$/);
        if (own && fs.existsSync(path.join(T_DIR, own[1]))) {
          if (!fs.existsSync(path.join(T_DIR, own[1], `${own[2]}.md`))) err(rel, `links to ${href}, which has no translation`);
        }
      }
      const gUpdated = day(field(g.fm, 'lastUpdated'));
      const tFrom = day(field(t.fm, 'sourceUpdated'));
      if (!tFrom) err(rel, 'no sourceUpdated date');
      else if (gUpdated && gUpdated > tFrom) warn(rel, `the English guide was updated ${gUpdated}, this translation is from ${tFrom}`);
    }
  }
}

console.log(`Translation check: ${files} translated guides. ${errors} errors, ${warnings} behind the English.`);
if (errors) process.exit(1);
