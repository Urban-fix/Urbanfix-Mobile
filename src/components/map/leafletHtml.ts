/**
 * Página HTML con Leaflet + OpenStreetMap (mismo mapa que usa el frontend web).
 * Se muestra dentro de un WebView (iOS/Android) o un iframe (web).
 *
 * Comunicación:
 *  - App → mapa: window.__cmd({ type, ... })
 *  - Mapa → app: postMessage(JSON) con { type: 'ready' | 'press' | 'marker', ... }
 */
export const leafletHtml = (opts: { lat: number; lng: number; zoom: number }) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #2B2B2B; }
  .leaflet-control-attribution { font-size: 9px; }
  .uf-pin { width: 18px; height: 18px; border-radius: 50%; border: 3px solid #1A1A1A; box-shadow: 0 0 0 2px rgba(255,255,255,0.85), 0 3px 8px rgba(0,0,0,0.45); }
  .uf-pin.sel { width: 24px; height: 24px; }
  .uf-offline { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #A8A8A4; font: 13px sans-serif; text-align: center; padding: 16px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  function send(msg) {
    var s = JSON.stringify(msg);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else if (window.parent !== window) window.parent.postMessage(s, '*');
  }
  if (typeof L === 'undefined') {
    document.body.innerHTML = '<div class="uf-offline">No se pudo cargar el mapa. Revisa tu conexión a internet.</div>';
    send({ type: 'error' });
  } else {
    var map = L.map('map', { zoomControl: false, attributionControl: true }).setView([${opts.lat}, ${opts.lng}], ${opts.zoom});
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var layer = L.layerGroup().addTo(map);
    var selectedId = null;

    function pinIcon(color, sel) {
      return L.divIcon({
        className: '',
        html: '<div class="uf-pin' + (sel ? ' sel' : '') + '" style="background:' + color + '"></div>',
        iconSize: sel ? [30, 30] : [24, 24],
        iconAnchor: sel ? [15, 15] : [12, 12]
      });
    }

    function setMarkers(markers) {
      layer.clearLayers();
      (markers || []).forEach(function (m) {
        var mk = L.marker([m.lat, m.lng], { icon: pinIcon(m.color, m.id === selectedId) }).addTo(layer);
        mk.on('click', function (e) {
          L.DomEvent.stopPropagation(e);
          send({ type: 'marker', id: m.id });
        });
      });
    }

    map.on('click', function (e) {
      send({ type: 'press', lat: e.latlng.lat, lng: e.latlng.lng });
    });

    window.__cmd = function (c) {
      if (c.type === 'markers') { selectedId = c.selectedId; setMarkers(c.markers); }
      if (c.type === 'fly') map.flyTo([c.lat, c.lng], c.zoom || map.getZoom(), { duration: 0.5 });
      if (c.type === 'invalidate') map.invalidateSize();
    };
    setTimeout(function () { map.invalidateSize(); }, 200);
    send({ type: 'ready' });
  }
</script>
</body>
</html>`;
