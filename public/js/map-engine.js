/* ============================================================
   RESURGENCE MAP ENGINE — Interactive Manhattan Companion Map
   Division Resurgence · resurgencebuilds.com
   ============================================================ */
(function () {
  'use strict';

  /* --- Constants --- */
  const PROGRESS_KEY = 'rb-map-progress-v1';

  /* --- State --- */
  let map, rc, data;
  let progress = loadProgress();
  let allMarkers = [];

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', () => {
    const dataEl = document.getElementById('map-data');
    if (!dataEl) return;
    data = JSON.parse(dataEl.textContent);
    initMap();
    buildMarkers();

    // Dev coordinate picker — Shift+Click copies pixel coords
    map.on('click', (e) => {
      if (e.originalEvent.shiftKey) {
        grabCoords(e.latlng);
      }
    });

    // Mobile long-press coordinate grabber (500ms hold)
    let longPressTimer = null;
    let longPressLatLng = null;
    const mapEl = document.getElementById('map-canvas');
    mapEl.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      longPressTimer = setTimeout(() => {
        const pt = map.containerPointToLatLng([touch.clientX - mapEl.getBoundingClientRect().left, touch.clientY - mapEl.getBoundingClientRect().top]);
        grabCoords(pt);
        longPressTimer = null;
      }, 500);
    }, { passive: true });
    mapEl.addEventListener('touchmove', () => { clearTimeout(longPressTimer); }, { passive: true });
    mapEl.addEventListener('touchend', () => { clearTimeout(longPressTimer); }, { passive: true });
  });

  /* --- Coordinate Grabber (shared by Shift+Click and long-press) --- */
  function grabCoords(latlng) {
    const p = rc.project(latlng);
    const x = Math.round(p.x);
    const y = Math.round(p.y);
    console.log(`📍 Pixel: [${x}, ${y}]`);
    if (navigator.clipboard) navigator.clipboard.writeText(`x: ${x}, y: ${y}`);

    const temp = L.circleMarker(latlng, {
      radius: 8, color: '#F26822', fillColor: '#F26822', fillOpacity: 0.6, weight: 2
    }).addTo(map);
    temp.bindPopup(`<div style="font-family:monospace;font-size:12px;color:#F26822">x: ${x}, y: ${y}<br><small>Copied to clipboard</small></div>`).openPopup();
    setTimeout(() => map.removeLayer(temp), 5000);
  }

  /* --- Map Init --- */
  function initMap() {
    const imgW = data.image.width;
    const imgH = data.image.height;
    const container = document.getElementById('map-canvas');

    map = L.map('map-canvas', {
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
      touchZoom: false,
      zoomSnap: 0,        // allow fractional zoom for pixel-perfect fit
      zoomDelta: 0.25,
    });

    // RasterCoords setup
    rc = new L.RasterCoords(map, [imgW, imgH]);

    // Image overlay
    L.imageOverlay('/images/map/manhattan-base.jpg', rc.getMaxBounds()).addTo(map);

    // Fit image to container with zero padding
    const bounds = rc.getMaxBounds();
    const zoom = map.getBoundsZoom(bounds, false, [0, 0]);
    map.setView(rc.unproject([imgW / 2, imgH / 2]), zoom);
    map.setMinZoom(zoom);
    map.setMaxZoom(zoom + 0.5);
    map.setMaxBounds(bounds);

    // Re-fit after CSS settles (fixes mobile timing)
    requestAnimationFrame(() => {
      map.invalidateSize();
      const z = map.getBoundsZoom(bounds, false, [0, 0]);
      map.setView(rc.unproject([imgW / 2, imgH / 2]), z);
      map.setMinZoom(z);
      map.setMaxZoom(z + 0.5);
    });
  }

  /* --- Build markers from pois.json --- */
  function buildMarkers() {
    const isMobile = window.innerWidth <= 767;
    const isSmall = window.innerWidth <= 480;
    const dotSize = isSmall ? 16 : isMobile ? 18 : 28;
    const halfDot = dotSize / 2;

    for (const poi of data.pois) {
      const cat = data.categories.find(c => c.id === poi.category);
      if (!cat) continue;

      const found = progress.has(poi.id);
      const icon = L.divIcon({
        html: `<div class="poi-dot" style="--poi-color:${cat.color}" data-found="${found}">
                 <img src="${cat.icon}" alt="" class="poi-icon" />
                 ${found ? '<span class="poi-check">✓</span>' : ''}
               </div>`,
        className: 'poi-marker',
        iconSize: [dotSize, dotSize],
        iconAnchor: [halfDot, halfDot],
      });

      const popupMaxW = isMobile ? 160 : 220;
      const marker = L.marker(rc.unproject([poi.x, poi.y]), { icon });
      marker.bindPopup(() => buildPopup(poi, cat), { maxWidth: popupMaxW, minWidth: 120, autoPanPadding: [10, 10] });
      marker.bindTooltip(poi.name, { direction: 'top', offset: [0, -(halfDot)], className: 'map-tooltip' });
      marker.poi = poi;
      marker.poiCat = cat;
      allMarkers.push(marker);
      marker.addTo(map);
    }
  }

  /* --- Popup --- */
  function buildPopup(poi, cat) {
    const found = progress.has(poi.id);
    const district = data.districts.find(d => d.id === poi.district);
    const districtName = district ? district.name : '';
    const levelStr = poi.level ? ` · Lv ${poi.level}` : '';

    let extra = '';
    if (poi.code) extra += `<div class="popup-code"><span class="popup-code__label">Code:</span> ${poi.code}</div>`;
    if (poi.clue) extra += `<div class="popup-clue">"${poi.clue}"</div>`;
    if (poi.amenities && poi.amenities.length) {
      extra += `<div class="popup-amenities">${poi.amenities.map(a => `<span class="popup-tag">${a}</span>`).join('')}</div>`;
    }

    return `<div class="map-popup">
      <div class="popup-header">
        <img src="${cat.icon}" alt="" class="popup-cat-icon" style="color:${cat.color};filter:drop-shadow(0 0 4px ${cat.color}40)" />
        <div>
          <div class="popup-name">${poi.name}</div>
          <div class="popup-meta">${districtName} · ${cat.label}${levelStr}</div>
        </div>
      </div>
      ${poi.description ? `<p class="popup-desc">${poi.description}</p>` : ''}
      ${extra}
      <div class="popup-actions">
        <button class="popup-btn ${found ? 'popup-btn--found' : ''}" onclick="window.__mapToggleFound('${poi.id}', this)">
          ${found ? '✓ Found' : '☐ Mark as Found'}
        </button>
        ${poi.source ? `<a href="${poi.source}" target="_blank" rel="noopener" class="popup-link">🔗 Source</a>` : ''}
      </div>
    </div>`;
  }

  /* --- Toggle Found --- */
  window.__mapToggleFound = function (poiId, btn) {
    if (progress.has(poiId)) {
      progress.delete(poiId);
    } else {
      progress.add(poiId);
    }
    saveProgress(progress);

    // Refresh marker icon
    const marker = allMarkers.find(m => m.poi && m.poi.id === poiId);
    if (marker) {
      const cat = marker.poiCat;
      const found = progress.has(poiId);
      marker.setIcon(L.divIcon({
        html: `<div class="poi-dot" style="--poi-color:${cat.color}" data-found="${found}">
                 <img src="${cat.icon}" alt="" class="poi-icon" />
                 ${found ? '<span class="poi-check">✓</span>' : ''}
               </div>`,
        className: 'poi-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }));
      marker.setPopupContent(buildPopup(marker.poi, cat));
    }

    if (btn) {
      const found = progress.has(poiId);
      btn.className = found ? 'popup-btn popup-btn--found' : 'popup-btn';
      btn.textContent = found ? '✓ Found' : '☐ Mark as Found';
    }
  };

  /* --- Progress CRUD --- */
  function loadProgress() {
    try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')); }
    catch { return new Set(); }
  }

  function saveProgress(set) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  }

})();
