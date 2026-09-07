import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { DEFAULT_PRICING } from "../../lib/pricing.js";

const fields = [
  { key: "baseFare", label: "Base fare (LKR)" },
  { key: "freeKm", label: "Free distance (km)" },
  { key: "perKmAfterFree", label: "Price per extra km (LKR)" },
  { key: "freeWaitMinutes", label: "Free waiting time (minutes)" },
  { key: "waitChargePerHour", label: "Waiting charge (LKR/hour)" },
];

export default function PricingPanel() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "pricing"), (snap) => {
      if (snap.exists()) setPricing({ ...DEFAULT_PRICING, ...snap.data() });
    });
    return unsub;
  }, []);

  function update(key) {
    return (e) => {
      setSaved(false);
      setPricing((p) => ({ ...p, [key]: Number(e.target.value) }));
    };
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "pricing"), pricing, { merge: true });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card max-w-xl space-y-5">
      <h2 className="font-display text-xl font-bold text-night-route">Pricing settings</h2>
      <p className="text-sm text-dusk-slate">
        These values are shown live on the public Pricing page — no code
        changes needed.
      </p>

      {fields.map((f) => (
        <label key={f.key} className="block text-sm font-semibold text-night-route">
          {f.label}
          <input
            type="number"
            min="0"
            className="input mt-1.5"
            value={pricing[f.key]}
            onChange={update(f.key)}
          />
        </label>
      ))}

      <button type="submit" disabled={saving} className="btn-amber">
        {saving ? "Saving…" : "Save Pricing"}
      </button>
      {saved && <p className="text-sm text-harbor-teal">Pricing updated.</p>}
    </form>
  );
}
