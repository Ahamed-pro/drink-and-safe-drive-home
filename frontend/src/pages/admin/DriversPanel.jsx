import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

import {
  driverMissingFields,
  isDriverVerified,
} from "../../lib/driverAssignment.js";

const initialForm = {
  fullName: "",
  phone: "",
  nationalId: "",
};

const statusLabel = {
  available: {
    text: "Available",
    cls: "bg-harbor-teal/15 text-harbor-teal",
  },
  busy: {
    text: "Busy",
    cls: "bg-porch-amber/15 text-porch-amber",
  },
};

function DriverAvatar({ name }) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "D";

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-harbor-teal/15 text-lg font-bold text-harbor-teal">
      {initials}
    </div>
  );
}

export default function DriversPanel() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const driversQuery = query(
      collection(db, "drivers"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      driversQuery,
      (snap) => {
        setDrivers(
          snap.docs.map((driverDoc) => ({
            id: driverDoc.id,
            ...driverDoc.data(),
          }))
        );
      },
      (error) => {
        console.error("Failed to load drivers:", error);
        setFormError("Unable to load drivers.");
      }
    );

    return unsubscribe;
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setFormError("");

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const nationalId = form.nationalId.trim();

    if (!fullName || !phone || !nationalId) {
      setFormError(
        "Driver name, contact number, and National ID number are all required."
      );
      return;
    }

    setSaving(true);

    try {
      // Generate a Firestore document ID.
      // No document is written until validation is complete.
      const driverRef = doc(collection(db, "drivers"));

      // Create driver directly in Firestore.
      //
      // The driver starts as AVAILABLE immediately,
      // so the assignment system can use this driver.
      await setDoc(driverRef, {
        fullName,
        phone,
        nationalId,

        active: true,
        status: "available",
        currentBookingId: null,

        createdAt: new Date().toISOString(),
      });

      // Reset form after successful creation.
      setForm(initialForm);

      if (e.target?.reset) {
        e.target.reset();
      }
    } catch (err) {
      console.error("Failed to add driver:", err);

      if (err?.code === "permission-denied") {
        setFormError(
          "Permission denied. Make sure the logged-in admin has a document in Firestore under /admins/{admin UID}."
        );
      } else {
        setFormError(
          err?.message ||
            "Something went wrong while adding the driver."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(driverId, active) {
    try {
      await updateDoc(doc(db, "drivers", driverId), {
        active: !active,
      });
    } catch (err) {
      console.error("Failed to change driver status:", err);

      setFormError(
        err?.message || "Failed to change driver status."
      );
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      {/* ADD DRIVER */}
      <form
        onSubmit={handleAdd}
        className="card h-fit space-y-4"
      >
        <h2 className="font-display text-xl font-bold text-night-route">
          Add a driver
        </h2>

        <p className="text-xs text-dusk-slate">
          Only the driver's name, contact number, and National
          ID number are required. A profile picture is not
          required.
        </p>

        {/* DRIVER NAME */}
        <label className="block text-sm font-semibold text-night-route">
          Driver name

          <input
            required
            type="text"
            className="input mt-1.5"
            value={form.fullName}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                fullName: e.target.value,
              }))
            }
          />
        </label>

        {/* PHONE */}
        <label className="block text-sm font-semibold text-night-route">
          Contact number

          <input
            required
            type="tel"
            className="input mt-1.5"
            value={form.phone}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                phone: e.target.value,
              }))
            }
          />
        </label>

        {/* NIC */}
        <label className="block text-sm font-semibold text-night-route">
          National ID number

          <input
            required
            type="text"
            className="input mt-1.5"
            value={form.nationalId}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                nationalId: e.target.value,
              }))
            }
          />
        </label>

        {formError && (
          <p className="text-sm text-signal-coral">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-amber w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add Driver"}
        </button>
      </form>

      {/* DRIVER LIST */}
      <div>
        <h2 className="font-display text-xl font-bold text-night-route">
          Drivers ({drivers.length})
        </h2>

        <div className="mt-4 space-y-3">
          {drivers.length === 0 && (
            <p className="text-sm text-dusk-slate">
              No drivers added yet.
            </p>
          )}

          {drivers.map((driver) => {
            const missing = driverMissingFields(driver);
            const verified = isDriverVerified(driver);

            const status =
              statusLabel[driver.status || "available"] ||
              statusLabel.available;

            return (
              <div
                key={driver.id}
                className="card flex flex-wrap items-start gap-4"
              >
                {/* INITIALS AVATAR - NO STORAGE REQUIRED */}
                <DriverAvatar name={driver.fullName} />

                <div className="min-w-[200px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-night-route">
                      {driver.fullName}
                    </h3>

                    {/* DRIVER STATUS */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
                    >
                      {status.text}
                    </span>

                    {/* VERIFICATION */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        verified
                          ? "bg-harbor-teal/15 text-harbor-teal"
                          : "bg-signal-coral/15 text-signal-coral"
                      }`}
                    >
                      {verified ? "Verified" : "Incomplete"}
                    </span>
                  </div>

                  <p className="text-sm text-dusk-slate">
                    {driver.phone}
                  </p>

                  <p className="text-sm text-dusk-slate">
                    National ID: {driver.nationalId || "—"}
                  </p>

                  {!verified && (
                    <p className="mt-2 text-xs text-signal-coral">
                      Missing: {missing.join(", ")}
                    </p>
                  )}

                  {driver.currentBookingId && (
                    <p className="mt-1 text-xs text-dusk-slate">
                      On booking: {driver.currentBookingId}
                    </p>
                  )}
                </div>

                {/* ACTIVE / INACTIVE */}
                <button
                  type="button"
                  onClick={() =>
                    toggleActive(
                      driver.id,
                      driver.active !== false
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    driver.active !== false
                      ? "bg-harbor-teal/15 text-harbor-teal"
                      : "bg-signal-coral/15 text-signal-coral"
                  }`}
                >
                  {driver.active !== false
                    ? "Active"
                    : "Inactive"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}