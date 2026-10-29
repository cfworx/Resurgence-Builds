#!/usr/bin/env python3
"""Make a post's featured image (1200 x 630) from one frame of a screen recording of the game.

The site only uses in-game pictures for posts (see CLAUDE.md). This takes one frame, crops it,
clears the bits of HUD left inside the crop, and can add the post's title in the same style as the
other guide heroes (white bold title, short orange bar, subtitle).

  python3 research/screenshots/make_hero.py research/screenshots/heroes.json [OUT_FILE_NAME ...]
  node scripts/build-post-images.mjs        (then makes the sized copies the site serves)

heroes.json lists every featured image made this way: the recording and second it came from, the
crop, what was cleared and the text added, so rerunning rebuilds them exactly. Recordings live in
the session uploads (they are too big for the repo); the frame time is enough to find the shot again.

Spec keys: out, video, t, crop [x, y, width] (height follows from 1600 x 840), clear [boxes], hud [[x0, y0,
x1, y1, colour]] (only that colour's pixels in the box: white, brightwhite, red, pink, orange, green), bar (false to skip
the health bar search), window, maxErr, title, subtitle, align, word.

Clearing HUD: crops are chosen to leave out the fixed HUD (minimap, menu icons, chat, skill bar, XP
bar). The player's orange health bar floats next to the agent, so it is found by its colour and
filled from the frames around it: the camera moves a little between frames, so the scenery behind
the bar in one frame is visible in another. Where no frame shows it, the gap is blended in from its
surroundings. Other boxes listed under "clear" (another player's name tag, say) are handled the
same way.
"""

import json
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VIDEO_DIRS = ['/mnt/user-data/uploads', '/mnt/user-data/attachments']
OUT_W, OUT_H = 1600, 840  # masters; scripts/build-post-images.mjs makes the 480 to 1600 px copies
FW, FH = 2560, 1440
FONT_BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
ORANGE = (241, 105, 32)


def find_video(name):
    for d in VIDEO_DIRS:
        for root, _, files in os.walk(d):
            for f in files:
                if f == name or f.endswith('-' + name):
                    return os.path.join(root, f)
    raise SystemExit(f'recording not found: {name}')


def frames(video, t0, t1, fps=10):
    cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-ss', f'{max(0, t0):.2f}', '-t', f'{t1 - max(0, t0):.2f}',
           '-i', video, '-vf', f'fps={fps}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    size = FW * FH * 3
    k = 0
    try:
        while True:
            b = p.stdout.read(size)
            if len(b) < size:
                break
            yield max(0, t0) + k / fps, np.frombuffer(b, np.uint8).reshape(FH, FW, 3)
            k += 1
    finally:
        p.stdout.close()
        p.wait()


def bar_mask(f):
    """The player's health bar: a flat block of pure HUD orange (254, 107, 0), about 400 x 50 px,
    sometimes tilted. Matched on that exact colour and shape so orange scenery (taxis, signs,
    explosions) is never touched."""
    a = f.astype(np.int16)
    org = (a[..., 0] > 225) & (a[..., 1] > 80) & (a[..., 1] < 135) & (a[..., 2] < 60)
    n, lab, st, _ = cv2.connectedComponentsWithStats(org.astype(np.uint8), 8)
    m = np.zeros(f.shape[:2], np.uint8)
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if area < 6000 or y > FH - 60:  # the XP bar along the bottom edge is left alone
            continue
        pts = np.column_stack(np.where(lab == i))[:, ::-1].astype(np.float32)
        (_, _), (rw, rh), _ = cv2.minAreaRect(pts)
        long, short = max(rw, rh), min(rw, rh)
        if 280 <= long <= 480 and 35 <= short <= 70 and area / max(1.0, rw * rh) > 0.65:
            cv2.fillConvexPoly(m, cv2.convexHull(pts.astype(np.int32)), 255)
    return cv2.dilate(m, np.ones((15, 15), np.uint8))


HUD_COLOURS = {
    # HUD pieces drawn in one flat colour, so only their own pixels are replaced, not the box around them
    'white': lambda a: (a.min(axis=2) > 185) & (a.max(axis=2) - a.min(axis=2) < 45),
    'brightwhite': lambda a: a.min(axis=2) > 228,  # reticles and markers over snow, which is a duller white
    'red': lambda a: (a[..., 0] > 150) & (a[..., 1] < 95) & (a[..., 2] < 110),
    'pink': lambda a: (a[..., 0] > 190) & (a[..., 1] > 100) & (a[..., 1] < 200) & (a[..., 2] > 130),
    'orange': lambda a: (a[..., 0] > 200) & (a[..., 1] > 70) & (a[..., 1] < 160) & (a[..., 2] < 80),
    'green': lambda a: (a[..., 1] > 150) & (a[..., 0] < 120) & (a[..., 2] < 120),
}


def hud_mask(f, hud):
    """hud: [[x0, y0, x1, y1, colour], ...] -> the pixels of that colour inside each box, grown by 3 px."""
    m = np.zeros(f.shape[:2], np.uint8)
    a = f.astype(np.int16)
    for x0, y0, x1, y1, colour in hud:
        sel = HUD_COLOURS[colour](a[y0:y1, x0:x1])
        m[y0:y1, x0:x1][sel] = 255
    return cv2.dilate(m, np.ones((7, 7), np.uint8))


def clear(video, t, f, boxes, auto_bar, window=2.0, max_err=60, crop=None, hud=()):
    target = f.copy()
    mask = bar_mask(f) if auto_bar else np.zeros(f.shape[:2], np.uint8)
    for (x0, y0, x1, y1) in boxes:
        mask[y0:y1, x0:x1] = 255
    if hud:
        mask = np.maximum(mask, hud_mask(f, hud))
        boxes = list(boxes) + [tuple(h[:4]) for h in hud]  # never take fill pixels from those spots in other frames
    if crop is not None:  # only what ends up in the picture needs clearing
        cx0, cy0, cx1, cy1 = crop
        keep = np.zeros_like(mask)
        keep[max(0, cy0 - 20):cy1 + 20, max(0, cx0 - 20):cx1 + 20] = 1
        mask = mask * keep
    if not mask.any():
        return target, 'nothing to clear'
    todo = mask > 0
    filled = np.zeros_like(todo)
    out = target.astype(np.float32)
    g0 = cv2.cvtColor(f, cv2.COLOR_RGB2GRAY).astype(np.float32)
    ys, xs = np.where(todo)
    by0, by1, bx0, bx1 = max(0, ys.min() - 120), min(FH, ys.max() + 120), max(0, xs.min() - 160), min(FW, xs.max() + 160)
    ring = cv2.dilate(mask, np.ones((61, 61), np.uint8)) > 0
    ring &= ~todo
    used = []
    for tt, g in frames(video, t - window, t + window, fps=10):
        if abs(tt - t) < 0.05 or todo[filled].all() and filled[todo].all():
            continue
        gm = bar_mask(g)
        for (x0, y0, x1, y1) in boxes:
            gm[y0:y1, x0:x1] = 255
        # how the scenery moved between the two frames, measured on the area around the gap
        gg = cv2.cvtColor(g, cv2.COLOR_RGB2GRAY).astype(np.float32)
        best = None
        tmpl = g0[by0:by1, bx0:bx1]
        tm = (ring[by0:by1, bx0:bx1]).astype(np.float32)
        S = 140
        sy0, sy1, sx0, sx1 = max(0, by0 - S), min(FH, by1 + S), max(0, bx0 - S), min(FW, bx1 + S)
        area = gg[sy0:sy1, sx0:sx1]
        if area.shape[0] < tmpl.shape[0] or area.shape[1] < tmpl.shape[1] or tm.sum() < 500:
            continue
        r = cv2.matchTemplate(area, tmpl, cv2.TM_SQDIFF, mask=tm)
        _, _, loc, _ = cv2.minMaxLoc(r)
        dx, dy = sx0 + loc[0] - bx0, sy0 + loc[1] - by0
        err = float(r[loc[1], loc[0]]) / float(tm.sum())
        if err > max_err or (dx == 0 and dy == 0):
            continue
        # pixels of the gap that this frame shows clean (its own bar is somewhere else)
        Y, X = ys + dy, xs + dx
        ok = (Y >= 0) & (Y < FH) & (X >= 0) & (X < FW)
        ok[ok] &= gm[Y[ok], X[ok]] == 0
        ok &= ~filled[ys, xs]
        if ok.sum() == 0:
            continue
        out[ys[ok], xs[ok]] = g[Y[ok], X[ok]]
        filled[ys[ok], xs[ok]] = True
        used.append((round(tt, 1), int(dx), int(dy), round(err, 1)))
        if filled[todo].all():
            break
    res = np.clip(out, 0, 255).astype(np.uint8)
    rest = (todo & ~filled).astype(np.uint8) * 255
    if rest.any():
        # What no other frame shows is rebuilt from the texture around it (OpenCV's frequency
        # selective reconstruction: it continues edges and patterns instead of smearing them).
        n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(rest, np.ones((5, 5), np.uint8)), 8)
        for i in range(1, n):
            x, y, w, h, _ = st[i]
            x0, y0, x1, y1 = max(0, x - 90), max(0, y - 90), min(FW, x + w + 90), min(FH, y + h + 90)
            hole = (lab[y0:y1, x0:x1] == i)
            src = cv2.cvtColor(res[y0:y1, x0:x1], cv2.COLOR_RGB2BGR)
            dst = np.zeros_like(src)
            cv2.xphoto.inpaint(src, np.where(hole, 0, 255).astype(np.uint8), dst, cv2.xphoto.INPAINT_FSR_FAST)
            patch = cv2.cvtColor(dst, cv2.COLOR_BGR2RGB)
            res[y0:y1, x0:x1][hole] = patch[hole]
    # soften the seam
    edge = cv2.dilate(mask, np.ones((9, 9), np.uint8)) - cv2.erode(mask, np.ones((9, 9), np.uint8))
    blur = cv2.GaussianBlur(res, (5, 5), 0)
    res[edge > 0] = blur[edge > 0]
    share = round(float(filled[todo].mean()), 2)
    return res, {'fromFrames': share, 'frames': used[:6], 'blended': round(1 - share, 2)}


def draw_text(img, title, subtitle, align='left'):
    if align == 'right':  # draw on the mirror image, then mirror back (text is drawn the right way round below)
        flipped = draw_text_layers(img.transpose(Image.FLIP_LEFT_RIGHT), title, subtitle, shade_only=True)
        return draw_text_layers(flipped.transpose(Image.FLIP_LEFT_RIGHT), title, subtitle, text_right=True, no_shade=True)
    return draw_text_layers(img, title, subtitle)


def draw_text_layers(img, title, subtitle, shade_only=False, text_right=False, no_shade=False):
    im = img.convert('RGBA')
    W, H = im.size
    k = W / 1200  # sizes below are for a 1200 px wide image
    shade = Image.new('L', (W, H), 0)
    sd = ImageDraw.Draw(shade)
    for x in range(W):
        a = max(0.0, 1 - x / (W * 0.75))
        sd.line([(x, 0), (x, H)], fill=int(165 * a ** 1.5))
    if not no_shade:
        im = Image.composite(Image.new('RGBA', (W, H), (8, 10, 12, 255)), im, shade)
    if shade_only:
        return im.convert('RGB')
    x = int(64 * k)
    size = int(96 * k)
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(FONT_BOLD, size)
    lines = [title.upper()]
    if d.textlength(lines[0], font=font) > W * 0.62:
        words = title.upper().split()
        best = None
        for j in range(1, len(words)):
            a, b = ' '.join(words[:j]), ' '.join(words[j:])
            wmax = max(d.textlength(a, font=font), d.textlength(b, font=font))
            if best is None or wmax < best[0]:
                best = (wmax, [a, b])
        lines = best[1] if best else lines
    while max(d.textlength(ln, font=font) for ln in lines) > W * 0.7 and size > 56 * k:
        size -= 4
        font = ImageFont.truetype(FONT_BOLD, size)
    sub_font = ImageFont.truetype(FONT_BOLD, int(30 * k))
    line_h = int(size * 1.04)
    block = line_h * len(lines) + int(34 * k) + (int(44 * k) if subtitle else 0)
    y = int(H * 0.5 - block / 2)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    def left(text, f):  # x of a line: from the left edge, or right-aligned against the right edge
        return W - x - d.textlength(text, font=f) if text_right else x
    for i, ln in enumerate(lines):
        ld.text((left(ln, font), y + i * line_h), ln, font=font, fill=(255, 255, 255, 255))
    bar_y = y + line_h * len(lines) + int(16 * k)
    bx = W - x - int(120 * k) if text_right else x
    ld.rectangle([bx, bar_y, bx + int(120 * k), bar_y + int(7 * k)], fill=ORANGE + (255,))
    if subtitle:
        ld.text((left(subtitle, sub_font), bar_y + int(24 * k)), subtitle, font=sub_font, fill=(232, 234, 236, 255))
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow.putalpha(layer.split()[3].filter(ImageFilter.GaussianBlur(6 * k)).point(lambda v: int(v * 0.8)))
    im = Image.alpha_composite(im, Image.alpha_composite(shadow, layer))
    return im.convert('RGB')


def frame_size(video):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                          '-of', 'csv=p=0', video], capture_output=True, text=True, check=True).stdout
    w, h = out.strip().split(',')[:2]
    return int(w), int(h)


def make(spec):
    global FW, FH
    video = find_video(spec['video'])
    FW, FH = frame_size(video)  # most recordings are 2560 x 1440; the October 28 phone ones are 2340 x 1080
    t = float(spec['t'])
    x, y, w = spec['crop']
    h = int(round(w * OUT_H / OUT_W))
    if x < 0 or y < 0 or x + w > FW or y + h > FH:
        raise SystemExit(f"{spec['out']}: crop {spec['crop']} runs off the frame")
    f = next(frames(video, t, t + 0.15))[1]
    img, report = clear(video, t, f, [tuple(b) for b in spec.get('clear', [])], spec.get('bar', True),
                        window=spec.get('window', 2.0), max_err=spec.get('maxErr', 60), crop=(x, y, x + w, y + h),
                        hud=spec.get('hud', ()))
    out = Image.fromarray(img[y:y + h, x:x + w]).resize((OUT_W, OUT_H), Image.LANCZOS)
    if spec.get('word'):
        out = replace_word(out, spec)
    if spec.get('title'):
        out = draw_text(out, spec['title'], spec.get('subtitle'), spec.get('align', 'left'))
    path = os.path.join(ROOT, spec['out'])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, quality=90, method=6)
    print(f"{spec['out']}: {os.path.getsize(path) // 1024} KB, {report}")
    return report


def replace_word(img, spec):
    """Swap one word on a sign or poster for another (for the occasional in-game meme).

    spec['word'] = {"quad": [[x, y] top-left, top-right, bottom-right, bottom-left of the old word's
    letters in the output image], "text": "BUGS", "align": "left" | "center"}

    The old letters are painted over with the sign's own colour (a smooth fit of the background
    around them plus its grain), and the new word is drawn at the same letter height, on the same
    slant and perspective, in the colour of the old letters, then softened to the same blur."""
    w = spec['word']
    quad = np.array(w['quad'], np.float32)
    a = np.array(img).astype(np.float32)
    H, W = a.shape[:2]
    pad = 8
    x0, y0 = int(quad[:, 0].min()) - pad, int(quad[:, 1].min()) - pad
    x1, y1 = int(quad[:, 0].max()) + pad, int(quad[:, 1].max()) + pad
    reg = a[y0:y1, x0:x1]
    rh, rw = reg.shape[:2]
    inside = np.zeros((rh, rw), np.uint8)
    q = quad - [x0, y0]
    grown = q + np.array([[-4, -4], [4, -4], [4, 4], [-4, 4]], np.float32)
    cv2.fillConvexPoly(inside, grown.astype(np.int32), 1)
    L = reg.mean(axis=2)
    vals = L[inside > 0].astype(np.uint8)
    thr, _ = cv2.threshold(vals.reshape(-1, 1), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    letters = (inside > 0) & (L > thr)
    ink = np.percentile(reg[letters], w.get('inkPercentile', 97), axis=0)
    hole = cv2.dilate(letters.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    hole &= inside > 0
    band = (inside > 0) & ~cv2.dilate(letters.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
    yy, xx = np.mgrid[0:rh, 0:rw]
    A = np.column_stack([np.ones(band.sum()), xx[band], yy[band]])
    fill = np.zeros_like(reg)
    rng = np.random.default_rng(7)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, reg[..., c][band], rcond=None)
        model = coef[0] + coef[1] * xx + coef[2] * yy
        sd = float(np.std(reg[..., c][band] - (A @ coef)))
        fill[..., c] = model + cv2.GaussianBlur(rng.normal(0, sd, (rh, rw)).astype(np.float32), (3, 3), 0)
    soft = cv2.GaussianBlur(hole.astype(np.float32), (5, 5), 0)
    reg = reg * (1 - soft[..., None]) + fill * soft[..., None]
    # the new word, rendered big, then warped onto the old word's slant and perspective
    text = w['text']
    font = ImageFont.truetype(w.get('font', '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf'), 400)
    probe = Image.new('L', (400 * (len(text) + 2), 700), 0)
    ImageDraw.Draw(probe).text((200, 100), text, font=font, fill=255)
    glyph = np.array(probe.crop(probe.getbbox())).astype(np.float32) / 255
    gh, gw = glyph.shape
    tl, tr, br, bl = q
    left_h = float(np.hypot(*(bl - tl)))
    right_h = float(np.hypot(*(br - tr)))
    span = float(np.hypot(*(tr - tl)))
    width = gw * (left_h + right_h) / 2 / gh  # natural width at the word's letter height
    width = min(width, span)
    start = 0.0 if w.get('align', 'center') == 'left' else (span - width) / 2
    f0, f1 = start / span, (start + width) / span
    def along(p0, p1, t):
        return p0 + (p1 - p0) * t
    dst = np.array([along(tl, tr, f0), along(tl, tr, f1), along(bl, br, f1), along(bl, br, f0)], np.float32)
    S = 4  # draw at 4x and shrink, for clean edges
    M = cv2.getPerspectiveTransform(np.array([[0, 0], [gw, 0], [gw, gh], [0, gh]], np.float32), dst * S)
    big = cv2.warpPerspective(glyph, M, (rw * S, rh * S), flags=cv2.INTER_LINEAR)
    alpha = cv2.resize(big, (rw, rh), interpolation=cv2.INTER_AREA)
    alpha = cv2.GaussianBlur(alpha, (0, 0), w.get('blur', 0.9)) * w.get('opacity', 0.95)
    reg = reg * (1 - alpha[..., None]) + ink * alpha[..., None]
    a[y0:y1, x0:x1] = reg
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


if __name__ == '__main__':
    specs = json.load(open(sys.argv[1]))
    only = set(sys.argv[2:])
    for s in specs:
        if only and os.path.basename(s['out']) not in only:
            continue
        make(s)
