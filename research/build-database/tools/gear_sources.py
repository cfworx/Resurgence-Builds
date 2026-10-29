#!/usr/bin/env python3
"""Read gear Source lists off screen recordings: which gear pieces can carry each Gear Set Effect,
each Body Armor Talent and each Backpack Talent.

The Build-Making Database's Details popup works the same way for gear as for weapon talents (see
talent_sources.py): the entry on the left, and under "Source" one tile per gear piece and rarity, with
the rarity colour on the left edge and the Armory tier in the top right corner. Gear tiles carry no
names, and the lists have no section headers.

  scan VIDEO...        For each entry opened in each video: finds the stretch where its popup is open
                       (also while a gear card opened from the list dims it), reads the entry's name,
                       stitches the scrolling list and cuts out the tiles. Gear set lists are named by
                       position (below); talent lists are named against the gear icon library.
                       Writes work/<video>/<entry>.json, the stitched list and a review sheet.
  library              Builds the gear icon library (evidence/gear-icons/) from the scanned gear set
                       lists, after checking that every copy of a piece looks the same in every list.
  cards VIDEO          Reads the name off every gear card opened from a list (the card that pops up
                       when a tile is clicked), with the time, to check the position naming against.
  compile --checked D  Writes gear-set-sources, body-armor-talent-sources and backpack-talent-sources
                       (.json and .csv) and the site copy, src/data/gear-sources.json.

Naming gear set tiles by position. The Armory (armory-gear.json) puts the 72 pieces in four families,
one piece per slot and tier, and every gear set belongs to one family. A set's Source list runs
High-End then Superior; within a rarity, T2 then T1 then T0 (as far down as the set goes); within a
tier, the six slots in the order mask, body armor, knee pads, backpack, gloves, holster. So the
position of a tile says which piece it is. The scan checks the list against that pattern (rarity and
tier of every tile) and refuses to name a list that doesn't fit; the library step then checks that
each piece's tile is the same picture in every list it appears in, and the gear cards Cory opened
give names to compare with.
"""

import argparse
import csv
import difflib
import json
import os
import re
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import talent_sources as ts  # noqa: E402

BASE = ts.BASE
WORK = ts.WORK
LIB = os.path.join(BASE, 'evidence', 'gear-icons')
SLOTS = ['Mask', 'Body Armor', 'Knee Pads', 'Backpack', 'Gloves', 'Holster']
TIERS_DOWN = ['T2', 'T1', 'T0']
RAR_ORDER = ['High-End', 'Superior', 'Specialized']
KINDS = {
    'set': ('gear-set-effects.json', 'gear-set-sources', None),
    'ba': ('body-armor-talents.json', 'body-armor-talent-sources', 'Body Armor'),
    'bp': ('backpack-talents.json', 'backpack-talent-sources', 'Backpack'),
}
EVIDENCE = {'set': 'gear-set-effects', 'ba': 'body-armor-talents', 'bp': 'backpack-talents'}  # evidence/<dir>/sources/
CARD_NAME = (150, 196, 950, 1660)  # the gear card's title bar (y0, y1, x0, x1), when one is open


def load(name):
    return json.load(open(os.path.join(BASE, name)))


def entries():
    """{name: (kind, record)} for every gear set, body armor talent and backpack talent."""
    out = {}
    for kind, (f, _, _) in KINDS.items():
        for r in load(f):
            out[r['name']] = (kind, r)
    return out


# ---------------------------------------------------------------------------------------------
# Popup stretches

def _header_state(band):
    """'bright' (popup open), 'dim' (popup open under a gear card) or None, from the orange bar.
    Only the bar's two ends are used: a gear card covers the middle."""
    parts = [band[:, int(0.006 * band.shape[1]):int(0.27 * band.shape[1])],
             band[:, int(0.73 * band.shape[1]):int(0.99 * band.shape[1])]]
    px = np.concatenate([p.reshape(-1, 3) for p in parts]).astype(np.float32)
    r, g, b = px[:, 0], px[:, 1], px[:, 2]
    orange = (r > 50) & (g > 0.38 * r) & (g < 0.62 * r) & (b < 0.2 * r)
    if orange.mean() < 0.6:
        return None
    return 'bright' if float(np.median(r[orange])) > 200 else 'dim'


def segments(video, known):
    """[(t0, t1, name, raw_ocr, [bright frame times])] for every entry popup in the video."""
    s = 0.5
    y0, y1, x0, x1 = (int(v * s) for v in ts.HEADER)
    iy0, iy1, ix0, ix1 = (int(v * s) for v in ts.ICON)
    runs = []
    cur = None
    for t, f in ts.decode(video, fps=5, scale=s):
        st = _header_state(f[y0:y1, x0:x1])
        if st is None:
            cur = None
            continue
        icon = cv2.resize(cv2.cvtColor(f[iy0:iy1, ix0:ix1], cv2.COLOR_RGB2GRAY), (32, 32)).astype(np.float32)
        if icon.std() < 3:
            continue
        icon = (icon - icon.mean()) / (icon.std() + 1e-6)
        if cur is not None and float((icon * cur['sig']).mean()) > 0.8:
            cur['t1'] = t
        else:
            cur = {'t0': t, 't1': t, 'sig': icon, 'bright': []}
            runs.append(cur)
        if st == 'bright':
            cur['bright'].append(round(t, 2))
    out = []
    for r in runs:
        if r['t1'] - r['t0'] < 0.8 or not r['bright']:
            continue
        name, raw = None, ''
        picks = r['bright'][len(r['bright']) // 2:] + r['bright'][:len(r['bright']) // 2]
        for tt in picks[:4]:
            f = ts.frame_at(video, tt)
            raw = ts.ocr_line(f[ts.NAME[0]:ts.NAME[1], ts.NAME[2]:ts.NAME[3]])
            best = difflib.get_close_matches(raw, known, n=1, cutoff=0.6)
            if best:
                name = best[0]
                break
        if out and name and out[-1][2] == name and r['t0'] - out[-1][1] < 3:
            out[-1] = (out[-1][0], r['t1'], name, out[-1][3], out[-1][4] + r['bright'])
            continue
        out.append((r['t0'], r['t1'], name, raw, r['bright']))
    return out


# ---------------------------------------------------------------------------------------------
# Stitching, skipping every frame dimmed by a gear card

def stitch(video, t0, t1, fps=10):
    HY0 = ts.HEADER[0] - ts.HEADER[0] % 2  # ffmpeg rounds an odd crop down to even rows; keep it even
    hx0, hx1 = 1700 - ts.VX0, ts.VX1 - ts.VX0  # the bar's right end, inside the list's columns
    canvas = np.zeros((40000, ts.VW, 3), np.uint8)
    filled = np.zeros(40000, bool)
    pos = 15000
    prev = None
    lost = dimmed = placed = 0
    for t, full in ts.decode(video, t0, t1, fps=fps, crop=(ts.VX0, HY0, ts.VW, ts.VY1 - HY0)):
        band = full[0:ts.HEADER[1] - HY0, hx0:hx1].reshape(-1, 3).astype(np.float32)
        if float(np.median(band[:, 0])) < 200:
            dimmed += 1
            continue
        f = full[ts.VY0 - HY0:]
        cur = f.astype(np.float32)
        if prev is None:
            if ts._loaded(f):
                prev = cur
                canvas[pos:pos + ts.VH] = f
                filled[pos:pos + ts.VH] = True
                placed += 1
            continue
        dy, sc = ts._motion(prev, cur)
        if sc < 0.8:
            lost += 1
            continue
        pos += dy
        # In the gear recordings the list often creeps a pixel or two per frame instead of
        # stopping, so a frame counts as still when it moved a few pixels at most and matches the
        # previous frame once that shift is taken out (no motion blur, nothing fading).
        if abs(dy) <= 3:
            a, b = (prev[dy:], cur[:ts.VH - dy]) if dy >= 0 else (prev[:ts.VH + dy], cur[-dy:])
            settled = float(np.abs(a - b).mean()) < 2.0
        else:
            settled = False
        prev = cur
        if not settled or not ts._loaded(f):
            continue
        lo = max(0, pos - 60)
        hi = min(len(filled), pos + 300 + 60)
        if filled[lo:hi].all():
            r = cv2.matchTemplate(canvas[lo:hi].astype(np.float32), cur[0:300], cv2.TM_CCOEFF_NORMED)
            _, sc2, _, loc = cv2.minMaxLoc(r)
            if sc2 < 0.95:
                continue
            pos = lo + loc[1]
        canvas[pos:pos + ts.VH] = f
        filled[pos:pos + ts.VH] = True
        placed += 1
    if not filled.any():
        return None, {'placed': 0, 'lost': lost, 'dimmed': dimmed}
    top = int(np.argmax(filled))
    bot = int(len(filled) - np.argmax(filled[::-1]))
    return canvas[top:bot].copy(), {'placed': placed, 'lost': lost, 'dimmed': dimmed,
                                    'gapRows': int((~filled[top:bot]).sum()), 'rows': bot - top}


# ---------------------------------------------------------------------------------------------
# Gear pieces and the icon library

def armory():
    return {p['name']: p for p in load('armory-gear.json')}


def family_piece(family, tier, slot, arm):
    for p in arm.values():
        if p['gearSetFamily'] == family and p['armoryTier'] == tier and p['slot'] == slot:
            return p['name']
    raise KeyError((family, tier, slot))


def expected_set_list(set_name, arm):
    """[(piece, rarity, tier)] in the order the set's Source list should show, from the Armory."""
    fam = {p['gearSetFamily'] for p in arm.values() if set_name in p['gearSets']}
    assert len(fam) == 1, (set_name, fam)
    fam = fam.pop()
    tiers = [t for t in TIERS_DOWN if any(set_name in p['gearSets'] and p['armoryTier'] == t for p in arm.values())]
    return fam, tiers


def load_library():
    lib = {}
    idx = os.path.join(LIB, 'index.json')
    if not os.path.exists(idx):
        return lib
    for name, info in json.load(open(idx)).items():
        for rar, f in info['files'].items():
            im = np.array(Image.open(os.path.join(LIB, f)).convert('RGB'))
            e = lib.setdefault(name, {'slot': info['slot'], 'tier': info['tier'], 'arts': {}})
            e['arts'][rar] = ts.art(im)
    return lib


def score(tile_img, ref_art):
    a = ts.art(tile_img)[4:-4, 4:-4]
    return float(cv2.matchTemplate(ref_art, a, cv2.TM_CCOEFF_NORMED).max())


# ---------------------------------------------------------------------------------------------
# One stitched list

def name_oversized_blocks(rows, tl, rars, tiers, fam, arm):
    """For a set list with more tiles in a rarity and tier block than the six slots (Captain Cow and
    Fearless Warrior show eight Superior T0 tiles: a second knee pad and a second pair of gloves).
    Each tile of such a block is matched to the slot whose picture it shares in a block of the same
    tier that has exactly six tiles. The first tile of a slot is that slot's Armory piece; any further
    tile of the same slot is kept as an extra listing ('extraOf'), named by nobody until a gear card
    settles it. Returns the problems left (an empty list when every block could be read)."""
    blocks = {}
    for r in rows:
        blocks.setdefault((r['rarity'], r['tier']), []).append(r)
    order = [(rar, t) for rar in rars for t in tiers]
    if list(blocks) != order or any(len(blocks[k]) < 6 for k in order):
        return [f'list does not fit the pattern: blocks {[(k, len(v)) for k, v in blocks.items()]}']
    probs = []
    for (rar, t), rs in blocks.items():
        if len(rs) == 6:
            for r, s in zip(rs, SLOTS):
                r['name'], r['how'] = family_piece(fam, t, s, arm), 'position'
            continue
        ref = next((v for (r2, t2), v in blocks.items() if t2 == t and len(v) == 6), None)
        if ref is None:
            probs.append(f'{rar} {t}: {len(rs)} tiles and no six-tile block of that tier to compare with')
            continue
        ref_arts = [ts.art(tl[x['i']]['img']) for x in ref]
        slots = []
        for r in rs:
            a = ts.art(tl[r['i']]['img'])[4:-4, 4:-4]
            sc = [float(cv2.matchTemplate(ra, a, cv2.TM_CCOEFF_NORMED).max()) for ra in ref_arts]
            k = int(np.argmax(sc))
            slots.append(k)
            r['slotMatch'] = round(sc[k], 3)
        if slots != sorted(slots) or set(slots) != set(range(6)):
            probs.append(f'{rar} {t}: tiles match slots {slots}, not one run of the six slots')
            continue
        seen = set()
        for r, k in zip(rs, slots):
            piece = family_piece(fam, t, SLOTS[k], arm)
            if k in seen:
                r['name'], r['how'], r['extraOf'] = None, 'extra', piece
            else:
                r['name'], r['how'] = piece, 'position'
                seen.add(k)
    return probs


def process(strip, meta, out_dir, label, kind, lib, arm):
    tl = ts.tiles(strip)
    rows = []
    for i, t in enumerate(tl):
        tr, tsc = ts.tier(t['img'])
        Image.fromarray(t['img']).save(os.path.join(out_dir, f'{ts.slug(label)}-{i:03d}.png'))
        rows.append({'i': i, 'y': t['y'], 'col': t['col'], 'rarity': ts.RARITIES.get(t['rarity'], t['rarity']),
                     'tier': tr, 'tierScore': round(tsc, 3), 'name': None, 'how': None})
    problems = []
    if kind == 'set':
        fam, tiers = expected_set_list(label, arm)
        rars = []
        for r in rows:
            if r['rarity'] not in rars:
                rars.append(r['rarity'])
        exp = [(family_piece(fam, t, s, arm), rar, t) for rar in rars for t in tiers for s in SLOTS]
        got = [(r['rarity'], r['tier']) for r in rows]
        if [(e[1], e[2]) for e in exp] == got:
            for r, e in zip(rows, exp):
                r['name'], r['how'] = e[0], 'position'
        else:
            problems += name_oversized_blocks(rows, tl, rars, tiers, fam, arm)
        meta = dict(meta, family=fam, tiers=tiers)
    else:
        slot = KINDS[kind][2]
        for r in rows:
            cands = [(score(tl[r['i']]['img'], e['arts'][r['rarity']]) if r['rarity'] in e['arts']
                      else max(score(tl[r['i']]['img'], a) for a in e['arts'].values()), n)
                     for n, e in lib.items() if e['slot'] == slot and e['tier'] == r['tier']]
            cands.sort(reverse=True)
            best = cands[0] if cands else (0.0, None)
            second = cands[1] if len(cands) > 1 else (0.0, None)
            r['candidates'] = [(round(s, 3), n) for s, n in cands[:3]]
            r['score'], r['margin'] = round(best[0], 3), round(best[0] - second[0], 3)
            if best[1] and best[0] >= 0.85 and best[0] - second[0] >= 0.10:
                r['name'], r['how'] = best[1], 'icon'
        seen = [r['name'] for r in rows if r['name']]
        for n in set(seen):
            by_rar = [r['rarity'] for r in rows if r['name'] == n]
            if len(by_rar) != len(set(by_rar)):
                problems.append(f'{n} appears twice in one rarity')
    # review sheet
    sc = 0.5
    tw, th = int(ts.TW * sc), int(ts.TH * sc)
    lab_w = 300
    sheet = Image.new('RGB', (lab_w + tw + 10, 30 + len(rows) * (th + 4)), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    d.text((4, 8), f"{label} ({meta.get('video', '')} {meta.get('seconds', '')})", fill=(0, 0, 0))
    for k, r in enumerate(rows):
        y = 30 + k * (th + 4)
        d.text((4, y + 4), f"{k}. {r['rarity']} {r['tier']} ({r['tierScore']:.2f})", fill=(0, 0, 0))
        nm = r['name'] or (f"extra listing, looks like {r['extraOf']}" if r.get('extraOf')
                           else '?? ' + str((r.get('candidates') or [[0, '']])[0][1]))
        d.text((4, y + 20), nm[:44], fill=(0, 0, 0) if r['name'] else (200, 0, 0))
        if 'score' in r:
            d.text((4, y + 36), f"{r['score']:.2f} / +{r['margin']:.2f}", fill=(90, 90, 90))
        sheet.paste(Image.fromarray(tl[r['i']]['img']).resize((tw, th)), (lab_w, y))
    sheet.save(os.path.join(out_dir, ts.slug(label) + '-review.png'))
    rec = dict(meta, kind=kind, tiles=rows, problems=problems)
    json.dump(rec, open(os.path.join(out_dir, ts.slug(label) + '.json'), 'w'), indent=1, ensure_ascii=False)
    named = sum(1 for r in rows if r['name'])
    tally = {}
    for r in rows:
        tally[(r['rarity'], r['tier'])] = tally.get((r['rarity'], r['tier']), 0) + 1
    print(f"  {label} [{kind}]: {len(rows)} tiles ({named} named) {sorted(tally.items())}"
          + (f" PROBLEMS: {problems}" if problems else ''))
    return rec


def scan(videos, reuse=False):
    known = entries()
    lib = load_library()
    arm = armory()
    for video in videos:
        vname = os.path.splitext(os.path.basename(video))[0]
        out_dir = os.path.join(WORK, vname)
        os.makedirs(out_dir, exist_ok=True)
        seg_path = os.path.join(out_dir, 'segments.json')
        dur, fps = ts.probe(video)
        if reuse and os.path.exists(seg_path):
            segs = [tuple(x) for x in json.load(open(seg_path))]
        else:
            segs = segments(video, list(known))
            json.dump(segs, open(seg_path, 'w'), indent=1)
        print(f'{vname}: {dur:.0f} s at {fps:.0f} fps, {len(segs)} popups')
        for (t0, t1, name, raw, bright) in segs:
            label = name or f'unknown-{t0:.0f}s'
            if not name:
                print(f'  {label}: name not read ({raw!r})')
                continue
            kind = known[name][0]
            png = os.path.join(out_dir, ts.slug(label) + '.png')
            meta_path = os.path.join(out_dir, ts.slug(label) + '.stitch.json')
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
            meta = {'entry': name, 'ocr': raw, 'video': os.path.basename(video),
                    'seconds': [round(t0, 1), round(t1, 1)], 'stitch': st}
            process(strip, meta, out_dir, label, kind, lib, arm)


def _scans(kind=None):
    """{entry: (dir, json)} for every scanned gear list, the latest recording winning."""
    found = {}
    for d in sorted(os.listdir(WORK)):
        p = os.path.join(WORK, d)
        if not os.path.isdir(p):
            continue
        for f in sorted(os.listdir(p)):
            if not f.endswith('.json') or f.endswith(('segments.json', '.stitch.json')):
                continue
            j = json.load(open(os.path.join(p, f)))
            if j.get('kind') in KINDS and (kind is None or j['kind'] == kind):
                found[j['entry']] = (d, f, j)
    return found


def build_library():
    """Every gear set list gives a tile per piece and rarity. Keep, per piece and rarity, the copy that
    looks most like the others, and stop if any copy doesn't look like the rest."""
    arm = armory()
    copies = {}
    for name, (d, f, j) in _scans('set').items():
        if j['problems']:
            print(f'{name}: skipped, {j["problems"]}')
            continue
        for r in j['tiles']:
            if not r['name']:  # an extra listing (see name_oversized_blocks)
                continue
            img = np.array(Image.open(os.path.join(WORK, d, f'{ts.slug(name)}-{r["i"]:03d}.png')).convert('RGB'))
            copies.setdefault((r['name'], r['rarity']), []).append((name, img))
    os.makedirs(LIB, exist_ok=True)
    idx = {}
    worst = []
    for (piece, rar), cs in sorted(copies.items()):
        arts = [ts.art(im) for _, im in cs]
        m = np.ones((len(cs), len(cs)))
        for a in range(len(cs)):
            for b in range(len(cs)):
                if a != b:
                    m[a, b] = float(cv2.matchTemplate(arts[a], arts[b][4:-4, 4:-4], cv2.TM_CCOEFF_NORMED).max())
        mean = m.mean(axis=1)
        k = int(np.argmax(mean))
        worst.append((round(float(m.min()), 3), piece, rar, [c[0] for c in cs]))
        p = arm[piece]
        e = idx.setdefault(piece, {'slot': p['slot'], 'tier': p['armoryTier'], 'family': p['gearSetFamily'], 'files': {}})
        fn = f'{ts.slug(piece)}-{ts.slug(rar)}.webp'
        Image.fromarray(cs[k][1]).save(os.path.join(LIB, fn), lossless=True)
        e['files'][rar] = fn
    json.dump(dict(sorted(idx.items())), open(os.path.join(LIB, 'index.json'), 'w'), indent=1, ensure_ascii=False)
    worst.sort()
    print(f'{len(idx)} pieces, {sum(len(e["files"]) for e in idx.values())} tiles in the gear icon library')
    print('lowest agreement between copies of one piece (1.0 = identical):')
    for w in worst[:12]:
        print('  ', w)
    # the same picture should never belong to two pieces
    lib = load_library()
    clash = []
    names = sorted(lib)
    for a in range(len(names)):
        for b in range(a + 1, len(names)):
            ea, eb = lib[names[a]], lib[names[b]]
            if ea['slot'] != eb['slot']:
                continue
            for rar in set(ea['arts']) & set(eb['arts']):
                s = float(cv2.matchTemplate(ea['arts'][rar], eb['arts'][rar][4:-4, 4:-4], cv2.TM_CCOEFF_NORMED).max())
                clash.append((round(s, 3), names[a], names[b], rar))
    clash.sort(reverse=True)
    print('most alike pairs of different pieces (same slot):')
    for c in clash[:8]:
        print('  ', c)


def cards(video):
    """The name on every gear card opened from a Source list, with the time it showed."""
    out = []
    last = None
    for t, f in ts.decode(video, fps=2):
        y0, y1, x0, x1 = CARD_NAME
        bar = f[y0:y1, x0:x1].astype(np.int16)
        C = bar.max(axis=2) - bar.min(axis=2)
        if (C > 80).mean() < 0.5:  # no gold or purple title bar there
            last = None
            continue
        txt = ts.ocr_line(f[y0:y1, x0:x1])
        if txt and txt != last:
            out.append((round(t, 1), txt))
            last = txt
    for t, txt in out:
        print(f'{t:7.1f}  {txt}')
    json.dump(out, open(os.path.join(WORK, os.path.splitext(os.path.basename(video))[0] + '-cards.json'), 'w'),
              indent=1, ensure_ascii=False)


# ---------------------------------------------------------------------------------------------

def card_readings():
    """gear-cards.json: the gear cards opened from Source lists (name read off each card). Returns
    ({piece: 'recording at N s'} for regular tiles, {(list, slot): [reading, ...]} for the extra tiles)."""
    path = os.path.join(BASE, 'gear-cards.json')
    if not os.path.exists(path):
        return {}, {}
    arm = armory()
    checks, extras = {}, {}
    for r in json.load(open(path))['cards']:
        where = f"{r['recording']} at {r['seconds']:.1f} s"
        if r['tile'] == 'extra':
            extras.setdefault((r['list'], arm[r['piece']]['slot']), []).append(dict(r, where=where))
        else:
            checks.setdefault(r['piece'], where)
    return checks, extras


def compile_sources(checked):
    arm = armory()
    cards, extra_cards = card_readings()
    known = entries()
    root = os.path.dirname(os.path.dirname(BASE))
    site = {'checked': checked, 'pieces': {}, 'sets': {}, 'bodyArmorTalents': {}, 'backpackTalents': {}}
    for p in arm.values():
        site['pieces'][ts.slug(p['name'])] = {'name': p['name'], 'slot': p['slot'], 'tier': p['armoryTier'],
                                             'family': p['gearSetFamily']}
    for kind, (src, out_name, slot) in KINDS.items():
        found = _scans(kind)
        order = {r['name']: r.get('listOrder', 999) for r in load(src)}
        missing = [n for n in order if n not in found]
        ev_dir = os.path.join(BASE, 'evidence', EVIDENCE[kind], 'sources')
        os.makedirs(ev_dir, exist_ok=True)
        data = []
        for name in sorted(found, key=lambda n: order.get(n, 999)):
            d, f, j = found[name]
            if j['problems'] or any(not r['name'] and not r.get('extraOf') for r in j['tiles']):
                raise SystemExit(f'{name} ({d}): not fully named yet {j["problems"]}')
            sl = ts.slug(name)
            Image.open(os.path.join(WORK, d, f[:-5] + '.png')).convert('RGB').save(
                os.path.join(ev_dir, sl + '.webp'), quality=84, method=6)
            pieces = []
            extras = []
            for r in j['tiles']:
                if r.get('extraOf'):
                    xslot = arm[r['extraOf']]['slot']
                    x = {'slot': xslot, 'rarity': r['rarity'], 'armoryTier': r['tier'], 'looksLike': r['extraOf']}
                    # its name: a card opened from this tile, in this list or (same picture, same place) the twin list
                    reads = extra_cards.get((name, xslot)) or next(
                        (v for (l2, s2), v in extra_cards.items() if s2 == xslot and l2 in ('Captain Cow', 'Fearless Warrior')), None)
                    if reads:
                        x['card'] = reads[0]['card']
                        x['piece'] = reads[0]['piece']
                        x['cardCheck'] = reads[0]['where'] + ('' if reads[0]['list'] == name else f" ({reads[0]['list']} list)")
                        if reads[0].get('note'):
                            x['note'] = reads[0]['note']
                    else:
                        x['note'] = 'A second tile of this slot, rarity and tier with the same picture; no card opened from it yet.'
                    extras.append(x)
                    continue
                p = arm[r['name']]
                if p['armoryTier'] != r['tier'] or (slot and p['slot'] != slot):
                    raise SystemExit(f"{name}: {r['name']} is {p['slot']} {p['armoryTier']}, list says {r['tier']}")
                e = next((x for x in pieces if x['name'] == r['name']), None)
                if not e:
                    e = {'name': r['name'], 'slot': p['slot'], 'armoryTier': p['armoryTier'],
                         'family': p['gearSetFamily'], 'rarities': [], 'match': r['how']}
                    if r['name'] in cards:
                        e['cardCheck'] = cards[r['name']]
                    pieces.append(e)
                e['rarities'].append(r['rarity'])
            data.append({'entry': name, 'slug': sl, 'pieceCount': len(pieces), 'tileCount': len(j['tiles']),
                         'extraListings': extras,
                         'source': {'recording': j['video'], 'seconds': j['seconds']},
                         'evidence': os.path.relpath(os.path.join(ev_dir, sl + '.webp'), BASE),
                         'checked': checked, 'pieces': pieces})
            key = {'set': 'sets', 'ba': 'bodyArmorTalents', 'bp': 'backpackTalents'}[kind]
            site[key][sl] = {'name': name, 'pieces': [{'slug': ts.slug(x['name']), 'rarities': x['rarities']} for x in pieces]}
        with open(os.path.join(BASE, out_name + '.json'), 'w') as fh:
            json.dump(data, fh, indent=1, ensure_ascii=False)
            fh.write('\n')
        with open(os.path.join(BASE, out_name + '.csv'), 'w', newline='') as fh:
            wr = csv.writer(fh)
            wr.writerow(['entry', 'piece', 'slot', 'armoryTier', 'family', 'rarities', 'match', 'gear card', 'recording', 'checked'])
            for t in data:
                for x in t['pieces']:
                    wr.writerow([t['entry'], x['name'], x['slot'], x['armoryTier'], x['family'], ' / '.join(x['rarities']),
                                 x['match'], x.get('cardCheck', ''), t['source']['recording'], t['checked']])
                for x in t.get('extraListings', []):
                    wr.writerow([t['entry'], x.get('card', '(not identified yet)'), x['slot'], x['armoryTier'],
                                 arm[x['piece']]['gearSetFamily'] if x.get('piece') else '', x['rarity'],
                                 'extra listing', x.get('cardCheck', ''), t['source']['recording'], t['checked']])
        print(f"{out_name}: {len(data)} entries, {sum(t['pieceCount'] for t in data)} pairs"
              + (f'; not scanned yet: {missing}' if missing else ''))
    with open(os.path.join(root, 'src', 'data', 'gear-sources.json'), 'w') as fh:
        json.dump(site, fh, indent=1, ensure_ascii=False)
        fh.write('\n')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    a = sub.add_parser('scan')
    a.add_argument('videos', nargs='+')
    a.add_argument('--reuse', action='store_true')
    sub.add_parser('library')
    c = sub.add_parser('cards')
    c.add_argument('video')
    k = sub.add_parser('compile')
    k.add_argument('--checked', required=True)
    args = ap.parse_args()
    if args.cmd == 'scan':
        scan(args.videos, reuse=args.reuse)
    elif args.cmd == 'library':
        build_library()
    elif args.cmd == 'cards':
        cards(args.video)
    else:
        compile_sources(args.checked)
