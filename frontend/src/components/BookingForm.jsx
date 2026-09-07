import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { fetchRoadDistanceKm } from "../lib/distance.js";
import { DEFAULT_PRICING, estimateFare, formatLKR } from "../lib/pricing.js";

const initialState = {
  fullName: "",
  phone: "",
  pickup: "",
  destination: "",
  date: "",
  time: "",
  vehicleType: "car",
  notes: "",
};

const vehicleOptions = [
  { value: "car", label: "Car / කාර් රථය" },
  { value: "van", label: "Van / වෑන් රථය" },
  { value: "suv", label: "SUV / Jeep" },
  { value: "pickup", label: "Pickup / ලොරි" },
  { value: "other", label: "Other / වෙනත්" },
];

export default function BookingForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [bookingId, setBookingId] = useState(null);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  // distance calculation state
  const [distanceKm, setDistanceKm] = useState(null);
  const [distanceStatus, setDistanceStatus] = useState("idle"); // idle | loading | done | error
  const [distanceError, setDistanceError] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "pricing"), (snap) => {
      if (snap.exists()) setPricing({ ...DEFAULT_PRICING, ...snap.data() });
    });
    return unsub;
  }, []);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      // Any change to pickup/destination invalidates the last calculated distance.
      if (field === "pickup" || field === "destination") {
        setDistanceKm(null);
        setDistanceStatus("idle");
        setDistanceError("");
      }
    };
  }

  async function handleCalculateDistance() {
    if (!form.pickup.trim() || !form.destination.trim()) {
      setDistanceStatus("error");
      setDistanceError("Enter both a pickup location and a destination first.");
      return;
    }
    setDistanceStatus("loading");
    setDistanceError("");
    try {
      const result = await fetchRoadDistanceKm(form.pickup, form.destination);
      setDistanceKm(result.distanceKm);
      setDistanceStatus("done");
    } catch (err) {
      setDistanceStatus("error");
      setDistanceError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const estimatedFare = distanceKm != null ? estimateFare(pricing, distanceKm) : null;
      const docRef = await addDoc(collection(db, "bookings"), {
        ...form,
        distanceKm: distanceKm ?? null,
        estimatedFare,
        status: "pending",
        assignedDriverId: null,
        createdAt: serverTimestamp(),
      });
      setBookingId(docRef.id);
      setForm(initialState);
      setDistanceKm(null);
      setDistanceStatus("idle");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card border-harbor-teal/30 bg-harbor-teal/5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-harbor-teal/15 text-harbor-teal">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-night-route">
          Booking received!
        </h3>
        <p className="si mt-2 text-dusk-slate">
          ඔබගේ රියදුරු ඉල්ලීම අප වෙත ලැබී ඇත. අපගේ කණ්ඩායම ඉක්මනින් ඔබ අමතනු ඇත.
        </p>
        <p className="mt-2 text-sm text-dusk-slate">
          We've received your request. Our team will call to confirm your driver shortly.
        </p>
        {bookingId && (
          <Link to={`/track/${bookingId}`} className="btn-ghost !border-night-route/20 !text-night-route hover:!bg-night-route/5 mt-5 inline-flex">
            Track this booking
          </Link>
        )}
        <div>
          <button
            type="button"
            className="btn-amber mt-4"
            onClick={() => { setStatus("idle"); setBookingId(null); }}
          >
            Book another driver
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h3 className="font-display text-xl font-bold text-night-route">
          Pre-Book a Driver
        </h3>
        <p className="si text-sm text-dusk-slate">රියදුරෙකු පෙර වෙන්කරවා ගන්න</p>
      </div>

      <Field label="Full name / සම්පූර්ණ නම" required>
        <input required value={form.fullName} onChange={update("fullName")} className="input" />
      </Field>
      <Field label="Phone number / දුරකථන අංකය" required>
        <input required type="tel" value={form.phone} onChange={update("phone")} className="input" />
      </Field>
      <Field label="Pickup location / ලබා ගන්නා ස්ථානය" required>
        <input required value={form.pickup} onChange={update("pickup")} className="input" placeholder="e.g. Kottawa" />
      </Field>
      <Field label="Destination / ගමනාන්තය" required>
        <input required value={form.destination} onChange={update("destination")} className="input" placeholder="e.g. Pettah" />
      </Field>

      <div className="sm:col-span-2 rounded-2xl border border-black/10 bg-warm-paper p-4">
        <button
          type="button"
          onClick={handleCalculateDistance}
          disabled={distanceStatus === "loading"}
          className="btn-ghost !border-night-route/20 !px-4 !py-2 !text-night-route hover:!bg-night-route/5"
        >
          {distanceStatus === "loading" ? "Calculating road distance…" : "Calculate Distance & Estimated Price"}
        </button>

        {distanceStatus === "done" && distanceKm != null && (
          <div className="mt-3 text-sm text-night-route">
            <p>
              Road distance: <span className="font-display font-bold">{distanceKm} km</span>
            </p>
            <p className="mt-1">
              Estimated fare: <span className="font-display font-bold text-porch-amber">{formatLKR(estimateFare(pricing, distanceKm))}</span>
            </p>
            <p className="mt-1 text-xs text-dusk-slate">
              Final price may vary slightly with waiting time and route conditions.
            </p>
          </div>
        )}
        {distanceStatus === "error" && (
          <p className="mt-3 text-sm text-signal-coral">{distanceError}</p>
        )}
      </div>

      <Field label="Date / දිනය" required>
        <input required type="date" value={form.date} onChange={update("date")} className="input" />
      </Field>
      <Field label="Preferred time / කැමති වේලාව" required>
        <input required type="time" value={form.time} onChange={update("time")} className="input" />
      </Field>
      <Field label="Vehicle type / වාහන වර්ගය" required>
        <select value={form.vehicleType} onChange={update("vehicleType")} className="input">
          {vehicleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Additional notes / වෙනත් විස්තර">
        <input value={form.notes} onChange={update("notes")} className="input" placeholder="Optional" />
      </Field>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "submitting"} className="btn-amber w-full sm:w-auto">
          {status === "submitting" ? "Submitting…" : "Confirm Pre-Booking"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-sm text-signal-coral">
            Something went wrong — please try again, or call/WhatsApp us directly.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block text-sm font-semibold text-night-route">
      {label} {required && <span className="text-signal-coral">*</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}