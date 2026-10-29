// Reads the real width and height of an image in /public from its file header, so the
// og:image tags and the structured data never claim a size the file doesn't have.
// Plain .mjs + fs (no dependencies), cached per path for the whole build.

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://resurgencebuilds.com';
const cache = new Map();

/**
 * @param {string | undefined} url  "/images/x.webp" or "https://resurgencebuilds.com/images/x.webp"
 * @returns {{ width: number, height: number } | null}  null for other hosts, SVGs and unreadable files
 */
export function publicImageSize(url) {
  if (!url) return null;
  let rel = url;
  if (/^https?:\/\//i.test(rel)) {
    if (!rel.startsWith(SITE + '/')) return null;
    rel = rel.slice(SITE.length);
  }
  rel = rel.split(/[?#]/)[0];
  if (cache.has(rel)) return cache.get(rel);
  let dims = null;
  try {
    dims = readDims(fs.readFileSync(path.join(process.cwd(), 'public', decodeURIComponent(rel))));
  } catch {
    dims = null;
  }
  cache.set(rel, dims);
  return dims;
}

function readDims(b) {
  if (b.length < 30) return null;
  // PNG: IHDR width/height right after the signature
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // GIF
  if (b.toString('ascii', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  // WebP: lossy (VP8), lossless (VP8L) and extended (VP8X) headers
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const v = b.readUInt32LE(21);
      return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 };
    }
    return null;
  }
  // JPEG: walk the segments to the first start-of-frame marker
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
