import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { DEFAULT_PRICING, formatLKR } from "../lib/pricing.js";
import { Link } from "react-router-dom";

export default function Pricing() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "pricing"), (snap) => {
      if (snap.exists()) setPricing({ ...DEFAULT_PRICING, ...snap.data() });
    });
    return unsub;
  }, []);

  const rows = [
    {
      label: "Base fare",
      si: "මූලික ගාස්තුව",
      value: formatLKR(pricing.baseFare),
    },
    {
      label: `First ${pricing.freeKm} km`,
      si: `පළමු කි.මී ${pricing.freeKm}`,
      value: "FREE",
      accent: "text-harbor-teal",
    },
    {
      label: `Above ${pricing.freeKm} km`,
      si: `කි.මී ${pricing.freeKm}ට වැඩි`,
      value: `${formatLKR(pricing.perKmAfterFree)} / km`,
    },
    {
      label: `First ${pricing.freeWaitMinutes} minutes waiting`,
      si: `මුල් මිනිත්තු ${pricing.freeWaitMinutes} රැඳී සිටීම`,
      value: "FREE",
      accent: "text-harbor-teal",
    },
    {
      label: "Waiting charge after that",
      si: "ඉන් පසු රැඳී සිටීමේ ගාස්තුව",
      value: `${formatLKR(pricing.waitChargePerHour)} / hour`,
    },
  ];

  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> Pricing
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            Simple, transparent pricing.
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">මිල ගණන්</p>
          <p className="mt-4 max-w-xl text-warm-paper/70">
            No surge pricing, no hidden fees. Here's exactly what you pay,
            explained in both English and Sinhala.
          </p>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="card overflow-hidden !p-0">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-display font-bold text-night-route">{row.label}</div>
                      <div className="si text-xs text-dusk-slate">{row.si}</div>
                    </td>
                    <td className={`px-6 py-4 text-right font-display font-extrabold ${row.accent || "text-night-route"}`}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card bg-night-route text-warm-paper">
            <h2 className="font-display text-lg font-bold">How your fare adds up</h2>
            <p className="si mt-1 text-sm text-porch-amber">ඔබේ ගාස්තුව ගණනය වන ආකාරය</p>
            <ol className="mt-4 space-y-3 text-sm text-warm-paper/75">
              <li>1. Start with the {formatLKR(pricing.baseFare)} base fare.</li>
              <li>2. Your first {pricing.freeKm} km are free.</li>
              <li>
                3. Every km after that is charged at {formatLKR(pricing.perKmAfterFree)}.
              </li>
              <li>
                4. The driver's first {pricing.freeWaitMinutes} minutes on-site
                are free — after that, waiting is billed at{" "}
                {formatLKR(pricing.waitChargePerHour)}/hour.
              </li>
            </ol>
            <Link to="/pre-book" className="btn-amber mt-6 inline-flex">
              Pre-Book a Driver
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
