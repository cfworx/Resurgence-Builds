#!/usr/bin/env python3
"""Rebuild the top of every OS Protocol card from one clean frame of the recording.

Why: the cards in evidence/os-protocols/ were stitched from frames taken while the popup scrolled.
The popup's title bar stays put while everything under it scrolls, so on many stitched cards the
rows just under the title came out wrong: an "OS Protocols" tag cut in half, a stray black band,
or half a line of text. The values were read from the stitched cards and are not affected.

What it does, for each card in os-protocols.json:
  1. Reads the frames of that card's window in the recording (source.recording, source.seconds).
  2. Finds the card in each frame by matching the stitched card's title bar.
  3. Picks a frame where the popup has finished opening and sits at the top of its scroll: title as
     bright as it stays once the opening animation is over, the "OS Protocols" tag exactly where it
     sits on a card at rest (TAG_ROW), and the picture still if there is such a frame.
  4. Keeps everything the popup shows in that frame, down to just above the popup's bottom edge,
     and adds the stitched card's remaining rows below it, lined up on the rows where the two meet.
     The grey "OS Protocol Talent" bar and the join both have to match before anything is written.
Nothing is redrawn or retouched: every pixel is either from that one frame or from the stitched
card. Short cards fit in the popup whole and come out as a single frame.

Output: evidence/os-protocols/clean/<slug>.webp (580 px wide, same framing as the stitched cards,
so scripts/build-db-images.mjs trims them the same way) and evidence/os-protocols/clean/frames.json
(the frame each card came from and how many rows it supplied). scripts/build-db-images.mjs uses a
clean file when there is one and the stitched card otherwise.

Run from anywhere (needs ffmpeg, numpy, opencv-python and Pillow):
  python3 research/build-database/tools/clean_os_protocol_cards.py --recordings /path/to/recordings
  python3 research/build-database/tools/clean_os_protocol_cards.py ambusher level-headed   (some cards)
"""

import argparse
import json
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
EV = os.path.join(BASE, 'evidence', 'os-protocols')
OUT = os.path.join(EV, 'clean')

FRAME_H = 1080  # the recordings are 2340 x 1080
CROP_X = 850  # decode only frame columns CROP_X..CROP_X+CROP_W: the popup sits inside them
CROP_W = 700
FPS = 20
EV_W = 580  # stitched cards: 12 px of frame on the left, 10 on the right, 12 above the title
TITLE = (12, 56)  # rows of the stitched card's title bar used to find the card in a frame
CARD = slice(12, 570)  # card columns inside the 580 px framing
VIEW_MARGIN = 12  # rows kept clear of the popup's bottom edge (a faint shadow sits there)
# The "OS Protocols" tag is the first thing in the scrolling part of every card. At rest at the top
# of the scroll its box starts TAG_ROW rows below the top of the 580 px framing; scrolled, it sits
# higher (or under the title), and in the little bounce when a card is scrolled back up, lower. So
# a frame with the tag exactly there shows the card the way it opens. The tag's look is taken from
# Ambusher's card at rest (TAG_FROM), which matches the other cards' tags whatever their colour.
TAG_ROW = 70
TAG_BOX = (slice(TAG_ROW, TAG_ROW + 34), slice(28, 200))
TAG_FROM = ('Screen_Recording_20261028_152837_The_Division_Resurgence.mp4', 65.8, 'ambusher')


def lum(a):
    return a.astype(np.float32).mean(axis=2)


def decode(path, t0, t1):
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{max(0.0, t0):.3f}', '-t', f'{t1 - max(0.0, t0):.3f}', '-i', path,
           '-vf', f'fps={FPS},crop={CROP_W}:{FRAME_H}:{CROP_X}:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    size = CROP_W * FRAME_H * 3
    n = len(raw) // size
    return np.frombuffer(raw[: n * size], np.uint8).reshape(n, FRAME_H, CROP_W, 3)


def view_bottom(frame, x0, y_from):
    """Row of the popup's bottom edge: an even, light grey line right across the card (text rows
    are bright too, but uneven), with dark popup just above it."""
    L = lum(frame[:, x0 + CARD.start + 30: x0 + CARD.stop - 30])
    med, std = np.median(L, axis=1), L.std(axis=1)
    for y in range(y_from, FRAME_H - 3):
        if med[y] > 45 and std[y] < 20 and med[y + 1] > 45 and std[y + 1] < 20 and med[y - 6] < 25:
            return y
    return None


def art_bottom(card):
    """First row under the coloured header art: three dark rows in a row, from row 150 down."""
    med = np.median(lum(card[:, CARD]), axis=1)
    for y in range(150, len(med) - 3):
        if med[y] < 20 and med[y + 1] < 20 and med[y + 2] < 20:
            return y
    return None


def bar_top(card, start):
    """First row of the grey "OS Protocol Talent" bar at or below start."""
    L = lum(card[:, CARD])
    C = card[:, CARD].max(axis=2).astype(np.int16) - card[:, CARD].min(axis=2)
    medL, medC = np.median(L, axis=1), np.median(C, axis=1)
    run = 0
    for y in range(start, len(medL)):
        if 28 <= medL[y] <= 50 and medC[y] < 10:
            run += 1
            if run >= 30:
                return y - 29
        else:
            run = 0
    return None


def tag_row(card, tag):
    """Row where the "OS Protocols" tag box starts in a card (580 px framing), and the match score."""
    hay = lum(card[40:200, :260])
    r = cv2.matchTemplate(hay, tag, cv2.TM_CCOEFF_NORMED)
    _, score, _, loc = cv2.minMaxLoc(r)
    return loc[1] + 40, float(score)


def match(hay, needle):
    """Row where needle (some rows of a card) best fits inside hay, and how well (1 = perfect).
    Normalised correlation, so the stitched cards' softer compression doesn't throw it off."""
    r = cv2.matchTemplate(lum(hay[:, CARD]), lum(needle[:, CARD]), cv2.TM_CCOEFF_NORMED)
    _, score, _, loc = cv2.minMaxLoc(r)
    return loc[1], float(score)


def clean_card(entry, recordings, tag):
    slug = os.path.basename(entry['evidence'])[:-5]
    ev = np.array(Image.open(os.path.join(EV, slug + '.webp')).convert('RGB'))
    if ev.shape[1] != EV_W:
        raise SystemExit(f'{slug}: stitched card is {ev.shape[1]} px wide, expected {EV_W}')
    rec = os.path.join(recordings, entry['source']['recording'])
    t0, t1 = entry['source']['seconds']
    frames = decode(rec, t0 - 0.5, t1 + 0.25)
    tmpl = lum(ev[TITLE[0]:TITLE[1], CARD])

    rows = []
    for i, f in enumerate(frames):
        g = lum(f[30:260])
        r = cv2.matchTemplate(g, tmpl, cv2.TM_CCOEFF_NORMED)
        _, score, _, loc = cv2.minMaxLoc(r)
        x0, y0 = loc[0] - CARD.start, loc[1] + 30 - TITLE[0]
        if score < 0.9 or x0 < 0 or x0 + EV_W > CROP_W:
            rows.append(None)
            continue
        card = f[y0:, x0:x0 + EV_W]
        trow, tscore = tag_row(card, tag)
        rows.append({'i': i, 'score': score, 'x0': x0, 'y0': y0, 'art': art_bottom(card),
                     'title': float(lum(card[TITLE[0]:TITLE[1], CARD]).mean()),
                     'tag': trow if tscore > 0.7 else None})
    # Fully opaque: the title bar as bright as it is once the opening animation is over (the
    # popup fades in over the list, so its title is dimmer or brighter until then).
    seen = [r['title'] for r in rows if r]
    steady = float(np.median(seen)) if seen else 0.0
    for r in rows:
        if r:
            r['opaque'] = abs(r['title'] - steady) < 3
    for k, r in enumerate(rows):
        if r is None:
            continue
        prev = rows[k - 1] if k else None
        nxt = rows[k + 1] if k + 1 < len(rows) else None
        def moved(o):
            if o is None or (o['x0'], o['y0']) != (r['x0'], r['y0']):
                return 99.0
            a = frames[r['i']][r['y0']:r['y0'] + 700, r['x0']:r['x0'] + EV_W]
            b = frames[o['i']][o['y0']:o['y0'] + 700, o['x0']:o['x0'] + EV_W]
            return float(np.abs(lum(a) - lum(b)).mean())
        r['still'] = min(moved(prev), moved(nxt)) < 1.0
    # The frame to use: fully opaque, the tag exactly where it sits when the card is at rest at the
    # top of its scroll, and still if possible. Some cards were scrolled the moment they opened, so
    # a single frame between the opening animation and the first scroll is enough.
    pick = [r for r in rows if r and r['score'] > 0.95 and r['opaque'] and r['tag'] == TAG_ROW]
    if not pick:
        return slug, None, 'no frame with the card at the top of its scroll'
    still = [r for r in pick if r['still']]
    best = (still or pick)[len(still or pick) // 2]
    f = frames[best['i']]
    x0, y0 = best['x0'], best['y0']
    vb = view_bottom(f, x0, y0 + 400)
    if vb is None:
        return slug, None, 'popup bottom edge not found'
    shown = f[y0:vb - VIEW_MARGIN, x0:x0 + EV_W]  # what the popup shows, in the stitched card's framing

    # Line the stitched card up with the frame twice: on the talent bar, and on the last rows the
    # frame shows (that is where the two meet, so that is the shift used).
    bf = bar_top(shown, art_bottom(shown) or 150)
    be = bar_top(ev, art_bottom(ev) or 150)
    if bf is None or be is None:
        return slug, None, f'talent bar not found (frame {bf}, stitched {be})'
    lo = max(0, be - 40)
    pos, bar_score = match(ev[lo:be + 100], shown[bf - 8:bf + 56])
    bar_shift = lo + pos - (bf - 8)  # stitched row = frame row + shift
    if bar_score < 0.9:
        return slug, None, f'talent bar does not match (score {bar_score:.2f})'
    if len(shown) + bar_shift >= len(ev):
        # The whole card fits in the popup: the frame alone, cut where the stitched card ends.
        out = shown[: len(ev) - bar_shift]
        from_frame, stitched_from, shift, join_score = len(out), None, bar_shift, None
    else:
        h = 48
        strip = shown[-h:]
        while (lum(strip[:, CARD]) > 120).sum() < 150 and h < 240:
            h += 24
            strip = shown[-h:]
        pos, join_score = match(ev, strip)
        shift = pos - (len(shown) - h)
        if join_score < 0.85:
            return slug, None, f'no clean join (score {join_score:.2f})'
        stitched_from = len(shown) + shift
        out = np.concatenate([shown, ev[stitched_from:]], axis=0)
        from_frame = len(shown)
    info = {
        'recording': entry['source']['recording'],
        'seconds': round(t0 - 0.5 + best['i'] / FPS, 2),
        'frameRows': int(from_frame),
        'stitchedFrom': stitched_from if stitched_from is None else int(stitched_from),
        'height': int(len(out)),
        'barMatch': round(bar_score, 3),
        'joinMatch': None if join_score is None else round(join_score, 3),
        'barShift': int(bar_shift),
        'joinShift': int(shift),
    }
    return slug, out, info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slugs', nargs='*')
    ap.add_argument('--recordings', default='/mnt/user-data/uploads')
    args = ap.parse_args()
    data = json.load(open(os.path.join(BASE, 'os-protocols.json')))
    os.makedirs(OUT, exist_ok=True)
    index_path = os.path.join(OUT, 'frames.json')
    index = json.load(open(index_path)) if os.path.exists(index_path) else {}
    rec, t, _ = TAG_FROM
    ref = decode(os.path.join(args.recordings, rec), t - 0.02, t + 0.03)[0]
    ref_ev = np.array(Image.open(os.path.join(EV, TAG_FROM[2] + '.webp')).convert('RGB'))
    r = cv2.matchTemplate(lum(ref[30:260]), lum(ref_ev[TITLE[0]:TITLE[1], CARD]), cv2.TM_CCOEFF_NORMED)
    _, _, _, loc = cv2.minMaxLoc(r)
    ref_card = ref[loc[1] + 30 - TITLE[0]:, loc[0] - CARD.start:loc[0] - CARD.start + EV_W]
    tag = lum(ref_card[TAG_BOX])
    failed = []
    for entry in data:
        slug = os.path.basename(entry['evidence'])[:-5]
        if args.slugs and slug not in args.slugs:
            continue
        slug, img, info = clean_card(entry, args.recordings, tag)
        if img is None:
            failed.append((slug, info))
            index.pop(slug, None)
            if os.path.exists(os.path.join(OUT, slug + '.webp')):
                os.remove(os.path.join(OUT, slug + '.webp'))
            print(f'{slug}: skipped, {info}')
            continue
        Image.fromarray(img).save(os.path.join(OUT, slug + '.webp'), quality=92, method=6)
        index[slug] = info
        note = '' if info['barShift'] == info['joinShift'] else f"  (stitched card shifts {info['joinShift'] - info['barShift']} rows between bar and join)"
        print(f"{slug}: {info['frameRows']} rows from {info['seconds']} s, height {info['height']}, "
              f"bar {info['barMatch']}, join {info['joinMatch']}{note}")
    with open(index_path, 'w') as fh:
        json.dump(dict(sorted(index.items())), fh, indent=1)
        fh.write('\n')
    print(f'{len(index)} clean cards, {len(failed)} kept stitched')
    return 1 if failed and args.slugs else 0


if __name__ == '__main__':
    sys.exit(main())
