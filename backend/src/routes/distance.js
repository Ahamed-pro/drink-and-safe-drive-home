import { Router } from "express";

const router = Router();

// Nominatim (OSM geocoding) requires a descriptive User-Agent and is rate
// limited to ~1 request/sec — browsers can't set a custom User-Agent header,
// which is why this call happens here on the server instead of the client.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";
const USER_AGENT = "DriveSafeDriveHome/1.0 (booking distance calculation)";

// Tiny in-memory cache so repeated lookups of the same pickup/destination
// pair (very common — e.g. everyone near the same nightspot) don't hammer
// the public Nominatim/OSRM endpoints.
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key, value) {
  cache.set(key, { value, time: Date.now() });
}

async function geocode(placeName) {
  const cacheKey = `geocode:${placeName.toLowerCase().trim()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=lk&q=${encodeURIComponent(
    placeName
  )}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Geocoding service error for "${placeName}".`);
  }
  const results = await res.json();
  if (!results.length) {
    const err = new Error(`Could not find location: "${placeName}".`);
    err.status = 404;
    throw err;
  }
  const result = {
    lat: Number(results[0].lat),
    lon: Number(results[0].lon),
    displayName: results[0].display_name,
  };
  cacheSet(cacheKey, result);
  return result;
}

// GET /api/distance?pickup=Kottawa&destination=Pettah
router.get("/", async (req, res) => {
  const { pickup, destination } = req.query;

  if (!pickup || !destination) {
    return res.status(400).json({ error: "Both pickup and destination are required." });
  }

  try {
    const [from, to] = await Promise.all([geocode(pickup), geocode(destination)]);

    const routeCacheKey = `route:${from.lat},${from.lon}-${to.lat},${to.lon}`;
    let distanceKm = cacheGet(routeCacheKey);

    if (distanceKm == null) {
      const routeUrl = `${OSRM_URL}/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();

      if (routeData.code !== "Ok" || !routeData.routes?.length) {
        return res.status(422).json({
          error:
            "No driving route could be found between these locations. Please check the addresses and try again.",
        });
      }

      distanceKm = Math.round((routeData.routes[0].distance / 1000) * 100) / 100;
      cacheSet(routeCacheKey, distanceKm);
    }

    res.json({
      distanceKm,
      pickup: { ...from, query: pickup },
      destination: { ...to, query: destination },
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Distance calculation failed." });
  }
});

export default router;