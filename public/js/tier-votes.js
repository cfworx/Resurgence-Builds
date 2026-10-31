/* Player tier lists: live vote totals for the vote bars (TierVote), player-rank badges (TierBadge), tier chips on
   database cards and the tier boards (TierBoard). API: /api/votes (functions/api/votes.js). Several components on a
   page each include this file; it runs once. What a reader voted is remembered in localStorage only to highlight it;
   the server's cookie is what keeps it to one vote. See VOTES.md. */
(function () {
  'use strict';
  if (window.__rbTierVotes) return;
  window.__rbTierVotes = true;
  if (!window.fetch || !document.querySelector || !window.Map) return;

  var TIERS = ['S', 'A', 'B', 'C', 'D'];
  var POLL_MS = 30000;            // tier boards refresh this often while visible
  var IDLE_MS = 20 * 60000;       // ...and pause after 20 minutes without a tap, click, key or scroll
  var MINE_KEY = 'rb-votes';
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // A little dad energy after each vote.
  var LINES = {
    S: ['S tier. Bold. Your squad expects carries now.', 'S tier. Somewhere a min-maxer just nodded. Once.', 'Cracked, you say? Noted. Respect.'],
    A: ['A tier. Strong pick, like cargo shorts with extra pockets.', 'A tier. Solid as a dad handshake.'],
    B: ['B tier. The "it\'s fine, I\'m fine" of tiers.', 'B tier. Gets the job done. Complains less than your squad.'],
    C: ['C tier. Ouch. It\'ll walk it off.', 'C tier. Not mad. Just disappointed.'],
    D: ['D tier. Brutal. Someone break the news gently.', 'D tier. Yikes is right. Moving on.'],
  };
  var FIRST = 'First vote! You just set its tier. Enjoy the power.';
  var CHANGED = ['Changed your mind? Happens to the best of us.', 'Vote updated. Everybody gets a respawn.'];
  var SAME = 'Still {T}. Consistent. Like dad jokes.';
  var OFFLINE = 'Couldn\'t reach the vote counter. Try again in a sec.';

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function voteCount(n) { return n === 1 ? '1 vote' : Number(n).toLocaleString('en-US') + ' votes'; }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // --- What this reader voted (a convenience for highlighting; never trusted by the server) ---
  function readMine() {
    try { var v = JSON.parse(localStorage.getItem(MINE_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
  }
  function mineOf(kind, id) { var t = readMine()[kind + ':' + id]; return TIERS.indexOf(t) >= 0 ? t : null; }
  function saveMine(kind, id, tier) {
    try { var m = readMine(); m[kind + ':' + id] = tier; localStorage.setItem(MINE_KEY, JSON.stringify(m)); } catch (e) {}
  }
  // Right after a vote, skip the browser's 20-second copy of the totals for a few minutes.
  function markFresh(kind) { try { sessionStorage.setItem('rb-votes-fresh-' + kind, String(Date.now())); } catch (e) {} }
  function wantsFresh(kind) {
    try { return Date.now() - Number(sessionStorage.getItem('rb-votes-fresh-' + kind) || 0) < 180000; } catch (e) { return false; }
  }

  // --- Totals ---
  var state = {};     // kind -> { items, votes, at }
  var inflight = {};
  function load(kind, fresh) {
    if (inflight[kind]) return inflight[kind];
    var opts = fresh || wantsFresh(kind) ? { cache: 'no-store' } : {};
    var p = fetch('/api/votes?kind=' + encodeURIComponent(kind), opts)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || typeof d.items !== 'object' || d.items === null) throw new Error('bad reply');
        state[kind] = { items: d.items, votes: Number(d.votes) || 0, at: Date.now() };
        return state[kind];
      });
    inflight[kind] = p;
    p.then(function () { inflight[kind] = null; }, function () { inflight[kind] = null; });
    return p;
  }
  function itemOf(kind, id) { var d = state[kind]; var it = d && d.items[id]; return it && it.n > 0 ? it : null; }

  // --- Painting ---
  function setChip(el, tier) {
    if (!el) return;
    el.className = el.className.replace(/\s*\btier-chip--\w+/g, '') + ' tier-chip--' + (tier ? tier.toLowerCase() : 'none');
    el.textContent = tier || '?';
  }
  function setDist(el, it) {
    if (!el) return;
    for (var i = 0; i < 5; i++) {
      var seg = el.children[i];
      if (seg) seg.style.flexGrow = it ? String(it[TIERS[i].toLowerCase()] || 0) : '0';
    }
    el.title = it ? TIERS.map(function (t) { return t + ' ' + (it[t.toLowerCase()] || 0); }).join(' · ') : '';
  }
  function setPressed(root, tier) {
    all('[data-tv-pick]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tv-pick') === tier ? 'true' : 'false'); });
  }

  function paintBar(root) {
    var kind = root.getAttribute('data-kind');
    var it = itemOf(kind, root.getAttribute('data-id'));
    setChip(root.querySelector('[data-tv-letter]'), it && it.tier);
    var c = root.querySelector('[data-tv-count]');
    if (c) c.textContent = it ? 'from ' + voteCount(it.n) : 'No votes yet. Yours sets the tier.';
    setDist(root.querySelector('[data-tv-dist]'), it);
  }
  function paintBadge(el) {
    var it = itemOf(el.getAttribute('data-kind'), el.getAttribute('data-id'));
    setChip(el.querySelector('[data-tv-letter]'), it && it.tier);
    var c = el.querySelector('[data-tv-count]');
    if (c) c.textContent = it ? voteCount(it.n) : 'Unranked: rank it';
  }
  function paintChip(el) {
    var it = itemOf(el.getAttribute('data-kind'), el.getAttribute('data-id'));
    el.hidden = !it;
    if (it) { setChip(el, it.tier); el.title = 'Player rank ' + it.tier + ', ' + voteCount(it.n); }
  }
  function paintCard(card, kind) {
    var id = card.getAttribute('data-id');
    var it = itemOf(kind, id);
    var c = card.querySelector('[data-tv-count]');
    if (c) c.textContent = it ? voteCount(it.n) : 'No votes yet';
    setDist(card.querySelector('[data-tv-dist]'), it);
    paintMine(card, kind);
  }
  function paintMine(card, kind) {
    var mine = mineOf(kind, card.getAttribute('data-id'));
    var m = card.querySelector('[data-tv-mine]');
    if (m) { m.hidden = !mine; if (mine) setChip(m.querySelector('[data-tv-mine-letter]'), mine); }
    var go = card.querySelector('[data-tv-go]');
    if (go) go.hidden = !!mine;
    setPressed(card, mine);
  }

  // Sort a board's cards into their tier rows. With `animate`, cards glide to their new spot (and flash if they
  // changed tier).
  function arrange(board, animate) {
    var kind = board.getAttribute('data-kind');
    if (!state[kind]) return;
    var cards = all('[data-tv-card]', board);
    var glide = animate && !reduceMotion && typeof Element.prototype.animate === 'function';
    var before = new Map();
    if (glide) cards.forEach(function (c) { before.set(c, { r: c.getBoundingClientRect(), row: c.closest('[data-tv-row]') }); });
    var focused = document.activeElement;
    var groups = { S: [], A: [], B: [], C: [], D: [], U: [] };
    cards.forEach(function (c) {
      var it = itemOf(kind, c.getAttribute('data-id'));
      var t = it && groups[it.tier] ? it.tier : 'U';
      groups[t].push({ el: c, avg: it ? it.avg : 0, n: it ? it.n : 0, name: c.getAttribute('data-name') || '', order: Number(c.getAttribute('data-order')) || 0 });
      paintCard(c, kind);
    });
    Object.keys(groups).forEach(function (t) {
      var row = board.querySelector('[data-tv-row="' + t + '"]');
      if (!row) return;
      var wrap = row.querySelector('[data-tv-cards]');
      groups[t].sort(t === 'U'
        ? function (a, b) { return a.order - b.order; }
        : function (a, b) { return (b.avg - a.avg) || (b.n - a.n) || a.name.localeCompare(b.name); });
      groups[t].forEach(function (g) { if (wrap.lastElementChild !== g.el || g.el.parentNode !== wrap) wrap.appendChild(g.el); });
    });
    updateEmpty(board);
    if (focused && focused !== document.activeElement && document.contains(focused) && focused.focus) {
      try { focused.focus({ preventScroll: true }); } catch (e) {}
    }
    if (!glide) return;
    cards.forEach(function (c) {
      var b = before.get(c);
      if (!b || c.hidden) return;
      var r = c.getBoundingClientRect();
      var dx = b.r.left - r.left;
      var dy = b.r.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
      if (b.row !== c.closest('[data-tv-row]')) {
        c.classList.remove('is-moved');
        void c.offsetWidth;
        c.classList.add('is-moved');
      }
    });
  }
  function updateEmpty(board) {
    all('[data-tv-row]', board).forEach(function (row) {
      row.classList.toggle('is-empty', !row.querySelector('[data-tv-card]:not([hidden])'));
    });
  }

  function agoText(at) {
    var s = Math.max(0, Math.round((Date.now() - at) / 1000));
    if (s < 10) return 'updated just now';
    if (s < 60) return 'updated ' + s + 's ago';
    return 'updated ' + Math.round(s / 60) + ' min ago';
  }
  function paintLive(kind) {
    var d = state[kind];
    all('[data-tv-live][data-kind="' + kind + '"]').forEach(function (el) {
      el.classList.toggle('is-paused', paused || !d);
      var st = el.querySelector('[data-tv-state]');
      if (st) st.textContent = !d ? 'Saved ranks' : paused ? 'Paused' : 'Live';
      var tot = el.querySelector('[data-tv-total]');
      if (tot && d) tot.textContent = voteCount(d.votes);
      var rk = el.querySelector('[data-tv-ranked]');
      var board = document.querySelector('[data-tv-board][data-kind="' + kind + '"]');
      if (rk && board && d) {
        var cards = all('[data-tv-card]', board);
        var ranked = cards.filter(function (c) { return itemOf(kind, c.getAttribute('data-id')); }).length;
        rk.textContent = ranked + ' of ' + cards.length + ' ranked';
      }
      var ago = el.querySelector('[data-tv-ago]');
      if (ago) ago.textContent = !d ? 'live numbers unavailable' : paused ? 'tap anywhere to resume' : agoText(d.at);
    });
  }

  function refresh(kind, animate) {
    all('[data-tv][data-kind="' + kind + '"]').forEach(paintBar);
    all('[data-tv-badge][data-kind="' + kind + '"]').forEach(paintBadge);
    all('[data-tv-chip][data-kind="' + kind + '"]').forEach(paintChip);
    all('[data-tv-board][data-kind="' + kind + '"]').forEach(function (b) { arrange(b, animate); });
    paintLive(kind);
  }

  // --- Voting ---
  function send(kind, id, tier) {
    var elapsed = window.performance && performance.now ? Math.round(performance.now()) : 10000;
    return fetch('/api/votes', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: kind, id: id, tier: tier, elapsed: elapsed }),
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d || {} }; });
    });
  }
  // Store the result and pick the line to show.
  function recordVote(kind, id, tier, d, prevMine) {
    saveMine(kind, id, tier);
    markFresh(kind);
    if (!state[kind]) state[kind] = { items: {}, votes: 0, at: Date.now() };
    var prev = state[kind].items[id];
    var next = d.item && d.item.n > 0 ? d.item : null;
    if (next) state[kind].items[id] = next; else delete state[kind].items[id];
    state[kind].votes = Math.max(0, state[kind].votes + (next ? next.n : 0) - (prev ? prev.n : 0));
    if (prevMine === tier && !d.changed) return SAME.replace('{T}', tier);
    if (d.changed) return pick(CHANGED);
    if (next && next.n === 1 && !prev) return FIRST;
    return pick(LINES[tier]);
  }
  function errorText(err) { return (err && err.d && typeof err.d.error === 'string' && err.d.error) || OFFLINE; }

  function setupBar(root) {
    var kind = root.getAttribute('data-kind');
    var id = root.getAttribute('data-id');
    var msg = root.querySelector('[data-tv-msg]');
    if (root.getAttribute('data-place') === 'before-comments') {
      var comments = document.querySelector('[data-comments]');
      if (comments && comments.parentNode) comments.parentNode.insertBefore(root, comments);
      if (location.hash === '#rank') root.scrollIntoView({ block: 'start' });
    }
    setPressed(root, mineOf(kind, id));
    root.setAttribute('data-ready', '');
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tv-pick]');
      if (!b || root.classList.contains('is-busy')) return;
      var tier = b.getAttribute('data-tv-pick');
      var prevMine = mineOf(kind, id);
      root.classList.add('is-busy');
      setPressed(root, tier);
      msg.classList.remove('is-error');
      msg.textContent = 'Counting...';
      send(kind, id, tier).then(function (res) {
        if (!res.ok) throw res;
        var line = recordVote(kind, id, tier, res.d, prevMine);
        refresh(kind, true);
        setPressed(root, tier);
        msg.textContent = line;
      }).catch(function (err) {
        setPressed(root, prevMine);
        msg.classList.add('is-error');
        msg.textContent = errorText(err);
      }).then(function () { root.classList.remove('is-busy'); });
    });
  }

  // --- Quick votes on a tier board ---
  function closeQuick(except) {
    all('[data-tv-quickpicks]:not([hidden])').forEach(function (p) {
      if (p === except) return;
      p.hidden = true;
      var b = p.closest('[data-tv-card]').querySelector('[data-tv-quick]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function toggleQuick(card) {
    var picks = card.querySelector('[data-tv-quickpicks]');
    var btn = card.querySelector('[data-tv-quick]');
    if (!picks || !btn) return;
    var open = picks.hidden;
    closeQuick(picks);
    picks.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var first = picks.querySelector('[aria-pressed="true"]') || picks.querySelector('[data-tv-pick]');
      if (first) try { first.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  function quickVote(board, card, tier) {
    if (card.classList.contains('is-busy')) return;
    var kind = board.getAttribute('data-kind');
    var id = card.getAttribute('data-id');
    var prevMine = mineOf(kind, id);
    var btn = card.querySelector('[data-tv-quick]');
    card.classList.add('is-busy');
    setPressed(card, tier);
    send(kind, id, tier).then(function (res) {
      if (!res.ok) throw res;
      var line = recordVote(kind, id, tier, res.d, prevMine);
      var picks = card.querySelector('[data-tv-quickpicks]');
      var hadFocus = picks && picks.contains(document.activeElement);
      if (picks) picks.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (hadFocus && btn) try { btn.focus({ preventScroll: true }); } catch (e) {}
      paintCard(card, kind);
      toast(line, tier, false);
      setTimeout(function () { refresh(kind, true); }, 700);
    }).catch(function (err) {
      setPressed(card, prevMine);
      toast(errorText(err), null, true);
    }).then(function () { card.classList.remove('is-busy'); });
  }

  var toastEl;
  var toastTimer;
  function toast(text, tier, isError) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'tv-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    while (toastEl.firstChild) toastEl.removeChild(toastEl.firstChild);
    if (tier) {
      var chip = document.createElement('span');
      chip.className = 'tier-chip tier-chip--' + tier.toLowerCase();
      chip.textContent = tier;
      toastEl.appendChild(chip);
    }
    var span = document.createElement('span');
    span.textContent = text;
    toastEl.appendChild(span);
    toastEl.classList.toggle('is-error', !!isError);
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 4000);
  }

  function setupBoard(board) {
    board.addEventListener('click', function (e) {
      var q = e.target.closest('[data-tv-quick]');
      if (q) { toggleQuick(q.closest('[data-tv-card]')); return; }
      var p = e.target.closest('[data-tv-pick]');
      if (p) quickVote(board, p.closest('[data-tv-card]'), p.getAttribute('data-tv-pick'));
    });
    all('[data-tv-card]', board).forEach(function (c) { paintMine(c, board.getAttribute('data-kind')); });
  }

  // Filter buttons (type of OS Protocol)
  function setupFilters(bar) {
    var board = document.querySelector('[data-tv-board][data-kind="' + bar.getAttribute('data-for') + '"]');
    if (!board) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tv-filter]');
      if (!b) return;
      var v = b.getAttribute('data-value');
      all('[data-tv-filter]', bar).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      closeQuick(null);
      all('[data-tv-card]', board).forEach(function (c) { c.hidden = v !== 'all' && c.getAttribute('data-group') !== v; });
      updateEmpty(board);
    });
  }

  // --- Live updates on tier boards ---
  var paused = false;
  var lastActive = Date.now();
  var boardKinds = [];
  function poll(force) {
    if (!boardKinds.length || document.visibilityState === 'hidden') return;
    if (!force && Date.now() - lastActive > IDLE_MS) { paused = true; boardKinds.forEach(paintLive); return; }
    boardKinds.forEach(function (kind) {
      load(kind, true).then(function () { refresh(kind, true); }, function () { paintLive(kind); });
    });
  }
  function wake() {
    lastActive = Date.now();
    if (paused) { paused = false; poll(true); }
  }

  function init() {
    var kinds = {};
    all('[data-tv], [data-tv-badge], [data-tv-chip], [data-tv-board]').forEach(function (el) { kinds[el.getAttribute('data-kind')] = true; });
    all('[data-tv]').forEach(setupBar);
    all('[data-tv-board]').forEach(function (b) {
      setupBoard(b);
      var k = b.getAttribute('data-kind');
      if (boardKinds.indexOf(k) < 0) boardKinds.push(k);
    });
    all('[data-tv-filters]').forEach(setupFilters);
    Object.keys(kinds).forEach(function (kind) {
      if (kind !== 'build' && kind !== 'os') return;
      load(kind, false).then(function () { refresh(kind, false); }, function () { paintLive(kind); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('[data-tv-quickpicks]:not([hidden])');
      if (!open) return;
      var btn = open.closest('[data-tv-card]').querySelector('[data-tv-quick]');
      closeQuick(null);
      if (btn) btn.focus();
    });
    if (!boardKinds.length) return;
    setInterval(poll, POLL_MS);
    setInterval(function () { boardKinds.forEach(paintLive); }, 5000);
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, wake, { passive: true }); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      var stale = boardKinds.some(function (k) { return !state[k] || Date.now() - state[k].at > POLL_MS; });
      lastActive = Date.now();
      paused = false;
      if (stale) poll(true);
    });
  }

  // Coming back with the Back button shows the cached page: bring its numbers up to date.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    Object.keys(state).forEach(function (kind) { load(kind, true).then(function () { refresh(kind, false); }, function () {}); });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
