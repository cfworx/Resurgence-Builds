/* ============================================================
   RESURGENCE MAP ENGINE: Interactive Manhattan Companion Map
   Division Resurgence · resurgencebuilds.com
   Data: src/data/pois.json (built by scripts/build-map-data.mjs)
   ============================================================ */
(function () {
  'use strict';

  var PROGRESS_KEY = 'rb-map-progress-v1';
  var FILTER_KEY = 'rb-map-filters-v2';
  var HIDE_KEY = 'rb-map-hide-found';
  var TAB_KEY = 'rb-map-tab';

  var PHONE = window.matchMedia('(max-width: 44.99em)');
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

  /* --- Glyphs (24x24 strokes), shaped after the game's own map icons --- */
  var ICONS = {
    house: '<path d="M4 11l8-6.5 8 6.5v9H4z"/><path d="M10 20v-5h4v5"/>',
    base: '<path d="M3 20h18M5 20V10M9.5 20V10M14.5 20V10M19 20V10M3 10l9-6 9 6z"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.5 7.8-8 9-4.5-1.2-8-4.5-8-9V6z"/><path d="M8 12l3 3 5-6"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    landmark: '<path d="M12 3l8 4H4z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8M3 21h18"/>',
    pin: '<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9l-5.4 2.6 1.2-6-4.5-4.2 6.1-.7z"/>',
    side: '<path d="M12 3v18M6 5h11l-2 3.5 2 3.5H6"/>',
    hex: '<path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M12 7.6l4 2.3v4.2l-4 2.3-4-2.3V9.9z"/>',
    alert: '<path d="M12 7v6M12 16.5h.01"/><path d="M4 4l2 2M20 4l-2 2M2 12h2M20 12h2M4 20l2-2M20 20l-2-2"/>',
    nest: '<path d="M3 20v-7l7-6 7 6v7"/><path d="M14 4v7M14 4h6l-1.5 2 1.5 2h-6"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    radar: '<path d="M4.9 19.1A10 10 0 1 1 19.1 19.1"/><path d="M8.5 15.5a5 5 0 1 1 7 0"/><circle cx="12" cy="12" r="1.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
    crate: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    echo: '<rect x="3" y="7" width="12" height="9" rx="2"/><path d="M15 10l6-3v9l-6-3"/><path d="M7 19h4"/>',
    frame: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><circle cx="12" cy="10" r="2.5"/><path d="M7 18c1-3 3-4 5-4s4 1 5 4"/>',
    audio: '<path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 11v2"/>',
    ammo: '<rect x="4" y="6" width="16" height="13" rx="1"/><path d="M8.5 6v13M12 6v13M15.5 6v13"/>',
    extract: '<path d="M12 21V8"/><path d="M7 13l5-5 5 5"/><path d="M4 3h16"/>',
    gate: '<path d="M4 21V5h16v16"/><path d="M8 21V9h8v12"/>',
    skull: '<path d="M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/>',
    bio: '<circle cx="12" cy="7" r="3"/><circle cx="7" cy="15.5" r="3"/><circle cx="17" cy="15.5" r="3"/>'
  };
  var HUB_CATS = { safe_house: 1, base: 1, settlement: 1 };

  var map, rc, data;
  var catById = {};
  var markersById = {};
  var poiById = {};
  var layers = {};
  var progress = new Set(store.get(PROGRESS_KEY, []));
  var filters = null;
  var hideFound = !!store.get(HIDE_KEY, false);
  var trackItems = []; // every collectible, with or without a pin: {id, cat, coll, pin}

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function glyph(cat) { return '<svg class="poi-glyph" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[cat.icon] || ICONS.pin) + '</svg>'; }

  function badgeSize(cat) {
    var w = window.innerWidth;
    var s = w <= 480 ? 22 : w <= 767 ? 24 : 26;
    if (cat && (cat.id === 'ammo' || cat.id === 'dz_contaminated')) s -= 6;
    if (cat && HUB_CATS[cat.id]) s += 4;
    return s;
  }

  /* --- Popup sizing: a popup always fits inside the map with its close button showing --- */
  function popupLayout() {
    var el = map.getContainer();
    var phone = PHONE.matches;
    var edge = phone ? 12 : 24;
    var zoom = el.querySelector('.leaflet-control-zoom');
    var attr = el.querySelector('.leaflet-control-attribution');
    var padTL = [Math.max(edge, 60), edge];
    var padBR = [Math.max(edge, (zoom ? zoom.offsetWidth : 40) + 20), Math.max(edge, (attr ? attr.offsetHeight : 18) + 8)];
    var maxH = Math.max(160, el.clientHeight - padTL[1] - padBR[1] - 72);
    var maxW = Math.max(200, Math.min(phone ? 300 : 340, el.clientWidth - padTL[0] - padBR[0] - 36));
    return { maxWidth: maxW, minWidth: Math.min(230, maxW), maxHeight: maxH, autoPanPaddingTopLeft: padTL, autoPanPaddingBottomRight: padBR };
  }
  function applyPopupLayout() {
    var o = popupLayout();
    map.getContainer().style.setProperty('--popup-max-h', o.maxHeight + 'px');
    Object.keys(markersById).forEach(function (id) {
      var p = markersById[id].getPopup();
      if (p) L.setOptions(p, { maxWidth: o.maxWidth, minWidth: o.minWidth, autoPanPaddingTopLeft: o.autoPanPaddingTopLeft, autoPanPaddingBottomRight: o.autoPanPaddingBottomRight });
    });
  }

  function iconFor(poi, cat, found) {
    var s = badgeSize(cat);
    var hit = COARSE.matches ? Math.max(s, 30) : s;
    var num = (poi.category === 'shd_crate' || poi.category === 'encrypted_crate') ? poi.crateNumber || (/(\d+)$/.exec(poi.name) || [])[1] : poi.category === 'echo' ? poi.number : null;
    return L.divIcon({
      className: 'poi-marker',
      html: '<div class="poi-dot' + (HUB_CATS[cat.id] ? ' poi-dot--hub' : '') + (found ? ' is-found' : '') + '" style="--poi-color:' + cat.color + ';width:' + s + 'px;height:' + s + 'px">' +
        glyph(cat) + (found ? '<span class="poi-check" aria-hidden="true">✓</span>' : '') +
        (num != null && !found ? '<span class="poi-num" aria-hidden="true">' + String(num).padStart(2, '0') + '</span>' : '') + '</div>',
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
    data.pois.forEach(function (p) { poiById[p.id] = p; });
    buildTrackItems();

    var saved = store.get(FILTER_KEY, null);
    filters = {};
    data.categories.forEach(function (c) {
      filters[c.id] = saved && typeof saved[c.id] === 'boolean' ? saved[c.id] : !!c.defaultOn;
    });

    drawFilterChips();
    initMap();
    buildMarkers();
    initFilters();
    initPanel();
    initChecklist();
    initSearch();
    updateCounts();
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  });

  // Collectibles inside instanced missions have no pin; they share ids with the checklist rows ("inside-<name>").
  function buildTrackItems() {
    data.pois.forEach(function (p) {
      var c = catById[p.category];
      if (c && c.trackable) trackItems.push({ id: p.id, cat: p.category, coll: p.collection, pin: p.id });
      (p.inside || []).forEach(function (i) {
        var cat = i.type === 'ECHO' ? 'echo' : i.type === 'Audio log' ? 'audio_log' : null;
        if (cat) trackItems.push({ id: 'inside-' + slug(i.name), cat: cat, pin: p.id, name: i.name });
      });
    });
    // checklist rows know each item's collection (set by the page); pick them up
    document.querySelectorAll('[data-found-id]').forEach(function (cb) {
      var id = cb.getAttribute('data-found-id');
      var t = trackItems.find(function (x) { return x.id === id; });
      if (t && cb.getAttribute('data-coll')) t.coll = cb.getAttribute('data-coll');
    });
  }

  function drawFilterChips() {
    document.querySelectorAll('.filter-chip[data-icon]').forEach(function (el) {
      el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[el.getAttribute('data-icon')] || ICONS.pin) + '</svg>';
    });
  }

  /* --- Map --- */
  function initMap() {
    var W = data.image.width;
    var H = data.image.height;
    var el = document.getElementById('map-canvas');
    var base = el.getAttribute('data-base') || '/images/map/manhattan-base.webp';

    map = L.map('map-canvas', {
      crs: L.CRS.Simple, zoomControl: false, attributionControl: true, scrollWheelZoom: false,
      zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 120, maxBoundsViscosity: 0.9
    });
    rc = new L.RasterCoords(map, [W, H]);
    var bounds = rc.getMaxBounds();
    L.imageOverlay(base, bounds, { alt: 'Division Resurgence in-game map of Midtown Manhattan' }).addTo(map);

    map.attributionControl.setPrefix(false);
    var wiki = '<a href="https://thedivision.fandom.com/wiki/Map:Tom_Clancy%27s_The_Division_Resurgence/New_York_City" target="_blank" rel="noopener noreferrer">';
    map.attributionControl.addAttribution(PHONE.matches ? 'Base data: ' + wiki + 'Division Wiki</a> (CC BY-SA)' : 'Base data: ' + wiki + 'The Division Wiki community map</a> (CC BY-SA), checked in game');

    L.control.zoom({ position: 'topright' }).addTo(map);
    addFullscreenControl();

    // labels for the off-map mission bubbles, on the left edge like the game
    data.pois.forEach(function (p) {
      if (p.category !== 'offmap') return;
      L.marker(rc.unproject([p.x + 22, p.y]), { interactive: false, keyboard: false, icon: L.divIcon({ className: 'map-edge-label', html: esc(p.name), iconSize: null, iconAnchor: [0, 8] }) }).addTo(map);
    });

    function fit() {
      map.invalidateSize();
      var z = map.getBoundsZoom(bounds, false, [0, 0]);
      map.setMinZoom(z - 0.25);
      map.setMaxZoom(z + 3.25);
      if (PHONE.matches) {
        var cover = map.getBoundsZoom(bounds, true);
        map.setView(rc.unproject([W * 0.47, H * 0.52]), Math.min(cover, z + 3), { animate: false });
      } else {
        map.fitBounds(bounds, { padding: [0, 0], animate: false });
      }
    }
    fit();
    var softBounds = bounds.pad(0.12);
    map.setMaxBounds(softBounds);
    requestAnimationFrame(fit);
    map._rbFit = fit;

    var lastW = el.clientWidth, lastH = el.clientHeight;
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        map.invalidateSize();
        if (el.clientWidth !== lastW || Math.abs(el.clientHeight - lastH) > 120) {
          lastW = el.clientWidth; lastH = el.clientHeight;
          if (!openPopup) fit();
        }
        applyPopupLayout();
      }, 150);
    });

    // Lift the max bounds while a popup is open so autopan can bring an edge popup fully into view; afterwards go
    // back to the view from before, unless the visitor moved the map in the meantime.
    var openPopup = null, autopanning = false, viewBeforePopup = null;
    map.on('autopanstart', function () { autopanning = true; if (!viewBeforePopup) viewBeforePopup = map.getCenter(); });
    map.on('dragstart zoomstart', function () { if (openPopup) viewBeforePopup = null; });
    map.on('popupopen', function (e) {
      openPopup = e.popup;
      map.setMaxBounds(null);
      var body = e.popup.getElement() && e.popup.getElement().querySelector('.popup-body');
      if (body && body.scrollHeight > body.clientHeight + 2) {
        body.classList.add('is-scrollable');
        body.addEventListener('scroll', function () { body.classList.toggle('is-at-end', body.scrollTop + body.clientHeight >= body.scrollHeight - 2); }, { passive: true });
      }
      if (autopanning) autopanning = false;
    });
    map.on('popupclose', function (e) {
      if (openPopup === e.popup) openPopup = null;
      setTimeout(function () {
        if (openPopup) return;
        var back = viewBeforePopup; viewBeforePopup = null;
        if (back) {
          map.once('moveend', function () { if (!openPopup) map.setMaxBounds(softBounds); });
          map.panTo(back, { animate: !REDUCED_MOTION.matches, duration: 0.3 });
        } else map.setMaxBounds(softBounds);
      }, 0);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openPopup) map.closePopup(); });

    // Scroll-wheel zoom only after the map is clicked (or in full screen), so the page still scrolls normally.
    var hint = document.getElementById('map-zoom-hint');
    map.on('click', function () { map.scrollWheelZoom.enable(); if (hint) hint.hidden = true; });
    el.addEventListener('mouseleave', function () { if (!isFull()) map.scrollWheelZoom.disable(); });
    el.addEventListener('wheel', function () {
      if (!map.scrollWheelZoom.enabled() && hint) {
        hint.hidden = false; clearTimeout(hint._t);
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

  /* --- Full screen: the map and its panel fill the window (works on phones, where the Fullscreen API often doesn't) --- */
  function isFull() { var a = document.getElementById('map-app'); return a && a.classList.contains('is-full'); }
  function addFullscreenControl() {
    var Ctl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        var box = L.DomUtil.create('div', 'leaflet-bar');
        var a = L.DomUtil.create('a', '', box);
        a.href = '#'; a.setAttribute('role', 'button');
        var draw = function () {
          var on = isFull();
          a.title = on ? 'Exit full screen' : 'Full screen';
          a.setAttribute('aria-label', a.title);
          a.innerHTML = on ? '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
        };
        draw();
        L.DomEvent.on(a, 'click', function (e) {
          L.DomEvent.preventDefault(e); L.DomEvent.stopPropagation(e);
          var app = document.getElementById('map-app');
          var on = !app.classList.contains('is-full');
          app.classList.toggle('is-full', on);
          document.documentElement.classList.toggle('map-full-lock', on);
          if (on) map.scrollWheelZoom.enable();
          draw();
          setTimeout(function () { map.invalidateSize(); applyPopupLayout(); }, 50);
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && isFull() && !document.querySelector('.leaflet-popup') && !document.getElementById('map-panel').classList.contains('is-open')) a.click();
        });
        return box;
      }
    });
    new Ctl().addTo(map);
  }

  /* --- Markers --- */
  function buildMarkers() {
    var o = popupLayout();
    map.getContainer().style.setProperty('--popup-max-h', o.maxHeight + 'px');
    data.categories.forEach(function (c) { layers[c.id] = L.layerGroup(); });
    data.pois.forEach(function (poi) {
      var cat = catById[poi.category];
      if (!cat) return;
      var m = L.marker(rc.unproject([poi.x, poi.y]), { icon: iconFor(poi, cat, progress.has(poi.id)), title: poi.name, keyboard: true, riseOnHover: CAN_HOVER.matches });
      m.bindPopup(function () { return buildPopup(poi, cat); }, { maxWidth: o.maxWidth, minWidth: o.minWidth, autoPanPaddingTopLeft: o.autoPanPaddingTopLeft, autoPanPaddingBottomRight: o.autoPanPaddingBottomRight });
      if (CAN_HOVER.matches) m.bindTooltip(esc(poi.name), { direction: 'top', offset: [0, -badgeSize(cat) / 2], className: 'map-tooltip' });
      m.on('popupopen', function () { setTimeout(function () { if (m.getTooltip() && m.isTooltipOpen()) m.closeTooltip(); }, 0); });
      m.on('popupclose', function (e) {
        var pop = e.popup.getElement(); var icon = m.getElement();
        if (pop && icon && pop.contains(document.activeElement)) icon.focus({ preventScroll: true });
      });
      m.poi = poi;
      markersById[poi.id] = m;
      if (!(hideFound && progress.has(poi.id))) layers[cat.id].addLayer(m);
    });
    data.categories.forEach(function (c) { if (filters[c.id]) layers[c.id].addTo(map); });
  }

  function insideId(name) { return 'inside-' + slug(name); }

  function buildPopup(poi, cat) {
    var found = progress.has(poi.id);
    var h = '<div class="map-popup" style="--poi-color:' + cat.color + '">';
    var num = poi.category === 'echo' && poi.number ? 'ECHO ' + String(poi.number).padStart(2, '0') : '';
    var meta = [num || cat.label];
    if (poi.collection) meta.push(poi.collection);
    if (poi.difficulty) meta.push(poi.difficulty);
    if (poi.level) meta.push('Level ' + poi.level);
    h += '<div class="popup-header"><span class="popup-badge"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[cat.icon] || ICONS.pin) + '</svg></span>';
    h += '<div><div class="popup-name">' + esc(poi.name) + '</div><div class="popup-meta">' + esc(meta.join(' · ')) + '</div></div></div>';
    h += '<div class="popup-body">';
    var tags = [];
    if (poi.district) tags.push('<span class="popup-district">' + esc(poi.district) + '</span>');
    if (poi.verified) tags.push('<span class="popup-verified" title="Compared with the game itself in November 2026">Checked in game</span>');
    if (poi.approx) tags.push('<span class="popup-flag" title="Dark Zone positions are converted from a schematic map and may be off by up to half a block.">≈ approximate</span>');
    else if (cat.wip && !poi.verified) tags.push('<span class="popup-flag" title="This layer is still being mapped.">partial layer</span>');
    if (tags.length) h += '<div class="popup-tags">' + tags.join('') + '</div>';
    if (poi.gameText) h += '<p class="popup-quote">' + esc(poi.gameText) + '</p>';
    if (poi.code) {
      var isRandom = /random/i.test(poi.code);
      h += '<div class="popup-code"><span class="popup-code__label">Code</span><strong class="' + (isRandom ? 'is-random' : '') + '">' + esc(poi.code) + '</strong></div>';
    }
    if (poi.description) h += '<p class="popup-desc">' + esc(poi.description.replace(/^Location:\s*/, '')) + '</p>';
    if (poi.codeNote) h += '<p class="popup-note">' + esc(poi.codeNote) + '</p>';
    if (poi.note) h += '<p class="popup-note">' + esc(poi.note) + '</p>';
    if (poi.missions && poi.missions.length) {
      h += '<ul class="popup-list">' + poi.missions.map(function (m) {
        return '<li><span>' + esc(m.name) + '</span>' + (m.level ? '<span class="popup-lv">Lv ' + esc(m.level) + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    if (poi.inside && poi.inside.length) {
      h += '<div class="popup-sub">Collectibles inside this mission</div><ul class="popup-list">' + poi.inside.map(function (i) {
        var id = insideId(i.name); var f = progress.has(id);
        var trackable = i.type === 'ECHO' || i.type === 'Audio log';
        return '<li><span>' + (f ? '✓ ' : '') + esc(i.name) + '</span><span class="popup-lv">' + esc(i.type) +
          (trackable ? ' <button type="button" class="map-btn map-btn--ghost" style="min-height:28px;padding:2px 8px" data-toggle-found="' + esc(id) + '">' + (f ? 'Found' : 'Mark') + '</button>' : '') + '</span></li>';
      }).join('') + '</ul>';
    }
    if (poi.amenities && poi.amenities.length) {
      h += '<div class="popup-amenities">' + poi.amenities.map(function (a) { return '<span class="popup-tag">' + esc(a) + '</span>'; }).join('') + '</div>';
    }
    h += '</div><div class="popup-actions">';
    if (cat.trackable) h += '<button type="button" class="map-btn' + (found ? ' map-btn--found' : '') + '" data-toggle-found="' + esc(poi.id) + '">' + (found ? '✓ Found' : 'Mark as found') + '</button>';
    h += '<button type="button" class="map-btn map-btn--ghost" data-copy-link="' + esc(poi.id) + '">Copy link</button>';
    h += '</div></div>';
    return h;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-toggle-found],[data-copy-link]') : null;
    if (!t) return;
    if (t.hasAttribute('data-toggle-found')) {
      var id = t.getAttribute('data-toggle-found');
      setFound(id, !progress.has(id));
      if (t.closest('.popup-list')) { var m = openMarker(); if (m) m.setPopupContent(buildPopup(m.poi, catById[m.poi.category])); }
      else if (t.classList.contains('map-btn')) {
        var f = progress.has(id);
        t.className = 'map-btn' + (f ? ' map-btn--found' : '');
        t.textContent = f ? '✓ Found' : 'Mark as found';
      }
    }
    if (t.hasAttribute('data-copy-link')) {
      var url = location.origin + location.pathname + '#poi=' + encodeURIComponent(t.getAttribute('data-copy-link'));
      var done = function () { t.textContent = 'Link copied'; setTimeout(function () { t.textContent = 'Copy link'; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { location.hash = 'poi=' + t.getAttribute('data-copy-link'); });
      else location.hash = 'poi=' + t.getAttribute('data-copy-link');
    }
  });

  function openMarker() {
    var found = null;
    Object.keys(markersById).forEach(function (id) { if (markersById[id].isPopupOpen()) found = markersById[id]; });
    return found;
  }

  function setFound(id, on) {
    if (on) progress.add(id); else progress.delete(id);
    store.set(PROGRESS_KEY, Array.from(progress));
    var m = markersById[id];
    if (m) {
      m.setIcon(iconFor(m.poi, catById[m.poi.category], on));
      applyHide(m);
    }
    var cb = document.querySelector('[data-found-id="' + cssEsc(id) + '"]');
    if (cb) { cb.checked = on; var row = cb.closest('.check-row'); if (row) row.classList.toggle('is-found', on); }
    updateCounts();
  }
  function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'); }

  function applyHide(m) {
    var layer = layers[m.poi.category];
    var shouldShow = !(hideFound && progress.has(m.poi.id));
    if (shouldShow && !layer.hasLayer(m)) layer.addLayer(m);
    if (!shouldShow && layer.hasLayer(m)) { if (m.isPopupOpen()) { /* keep it until the popup closes */ m.once('popupclose', function () { applyHide(m); }); return; } layer.removeLayer(m); }
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
    var hide = document.getElementById('hide-found');
    if (hide) {
      hide.checked = hideFound;
      hide.addEventListener('change', function () {
        hideFound = hide.checked; store.set(HIDE_KEY, hideFound);
        Object.keys(markersById).forEach(function (id) { applyHide(markersById[id]); });
      });
    }
    var reset = document.getElementById('map-reset-progress');
    if (reset) reset.addEventListener('click', function () {
      if (!progress.size) return;
      if (reset.dataset.armed !== '1') { reset.dataset.armed = '1'; reset.textContent = 'Tap again to clear ' + progress.size + ' found'; setTimeout(function () { reset.dataset.armed = ''; reset.textContent = 'Reset progress'; }, 4000); return; }
      var ids = Array.from(progress);
      ids.forEach(function (id) { setFound(id, false); });
      reset.dataset.armed = ''; reset.textContent = 'Reset progress';
    });
  }

  function updateCounts() {
    var byCat = {}, byColl = {};
    trackItems.forEach(function (t) {
      var f = progress.has(t.id) ? 1 : 0;
      (byCat[t.cat] = byCat[t.cat] || [0, 0]); byCat[t.cat][0] += f; byCat[t.cat][1]++;
      if (t.coll) { var k = t.cat + ':' + t.coll; (byColl[k] = byColl[k] || [0, 0]); byColl[k][0] += f; byColl[k][1]++; }
    });
    var all = [0, 0];
    Object.keys(byCat).forEach(function (c) {
      var v = byCat[c]; all[0] += v[0]; all[1] += v[1];
      var txt = v[0] + '/' + v[1]; var done = v[0] === v[1];
      var a = document.querySelector('[data-count-for="' + c + '"]'); if (a) { a.textContent = txt; a.classList.toggle('is-complete', done); }
      var b = document.querySelector('[data-check-count="' + c + '"]'); if (b) { b.textContent = txt; b.classList.toggle('is-complete', done); }
      var bar = document.querySelector('[data-check-bar="' + c + '"]'); if (bar) bar.style.width = (100 * v[0] / v[1]) + '%';
    });
    Object.keys(byColl).forEach(function (k) {
      var el = document.querySelector('[data-coll-count="' + cssEsc(k) + '"]'); if (el) el.textContent = byColl[k][0] + '/' + byColl[k][1];
    });
    var t = all[0] + ' / ' + all[1];
    var total = document.getElementById('map-progress-total'); if (total) total.textContent = t;
    var bar2 = document.getElementById('map-progress-bar'); if (bar2) bar2.style.width = (all[1] ? 100 * all[0] / all[1] : 0) + '%';
    var tc = document.getElementById('tab-check-count'); if (tc) tc.textContent = all[0] + '/' + all[1];
    var dc = document.getElementById('dock-count'); if (dc) dc.textContent = all[0] + '/' + all[1];
  }

  /* --- Panel: tabs on every screen; on phones it is a bottom sheet opened from the dock --- */
  var panel, backdrop;
  function showTab(name) {
    ['layers', 'check'].forEach(function (n) {
      var tab = document.getElementById(n === 'layers' ? 'tab-layers' : 'tab-check');
      var pane = document.getElementById(n === 'layers' ? 'pane-layers' : 'pane-check');
      var on = n === name;
      tab.classList.toggle('is-active', on); tab.setAttribute('aria-selected', on ? 'true' : 'false'); pane.hidden = !on;
    });
    store.set(TAB_KEY, name);
  }
  function openSheet(name) {
    if (name) showTab(name);
    if (!PHONE.matches) return;
    panel.classList.add('is-open'); backdrop.hidden = false;
    setTimeout(function () { var c = document.getElementById('panel-close'); if (c) c.focus({ preventScroll: true }); }, 50);
  }
  function closeSheet() {
    if (!panel.classList.contains('is-open')) return;
    var hadFocus = panel.contains(document.activeElement);
    panel.classList.remove('is-open'); backdrop.hidden = true;
    if (hadFocus) { var b = document.querySelector('.map-dock__btn'); if (b) b.focus({ preventScroll: true }); }
  }
  function initPanel() {
    panel = document.getElementById('map-panel');
    backdrop = document.createElement('div'); backdrop.className = 'map-backdrop'; backdrop.hidden = true;
    panel.parentNode.insertBefore(backdrop, panel);
    showTab(store.get(TAB_KEY, 'layers') === 'check' ? 'check' : 'layers');
    document.getElementById('tab-layers').addEventListener('click', function () { showTab('layers'); });
    document.getElementById('tab-check').addEventListener('click', function () { showTab('check'); });
    document.querySelectorAll('[data-open-pane]').forEach(function (b) { b.addEventListener('click', function () { openSheet(b.getAttribute('data-open-pane')); }); });
    document.getElementById('panel-close').addEventListener('click', closeSheet);
    backdrop.addEventListener('click', closeSheet);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    var dock = document.getElementById('map-dock'); var canvas = document.getElementById('map-canvas');
    if ('IntersectionObserver' in window && dock && canvas) {
      new IntersectionObserver(function (entries) { dock.classList.toggle('is-hidden', !entries[0].isIntersecting); }, { threshold: 0.2 }).observe(canvas);
    }
  }

  /* --- Checklist --- */
  function initChecklist() {
    document.querySelectorAll('[data-found-id]').forEach(function (cb) {
      var id = cb.getAttribute('data-found-id');
      var f = progress.has(id);
      cb.checked = f; var row = cb.closest('.check-row'); if (row) row.classList.toggle('is-found', f);
      cb.addEventListener('change', function () { setFound(id, cb.checked); });
    });
    document.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { closeSheet(); focusPoi(b.getAttribute('data-goto')); });
    });
  }

  /* --- Search: names, districts, collections, numbers, codes, missions and what's inside them --- */
  function initSearch() {
    var input = document.getElementById('map-search');
    var list = document.getElementById('map-search-results');
    if (!input || !list) return;
    var index = data.pois.map(function (p) {
      var c = catById[p.category] || {};
      var extra = [];
      if (p.category === 'echo' && p.number) extra.push('echo ' + p.number, 'echo ' + String(p.number).padStart(2, '0'));
      if (p.crateNumber) extra.push('crate ' + p.crateNumber, String(p.crateNumber));
      return { p: p, text: [p.name, c.label, p.district, p.collection, p.gameText, p.description, p.code].concat(extra)
        .concat((p.missions || []).map(function (m) { return m.name; })).concat((p.inside || []).map(function (i) { return i.name; })).join(' ').toLowerCase() };
    });
    function render() {
      var q = input.value.trim().toLowerCase();
      list.innerHTML = '';
      if (q.length < 2) { list.hidden = true; return; }
      var words = q.split(/\s+/);
      var hits = index.filter(function (e) { return words.every(function (w) { return e.text.indexOf(w) !== -1; }); })
        .sort(function (a, b) { return (a.p.name.toLowerCase().indexOf(q) === 0 ? 0 : 1) - (b.p.name.toLowerCase().indexOf(q) === 0 ? 0 : 1); })
        .slice(0, 14);
      if (!hits.length) { list.innerHTML = '<li class="search-empty">No matches. Try a district (Chelsea) or a number (ECHO 07).</li>'; list.hidden = false; return; }
      hits.forEach(function (e) {
        var p = e.p, c = catById[p.category];
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'search-hit';
        var sub = [p.district, p.collection].filter(Boolean).join(' · ');
        b.innerHTML = '<span class="filter-chip" style="--c:' + c.color + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[c.icon] || ICONS.pin) + '</svg></span>' +
          '<span class="search-hit__name">' + esc(p.name) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="search-hit__cat">' + esc(c.label) + '</span>';
        b.addEventListener('click', function () { focusPoi(p.id); list.hidden = true; input.blur(); });
        li.appendChild(b); list.appendChild(li);
      });
      list.hidden = false;
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var first = list.querySelector('.search-hit'); if (first) first.click(); }
      if (e.key === 'Escape') { input.value = ''; render(); }
      if (e.key === 'ArrowDown') { var f = list.querySelector('.search-hit'); if (f) { e.preventDefault(); f.focus(); } }
    });
    list.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(list.querySelectorAll('.search-hit')); var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i < items.length - 1) { e.preventDefault(); items[i + 1].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (i > 0) items[i - 1].focus(); else input.focus(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.map-search')) list.hidden = true; });
  }

  function focusPoi(id) {
    var m = markersById[id];
    if (!m) return;
    var catId = m.poi.category;
    if (!filters[catId]) { setCategory(catId, true); store.set(FILTER_KEY, filters); }
    if (!layers[catId].hasLayer(m)) layers[catId].addLayer(m); // a hidden found item still opens when asked for
    var canvas = document.getElementById('map-canvas');
    var r = canvas.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) canvas.scrollIntoView({ behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth', block: 'center' });
    var z = Math.max(map.getZoom(), map.getMinZoom() + 1.75);
    map.flyTo(m.getLatLng(), z, { duration: REDUCED_MOTION.matches ? 0 : 0.6 });
    setTimeout(function () {
      m.openPopup();
      var dot = m.getElement() && m.getElement().querySelector('.poi-dot');
      if (dot) { dot.classList.remove('leaflet-pulse'); void dot.offsetWidth; dot.classList.add('leaflet-pulse'); }
    }, REDUCED_MOTION.matches ? 50 : 650);
  }

  function openFromHash() {
    var h = decodeURIComponent(location.hash || '');
    var mm = /#poi=([\w\-]+)/.exec(h);
    if (mm) focusPoi(mm[1]);
  }
})();
