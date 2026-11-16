#!/usr/bin/env python3
"""Cuts the owner's product photos into the pictures the review, gear and gift pages use.

    python3 research/reviews/make_photos.py <folder with the owner's photos> [name ...]

The folder holds the photos under the numbers the owner's phone gave them (4140.jpg, 4141.jpg ...). They stay out
of the repo, which is public: some were taken at a window and show the owner's home. Only the cut pictures this
script writes go in, under research/screenshots/masters/<dir>/ (then `node scripts/build-post-images.mjs` makes the
site copies). photos.json says how each picture is cut:

  src, rot      photo number, and degrees to turn it counterclockwise first (phones save some shots sideways)
  box           [left, top, right, bottom] as fractions of the turned photo: a plain crop
  quad          four corners (top left, top right, bottom right, bottom left) of a book held at an angle: it is
                straightened, and everything outside the corners (the window, the yard) is left out
  book          where the object is; used inside "tiles", which fit a box of the tile's shape around it
                (a tile with "box" instead is cropped to fill)
  blur          boxes to soften, for a player name on the phone screen
  w             widest the picture is saved (inside pages stay small: they are shown for review, not to be read)
  size          exact size, the picture is cropped to fill it (post heroes are 1600 x 840)
  tiles         several photos side by side in one picture, each with "at": [x, y, width, height]
  dir           masters folder: reviews (default) or guides
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
MASTERS = ROOT / 'research' / 'screenshots' / 'masters'
SPEC = json.loads((HERE / 'photos.json').read_text())
BG = (14, 14, 17)


def px(im, b):
    w, h = im.size
    return (round(b[0] * w), round(b[1] * h), round(b[2] * w), round(b[3] * h))


def load(src_dir, part):
    im = Image.open(src_dir / f"{part['src']}.jpg").convert('RGB')
    if part.get('rot'):
        im = im.rotate(part['rot'], expand=True)
    for b in part.get('blur', []):
        box = px(im, b)
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(part.get('blur_px', 12))), box)
    return im


def unwarp(im, quad):
    w, h = im.size
    pts = [(x * w, y * h) for x, y in quad]
    d = lambda a, b: ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5
    W = round(max(d(pts[0], pts[1]), d(pts[3], pts[2])))
    H = round(max(d(pts[0], pts[3]), d(pts[1], pts[2])))
    A, B = [], []
    for (x, y), (u, v) in zip([(0, 0), (W, 0), (W, H), (0, H)], pts):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    coeffs = np.linalg.solve(np.array(A, float), np.array(B, float))
    return im.transform((W, H), Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)


def cut(im, part):
    if 'quad' in part:
        return unwarp(im, part['quad'])
    if 'box' in part:
        return im.crop(px(im, part['box']))
    return im


def fill(im, size):
    """Crop to the shape of `size` around the middle, then resize."""
    W, H = size
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = round(w * H / W); top = (h - nh) // 2
        im = im.crop((0, top, w, top + nh))
    return im.resize((W, H), Image.LANCZOS)


def around(im, book, size, margin):
    """The smallest box shaped like `size` that holds the object plus a margin, kept inside the photo."""
    w, h = im.size
    aspect = size[0] / size[1]
    x0, y0, x1, y1 = book[0] * w, book[1] * h, book[2] * w, book[3] * h
    bw, bh = (x1 - x0) * (1 + 2 * margin), (y1 - y0) * (1 + 2 * margin)
    cw, ch = max(bw, bh * aspect), max(bh, bw / aspect)
    s = min(1, w / cw, h / ch)
    cw, ch = cw * s, ch * s
    left = min(max((x0 + x1) / 2 - cw / 2, 0), w - cw)
    top = min(max((y0 + y1) / 2 - ch / 2, 0), h - ch)
    return im.crop((round(left), round(top), round(left + cw), round(top + ch))).resize(size, Image.LANCZOS)


def make(name, spec, src_dir):
    if 'tiles' in spec:
        out = Image.new('RGB', tuple(spec['size']), BG)
        for t in spec['tiles']:
            im = load(src_dir, t)
            x, y, w, h = t['at']
            tile = around(im, t['book'], (w, h), t.get('margin', spec.get('margin', 0.05))) if 'book' in t else fill(cut(im, t), (w, h))
            out.paste(tile, (x, y))
    else:
        out = cut(load(src_dir, spec), spec)
        if 'size' in spec:
            out = fill(out, tuple(spec['size']))
        elif out.width > spec.get('w', 1400):
            w = spec.get('w', 1400)
            out = out.resize((w, round(out.height * w / out.width)), Image.LANCZOS)
    dest = MASTERS / spec.get('dir', 'reviews') / f'{name}.webp'
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, 'WEBP', quality=90, method=6)
    print(f'{dest.relative_to(ROOT)}  {out.width}x{out.height}  {dest.stat().st_size // 1024} KB')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    for name in (sys.argv[2:] or [k for k in SPEC if not k.startswith('_')]):
        make(name, SPEC[name], src)
