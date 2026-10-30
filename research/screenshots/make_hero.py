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
the health bar search), window, maxErr, title, subtitle, align, titleY (where the middle of the title block sits, as a
share of the height: 0.5 by default, lower to lift it off faces), word, n95 (a face mask drawn on, see draw_n95).

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
from scipy.interpolate import splprep, splev

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


def smooth_closed(pts, n=600):
    p = np.array(pts, np.float64)
    tck, _ = splprep([p[:, 0], p[:, 1]], s=len(p) * 2.0, per=True)
    x, y = splev(np.linspace(0, 1, n, endpoint=False), tck)
    return np.column_stack([x, y])


def smooth_open(pts, n=300):
    p = np.array(pts, np.float64)
    tck, _ = splprep([p[:, 0], p[:, 1]], s=len(p) * 1.0, k=min(3, len(p) - 1))
    x, y = splev(np.linspace(0, 1, n), tck)
    return np.column_stack([x, y])


def fill_aa(shape, poly, ss=4):
    """Anti-aliased polygon fill (0..1), drawn at ss x and averaged down."""
    H, W = shape
    big = np.zeros((H * ss, W * ss), np.uint8)
    cv2.fillPoly(big, [np.round(poly * ss).astype(np.int32)], 255, lineType=cv2.LINE_AA)
    return cv2.resize(big, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255


def draw_n95(frame, spec, seed=11):
    """Put an N95 cup mask on a face (for the occasional in-game meme; used on the Super Spreader post).

    spec['n95'] is in frame pixels: outline (points around the mask, smoothed into a closed curve),
    keepAbove (a line, usually the bottom of goggles or glasses, above which the original pixels stay in
    front of the mask), light (direction [x right, y down, z towards the camera]), lit and ambient
    colours (match the scene: the lit side of a white surface and its shadow), depth, straps (short
    runs from the sides that fade out where they go behind the head) and an optional valve. The cup is
    shaded from a height field (a dome that rises at the rim), with a soft contact shadow on the skin,
    non-woven grain, and the frame's own softness."""
    a = frame.astype(np.float32)
    H, W = a.shape[:2]
    outline = smooth_closed(spec['outline'])
    pad = 60
    x0, y0 = int(outline[:, 0].min()) - pad, int(outline[:, 1].min()) - pad
    x1, y1 = int(outline[:, 0].max()) + pad, int(outline[:, 1].max()) + pad
    reg = a[y0:y1, x0:x1].copy()
    rh, rw = reg.shape[:2]
    poly = outline - [x0, y0]
    alpha = fill_aa((rh, rw), poly)
    inside = (alpha > 0.5).astype(np.uint8)
    D = cv2.distanceTransform(inside, cv2.DIST_L2, 5)
    Dout = cv2.distanceTransform(1 - inside, cv2.DIST_L2, 5)
    Dmax = float(D.max())
    # height: a dome that rises steeply at the rim and is rounded in the middle
    z = np.sqrt(np.clip(D * (2 * Dmax - D), 0, None))
    z = cv2.GaussianBlur(z, (0, 0), spec.get('smooth', 10))
    depth = spec.get('depth', 0.9)
    gx = cv2.Sobel(z, cv2.CV_32F, 1, 0, ksize=5) / 32.0 * depth
    gy = cv2.Sobel(z, cv2.CV_32F, 0, 1, ksize=5) / 32.0 * depth
    n = np.dstack([-gx, -gy, np.ones_like(z)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    L = np.array(spec.get('light', [0.45, -0.55, 0.7]), np.float32)
    L /= np.linalg.norm(L)
    ndl = (n @ L)
    wrap = spec.get('wrap', 0.35)
    diff = np.clip((ndl + wrap) / (1 + wrap), 0, 1)
    lit = np.array(spec.get('lit', [206, 212, 208]), np.float32)
    amb = np.array(spec.get('ambient', [86, 94, 98]), np.float32)
    col = amb + (lit - amb) * diff[..., None]
    # the rim curls away: darker right at the edge, a faint molded lip just inside it
    ao = 1 - 0.32 * np.exp(-D / 5.0)
    lip = 1 + 0.05 * np.exp(-((D - 9.0) ** 2) / 8.0) - 0.04 * np.exp(-((D - 15.0) ** 2) / 10.0)
    col *= (ao * lip)[..., None]
    # non-woven texture: fine grain plus soft mottling
    rng = np.random.default_rng(seed)
    g1 = cv2.GaussianBlur(rng.normal(0, 1, (rh, rw)).astype(np.float32), (0, 0), 0.8) * spec.get('grain', 7.0)
    g2 = cv2.GaussianBlur(rng.normal(0, 1, (rh, rw)).astype(np.float32), (0, 0), 5) * spec.get('mottle', 10.0)
    col += (g1 + g2)[..., None]
    # valve (optional): a round cover with a ring and slots
    v = spec.get('valve')
    if v:
        cx, cy, r = v['x'] - x0, v['y'] - y0, v['r']
        yy, xx = np.mgrid[0:rh, 0:rw].astype(np.float32)
        # slightly squashed by the cup's curve
        dd = np.sqrt(((xx - cx) / r) ** 2 + ((yy - cy) / (r * v.get('squash', 0.92))) ** 2)
        cover = np.clip((1 - dd) * r / 1.5, 0, 1)
        vcol = np.array(v.get('colour', [150, 156, 158]), np.float32)
        # its own little dome, lit the same way
        vz = np.sqrt(np.clip(1 - dd ** 2, 0, 1))
        vgx = cv2.Sobel(vz, cv2.CV_32F, 1, 0, ksize=3) * r * 0.25
        vgy = cv2.Sobel(vz, cv2.CV_32F, 0, 1, ksize=3) * r * 0.25
        vn = np.dstack([-vgx, -vgy, np.ones_like(vz) * 8])
        vn /= np.linalg.norm(vn, axis=2, keepdims=True)
        vd = np.clip(((vn @ L) + 0.3) / 1.3, 0, 1)
        vshade = vcol * (0.55 + 0.6 * vd)[..., None]
        ring = np.exp(-((dd - 0.86) ** 2) / 0.004)
        vshade *= (1 - 0.35 * ring)[..., None]
        # slots: horizontal dark bars in the middle
        slots = np.zeros_like(dd)
        for k in range(-2, 3):
            sy = cy + k * r * 0.22
            band = np.exp(-((yy - sy) ** 2) / (r * 0.035) ** 2) * (np.abs(xx - cx) < r * 0.5 * np.sqrt(max(0.0, 1 - (k * 0.22) ** 2)))
            slots = np.maximum(slots, band)
        vshade *= (1 - 0.45 * slots * (dd < 0.7))[..., None]
        # contact shadow around the cover on the mask
        sh = np.exp(-np.clip(dd - 1, 0, None) * r / 4.0) * (dd > 1)
        col *= (1 - 0.25 * sh)[..., None]
        col = col * (1 - cover[..., None]) + vshade * cover[..., None]
    col = np.clip(col, 0, 255)
    # straps: short visible runs from the sides into the hood
    for s in spec.get('straps', []):
        line = smooth_open(s['points'], 120) - [x0, y0]
        sm = np.zeros((rh * 4, rw * 4), np.uint8)
        cv2.polylines(sm, [np.round(line * 4).astype(np.int32)], False, 255, thickness=int(s.get('width', 5) * 4), lineType=cv2.LINE_AA)
        sm = cv2.resize(sm, (rw, rh), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        # fade towards the end that goes behind the head
        fade = np.ones_like(sm)
        if s.get('fadeTo'):
            fx, fy = s['fadeTo'][0] - x0, s['fadeTo'][1] - y0
            yy, xx = np.mgrid[0:rh, 0:rw].astype(np.float32)
            dist = np.sqrt((xx - fx) ** 2 + (yy - fy) ** 2)
            fade = np.clip(dist / s.get('fadeLen', 14.0), 0, 1)
        scol = np.array(s.get('colour', [150, 160, 166]), np.float32)
        sm = sm * fade * s.get('opacity', 0.95)
        # strap casts a thin shadow below itself
        shadow = cv2.GaussianBlur(np.roll(sm, 2, axis=0), (0, 0), 1.5) * 0.35
        reg = reg * (1 - shadow[..., None])
        reg = reg * (1 - sm[..., None]) + scol * sm[..., None]
    # contact shadow on the skin around the mask
    occl = np.exp(-Dout / 4.5) * (1 - inside)
    reg = reg * (1 - 0.35 * occl[..., None])
    # composite the mask, softened to the frame's own sharpness
    col = cv2.GaussianBlur(col, (0, 0), spec.get('soften', 0.7))
    al = cv2.GaussianBlur(alpha, (0, 0), 0.6)[..., None]
    out = reg * (1 - al) + col * al
    # what sits in front of the mask (goggle rim): keep the original pixels above that line
    keep = spec.get('keepAbove')
    if keep:
        line = smooth_open(keep, 200) - [x0, y0]
        polyk = np.vstack([line, [[line[-1, 0], -10], [line[0, 0], -10]]])
        ka = fill_aa((rh, rw), polyk)
        ka = cv2.GaussianBlur(ka, (0, 0), 0.7)[..., None]
        out = out * (1 - ka) + a[y0:y1, x0:x1] * ka
    a[y0:y1, x0:x1] = out
    return np.clip(a, 0, 255).astype(np.uint8)


def draw_text(img, title, subtitle, align='left', title_y=0.5):
    if align == 'right':  # draw on the mirror image, then mirror back (text is drawn the right way round below)
        flipped = draw_text_layers(img.transpose(Image.FLIP_LEFT_RIGHT), title, subtitle, shade_only=True)
        return draw_text_layers(flipped.transpose(Image.FLIP_LEFT_RIGHT), title, subtitle, text_right=True, no_shade=True,
                                title_y=title_y)
    return draw_text_layers(img, title, subtitle, title_y=title_y)


def draw_text_layers(img, title, subtitle, shade_only=False, text_right=False, no_shade=False, title_y=0.5):
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
    y = int(H * title_y - block / 2)
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
    if spec.get('n95'):
        img = draw_n95(img, spec['n95'])
    out = Image.fromarray(img[y:y + h, x:x + w]).resize((OUT_W, OUT_H), Image.LANCZOS)
    if spec.get('word'):
        out = replace_word(out, spec)
    if spec.get('title'):
        out = draw_text(out, spec['title'], spec.get('subtitle'), spec.get('align', 'left'), spec.get('titleY', 0.5))
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
