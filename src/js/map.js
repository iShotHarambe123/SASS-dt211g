import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/**
 * Gets location data.
 * @param {string} query
 * @returns {Promise<Object|null>}
 */
async function fetchNominatim(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
    'accept-language': 'sv'
  });

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  return {
    lat: Number(first.lat),
    lon: Number(first.lon),
    displayName: first.display_name || query
  };
}

/**
 * Creates the map.
 * @returns {Object}
 */
function initMap() {
  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = icon;

  const map = L.map('map', {
    center: [62, 15],
    zoom: 5
  });

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }
  ).addTo(map);

  return { map, marker: null };
}

/**
 * Updates map with new location.
 * @param {Object} map
 * @param {Object} marker
 * @param {Object} place
 * @returns {Object}
 */
function updateMap(map, marker, place) {
  const { lat, lon, displayName } = place;
  map.flyTo([lat, lon], 14, { duration: 0.8 });

  if (marker) {
    marker.setLatLng([lat, lon]).setPopupContent(displayName).openPopup();
    return marker;
  }
  const newMarker = L.marker([lat, lon]).addTo(map);
  newMarker.bindPopup(displayName).openPopup();
  return newMarker;
}

/**
 * Sets up search form.
 * @param {Object} map
 * @param {HTMLElement} formEl
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} statusEl
 */
function bindSearch(map, formEl, inputEl, statusEl) {
  let activeMarker = null;

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = inputEl.value.trim();
    if (!q) return;

    statusEl.textContent = 'Söker plats!';
    statusEl.removeAttribute('aria-hidden');

    try {
      const place = await fetchNominatim(q);
      if (!place) {
        statusEl.textContent = 'Hittade inga träffar. Försök förtydliga sökningen.';
        return;
      }
      activeMarker = updateMap(map, activeMarker, place);
      statusEl.textContent = `Visar: ${place.displayName}`;
      document.getElementById('map')?.focus?.();
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Kunde inte hämta plats just nu.';
    }
  });
}

const { map } = initMap();
const formEl = document.getElementById('placeSearch');
const inputEl = document.getElementById('q');
const statusEl = document.getElementById('map-status');

bindSearch(map, formEl, inputEl, statusEl);