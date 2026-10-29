#!/usr/bin/env python3
"""Read talent source lists ("which weapons can roll this talent") off screen recordings.

In the game's Build-Making Database, opening a talent shows a Details popup: the talent on the left
and, under "Source", every weapon that can roll it, one tile per weapon and rarity, grouped by weapon
class. This tool turns a recording of someone opening talents and scrolling those lists into data.

  scan VIDEO...        For each talent opened in each video: finds the stretch where its popup is
                       open, reads the talent's name off it, stitches its scrolling Source list into
                       one tall image, cuts out every tile (class section, rarity colour, tier) and
                       names each tile's weapon by comparing it with the icon library. Writes
                       work/<video>/<talent>.json, the stitched list and a review sheet per talent.
  library NAME=TILE... Adds confirmed tiles to the icon library (evidence/weapon-icons/).
  compile --checked D  Writes weapon-talent-sources.json and .csv (one row per talent and weapon) from
                       the scans, after checking every weapon against the Armory's class and tier.

The icon library holds one icon per weapon and rarity, cut from lists whose weapons were confirmed
in game (matched to the Armory screen, where every weapon has its name under it, or read off the
weapon card opened from the list). A tile is named automatically only when it clearly matches one
library icon of its own class and tier; anything else is left for a person to check.

Needs ffmpeg, numpy, opencv-python, Pillow and tesseract (pytesseract). Recordings are 2560 x 1440;
the popup sits in the same place in every recording so far (checked October 29, 2026).
"""

import argparse
import difflib
import json
import os
import re
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)  # research/build-database
LIB = os.path.join(BASE, 'evidence', 'weapon-icons')
WORK = os.path.join(HERE, 'work')

FRAME_W, FRAME_H = 2560, 1440
# The Source list's scrolling area (rows above and below are covered by the popup's own masks).
VX0, VX1, VY0, VY1 = 1040, 2090, 394, 1168
VW, VH = VX1 - VX0, VY1 - VY0
COLS = [12, 358, 704]  # left edge of each tile column inside the list area
TW, TH = 330, 156  # tile size, including the 2 px border
HEADER = (195, 255, 420, 2180)  # rows/cols of the popup's orange "Details" bar (y0, y1, x0, x1)
ICON = (330, 530, 600, 820)  # the talent's icon on the left of the popup
NAME = (615, 690, 440, 985)  # the talent's name under the icon
TEXT = (690, 960, 440, 985)  # the talent's description
CLASSES = ['SMG', 'LMG', 'Assault Rifle', 'Marksman Rifle', 'Rifle', 'Shotgun']
RARITIES = {'gold': 'High-End', 'purple': 'Superior', 'blue': 'Specialized'}


def slug(s):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))


# ---------------------------------------------------------------------------------------------
# Video decoding

def probe(video):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries',
                          'stream=avg_frame_rate:format=duration', '-of', 'json', video],
                         capture_output=True, text=True, check=True).stdout
    j = json.loads(out)
    num, den = j['streams'][0]['avg_frame_rate'].split('/')
    return float(j['format']['duration']), float(num) / float(den)


def decode(video, t0=0.0, t1=None, fps=10, crop=None, scale=None):
    """Yield (time, frame) pairs, RGB uint8. crop = (x, y, w, h) in full-size pixels."""
    vf = [f'fps={fps}']
    w, h = FRAME_W, FRAME_H
    if crop:
        x, y, w, h = crop
        vf.append(f'crop={w}:{h}:{x}:{y}')
    if scale:
        w, h = int(w * scale), int(h * scale)
        vf.append(f'scale={w}:{h}')
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{t0:.3f}']
    if t1 is not None:
        cmd += ['-t', f'{t1 - t0:.3f}']
    cmd += ['-i', video, '-vf', ','.join(vf), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    size = w * h * 3
    k = 0
    try:
        while True:
            b = p.stdout.read(size)
            if len(b) < size:
                break
            yield t0 + k / fps, np.frombuffer(b, np.uint8).reshape(h, w, 3)
            k += 1
    finally:
        p.stdout.close()
        p.wait()


def frame_at(video, t):
    for _, f in decode(video, t, t + 0.2, fps=10):
        return f
    return None


# ---------------------------------------------------------------------------------------------
# 1. Talent segments

def ocr_line(img, psm=7):
    g = Image.fromarray(img).convert('L')
    g = ImageOps.invert(g).resize((g.width * 2, g.height * 2), Image.LANCZOS)
    return pytesseract.image_to_string(g, config=f'--psm {psm}').strip()


def segments(video, known_names):
    """Stretches of the video where one talent's popup is open: [(t0, t1, name, text)]."""
    s = 0.5  # work at half size
    y0, y1, x0, x1 = (int(v * s) for v in HEADER)
    iy0, iy1, ix0, ix1 = (int(v * s) for v in ICON)
    runs = []
    cur = None
    for t, f in decode(video, fps=5, scale=s):
        band = f[y0:y1, x0:x1].astype(np.int16)
        orange = ((band[..., 0] > 200) & (band[..., 1] > 90) & (band[..., 1] < 170) & (band[..., 2] < 60)).mean()
        if orange < 0.6:
            cur = None
            continue
        icon = cv2.resize(cv2.cvtColor(f[iy0:iy1, ix0:ix1], cv2.COLOR_RGB2GRAY), (32, 32)).astype(np.float32)
        icon = (icon - icon.mean()) / (icon.std() + 1e-6)
        if cur is not None and float((icon * cur['sig']).mean()) > 0.85:
            cur['t1'] = t
        else:
            cur = {'t0': t, 't1': t, 'sig': icon}
            runs.append(cur)
    # read each talent's name off a frame in the middle of its stretch
    out = []
    for r in runs:
        if r['t1'] - r['t0'] < 0.8:
            continue
        f = frame_at(video, (r['t0'] + r['t1']) / 2)
        raw = ocr_line(f[NAME[0]:NAME[1], NAME[2]:NAME[3]])
        text = ocr_line(f[TEXT[0]:TEXT[1], TEXT[2]:TEXT[3]], psm=6).replace('\n', ' ')
        best = difflib.get_close_matches(raw, known_names, n=1, cutoff=0.6)
        name = best[0] if best else None
        if out and name and out[-1][2] == name and r['t0'] - out[-1][1] < 3:
            out[-1] = (out[-1][0], r['t1'], name, out[-1][3], out[-1][4])  # same talent, brief interruption
            continue
        out.append((r['t0'], r['t1'], name, text, raw))
    return out


# ---------------------------------------------------------------------------------------------
# 2. Stitching the scrolling list

def _motion(prev, cur):
    """How far the list scrolled between two frames (positive = scrolled down) and the match score."""
    best = (-1.0, 0)
    for y0 in (40, 300, 560):
        band = cur[y0:y0 + 160]
        if band.std() < 8:
            continue
        r = cv2.matchTemplate(prev, band, cv2.TM_CCOEFF_NORMED)
        _, sc, _, loc = cv2.minMaxLoc(r)
        if sc > best[0]:
            best = (float(sc), loc[1] - y0)
    return best[1], best[0]


def _loaded(f):
    """The list has drawn its tiles (not the blank moment right after the popup opens)."""
    C = f[:, :, :].max(axis=2).astype(np.int16) - f.min(axis=2)
    return (C[:, COLS[0] + 4:COLS[0] + 10] > 60).mean() > 0.15


def stitch(video, t0, t1, fps=10):
    """One tall image of the whole Source list, from the frames where the list sits still."""
    canvas = np.zeros((40000, VW, 3), np.uint8)
    filled = np.zeros(40000, bool)
    start = 15000
    pos = start
    prev = None
    lost = 0
    placed = 0
    for t, f in decode(video, t0, t1, fps=fps, crop=(VX0, VY0, VW, VH)):
        cur = f.astype(np.float32)
        if prev is None:
            if _loaded(f):
                prev = cur
                canvas[pos:pos + VH] = f
                filled[pos:pos + VH] = True
                placed += 1
            continue
        dy, sc = _motion(prev, cur)
        if sc < 0.8:
            lost += 1  # a weapon card or something else covering the list; keep the last position
            continue
        pos += dy
        settled = dy == 0 and float(np.abs(cur - prev).mean()) < 1.5
        prev = cur
        if not settled or not _loaded(f):
            continue
        # place the frame against what is already on the canvas, so small errors don't add up
        lo = max(0, pos - 60)
        hi = min(len(filled), pos + 300 + 60)
        if filled[lo:hi].all():
            r = cv2.matchTemplate(canvas[lo:hi].astype(np.float32), cur[0:300], cv2.TM_CCOEFF_NORMED)
            _, sc2, _, loc = cv2.minMaxLoc(r)
            if sc2 < 0.95:
                continue
            pos = lo + loc[1]
        canvas[pos:pos + VH] = f
        filled[pos:pos + VH] = True
        placed += 1
    if not filled.any():
        return None, {'placed': 0, 'lost': lost}
    top = int(np.argmax(filled))
    bot = int(len(filled) - np.argmax(filled[::-1]))
    gaps = int((~filled[top:bot]).sum())
    return canvas[top:bot].copy(), {'placed': placed, 'lost': lost, 'gapRows': gaps, 'rows': bot - top}


# ---------------------------------------------------------------------------------------------
# 3. Tiles

def _rarity(rgb):
    r, g, b = rgb
    if r > 150 and g > 90 and b < 90:
        return 'gold'
    if r > 110 and b > 150 and g < 130:
        return 'purple'
    if b > 150 and r < 120:
        return 'blue'
    return 'other'


def _section(strip, top):
    """The class name above a block of tiles ("::  Assault Rifle"), read and matched to a class."""
    hdr = strip[max(0, top - 74):max(1, top - 16), 40:560]
    if hdr.size == 0:
        return None, ''
    g = cv2.cvtColor(hdr, cv2.COLOR_RGB2GRAY)
    g = cv2.resize(g, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    _, bw = cv2.threshold(g, 120, 255, cv2.THRESH_BINARY_INV)  # dark text on white for tesseract
    txt = pytesseract.image_to_string(Image.fromarray(bw), config='--psm 7').strip()
    words = re.sub(r'[^A-Za-z ]', ' ', txt).strip().lower()
    lower = {c.lower(): c for c in CLASSES}
    best = difflib.get_close_matches(words, list(lower), n=1, cutoff=0.5)
    if not best:
        for k in (2, 1):
            tail = ' '.join(words.split()[-k:])
            best = difflib.get_close_matches(tail, list(lower), n=1, cutoff=0.6)
            if best:
                break
    best = [lower[best[0]]] if best else None
    return (best[0] if best else None), txt


def tiles(strip):
    C = strip.max(axis=2).astype(np.int16) - strip.min(axis=2)
    H = strip.shape[0]
    found = []
    for ci, x0 in enumerate(COLS):
        stripe = C[:, x0 + 4:x0 + 10].mean(axis=1) > 60
        y = 0
        while y < H:
            if stripe[y]:
                y1 = y
                while y1 < H and stripe[y1]:
                    y1 += 1
                if y1 - y >= 110:
                    found.append((y, ci, y1 - y))
                y = y1
            else:
                y += 1
    found.sort()
    rows = []
    for t in found:
        if rows and abs(t[0] - rows[-1][0][0]) <= 6:
            rows[-1].append(t)
        else:
            rows.append([t])
    out = []
    section, raw, prev_bottom = None, '', 0
    for r in rows:
        top = min(t[0] for t in r)
        if top - prev_bottom > 40:
            section, raw = _section(strip, top)
        for (y, ci, h) in sorted(r, key=lambda t: t[1]):
            x0 = COLS[ci]
            ty = max(0, y - 2)
            tile = strip[ty:ty + TH, x0:x0 + TW]
            if tile.shape[0] < TH:  # the last row can be cut by the popup's bottom edge
                if tile.shape[0] < 120:
                    continue
                tile = np.concatenate([tile, np.repeat(tile[-1:], TH - tile.shape[0], axis=0)], axis=0)
            rgb = tuple(int(v) for v in np.median(strip[y + 20:y + h - 20, x0 + 4:x0 + 10].reshape(-1, 3), axis=0))
            out.append({'section': section, 'sectionRaw': raw, 'y': int(ty), 'col': ci,
                        'rarity': _rarity(rgb), 'stripe': rgb, 'img': tile})
        prev_bottom = max(t[0] + t[2] for t in r)
    return out


_DIGITS = {}
DIGIT = (12, 38, 308, 326)  # the tier digit inside a tile (y0, y1, x0, x1); the "T" sits just left of it


def tier(tile):
    """'T0', 'T1' or 'T2', read from the tag in the tile's top right corner."""
    if not _DIGITS:
        ref = os.path.join(LIB, '_tier-digits.png')
        if not os.path.exists(ref):
            return None, 0.0
        sheet = np.array(Image.open(ref).convert('L')).astype(np.float32)
        w = DIGIT[3] - DIGIT[2]
        for i, d in enumerate('012'):
            _DIGITS[d] = sheet[:, i * w:(i + 1) * w]
    y0, y1, x0, x1 = DIGIT
    area = cv2.cvtColor(tile[y0 - 6:y1 + 6, x0 - 6:min(TW, x1 + 4)], cv2.COLOR_RGB2GRAY).astype(np.float32)
    best = ('?', -1.0)
    for d, ref in _DIGITS.items():
        sc = float(cv2.matchTemplate(area, ref, cv2.TM_CCOEFF_NORMED).max())
        if sc > best[1]:
            best = (d, sc)
    return 'T' + best[0], best[1]


def make_digit_sheet(refs):
    """refs: {'0': tile, '1': tile, '2': tile} -> evidence/weapon-icons/_tier-digits.png"""
    y0, y1, x0, x1 = DIGIT
    parts = [cv2.cvtColor(refs[d][y0:y1, x0:x1], cv2.COLOR_RGB2GRAY) for d in '012']
    os.makedirs(LIB, exist_ok=True)
    Image.fromarray(np.concatenate(parts, axis=1)).save(os.path.join(LIB, '_tier-digits.png'))


# ---------------------------------------------------------------------------------------------
# 4. Naming tiles against the icon library

def art(tile):
    """The weapon drawing, as edges, so the gold/purple/blue background doesn't matter."""
    g = cv2.cvtColor(tile[10:128, 22:300], cv2.COLOR_RGB2GRAY).astype(np.float32)
    g = cv2.GaussianBlur(g, (3, 3), 0)
    e = cv2.magnitude(cv2.Sobel(g, cv2.CV_32F, 1, 0), cv2.Sobel(g, cv2.CV_32F, 0, 1))
    e[:34, 250:] = 0  # the tier tag
    return e


def load_library():
    lib = {}
    idx = os.path.join(LIB, 'index.json')
    if not os.path.exists(idx):
        return lib
    for name, info in json.load(open(idx)).items():
        for rar, f in info['files'].items():
            im = np.array(Image.open(os.path.join(LIB, f)).convert('RGB'))
            lib.setdefault(name, {'class': info['class'], 'tier': info['tier'], 'arts': []})['arts'].append(art(im))
    return lib


def identify(tile_img, cls, tier_read, lib):
    a = art(tile_img)
    inner = a[4:-4, 4:-4]
    scores = []
    for name, e in lib.items():
        if cls and e['class'] != cls:
            continue
        best = -1.0
        for ref in e['arts']:
            r = cv2.matchTemplate(ref, inner, cv2.TM_CCOEFF_NORMED)
            best = max(best, float(r.max()))
        scores.append((best, name))
    scores.sort(reverse=True)
    if not scores:
        return None, 0.0, 0.0, []
    top, second = scores[0], (scores[1] if len(scores) > 1 else (0.0, None))
    return top[1], top[0], top[0] - second[0], scores[:3]


# ---------------------------------------------------------------------------------------------

def review_sheet(path, title, items):
    """items: [(label, tile image)] -> one image to look over by eye."""
    sc = 0.6
    tw, th = int(TW * sc), int(TH * sc)
    cols = 6
    rows = (len(items) + cols - 1) // cols
    s = Image.new('RGB', (cols * (tw + 6), 24 + rows * (th + 30)), (255, 255, 255))
    d = ImageDraw.Draw(s)
    d.text((4, 4), title, fill=(0, 0, 0))
    for i, (lab, img) in enumerate(items):
        x = (i % cols) * (tw + 6)
        y = 24 + (i // cols) * (th + 30)
        s.paste(Image.fromarray(img).resize((tw, th)), (x, y + 26))
        for k, line in enumerate(lab.split('\n')[:2]):
            d.text((x + 2, y + 2 + k * 12), line, fill=(0, 0, 0))
    s.save(path)


def _groups(rows):
    """Within each class section the tiles run all High-End copies, then Superior, then Specialized,
    each in the same weapon order. Pair them up into weapons: [(section, [tile indexes])]."""
    out = []
    order = []
    by_sec = {}
    for r in rows:
        key = (r['sectionStart'], r['section'])
        if key not in by_sec:
            by_sec[key] = []
            order.append(key)
        by_sec[key].append(r)
    for key in order:
        ts = by_sec[key]
        runs = []
        for r in ts:
            if runs and runs[-1][0] == r['rarity']:
                runs[-1][1].append(r['i'])
            else:
                runs.append((r['rarity'], [r['i']]))
        sizes = {len(x[1]) for x in runs}
        if len(sizes) == 1 and len(runs) <= 3:
            n = sizes.pop()
            for j in range(n):
                out.append((key[1], [x[1][j] for x in runs], [x[0] for x in runs]))
        else:  # unusual layout: one weapon per tile, checked by hand
            for r in ts:
                out.append((key[1], [r['i']], [r['rarity']]))
    return out


def process(strip, meta, out_dir, label, lib):
    """Tiles, tiers and names for one stitched list. Writes <label>.json and <label>-review.png."""
    ts = tiles(strip)
    rows = []
    start = None
    prev_sec = object()
    for i, t in enumerate(ts):
        if t['section'] != prev_sec or (rows and t['y'] - rows[-1]['y'] > 260):
            start = i
        prev_sec = t['section']
        tr, tsc = tier(t['img'])
        Image.fromarray(t['img']).save(os.path.join(out_dir, f'{slug(label)}-{i:03d}.png'))
        rows.append({'i': i, 'section': t['section'], 'sectionRaw': t['sectionRaw'], 'sectionStart': start, 'y': t['y'],
                     'col': t['col'], 'rarity': RARITIES.get(t['rarity'], t['rarity']), 'tier': tr, 'tierScore': round(tsc, 3)})
    weapons = []
    for sec, idxs, rars in _groups(rows):
        tiers = [rows[i]['tier'] for i in idxs]
        slot_tier = max(set(tiers), key=tiers.count)
        # Compare with the library icons of the same class and tier only (the tier tag is read
        # reliably; Classic M60 and Military M60 E4, say, look alike but sit in different tiers).
        cand = {}
        same = {n: e for n, e in lib.items() if e['tier'] == slot_tier}
        for i in idxs:
            for sc, nm in _scores(ts[i]['img'], sec, same):
                cand.setdefault(nm, []).append(sc)
        ranked = sorted(((sum(v) / len(idxs), nm) for nm, v in cand.items()), reverse=True)
        best, second = (ranked[0] if ranked else (0.0, None)), (ranked[1] if len(ranked) > 1 else (0.0, None))
        ok = best[1] is not None and best[0] >= 0.90 and best[0] - second[0] >= 0.10
        weapons.append({'class': sec, 'tiles': idxs, 'rarities': rars, 'tier': slot_tier, 'tiers': tiers,
                        'name': best[1] if ok else None, 'how': 'icon' if ok else None,
                        'best': best[1], 'score': round(best[0], 3), 'margin': round(best[0] - second[0], 3),
                        'candidates': [(round(sc, 3), nm) for sc, nm in ranked[:3]]})
    # review sheet: one line per weapon, its copies side by side
    sc = 0.5
    tw, th = int(TW * sc), int(TH * sc)
    lab = 230
    sheet = Image.new('RGB', (lab + 3 * (tw + 4), 26 + len(weapons) * (th + 4)), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    d.text((4, 6), f"{label} ({meta.get('video', '')} {meta.get('seconds', '')})", fill=(0, 0, 0))
    for k, w in enumerate(weapons):
        y = 26 + k * (th + 4)
        d.text((4, y + 4), f"{k}. {w['class'] or '?'} {w['tier']}", fill=(0, 0, 0))
        d.text((4, y + 20), (w['name'] or '?? ' + str(w['best']))[:30], fill=(0, 0, 0) if w['name'] else (200, 0, 0))
        d.text((4, y + 36), f"{w['score']:.2f} / +{w['margin']:.2f}", fill=(90, 90, 90))
        for c, i in enumerate(w['tiles']):
            sheet.paste(Image.fromarray(ts[i]['img']).resize((tw, th)), (lab + c * (tw + 4), y))
    sheet.save(os.path.join(out_dir, slug(label) + '-review.png'))
    rec = dict(meta, tiles=rows, weapons=weapons)
    json.dump(rec, open(os.path.join(out_dir, slug(label) + '.json'), 'w'), indent=1)
    named = sum(1 for w in weapons if w['name'])
    secs = []
    for w in weapons:
        if not secs or secs[-1][0] != w['class']:
            secs.append([w['class'], 0])
        secs[-1][1] += 1
    print(f"  {label}: {len(rows)} tiles, {len(weapons)} weapons ({named} named), sections {secs}")
    return rec


def _scores(tile_img, cls, lib):
    a = art(tile_img)[4:-4, 4:-4]
    out = []
    for name, e in lib.items():
        if cls and e['class'] != cls:
            continue
        best = max(float(cv2.matchTemplate(ref, a, cv2.TM_CCOEFF_NORMED).max()) for ref in e['arts'])
        out.append((best, name))
    return out


def scan(videos, reuse=False):
    talents = json.load(open(os.path.join(BASE, 'weapon-talents.json')))
    known = [t['name'] for t in talents]
    lib = load_library()
    for video in videos:
        vname = os.path.splitext(os.path.basename(video))[0]
        out_dir = os.path.join(WORK, vname)
        os.makedirs(out_dir, exist_ok=True)
        seg_path = os.path.join(out_dir, 'segments.json')
        dur, fps = probe(video)
        if reuse and os.path.exists(seg_path):
            segs = [tuple(x) for x in json.load(open(seg_path))]
        else:
            segs = segments(video, known)
            json.dump(segs, open(seg_path, 'w'), indent=1)
        print(f'{vname}: {dur:.0f} s at {fps:.0f} fps, {len(segs)} talent popups')
        for (t0, t1, name, text, raw) in segs:
            label = name or f'unknown-{t0:.0f}s'
            png = os.path.join(out_dir, slug(label) + '.png')
            meta_path = os.path.join(out_dir, slug(label) + '.stitch.json')
            if reuse and os.path.exists(png) and os.path.exists(meta_path):
                strip = np.array(Image.open(png).convert('RGB'))
                st = json.load(open(meta_path))
            else:
                strip, st = stitch(video, t0, t1 + 0.2, fps=min(30, round(fps)))
                if strip is None:
                    print(f'  {label}: {t0:.1f}-{t1:.1f} s, list never drew')
                    continue
                Image.fromarray(strip).save(png)
                json.dump(st, open(meta_path, 'w'))
            meta = {'talent': name, 'ocr': raw, 'text': text, 'video': os.path.basename(video),
                    'seconds': [round(t0, 1), round(t1, 1)], 'stitch': st}
            process(strip, meta, out_dir, label, lib)


def add_to_library(pairs):
    """pairs: NAME=TILE_PNG[,RARITY]. Keeps the best (sharpest) copy per weapon and rarity."""
    arm = {w['name']: w for w in json.load(open(os.path.join(BASE, 'armory-weapons.json')))}
    os.makedirs(LIB, exist_ok=True)
    idx_path = os.path.join(LIB, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for p in pairs:
        name, rest = p.split('=', 1)
        tile_png, rarity = rest.split(',') if ',' in rest else (rest, None)
        w = arm[name]
        img = np.array(Image.open(tile_png).convert('RGB'))
        if rarity is None:
            C = img.max(axis=2).astype(np.int16) - img.min(axis=2)
            rgb = tuple(int(v) for v in np.median(img[20:136, 4:10].reshape(-1, 3), axis=0))
            rarity = RARITIES.get(_rarity(rgb), 'other')
        e = idx.setdefault(name, {'class': w['class'], 'tier': w['armoryTier'], 'siteId': w.get('siteId'), 'files': {}})
        f = f'{slug(name)}-{slug(rarity)}.webp'
        Image.fromarray(img).save(os.path.join(LIB, f), lossless=True)
        e['files'][rarity] = f
    json.dump(dict(sorted(idx.items())), open(idx_path, 'w'), indent=1)
    open(idx_path, 'a').write('\n')
    print(f'{len(idx)} weapons in the icon library')


def compile_sources(checked):
    """Writes weapon-talent-sources.json and .csv (the spreadsheet) from every scanned list in work/,
    and saves each stitched list as the evidence image. Confirmations already in the JSON (a weapon
    name read off the weapon card in game) are kept."""
    out_json = os.path.join(BASE, 'weapon-talent-sources.json')
    old = {t['talent']: t for t in json.load(open(out_json))} if os.path.exists(out_json) else {}
    arm = {w['name']: w for w in json.load(open(os.path.join(BASE, 'armory-weapons.json')))}
    talents = {t['name']: t for t in json.load(open(os.path.join(BASE, 'weapon-talents.json')))}
    found = {}
    for d in sorted(os.listdir(WORK)):
        if not os.path.isdir(os.path.join(WORK, d)):
            continue
        for f in sorted(os.listdir(os.path.join(WORK, d))):
            if not f.endswith('.json') or f.endswith(('segments.json', '.stitch.json')):
                continue
            j = json.load(open(os.path.join(WORK, d, f)))
            if 'weapons' not in j or not j.get('talent'):
                continue
            if any(not w['name'] for w in j['weapons']):
                raise SystemExit(f"{j['talent']} ({d}): {sum(1 for w in j['weapons'] if not w['name'])} weapons not named yet")
            found[j['talent']] = (d, f, j)  # a later recording of the same talent replaces an earlier one
    ev_dir = os.path.join(BASE, 'evidence', 'weapon-talents', 'sources')
    os.makedirs(ev_dir, exist_ok=True)
    data = []
    for name in sorted(found, key=lambda n: talents.get(n, {}).get('listOrder', 999)):
        d, f, j = found[name]
        sl = slug(name)
        Image.open(os.path.join(WORK, d, f[:-5] + '.png')).convert('RGB').save(os.path.join(ev_dir, sl + '.webp'), quality=84, method=6)
        prev = {w['name']: w for w in old.get(name, {}).get('weapons', [])}
        order = []
        weapons = []
        for w in j['weapons']:
            a = arm[w['name']]
            if a['class'] != w['class'] or a['armoryTier'] != w['tier']:
                raise SystemExit(f"{name}: {w['name']} is {a['class']} {a['armoryTier']} in the Armory, list says {w['class']} {w['tier']}")
            if not order or order[-1] != a['class']:
                order.append(a['class'])
            e = {'name': w['name'], 'class': a['class'], 'armoryTier': a['armoryTier'], 'siteId': a.get('siteId'),
                 'rarities': w['rarities'], 'match': 'icon'}
            p = prev.get(w['name'])
            if p and p.get('match') == 'confirmed':
                e['match'] = 'confirmed'
                e['note'] = p.get('note', '')
            weapons.append(e)
        data.append({'talent': name, 'slug': sl, 'classOrder': order, 'weaponCount': len(weapons),
                     'source': {'recording': j['video'], 'seconds': j['seconds']},
                     'evidence': f'evidence/weapon-talents/sources/{sl}.webp', 'checked': checked, 'weapons': weapons})
    with open(out_json, 'w') as fh:
        json.dump(data, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    import csv
    with open(os.path.join(BASE, 'weapon-talent-sources.csv'), 'w', newline='') as fh:
        wr = csv.writer(fh)
        wr.writerow(['talent', 'weapon', 'class', 'armoryTier', 'rarities', 'match', 'note', 'recording', 'checked'])
        for t in data:
            for w in t['weapons']:
                wr.writerow([t['talent'], w['name'], w['class'], w['armoryTier'], ' / '.join(w['rarities']), w['match'],
                             w.get('note', ''), t['source']['recording'], t['checked']])
    write_site_copy(data, checked)
    print(f"{len(data)} talents, {sum(t['weaponCount'] for t in data)} talent and weapon pairs")


def write_site_copy(data, checked):
    """src/data/weapon-talent-sources.json: what the site reads (the research folder itself is never
    served). Weapons are keyed to the site's own weapon records (siteId), so names and page addresses
    match the weapon pages even where the Armory spells a name differently."""
    root = os.path.dirname(os.path.dirname(BASE))
    site = {w['id']: w for w in json.load(open(os.path.join(root, 'src', 'data', 'standard-weapons.json')))}
    # The site's own talent names (one differs: the database's "Precision Support" is the site's "Precise Support").
    site_talents = {t['id']: t['name'] for t in json.load(open(os.path.join(root, 'src', 'data', 'weapon-talents.json')))}
    research = {t['name']: t for t in json.load(open(os.path.join(BASE, 'weapon-talents.json')))}
    out = {'checked': checked, 'talents': {}}
    for t in data:
        site_name = site_talents[research[t['talent']]['siteId']]
        ws = []
        for w in t['weapons']:
            sw = site.get(w['siteId'])
            if not sw:
                raise SystemExit(f"{t['talent']}: {w['name']} ({w['siteId']}) has no site weapon record")
            ws.append({'name': sw['name'], 'slug': slug(sw['name']), 'class': w['class'], 'tier': w['armoryTier']})
        out['talents'][slug(site_name)] = {'name': site_name, 'id': research[t['talent']]['siteId'],
                                           'classOrder': t['classOrder'], 'weapons': ws}
    with open(os.path.join(root, 'src', 'data', 'weapon-talent-sources.json'), 'w') as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)
        fh.write('\n')


if __name__ == '__main__':
    import pytesseract  # noqa: F401  (only needed for scan)
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    a = sub.add_parser('scan')
    a.add_argument('videos', nargs='+')
    a.add_argument('--reuse', action='store_true', help='reuse segments and stitched lists from an earlier scan')
    b = sub.add_parser('library')
    b.add_argument('pairs', nargs='+')
    c = sub.add_parser('compile', help='write weapon-talent-sources.json and .csv from the scans')
    c.add_argument('--checked', required=True, help='date the lists were recorded, e.g. 2026-10-29')
    args = ap.parse_args()
    if args.cmd == 'scan':
        scan(args.videos, reuse=args.reuse)
    elif args.cmd == 'compile':
        compile_sources(args.checked)
    else:
        add_to_library(args.pairs)
else:
    import pytesseract  # noqa: F401
