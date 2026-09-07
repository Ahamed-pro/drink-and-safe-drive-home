const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * Calls the backend, which geocodes both addresses and asks OSRM for the
 * actual driving-road distance (not a straight-line estimate). Throws with
 * a user-readable message on failure (location not found, no route, etc).
 */
export async function fetchRoadDistanceKm(pickup, destination) {
  const url = `${API_BASE}/api/distance?pickup=${encodeURIComponent(
    pickup
  )}&destination=${encodeURIComponent(destination)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Could not calculate distance for these locations.");
  }

  return data; // { distanceKm, pickup: {...}, destination: {...} }
}