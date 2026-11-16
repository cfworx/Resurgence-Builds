import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';

/**
 * Photos inside a post (reviews, gear and gift guides). In markdown write the picture by its master name, on a
 * line of its own, with the caption as the title:
 *
 *   ![What the picture shows](/images/reviews/gamesir-g8-plus-back-buttons-l4-r4.webp "Caption under the picture")
 *
 * The picture has to be in src/data/post-images.json (made by scripts/build-post-images.mjs from
 * research/screenshots/masters/). This plugin points the <img> at the right copy, adds its real width and height
 * (so the page does not jump), srcset and sizes (a phone downloads the 480 or 800 px copy) and lazy loading, and
 * wraps it in <figure class="shot"> with the caption. A portrait picture gets "shot--tall" (narrower, centred).
 * Two or more pictures in one paragraph become a row ("shot-row"), for a front and a back cover side by side.
 * Images not in the manifest are left alone.
 */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'post-images.json'), 'utf8'));
const byName = new Map();
for (const [url, img] of Object.entries(manifest)) byName.set(url.replace(/-\d+\.webp$/, ''), { url, ...img });

const SIZES = {
  wide: '(max-width: 832px) calc(100vw - 32px), 768px',
  tall: '(max-width: 480px) calc(100vw - 32px), 416px',
  row: '(max-width: 832px) calc(50vw - 22px), 378px',
};

function figure(img, kind) {
  const entry = byName.get(String(img.properties.src).replace(/\.webp$/, ''));
  const caption = img.properties.title;
  const tall = entry.height > entry.width * 1.05;
  img.properties = {
    src: entry.url,
    srcset: entry.srcset.map(([w, url]) => `${url} ${w}w`).join(', '),
    sizes: kind === 'row' ? SIZES.row : tall ? SIZES.tall : SIZES.wide,
    width: entry.width,
    height: entry.height,
    alt: img.properties.alt || '',
    loading: 'lazy',
    decoding: 'async',
  };
  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['shot', ...(tall && kind !== 'row' ? ['shot--tall'] : [])] },
    children: caption ? [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }] : [img],
  };
}

export default function rehypePostFigures() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index == null) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      const ours = (c) => c.type === 'element' && c.tagName === 'img' && byName.has(String(c.properties?.src || '').replace(/\.webp$/, ''));
      if (!kids.length || !kids.every(ours)) return;
      parent.children[index] = kids.length === 1
        ? figure(kids[0], 'single')
        : { type: 'element', tagName: 'div', properties: { className: ['shot-row'] }, children: kids.map((k) => figure(k, 'row')) };
    });
  };
}
