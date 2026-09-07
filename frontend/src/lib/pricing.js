// Default pricing — used only until the live settings/pricing doc loads from
// Firestore. The admin can change every one of these numbers from the
// Pricing Management panel without touching code.
export const DEFAULT_PRICING = {
  baseFare: 200,
  freeKm: 10,
  perKmAfterFree: 100,
  freeWaitMinutes: 15,
  waitChargePerHour: 1500,
  currency: "LKR",
};

export function formatLKR(amount) {
  return `LKR ${Number(amount).toLocaleString("en-LK")}`;
}

export function estimateFare(pricing, distanceKm = 0) {
  const km = Math.max(0, Number(distanceKm) || 0);
  const billableKm = Math.max(0, km - pricing.freeKm);
  const distanceCharge = billableKm * pricing.perKmAfterFree;
  return pricing.baseFare + distanceCharge;
}
