/* ============================================================
   DESIGN AUDIT: mobile and layout checks across every template
   ------------------------------------------------------------
   Runs the browser checks from the responsive design guide (overflow, text sizes, tap targets, line length,
   near-miss edges, focus under sticky bars, contrast, floating headings, breakpoints) plus header height,
   fine-print share, first-screen images, button heights and spacing, on a built copy of the site.

   It is a developer tool, not part of the build. It needs Playwright (with Chromium) installed.

     npm run build
     npx http-server dist -p 4399 -s &
     NODE_PATH=$(npm root -g) node scripts/design-audit.cjs                 # full run, writes design-audit.json
     NODE_PATH=$(npm root -g) node scripts/design-audit.cjs --quick         # 390 and 1440 only
     NODE_PATH=$(npm root -g) node scripts/design-audit.cjs --pages home,map --sweep

   Options: --base <url> (default http://localhost:4399), --out <file>, --pages <labels>, --quick,
   --sweep (overflow and header rows from 300 to 1940px in 10px steps), --verbose (print every finding).
   ============================================================ */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf('--' + name); return i === -1 ? dflt : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const BASE = opt('base', 'http://localhost:4399');
const OUT = opt('out', 'design-audit.json');
const QUICK = !!opt('quick', false);
const SWEEP = !!opt('sweep', false);
const VERBOSE = !!opt('verbose', false);
const ONLY = opt('pages', '') ? String(opt('pages', '')).split(',') : null;

// label, path, kind ('content' pages are held to the fine-print rule; 'listing' and 'app' pages are not)
const PAGES = [
  ['home', '/', 'listing'],
  ['builds', '/builds/', 'listing'],
  ['build-long', '/builds/tactical-pharma-800k-dps-rank-1-global-build/', 'content'],
  ['build-new', '/builds/tactical-pharma-season-2-build-ggreborn/', 'content'],
  ['tier-list', '/tier-list/', 'listing'],
  ['tier-os', '/tier-list/os-protocols/', 'listing'],
  ['class', '/class/field-medic/', 'listing'],
  ['guides', '/guides/', 'listing'],
  ['guide-long', '/guides/division-resurgence-exotic-weapons-list-2026/', 'content'],
  ['guide-short', '/guides/division-resurgence-error-6000010/', 'content'],
  ['guide-os', '/guides/best-os-protocol/', 'content'],
  ['news', '/news/', 'listing'],
  ['news-post', '/news/reddit-weekly-highlights-october-24/', 'content'],
  ['patch-index', '/patch-notes/', 'listing'],
  ['patch-post', '/patch-notes/season-2-phase-2/', 'content'],
  ['db-index', '/database/', 'listing'],
  ['db-weapons', '/database/weapons/', 'listing'],
  ['db-weapon', '/database/weapons/acr/', 'content'],
  ['db-exotics', '/database/exotic-weapons/', 'listing'],
  ['db-exotic', '/database/exotic-weapons/lady-death/', 'content'],
  ['db-os', '/database/os-protocols/', 'listing'],
  ['db-os-detail', '/database/os-protocols/brains-over-brawn/', 'content'],
  ['db-mods', '/database/skill-mod-combos/', 'listing'],
  ['db-mod', '/database/skill-mod-combos/accelerated-deployment/', 'content'],
  ['db-drops', '/database/drop-rates/', 'listing'],
  ['db-bonus', '/database/bonus-attributes/', 'listing'],
  ['db-sets', '/database/gear-set-effects/', 'listing'],
  ['db-set', '/database/gear-set-effects/boom-shakalaka/', 'content'],
  ['db-talents', '/database/weapon-talents/', 'listing'],
  ['db-talent', '/database/weapon-talents/adaptation/', 'content'],
  ['db-gear', '/database/gear/', 'listing'],
  ['db-armor', '/database/body-armor-talents/', 'listing'],
  ['tag', '/tag/field-medic/', 'listing'],
  ['author', '/author/rapidf5/', 'content'],
  ['about', '/about/', 'content'],
  ['contact', '/contact/', 'content'],
  ['privacy', '/privacy/', 'content'],
  ['sitemap', '/sitemap/', 'listing'],
  ['404', '/this-page-does-not-exist/', 'content'],
  ['map', '/division-resurgence-interactive-map/', 'app'],
  ['builder', '/builder/', 'app'],
].filter(([label]) => !ONLY || ONLY.includes(label));

const PHONES = QUICK ? [390] : [320, 360, 375, 390, 414, 430];
const TABLETS = QUICK ? [] : [768, 820, 834, 1024];
const DESKTOPS = QUICK ? [1440] : [1280, 1366, 1440, 1536, 1920];

/* ---------- In-page checks (adapted from the guide's section 7) ---------- */
const CHECKS = String.raw`
window.__audit = (() => {
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + [...el.classList].slice(0, 3).map(c => '.' + c).join('');
  const where = el => { const parts = []; for (let a = el, i = 0; a && a !== document.body && i < 4; a = a.parentElement, i++) parts.unshift(name(a)); return parts.join(' > '); };
  // (the inside of a closed <details> still reports a size, but nobody can see or tap it)
  const shown = el => { if (el.closest('details:not([open]) > :not(summary)')) return false; const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width >= 2 && r.height >= 2 && s.visibility !== 'hidden' && +s.opacity > 0; };

  function overflow() {
    const vw = document.documentElement.clientWidth, undo = [], rows = [];
    const plain = s => s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.backgroundImage === 'none' && parseFloat(s.borderLeftWidth) === 0;
    for (const el of [document.documentElement, document.body, ...document.body.querySelectorAll('*')]) {
      const s = getComputedStyle(el);
      if ((s.overflowX === 'hidden' || s.overflowX === 'clip') && el.getBoundingClientRect().width >= vw * 0.9 && (el === document.documentElement || el === document.body || plain(s))) {
        undo.push([el, el.style.overflowX]); el.style.overflowX = 'visible';
      }
    }
    const pinnedOrScrolling = el => {
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.position === 'fixed' || (a !== el && (s.overflowX === 'auto' || s.overflowX === 'scroll'))) return true;
      }
      return false;
    };
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      if (r.width < 1 || s.visibility === 'hidden' || pinnedOrScrolling(el)) continue;
      if (el.closest('.leaflet-container, svg, .os-disclaimer__diamonds')) continue;
      const text = (el.innerText || '').trim().slice(0, 40);
      // clipped on purpose by a box of its own (a card hiding its blurred background art) is not page overflow
      const clippedBy = () => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const st = getComputedStyle(a); if (/(hidden|clip)/.test(st.overflowX) && a.getBoundingClientRect().right <= vw + 1) return true; } return false; };
      if (r.right > vw + 1 && ![...el.children].some(k => k.getBoundingClientRect().right > vw + 1) && !clippedBy()) {
        rows.push({ problem: 'past the screen edge', by: Math.round(r.right - vw), where: where(el), text });
      } else if (s.overflowX === 'visible' && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2 && ![...el.children].some(k => k.scrollWidth > k.clientWidth + 2)) {
        // only count it when something visible actually sticks out (closed dropdown menus are hidden)
        const right = r.left + el.clientWidth + 2;
        const visibleOut = [...el.querySelectorAll('*')].some(k => { const q = k.getBoundingClientRect(), ks = getComputedStyle(k); return q.right > right && q.width > 0 && ks.visibility !== 'hidden' && +ks.opacity > 0; })
          || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() && (() => { const rg = document.createRange(); rg.selectNodeContents(n); return [...rg.getClientRects()].some(q => q.right > right); })());
        if (visibleOut) rows.push({ problem: 'text wider than its own box', by: el.scrollWidth - el.clientWidth, where: where(el), text });
      }
    }
    const docOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    undo.forEach(([el, v]) => { el.style.overflowX = v; });
    return { rows, docOverflow, clipped: undo.length };
  }

  function textSizes() {
    const root = document.querySelector('main') || document.body, sizes = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const text = node.textContent.trim(), el = node.parentElement;
      if (!text || !el || el.closest('script, style, noscript, .leaflet-container svg')) continue;
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      if (r.width < 2 || r.height < 2 || s.visibility === 'hidden' || +s.opacity === 0) continue;
      const px = Math.round(parseFloat(s.fontSize) * 10) / 10;
      const row = sizes.get(px) || { size: px, characters: 0, example: '' };
      row.characters += text.length;
      if (!row.example) row.example = name(el) + ': ' + text.slice(0, 30);
      sizes.set(px, row);
    }
    return [...sizes.values()].sort((a, b) => a.size - b.size);
  }

  function tapTargets() {
    const inSentence = el => {
      const block = el.closest('p, li, td, dd, figcaption, label');
      return el.tagName === 'A' && getComputedStyle(el).display === 'inline' && !!block && block.innerText.trim().length > el.innerText.trim().length + 10;
    };
    const targets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])')]
      .filter(el => shown(el) && !inSentence(el) && !el.closest('.leaflet-marker-pane'));
    const stretched = el => {
      // the stretched-link pattern: an absolutely positioned ::after that covers the whole card
      const a = getComputedStyle(el, '::after');
      if (a.content === 'none' || a.position !== 'absolute' || getComputedStyle(el).position !== 'static') return null;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position !== 'static') return p.getBoundingClientRect();
      return null;
    };
    const grown = el => {
      // a tap area grown with an invisible pseudo-element on the element itself (e.g. ::before { inset: -6px 0 })
      if (getComputedStyle(el).position === 'static') return null;
      const r = el.getBoundingClientRect(), px = v => (/px$/.test(v) ? parseFloat(v) : NaN);
      for (const pe of ['::before', '::after']) {
        const s = getComputedStyle(el, pe);
        if (s.content === 'none' || s.position !== 'absolute') continue;
        const [t, rt, b, l] = [s.top, s.right, s.bottom, s.left].map(px);
        if ([t, rt, b, l].some(Number.isNaN) || (t >= 0 && rt >= 0 && b >= 0 && l >= 0)) continue;
        const left = Math.min(r.left, r.left + l), top = Math.min(r.top, r.top + t), right = Math.max(r.right, r.right - rt), bottom = Math.max(r.bottom, r.bottom - b);
        return { left, top, right, bottom, width: right - left, height: bottom - top };
      }
      return null;
    };
    const viaLabel = el => (el.matches('input[type=checkbox], input[type=radio]') && el.closest('label')) ? el.closest('label').getBoundingClientRect() : null;
    const box = new Map(targets.map(el => [el, grown(el) || stretched(el) || viaLabel(el) || el.getBoundingClientRect()]));
    const small = r => r.width < 24 || r.height < 24;
    const centre = r => [r.left + r.width / 2, r.top + r.height / 2];
    const distanceToBox = ([x, y], r) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
    const crowded = el => {
      const c = centre(box.get(el));
      return targets.some(other => {
        if (other === el || other.contains(el) || el.contains(other)) return false;
        const q = box.get(other);
        return small(q) ? Math.hypot(c[0] - centre(q)[0], c[1] - centre(q)[1]) < 24 : distanceToBox(c, q) < 12;
      });
    };
    const rows = [];
    for (const el of targets) {
      const r = box.get(el), issues = [];
      let level = '';
      if (small(r)) { level = crowded(el) ? 'fail' : 'small'; issues.push(level === 'fail' ? 'under 24px and crowded (WCAG 2.5.8)' : 'under 24px, spaced'); }
      else if (r.width < 44 || r.height < 44) { level = 'fiddly'; issues.push('under 44px'); }
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      if (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]), select, textarea') && fontSize < 16) { level = 'fail'; issues.push(fontSize + 'px field text (iPhone zoom)'); }
      if (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]), select, textarea') && r.height < 44) issues.push('field under 44px tall');
      if (issues.length) rows.push({ level, size: Math.round(r.width) + 'x' + Math.round(r.height), issue: issues.join('; '), text: (el.innerText || el.value || el.placeholder || el.getAttribute('aria-label') || '').trim().slice(0, 30), where: where(el) });
    }
    return rows;
  }

  function lineLength() {
    const ctx = document.createElement('canvas').getContext('2d'), rows = [];
    for (const el of document.querySelectorAll('main :is(p, li, dd, td, blockquote, figcaption)')) {
      if (el.querySelector('p, li, div, ul, ol, table')) continue;
      const text = el.innerText.replace(/\s+/g, ' ').trim(), s = getComputedStyle(el);
      if (text.length < 80 || !el.getClientRects().length) continue;
      const range = document.createRange(); range.selectNodeContents(el);
      const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.4;
      // the real lines: text fragments grouped by their top, so the widest line is measured, not the box
      const lineBoxes = [];
      for (const q of [...range.getClientRects()].filter(q => q.width > 1).sort((a, b) => a.top - b.top)) {
        const line = lineBoxes.find(l => Math.abs(l.top - q.top) < lh / 2);
        if (line) { line.left = Math.min(line.left, q.left); line.right = Math.max(line.right, q.right); }
        else lineBoxes.push({ top: q.top, left: q.left, right: q.right });
      }
      const lines = lineBoxes.length;
      if (lines < 2) continue;
      ctx.font = s.fontStyle + ' ' + s.fontWeight + ' ' + s.fontSize + ' ' + s.fontFamily;
      const per = ctx.measureText(text).width / text.length;
      const width = Math.max(...lineBoxes.map(l => l.right - l.left));
      const perLine = Math.round(width / per);
      if (perLine > 80) rows.push({ chars: perLine, lines, text: text.slice(0, 50), where: where(el) });
    }
    return rows.sort((a, b) => b.chars - a.chars);
  }

  function nearMiss() {
    const skip = 'nav, button, [role=button], [class*="btn"], [class*="chip"], [class*="tag"], [class*="badge"], [class*="pill"]';
    const edges = new Map();
    for (const el of document.querySelectorAll('main :is(h1, h2, h3, h4, h5, p, li, dt, dd, label, th, td, figcaption, blockquote)')) {
      const align = getComputedStyle(el).textAlign;
      if (el.closest(skip) || ['center', 'right', 'end'].includes(align) || !(el.innerText || '').trim()) continue;
      const range = document.createRange(); range.selectNodeContents(el);
      const first = [...range.getClientRects()].find(q => q.width > 1 && q.height > 1);
      if (!first) continue;
      const x = Math.round(first.left);
      if (!edges.has(x)) edges.set(x, []);
      edges.get(x).push(el);
    }
    const xs = [...edges.keys()].sort((a, b) => a - b), rows = [];
    for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length && xs[j] - xs[i] <= 8; j++) {
      if (xs[j] - xs[i] < 2) continue;
      const a = edges.get(xs[i]), b = edges.get(xs[j]);
      rows.push({ edges: xs[i] + '/' + xs[j], apart: xs[j] - xs[i], count: a.length + '/' + b.length, a: name(a[0]) + ': ' + a[0].innerText.trim().slice(0, 25), b: name(b[0]) + ': ' + b[0].innerText.trim().slice(0, 25) });
    }
    return rows;
  }

  async function focusHidden(cap) {
    let stops = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.getClientRects().length && !el.disabled && getComputedStyle(el).visibility !== 'hidden' && !el.closest('.leaflet-marker-pane'));
    const frame = () => new Promise(done => requestAnimationFrame(() => done()));
    const hiddenBy = el => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return 'off screen';
      const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2]]
        .filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
      let cover = null;
      for (const [x, y] of pts) { const hit = document.elementFromPoint(x, y); if (!hit || el.contains(hit) || hit.contains(el)) return ''; cover = cover || hit; }
      if (!cover) return '';
      for (let a = cover; a; a = a.parentElement) { const p = getComputedStyle(a).position; if (p === 'sticky' || p === 'fixed') return 'hidden under ' + name(a); }
      return 'hidden under ' + name(cover);
    };
    const rows = [];
    // focus() scrolls with the page's scroll-behavior; smooth scrolling would still be moving when we measure
    document.documentElement.style.scrollBehavior = 'auto';
    stops = stops.reverse();
    if (cap && stops.length > cap) stops = stops.slice(0, Math.floor(cap / 2)).concat(stops.slice(-Math.ceil(cap / 2)));
    window.scrollTo(0, document.documentElement.scrollHeight);
    await frame();
    for (const el of stops) {
      el.focus({ focusVisible: true });
      await frame();
      if (document.activeElement !== el) continue;
      const problem = hiddenBy(el);
      if (problem) rows.push({ problem, text: (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 30), where: where(el) });
    }
    if (document.activeElement) document.activeElement.blur();
    return { rows, stops: stops.length };
  }

  function focusRing() {
    // How the focus ring looks on the first link in main and on a button
    const out = {};
    for (const sel of ['main a[href]', 'main button', 'header a[href]', 'input[type=search], input[type=text], input[type=email], textarea']) {
      const el = [...document.querySelectorAll(sel)].find(shown);
      if (!el) continue;
      el.focus({ focusVisible: true });
      const s = getComputedStyle(el);
      out[sel] = s.outlineStyle + ' ' + s.outlineWidth + ' offset ' + s.outlineOffset + ' ' + s.outlineColor + (s.boxShadow !== 'none' ? ' shadow' : '');
      el.blur();
    }
    return out;
  }

  function contrast() {
    const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
    const rgba = color => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
    const channel = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
    // Solid backdrop behind text. This site's page background is a dark gradient on body: treat body as #04060a.
    const backdrop = el => {
      for (let a = el; a; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (a === document.body || a === document.documentElement) return [4, 6, 10];
        if (s.backgroundImage !== 'none') return null;
        const [r, g, b, alpha] = rgba(s.backgroundColor);
        if (alpha >= 0.95) return [r, g, b];
        if (alpha > 0) return null;
      }
      return [4, 6, 10];
    };
    const found = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const el = node.parentElement;
      if (!node.textContent.trim() || !el || el.closest('script, style, noscript')) continue;
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || s.visibility === 'hidden' || +s.opacity === 0) continue;
      if (s.webkitTextFillColor && s.webkitTextFillColor !== s.color && rgba(s.webkitTextFillColor)[3] === 0) continue; // gradient text
      const bg = backdrop(el);
      if (!bg) continue;
      const [cr, cg, cb, alpha] = rgba(s.color);
      const fg = [cr, cg, cb].map((v, i) => v * alpha + bg[i] * (1 - alpha));
      const size = parseFloat(s.fontSize), large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
      const need = large ? 3 : 4.5, got = ratio(fg, bg), key = s.color + '|' + bg + '|' + need;
      if (got < need && !found.has(key)) found.set(key, { contrast: +got.toFixed(2), needs: need, text: s.color, background: 'rgb(' + bg.join(', ') + ')', size, example: node.textContent.trim().slice(0, 30), where: where(el) });
    }
    return [...found.values()];
  }

  function floatingHeadings() {
    const before = el => { for (let n = el; n && n.tagName !== 'MAIN' && n !== document.body; n = n.parentElement) for (let p = n.previousElementSibling; p; p = p.previousElementSibling) if (shown(p) && !p.matches('.section-tag')) return p; return null; };
    const after = el => { for (let p = el.nextElementSibling; p; p = p.nextElementSibling) if (shown(p)) return p; return null; };
    const rows = [];
    for (const h of document.querySelectorAll('main :is(h2, h3, h4)')) {
      if (!shown(h)) continue;
      const a = before(h), b = after(h);
      if (!a || !b) continue;
      const r = h.getBoundingClientRect(), above = r.top - a.getBoundingClientRect().bottom, below = b.getBoundingClientRect().top - r.bottom;
      if (above < 0 || below <= 0) continue;
      if (above < below * 1.5) rows.push({ heading: h.innerText.trim().slice(0, 40), above: Math.round(above), below: Math.round(below), where: where(h) });
    }
    return rows;
  }

  function breakpoints() {
    const found = new Map();
    const add = (px, q) => { const e = found.get(px) || { px, uses: 0, sample: q }; e.uses++; found.set(px, e); };
    const read = text => {
      for (const m of text.matchAll(/(min|max)-width\s*:\s*([\d.]+)(px|r?em)/g)) { const px = parseFloat(m[2]) * (m[3] === 'px' ? 1 : 16); add(m[1] === 'max' ? Math.floor(px) + 1 : Math.ceil(px), text); }
      for (const m of text.matchAll(/width\s*(>=|<=|>|<)\s*([\d.]+)(px|r?em)/g)) { const px = parseFloat(m[2]) * (m[3] === 'px' ? 1 : 16); add(m[1] === '<=' || m[1] === '>' ? Math.floor(px) + 1 : Math.ceil(px), text); }
    };
    const walk = rules => { for (const rule of rules) { if (rule.media) read(rule.media.mediaText); if (rule.cssRules) walk(rule.cssRules); } };
    for (const sheet of document.styleSheets) { try { if (!/leaflet/.test(sheet.href || '')) walk(sheet.cssRules); } catch (e) {} }
    return [...found.values()].sort((a, b) => a.px - b.px);
  }

  function header() {
    const h = document.querySelector('.site-header');
    if (!h) return null;
    const r = h.getBoundingClientRect(), s = getComputedStyle(h);
    const items = [...h.querySelectorAll('a, button')].filter(shown).map(el => el.getBoundingClientRect());
    const tops = [...new Set(items.map(q => Math.round(q.top + q.height / 2)))];
    const rows = tops.length ? (Math.max(...tops) - Math.min(...tops) > 12 ? 2 : 1) : 0;
    return { height: Math.round(r.height), position: s.position, rows, overflowRight: Math.round(Math.max(0, ...items.map(q => q.right)) - document.documentElement.clientWidth) };
  }

  function finePrint() {
    const root = document.querySelector('main') || document.body;
    const bodySize = parseFloat(getComputedStyle(document.body).fontSize);
    let small = 0, all = 0; const counts = new Map(), by = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const el = node.parentElement, text = node.textContent.trim();
      if (!text || !el || el.closest('script, style, noscript, nav, .breadcrumbs, .leaflet-container')) continue;
      if (!shown(el)) continue;
      const words = text.split(/\s+/).length, size = parseFloat(getComputedStyle(el).fontSize);
      all += words;
      if (size < bodySize - 0.5) {
        small += words;
        if (text.length > 30) counts.set(text, (counts.get(text) || 0) + 1);
        const key = name(el.closest('p, li, td, th, dd, dt, figcaption, blockquote, summary, h1, h2, h3, h4, span, div, a') || el) + ' ' + Math.round(size) + 'px';
        by.set(key, (by.get(key) || 0) + words);
      }
    }
    const repeated = [...counts].filter(([, n]) => n >= 3).map(([t, n]) => ({ n, text: t.slice(0, 60) }));
    return { share: all ? Math.round(small / all * 100) : 0, words: all, bodySize, repeated, top: [...by].sort((a, b) => b[1] - a[1]).slice(0, 8) };
  }

  function images() {
    const rows = [];
    for (const img of document.querySelectorAll('img')) {
      const r = img.getBoundingClientRect();
      if (r.width < 2) continue;
      const firstScreen = r.top < innerHeight && r.bottom > 0 && window.scrollY === 0;
      if (firstScreen && img.loading === 'lazy') rows.push({ problem: 'lazy on first screen', src: img.getAttribute('src'), where: where(img) });
      const s = getComputedStyle(img);
      if ((!img.hasAttribute('width') || !img.hasAttribute('height')) && s.aspectRatio === 'auto' && !img.closest('.leaflet-container')) rows.push({ problem: 'no width/height or aspect-ratio', src: (img.getAttribute('src') || '').slice(0, 70), where: where(img) });
    }
    return rows;
  }

  function buttons() {
    const els = [...document.querySelectorAll('main button, main .btn, main a[class*="btn"], main [role=button], main input[type=submit]')].filter(el => shown(el) && !el.closest('.leaflet-marker-pane, .leaflet-control'));
    const heights = new Map();
    for (const el of els) { const h = Math.round(el.getBoundingClientRect().height); const e = heights.get(h) || { h, n: 0, example: '' }; e.n++; if (!e.example) e.example = name(el) + ': ' + (el.innerText || '').trim().slice(0, 20); heights.set(h, e); }
    return [...heights.values()].sort((a, b) => a.h - b.h);
  }

  function spacing() {
    const scale = [12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
    let on = 0, off = 0; const offVals = new Map();
    const radii = new Map();
    for (const el of (document.querySelector('main') || document.body).querySelectorAll('*')) {
      if (!shown(el) || el.closest('svg, .leaflet-container')) continue;
      const s = getComputedStyle(el);
      for (const v of [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft, s.marginTop, s.marginBottom, s.rowGap, s.columnGap]) {
        const px = parseFloat(v);
        if (!(px >= 12)) continue;
        if (scale.includes(Math.round(px))) on++; else { off++; offVals.set(Math.round(px), (offVals.get(Math.round(px)) || 0) + 1); }
      }
      const rad = s.borderTopLeftRadius;
      if (rad && rad !== '0px' && !rad.includes('%') && parseFloat(rad) < 100 && (s.borderTopWidth !== '0px' || s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none')) radii.set(rad, (radii.get(rad) || 0) + 1);
    }
    return { onScale: on + off ? Math.round(on / (on + off) * 100) : 100, off: [...offVals].sort((a, b) => b[1] - a[1]).slice(0, 10), radii: [...radii].sort((a, b) => b[1] - a[1]) };
  }

  function pageEdges() {
    // Distance from the header to the first thing you see in <main> (a line of text, an image, a filled box), and
    // from the last one to whatever follows <main> (the related-links strip or the footer)
    const h = document.querySelector('.site-header'), main = document.querySelector('main');
    if (!h || !main) return null;
    const ownText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const filled = s => s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none' || parseFloat(s.borderTopWidth) > 0;
    const pinned = el => { for (let a = el; a && a !== main; a = a.parentElement) if (/fixed|sticky/.test(getComputedStyle(a).position)) return true; return false; };
    // text counts from its glyphs, not its box (a link padded out to 44px for tapping isn't where the text is)
    const boxes = [];
    for (const k of main.querySelectorAll('*')) {
      if (!shown(k) || pinned(k) || k.closest('.sr-only, .skip-link')) continue;
      const s = getComputedStyle(k);
      if (/^(IMG|VIDEO|IFRAME|CANVAS|PICTURE)$/.test(k.tagName) || filled(s)) { boxes.push([k.getBoundingClientRect(), k]); continue; }
      for (const n of k.childNodes) if (n.nodeType === 3 && n.textContent.trim()) {
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) if (q.width > 1 && q.height > 1) boxes.push([q, k]);
      }
    }
    if (!boxes.length) return null;
    const firstBox = boxes.reduce((a, b) => (b[0].top < a[0].top ? b : a)), lastBox = boxes.reduce((a, b) => (b[0].bottom > a[0].bottom ? b : a));
    const hb = h.getBoundingClientRect().bottom;
    let next = main.nextElementSibling;
    while (next && (/^(SCRIPT|STYLE|TEMPLATE)$/.test(next.tagName) || next.getBoundingClientRect().height === 0 || /fixed|absolute/.test(getComputedStyle(next).position))) next = next.nextElementSibling;
    return { start: Math.round(firstBox[0].top - hb), end: next ? Math.round(next.getBoundingClientRect().top - lastBox[0].bottom) : null, first: name(firstBox[1]), last: name(lastBox[1]), next: next ? name(next) : null };
  }

  function clipped() {
    // Text cut off inside boxes that hide their overflow (shows up most with the text-spacing test)
    const rows = [];
    for (const el of document.querySelectorAll('main *')) {
      const s = getComputedStyle(el);
      if (!/(hidden|clip)/.test(s.overflowX + s.overflowY) || !shown(el) || el.closest('.leaflet-container') || !(el.innerText || '').trim()) continue;
      if (s.textOverflow === 'ellipsis' || (s.webkitLineClamp && s.webkitLineClamp !== 'none')) continue;
      if (el.closest('.os-disclaimer__diamonds')) continue;
      if (el.scrollHeight > el.clientHeight + 3 || el.scrollWidth > el.clientWidth + 3) rows.push({ by: Math.max(el.scrollHeight - el.clientHeight, el.scrollWidth - el.clientWidth), where: where(el), text: (el.innerText || '').trim().slice(0, 30) });
    }
    return rows;
  }

  return { overflow, textSizes, tapTargets, lineLength, nearMiss, focusHidden, focusRing, contrast, floatingHeadings, breakpoints, header, finePrint, images, buttons, spacing, pageEdges, clipped };
})();
`;

const TEXT_SPACING = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';

async function load(page, path) {
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => ({ status: () => 'ERR ' + e.message }));
  await page.addScriptTag({ content: CHECKS });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  // the build planner shows a ~2s boot screen over everything; measure the page under it
  await page.waitForFunction(() => { const b = document.getElementById('boot'); return !b || b.classList.contains('is-done'); }, null, { timeout: 8000 }).catch(() => {});
  if (await page.$('#boot')) await page.waitForTimeout(600);
  await page.waitForTimeout(150);
  return res && res.status ? res.status() : null;
}
const run = (page, fn, ...a) => page.evaluate(([f, a]) => window.__audit[f](...a), [fn, a]);

(async () => {
  const browser = await chromium.launch();
  const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const phone = await phoneCtx.newPage();
  const desk = await deskCtx.newPage();
  const errors = [];
  for (const p of [phone, desk]) p.on('pageerror', e => errors.push(p === phone ? 'phone' : 'desk', e.message));

  const report = { base: BASE, date: new Date().toISOString(), pages: {} };
  for (const [label, path, kind] of PAGES) {
    const r = report.pages[label] = { path, kind, widths: {} };
    process.stdout.write(label + ' ');
    // Phones
    for (const w of PHONES) {
      await phone.setViewportSize({ width: w, height: w <= 375 ? 667 : 844 });
      const status = await load(phone, path);
      const row = r.widths[w] = { status, overflow: await run(phone, 'overflow'), header: await run(phone, 'header') };
      if (w === 390 || w === 320) {
        row.tap = await run(phone, 'tapTargets');
        row.clipped = await run(phone, 'clipped');
      }
      if (w === 390) {
        row.textSizes = await run(phone, 'textSizes');
        row.contrast = await run(phone, 'contrast');
        row.headings = await run(phone, 'floatingHeadings');
        row.finePrint = await run(phone, 'finePrint');
        row.images = await run(phone, 'images');
        row.buttons = await run(phone, 'buttons');
        row.edges = await run(phone, 'pageEdges');
        row.spacing = await run(phone, 'spacing');
        await phone.addStyleTag({ content: TEXT_SPACING });
        await phone.waitForTimeout(100);
        row.textSpacing = { overflow: (await run(phone, 'overflow')).rows.length, clipped: await run(phone, 'clipped') };
        await load(phone, path);
        row.focus = await run(phone, 'focusHidden', 160);
      }
    }
    // Tablets and desktops (no touch)
    for (const w of [...TABLETS, ...DESKTOPS]) {
      await desk.setViewportSize({ width: w, height: w <= 1024 ? 1024 : 900 });
      const status = await load(desk, path);
      const row = r.widths[w] = { status, overflow: await run(desk, 'overflow'), header: await run(desk, 'header') };
      if (w === 1280 || w === 1440) row.lineLength = await run(desk, 'lineLength');
      if (w === 1440) {
        row.textSizes = await run(desk, 'textSizes');
        row.nearMiss = await run(desk, 'nearMiss');
        row.contrast = await run(desk, 'contrast');
        row.headings = await run(desk, 'floatingHeadings');
        row.images = await run(desk, 'images');
        row.buttons = await run(desk, 'buttons');
        row.edges = await run(desk, 'pageEdges');
        row.focusRing = await run(desk, 'focusRing');
        row.breakpoints = await run(desk, 'breakpoints');
        row.clipped = await run(desk, 'clipped');
        await desk.addStyleTag({ content: TEXT_SPACING });
        await desk.waitForTimeout(100);
        row.textSpacing = { overflow: (await run(desk, 'overflow')).rows.length, clipped: await run(desk, 'clipped') };
        await load(desk, path);
        row.focus = await run(desk, 'focusHidden', 160);
      }
    }
    // Width sweep
    if (SWEEP) {
      r.sweep = [];
      await load(desk, path);
      for (let w = 300; w <= 1940; w += 10) {
        await desk.setViewportSize({ width: w, height: 900 });
        await desk.waitForTimeout(30);
        const o = await run(desk, 'overflow');
        const h = await run(desk, 'header');
        if (o.rows.length || o.docOverflow > 0 || (h && (h.rows > 1 || h.overflowRight > 0))) r.sweep.push({ w, overflow: o.rows.length, doc: o.docOverflow, headerRows: h && h.rows, headerOverflow: h && h.overflowRight, first: o.rows[0] });
      }
    }
  }
  report.errors = errors;
  fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
  console.log('\n\nWrote ' + OUT);

  /* ---------- Summary ---------- */
  const lines = [];
  const L = s => lines.push(s);
  let totals = { overflow: 0, tapFail: 0, tapFiddly: 0, fieldZoom: 0, contrast: 0, headings: 0, lineLong: 0, nearMiss: 0, focusHidden: 0, lazyFirst: 0, noDims: 0, clipped: 0, tsClipped: 0, under13: 0 };
  for (const [label, pr] of Object.entries(report.pages)) {
    const w = pr.widths;
    const ph = w[390] || {}, dk = w[1440] || {};
    const ovW = Object.entries(w).filter(([, x]) => x.overflow && (x.overflow.rows.length || x.overflow.docOverflow > 0)).map(([k, x]) => k + '(' + x.overflow.rows.length + (x.overflow.docOverflow > 0 ? ',doc+' + x.overflow.docOverflow : '') + ')');
    const tap = [...(ph.tap || []), ...((w[320] || {}).tap || [])];
    const tapFail = (ph.tap || []).filter(t => t.level === 'fail').length, tapFiddly = (ph.tap || []).filter(t => t.level === 'fiddly' || t.level === 'small').length;
    const fieldZoom = (ph.tap || []).filter(t => /field text/.test(t.issue)).length;
    const sizesP = (ph.textSizes || []).map(s => s.size), sizesD = (dk.textSizes || []).map(s => s.size);
    const under13 = [...new Set([...sizesP, ...sizesD].filter(s => s < 13))];
    const hdr = ph.header ? ph.header.height + 'px ' + ph.header.position : '-';
    totals.overflow += ovW.length; totals.tapFail += tapFail; totals.tapFiddly += tapFiddly; totals.fieldZoom += fieldZoom;
    totals.contrast += (ph.contrast || []).length + (dk.contrast || []).length; totals.headings += (dk.headings || []).length;
    totals.lineLong += (dk.lineLength || []).length; totals.nearMiss += (dk.nearMiss || []).length;
    totals.focusHidden += ((ph.focus || {}).rows || []).length + ((dk.focus || {}).rows || []).length;
    totals.lazyFirst += [...(ph.images || []), ...(dk.images || [])].filter(i => /lazy/.test(i.problem)).length;
    totals.noDims += (dk.images || []).filter(i => /no width/.test(i.problem)).length;
    totals.clipped += (ph.clipped || []).length + (dk.clipped || []).length;
    totals.tsClipped += ((ph.textSpacing || {}).clipped || []).length + ((dk.textSpacing || {}).clipped || []).length;
    totals.under13 += under13.length ? 1 : 0;
    L(`\n## ${label}  ${pr.path}`);
    L(`  overflow at: ${ovW.join(' ') || 'none'}`);
    L(`  header (390): ${hdr}; rows>1 at: ${Object.entries(w).filter(([, x]) => x.header && x.header.rows > 1).map(([k]) => k).join(' ') || 'never'}`);
    L(`  text sizes 390: ${sizesP.length} [${sizesP.join(', ')}]  1440: ${sizesD.length} [${sizesD.join(', ')}]${under13.length ? '  UNDER 13: ' + under13.join(',') : ''}`);
    L(`  tap 390: ${tapFail} fail, ${tapFiddly} under 44, ${fieldZoom} zooming fields`);
    L(`  contrast: 390 ${(ph.contrast || []).length}, 1440 ${(dk.contrast || []).length}; floating headings 1440: ${(dk.headings || []).length}; long lines 1440: ${(dk.lineLength || []).length}; near-miss 1440: ${(dk.nearMiss || []).length}`);
    L(`  focus hidden: 390 ${((ph.focus || {}).rows || []).length}/${(ph.focus || {}).stops || 0}, 1440 ${((dk.focus || {}).rows || []).length}/${(dk.focus || {}).stops || 0}`);
    L(`  fine print: ${ph.finePrint ? ph.finePrint.share + '% of ' + ph.finePrint.words + ' words (body ' + ph.finePrint.bodySize + 'px)' + (ph.finePrint.repeated.length ? ', repeated x' + ph.finePrint.repeated.length : '') : '-'}`);
    L(`  images: ${[...(ph.images || []), ...(dk.images || [])].map(i => i.problem).join('; ') || 'ok'}`);
    L(`  buttons 390: ${(ph.buttons || []).map(b => b.h + 'px x' + b.n).join(', ') || '-'}; 1440: ${(dk.buttons || []).map(b => b.h + 'px x' + b.n).join(', ') || '-'}`);
    L(`  spacing on scale 1440: ${dk.spacing ? dk.spacing.onScale + '%' : (ph.spacing ? ph.spacing.onScale + '% (390)' : '-')}; page start/end 390: ${ph.edges ? ph.edges.start + '/' + ph.edges.end : '-'} 1440: ${dk.edges ? dk.edges.start + '/' + dk.edges.end : '-'}`);
    L(`  clipped: ${(ph.clipped || []).length + (dk.clipped || []).length}; with text spacing: overflow ${(ph.textSpacing || {}).overflow || 0}/${(dk.textSpacing || {}).overflow || 0}, clipped ${((ph.textSpacing || {}).clipped || []).length}/${((dk.textSpacing || {}).clipped || []).length}`);
    if (pr.sweep) L(`  sweep problems at: ${pr.sweep.map(s => s.w).join(' ') || 'none'}`);
    if (VERBOSE) {
      for (const [k, x] of Object.entries(w)) for (const o of (x.overflow ? x.overflow.rows : [])) L(`    [${k}] ${o.problem} by ${o.by}: ${o.where} "${o.text}"`);
      for (const t of (ph.tap || [])) L(`    [tap] ${t.level} ${t.size} ${t.issue}: ${t.where} "${t.text}"`);
      for (const c of [...(ph.contrast || []), ...(dk.contrast || [])]) L(`    [contrast] ${c.contrast}:1 needs ${c.needs} ${c.text} on ${c.background} ${c.size}px "${c.example}" ${c.where}`);
      for (const h of (dk.headings || [])) L(`    [heading] above ${h.above} below ${h.below} "${h.heading}"`);
      for (const f of [...((ph.focus || {}).rows || []), ...((dk.focus || {}).rows || [])]) L(`    [focus] ${f.problem}: ${f.where} "${f.text}"`);
      for (const c of [...(ph.clipped || []), ...(dk.clipped || [])]) L(`    [clipped] by ${c.by}: ${c.where} "${c.text}"`);
      if (ph.finePrint) L(`    [fine print] ${ph.finePrint.top.map(([k, n]) => k + '=' + n).join(' | ')}`);
      for (const x of (dk.lineLength || []).slice(0, 12)) L(`    [long] ${x.chars} chars: ${x.where} "${x.text}"`);
      for (const x of (dk.nearMiss || []).slice(0, 12)) L(`    [near] ${x.edges} (${x.apart}px) ${x.a} | ${x.b}`);
      if (ph.edges) L(`    [edges] 390 start ${ph.edges.start} end ${ph.edges.end}`);
    }
  }
  const first = Object.values(report.pages)[0];
  if (first && first.widths[1440] && first.widths[1440].breakpoints) L(`\nBreakpoints (from ${Object.keys(report.pages)[0]}): ${first.widths[1440].breakpoints.map(b => b.px + 'px(' + b.uses + ')').join(' ')}`);
  // The guide wants every page to start and end the same distance from the header and footer (within 4px)
  const edgeRows = Object.entries(report.pages).map(([l, pr]) => [l, (pr.widths[390] || {}).edges, (pr.widths[1440] || {}).edges]).filter(([, a, b]) => a || b);
  if (edgeRows.length) L('\nPage start/end in px (header to first content / last content to what follows <main>), 390 | 1440:\n' + edgeRows.map(([l, a, b]) => `  ${l}: ${a ? a.start + '/' + a.end : '-'} | ${b ? b.start + '/' + b.end : '-'}`).join('\n'));
  L('\nTOTALS ' + JSON.stringify(totals));
  if (errors.length) L('\nPAGE ERRORS: ' + errors.join(' | '));
  const summary = lines.join('\n');
  fs.writeFileSync(OUT.replace(/\.json$/, '') + '-summary.txt', summary);
  console.log(summary);
  await browser.close();
})();
