/* ============================================================
   RESURGENCE MAP ENGINE — Interactive Manhattan Companion Map
   Division Resurgence · resurgencebuilds.com
   Data: src/data/pois.json (built by scripts/build-map-data.mjs)
   ============================================================ */
(function () {
  'use strict';

  var PROGRESS_KEY = 'rb-map-progress-v1';
  var FILTER_KEY = 'rb-map-filters-v2';

  // Same width as the page's phone layout (the CSS uses this query too).
  var PHONE = window.matchMedia('(max-width: 44.99em)');
  // Name tooltips only where a mouse can hover. On touch screens they pile up and never close.
  var CAN_HOVER = window.matchMedia('(hover: hover)');
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  var COARSE = window.matchMedia('(pointer: coarse)');

  /* --- Safe storage (private windows, blocked storage, previews) --- */
  var store = {
    get: function (k, fallback) {
      try { var v = window.localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };

  /* --- Marker glyphs (24x24, drawn in white on a colored badge) --- */
  var ICONS = {
    house: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    base: '<path d="M5 21V8l7-4 7 4v13"/><path d="M9 12h6M9 16h6M3 21h18"/>',
    tent: '<path d="M3 20L12 4l9 16z"/><path d="M12 20l-3-6h6z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    landmark: '<path d="M12 3l8 4H4z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8M3 21h18"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9l-5.4 2.6 1.2-6-4.5-4.2 6.1-.7z"/>',
    side: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    portal: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
    alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    nest: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    radar: '<path d="M4.9 19.1A10 10 0 1 1 19.1 19.1"/><path d="M8.5 15.5a5 5 0 1 1 7 0"/><circle cx="12" cy="12" r="1.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    crate: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    echo: '<path d="M6 18A8 8 0 0 1 6 6"/><path d="M18 6a8 8 0 0 1 0 12"/><path d="M9 15a4 4 0 0 1 0-6"/><path d="M15 9a4 4 0 0 1 0 6"/>',
    gem: '<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>',
    audio: '<path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 11v2"/>',
    ammo: '<rect x="4" y="8" width="16" height="12" rx="1"/><path d="M8 8V5h8v3M9 13h6"/>',
    extract: '<path d="M12 21V8"/><path d="M7 13l5-5 5 5"/><path d="M4 3h16"/>',
    gate: '<path d="M4 21V5h16v16"/><path d="M8 21V9h8v12"/>',
    skull: '<path d="M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/>',
    bio: '<circle cx="12" cy="7" r="3"/><circle cx="7" cy="15.5" r="3"/><circle cx="17" cy="15.5" r="3"/>',
    pin: '<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>'
  };

  var map, rc, data;
  var catById = {};
  var markersById = {};
  var layers = {};
  var progress = new Set(store.get(PROGRESS_KEY, []));
  var filters = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function badgeSize() {
    var w = window.innerWidth;
    return w <= 480 ? 18 : w <= 767 ? 20 : 24;
  }

  /* --- Popup sizing ---
     A popup has to fit inside the map with its close button showing. On phones the map is only about 340px tall,
     so the popup's height is capped (its middle scrolls) and it keeps clear of the zoom buttons on the right. */
  function popupLayout() {
    var el = map.getContainer();
    var phone = PHONE.matches;
    var edge = phone ? 12 : 24;
    // Keep popups out of the strip on the right where the zoom buttons sit (they draw above popups), and above the
    // attribution line at the bottom.
    var zoom = el.querySelector('.leaflet-control-zoom');
    var attr = el.querySelector('.leaflet-control-attribution');
    var padTL = [edge, edge];
    var padBR = [Math.max(edge, (zoom ? zoom.offsetWidth : 40) + 20), Math.max(edge, (attr ? attr.offsetHeight : 18) + 8)];
    // 72px covers the popup's margin, border, tip and the marker offset; 36px its side margins and border.
    var maxH = Math.max(150, el.clientHeight - padTL[1] - padBR[1] - 72);
    var maxW = Math.max(180, Math.min(phone ? 300 : 320, el.clientWidth - padTL[0] - padBR[0] - 36));
    return {
      maxWidth: maxW,
      minWidth: Math.min(200, maxW),
      maxHeight: maxH,
      autoPanPaddingTopLeft: padTL,
      autoPanPaddingBottomRight: padBR
    };
  }

  function applyPopupLayout() {
    var o = popupLayout();
    map.getContainer().style.setProperty('--popup-max-h', o.maxHeight + 'px');
    Object.keys(markersById).forEach(function (id) {
      var p = markersById[id].getPopup();
      if (p) L.setOptions(p, { maxWidth: o.maxWidth, minWidth: o.minWidth, autoPanPaddingTopLeft: o.autoPanPaddingTopLeft, autoPanPaddingBottomRight: o.autoPanPaddingBottomRight });
    });
  }

  // After the map pans to fit a popup, make sure the page shows it too: not under the sticky header, not under the
  // floating Layers button, not off screen.
  function keepPopupOnScreen(popup) {
    var el = popup.getElement && popup.getElement();
    if (!el || !el.isConnected) return;
    var r = el.getBoundingClientRect();
    var top = 0;
    var header = document.querySelector('.site-header');
    if (header && /sticky|fixed/.test(getComputedStyle(header).position)) top = Math.max(0, header.getBoundingClientRect().bottom);
    var bottom = window.innerHeight;
    var toggle = document.getElementById('filters-toggle');
    if (toggle && getComputedStyle(toggle).display !== 'none' && !toggle.classList.contains('is-hidden')) bottom = toggle.getBoundingClientRect().top;
    var dy = 0;
    if (r.top < top + 8) dy = r.top - top - 8;
    else if (r.bottom > bottom - 8) dy = Math.min(r.bottom - bottom + 8, r.top - top - 8);
    if (Math.abs(dy) > 1) window.scrollBy({ top: dy, behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth' });
  }

  function iconFor(cat, found) {
    var s = badgeSize();
    // On touch screens the tappable area is 28px even where the dot is drawn smaller.
    var hit = COARSE.matches ? Math.max(s, 28) : s;
    return L.divIcon({
      className: 'poi-marker',
      html: '<div class="poi-dot' + (found ? ' is-found' : '') + '" style="--poi-color:' + cat.color + ';width:' + s + 'px;height:' + s + 'px">' +
        '<svg class="poi-glyph" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[cat.icon] || ICONS.pin) + '</svg>' +
        (found ? '<span class="poi-check" aria-hidden="true">✓</span>' : '') + '</div>',
      iconSize: [hit, hit],
      iconAnchor: [hit / 2, hit / 2],
      popupAnchor: [0, -s / 2]
    });
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', function () {
    var dataEl = document.getElementById('map-data');
    if (!dataEl || typeof L === 'undefined') return;
    data = JSON.parse(dataEl.textContent);
    data.categories.forEach(function (c) { catById[c.id] = c; });

    var saved = store.get(FILTER_KEY, null);
    filters = {};
    data.categories.forEach(function (c) {
      filters[c.id] = saved && typeof saved[c.id] === 'boolean' ? saved[c.id] : !!c.defaultOn;
    });

    initMap();
    buildMarkers();
    initFilters();
    initMobileFilters();
    initSearch();
    updateCounts();
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  });

  /* --- Map --- */
  function initMap() {
    var W = data.image.width;
    var H = data.image.height;
    var el = document.getElementById('map-canvas');
    var base = el.getAttribute('data-base') || '/images/map/manhattan-base.webp';

    map = L.map('map-canvas', {
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 140,
      maxBoundsViscosity: 0.9
    });
    rc = new L.RasterCoords(map, [W, H]);
    var bounds = rc.getMaxBounds();
    L.imageOverlay(base, bounds, { alt: 'Division Resurgence in-game map of Midtown Manhattan' }).addTo(map);

    map.attributionControl.setPrefix(false);
    // Short on phones so it stays on one line; the full credit is in the paragraph under the map.
    var wiki = '<a href="https://thedivision.fandom.com/wiki/Map:Tom_Clancy%27s_The_Division_Resurgence/New_York_City" target="_blank" rel="noopener noreferrer">';
    map.attributionControl.addAttribution(PHONE.matches
      ? 'Locations: ' + wiki + 'Division Wiki</a> (CC BY-SA)'
      : 'Locations: ' + wiki + 'The Division Wiki community map</a> (CC BY-SA)');

    L.control.zoom({ position: 'topright' }).addTo(map);

    function fit() {
      map.invalidateSize();
      var z = map.getBoundsZoom(bounds, false, [0, 0]);
      map.setMinZoom(z - 0.25);
      map.setMaxZoom(z + 3);
      map.fitBounds(bounds, { padding: [0, 0], animate: false });
    }
    fit();
    var softBounds = bounds.pad(0.12);
    map.setMaxBounds(softBounds);
    requestAnimationFrame(fit);

    // Re-fit only when the map's width changes (phones fire resize events while the toolbars slide in and out).
    var lastW = el.clientWidth;
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        if (el.clientWidth !== lastW) {
          lastW = el.clientWidth;
          if (!openPopup) fit();
        }
        applyPopupLayout();
      }, 150);
    });

    // The max bounds would undo the pan that brings a popup near the map's edge into view (its close button ended up
    // above the top of the map on phones). Lift them while a popup is open. When it closes, go back to the view from
    // before the popup panned the map, unless the visitor dragged or zoomed in the meantime.
    var openPopup = null;
    var autopanning = false;
    var viewBeforePopup = null;
    map.on('autopanstart', function () {
      autopanning = true;
      if (!viewBeforePopup) viewBeforePopup = map.getCenter();
    });
    map.on('dragstart zoomstart', function () { if (openPopup) viewBeforePopup = null; });
    map.on('popupopen', function (e) {
      openPopup = e.popup;
      map.setMaxBounds(null);
      // Fade the bottom edge of a popup whose middle scrolls, until it's scrolled to the end.
      var body = e.popup.getElement() && e.popup.getElement().querySelector('.popup-body');
      if (body && body.scrollHeight > body.clientHeight + 2) {
        body.classList.add('is-scrollable');
        body.addEventListener('scroll', function () {
          body.classList.toggle('is-at-end', body.scrollTop + body.clientHeight >= body.scrollHeight - 2);
        }, { passive: true });
      }
      var settle = function () { keepPopupOnScreen(e.popup); };
      if (autopanning) { autopanning = false; map.once('moveend', settle); }
      else requestAnimationFrame(settle);
    });
    map.on('popupclose', function (e) {
      if (openPopup === e.popup) openPopup = null;
      // Deferred: when another marker is tapped, the old popup closes and the new one opens in the same tick.
      setTimeout(function () {
        if (openPopup) return;
        var back = viewBeforePopup;
        viewBeforePopup = null;
        if (back) {
          map.once('moveend', function () { if (!openPopup) map.setMaxBounds(softBounds); });
          map.panTo(back, { animate: !REDUCED_MOTION.matches, duration: 0.3 });
        } else {
          map.setMaxBounds(softBounds);
        }
      }, 0);
    });
    // Escape closes the popup even when focus is inside it (Leaflet only listens while the map itself has focus).
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openPopup) map.closePopup(); });

    // Scroll-wheel zoom only after the map is clicked, so the page still scrolls normally.
    var hint = document.getElementById('map-zoom-hint');
    map.on('click', function () { map.scrollWheelZoom.enable(); if (hint) hint.hidden = true; });
    el.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
    el.addEventListener('wheel', function () {
      if (!map.scrollWheelZoom.enabled() && hint) {
        hint.hidden = false;
        clearTimeout(hint._t);
        hint._t = setTimeout(function () { hint.hidden = true; }, 1600);
      }
    }, { passive: true });

    // Contributor helper: Shift+Click copies pixel coordinates in the map coordinate space.
    map.on('click', function (e) {
      if (!e.originalEvent.shiftKey) return;
      var p = rc.project(e.latlng);
      var txt = 'x: ' + Math.round(p.x) + ', y: ' + Math.round(p.y);
      if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(function () {});
      L.popup({ className: 'coord-popup' }).setLatLng(e.latlng).setContent('<span class="coord-readout">' + txt + '</span>').openOn(map);
    });
  }

  /* --- Markers --- */
  function buildMarkers() {
    var o = popupLayout();
    map.getContainer().style.setProperty('--popup-max-h', o.maxHeight + 'px');
    data.categories.forEach(function (c) { layers[c.id] = L.layerGroup(); });
    data.pois.forEach(function (poi) {
      var cat = catById[poi.category];
      if (!cat) return;
      var m = L.marker(rc.unproject([poi.x, poi.y]), {
        icon: iconFor(cat, progress.has(poi.id)),
        title: poi.name,
        keyboard: true,
        riseOnHover: CAN_HOVER.matches
      });
      m.bindPopup(function () { return buildPopup(poi, cat); }, {
        maxWidth: o.maxWidth,
        minWidth: o.minWidth,
        autoPanPaddingTopLeft: o.autoPanPaddingTopLeft,
        autoPanPaddingBottomRight: o.autoPanPaddingBottomRight
      });
      if (CAN_HOVER.matches) {
        m.bindTooltip(esc(poi.name), { direction: 'top', offset: [0, -badgeSize() / 2], className: 'map-tooltip' });
      }
      // The name tooltip would sit under the popup that just opened (deferred: the same click also reopens it).
      m.on('popupopen', function () { setTimeout(function () { if (m.getTooltip() && m.isTooltipOpen()) m.closeTooltip(); }, 0); });
      // Hand keyboard focus back to the marker when its popup closes, instead of dropping it on the page.
      m.on('popupclose', function (e) {
        var pop = e.popup.getElement();
        var icon = m.getElement();
        if (pop && icon && pop.contains(document.activeElement)) icon.focus({ preventScroll: true });
      });
      m.poi = poi;
      markersById[poi.id] = m;
      layers[cat.id].addLayer(m);
    });
    data.categories.forEach(function (c) { if (filters[c.id]) layers[c.id].addTo(map); });
  }

  function buildPopup(poi, cat) {
    var found = progress.has(poi.id);
    var flags = [];
    if (poi.approx) flags.push('<span class="popup-flag" title="Dark Zone positions are converted from a schematic map and may be off by up to half a block.">≈ approximate</span>');
    if (cat.wip) flags.push('<span class="popup-flag" title="The community is still mapping this category.">partial layer</span>');
    // Header and buttons stay put; only the middle scrolls when a popup is taller than the map allows.
    var h = '<div class="map-popup">';
    h += '<div class="popup-header"><span class="popup-badge" style="--poi-color:' + cat.color + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[cat.icon] || ICONS.pin) + '</svg></span>';
    h += '<div><div class="popup-name">' + esc(poi.name) + '</div><div class="popup-meta">' + esc(cat.label) +
      (poi.difficulty ? ' · ' + esc(poi.difficulty) : '') + (poi.level ? ' · Lv ' + esc(poi.level) : '') + '</div></div></div>';
    h += '<div class="popup-body">';
    if (flags.length) h += '<div class="popup-flags">' + flags.join('') + '</div>';
    if (poi.code) {
      var isRandom = /random/i.test(poi.code);
      h += '<div class="popup-code"><span class="popup-code__label">Code</span> <strong class="' + (isRandom ? 'is-random' : '') + '">' + esc(poi.code) + '</strong></div>';
    }
    if (poi.description) h += '<p class="popup-desc">' + esc(poi.description) + '</p>';
    if (poi.codeNote) h += '<p class="popup-note">' + esc(poi.codeNote) + '</p>';
    if (poi.missions && poi.missions.length) {
      h += '<ul class="popup-list">' + poi.missions.map(function (m) {
        return '<li><span>' + esc(m.name) + '</span>' + (m.level ? '<span class="popup-lv">Lv ' + esc(m.level) + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    if (poi.inside && poi.inside.length) {
      h += '<div class="popup-sub">Collectibles inside this mission</div><ul class="popup-list">' + poi.inside.map(function (i) {
        return '<li><span>' + esc(i.name) + '</span><span class="popup-lv">' + esc(i.type) + '</span></li>';
      }).join('') + '</ul>';
    }
    if (poi.amenities && poi.amenities.length) {
      h += '<div class="popup-amenities">' + poi.amenities.map(function (a) { return '<span class="popup-tag">' + esc(a) + '</span>'; }).join('') + '</div>';
    }
    h += '</div>';
    h += '<div class="popup-actions">';
    if (cat.trackable) {
      h += '<button type="button" class="popup-btn' + (found ? ' popup-btn--found' : '') + '" data-toggle-found="' + esc(poi.id) + '">' + (found ? '✓ Found' : 'Mark as found') + '</button>';
    }
    h += '<button type="button" class="popup-btn popup-btn--ghost" data-copy-link="' + esc(poi.id) + '">Copy link</button>';
    h += '</div></div>';
    return h;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-toggle-found],[data-copy-link]') : null;
    if (!t) return;
    if (t.hasAttribute('data-toggle-found')) toggleFound(t.getAttribute('data-toggle-found'), t);
    if (t.hasAttribute('data-copy-link')) {
      var url = location.origin + location.pathname + '#poi=' + encodeURIComponent(t.getAttribute('data-copy-link'));
      var done = function () { t.textContent = 'Link copied'; setTimeout(function () { t.textContent = 'Copy link'; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { location.hash = 'poi=' + t.getAttribute('data-copy-link'); });
      else location.hash = 'poi=' + t.getAttribute('data-copy-link');
    }
  });

  function toggleFound(id, btn) {
    if (progress.has(id)) progress.delete(id); else progress.add(id);
    store.set(PROGRESS_KEY, Array.from(progress));
    var m = markersById[id];
    if (m) m.setIcon(iconFor(catById[m.poi.category], progress.has(id)));
    if (btn) {
      var f = progress.has(id);
      btn.className = 'popup-btn' + (f ? ' popup-btn--found' : '');
      btn.textContent = f ? '✓ Found' : 'Mark as found';
    }
    updateCounts();
  }

  /* --- Filters --- */
  function setCategory(id, on) {
    filters[id] = on;
    if (on) layers[id].addTo(map); else map.removeLayer(layers[id]);
    var cb = document.querySelector('.filter-checkbox[data-category="' + id + '"]');
    if (cb) cb.checked = on;
  }

  function initFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(function (cb) {
      var id = cb.getAttribute('data-category');
      cb.checked = !!filters[id];
      cb.addEventListener('change', function () { setCategory(id, cb.checked); store.set(FILTER_KEY, filters); });
    });
    document.querySelectorAll('[data-group-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.getAttribute('data-group-toggle');
        var on = btn.getAttribute('data-mode') === 'all';
        data.categories.filter(function (c) { return c.group === group; }).forEach(function (c) { setCategory(c.id, on); });
        store.set(FILTER_KEY, filters);
      });
    });
    var reset = document.getElementById('map-reset-progress');
    if (reset) reset.addEventListener('click', function () {
      if (!progress.size) return;
      progress = new Set();
      store.set(PROGRESS_KEY, []);
      Object.keys(markersById).forEach(function (id) { var m = markersById[id]; m.setIcon(iconFor(catById[m.poi.category], false)); });
      updateCounts();
    });
  }

  function updateCounts() {
    data.categories.forEach(function (c) {
      var el = document.querySelector('[data-count-for="' + c.id + '"]');
      if (!el) return;
      if (c.trackable) {
        var foundN = data.pois.filter(function (p) { return p.category === c.id && progress.has(p.id); }).length;
        el.textContent = foundN + '/' + c.count;
        el.classList.toggle('is-complete', foundN === c.count);
      } else {
        el.textContent = c.count;
      }
    });
    var total = document.getElementById('map-progress-total');
    if (total) {
      var trackIds = data.pois.filter(function (p) { return catById[p.category] && catById[p.category].trackable; });
      var foundAll = trackIds.filter(function (p) { return progress.has(p.id); }).length;
      total.textContent = foundAll + ' / ' + trackIds.length;
    }
  }

  function initMobileFilters() {
    var toggle = document.getElementById('filters-toggle');
    var panel = document.getElementById('map-filters');
    var close = document.getElementById('filters-close');
    if (!toggle || !panel) return;
    var backdrop = document.createElement('div');
    backdrop.className = 'map-filters-backdrop';
    // Same parent as the panel, so both share one stacking context and the sheet stays above its backdrop.
    panel.parentNode.insertBefore(backdrop, panel);
    function open() { panel.classList.add('is-open'); backdrop.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); }
    function shut() { panel.classList.remove('is-open'); backdrop.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function () { panel.classList.contains('is-open') ? shut() : open(); });
    if (close) close.addEventListener('click', shut);
    backdrop.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
    // Only show the floating Layers button while the map is on screen.
    var canvas = document.getElementById('map-canvas');
    if ('IntersectionObserver' in window && canvas) {
      new IntersectionObserver(function (entries) {
        toggle.classList.toggle('is-hidden', !entries[0].isIntersecting && !panel.classList.contains('is-open'));
      }, { threshold: 0.15 }).observe(canvas);
    }
  }

  /* --- Search --- */
  function initSearch() {
    var input = document.getElementById('map-search');
    var list = document.getElementById('map-search-results');
    if (!input || !list) return;
    function render() {
      var q = input.value.trim().toLowerCase();
      list.innerHTML = '';
      if (q.length < 2) { list.hidden = true; return; }
      var hits = data.pois.filter(function (p) {
        return (p.name + ' ' + (p.description || '') + ' ' + (p.missions || []).map(function (m) { return m.name; }).join(' ') +
          ' ' + (p.inside || []).map(function (i) { return i.name; }).join(' ')).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 12);
      if (!hits.length) { list.innerHTML = '<li class="search-empty">No matches</li>'; list.hidden = false; return; }
      hits.forEach(function (p) {
        var c = catById[p.category];
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'search-hit';
        b.innerHTML = '<span class="filter-swatch" style="background:' + c.color + '"></span><span class="search-hit__name">' + esc(p.name) + '</span><span class="search-hit__cat">' + esc(c.label) + '</span>';
        b.addEventListener('click', function () { focusPoi(p.id); list.hidden = true; });
        li.appendChild(b);
        list.appendChild(li);
      });
      list.hidden = false;
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var first = list.querySelector('.search-hit'); if (first) first.click(); }
      if (e.key === 'Escape') { input.value = ''; render(); }
    });
  }

  function focusPoi(id) {
    var m = markersById[id];
    if (!m) return;
    var catId = m.poi.category;
    if (!filters[catId]) { setCategory(catId, true); store.set(FILTER_KEY, filters); }
    map.flyTo(m.getLatLng(), Math.max(map.getZoom(), map.getMinZoom() + 1.75), { duration: 0.6 });
    setTimeout(function () { m.openPopup(); }, 650);
  }

  function openFromHash() {
    var h = decodeURIComponent(location.hash || '');
    var mm = /#poi=([\w\-]+)/.exec(h);
    if (mm) focusPoi(mm[1]);
  }
})();
