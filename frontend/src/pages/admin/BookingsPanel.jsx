import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  assignDriverToBooking,
  unassignDriverFromBooking,
  finishBooking,
  setBookingStatus,
  isDriverAssignable,
} from "../../lib/driverAssignment.js";
import { formatLKR } from "../../lib/pricing.js";

const statusOptions = ["pending", "confirmed", "on_the_way", "completed", "cancelled"];

const statusStyles = {
  pending: "bg-porch-amber/15 text-porch-amber",
  confirmed: "bg-harbor-teal/15 text-harbor-teal",
  on_the_way: "bg-harbor-teal/15 text-harbor-teal",
  completed: "bg-dusk-slate/15 text-dusk-slate",
  cancelled: "bg-signal-coral/15 text-signal-coral",
};

export default function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errorByBooking, setErrorByBooking] = useState({});

  useEffect(() => {
    const unsubBookings = onSnapshot(
      query(collection(db, "bookings"), orderBy("createdAt", "desc")),
      (snap) => setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubDrivers = onSnapshot(collection(db, "drivers"), (snap) =>
      setDrivers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => {
      unsubBookings();
      unsubDrivers();
    };
  }, []);

  function driverById(id) {
    return drivers.find((d) => d.id === id);
  }

  function clearError(bookingId) {
    setErrorByBooking((prev) => ({ ...prev, [bookingId]: null }));
  }

  async function handleAssign(bookingId, driverId) {
    clearError(bookingId);
    try {
      if (!driverId) {
        await unassignDriverFromBooking(bookingId);
      } else {
        await assignDriverToBooking(bookingId, driverId);
      }
    } catch (err) {
      setErrorByBooking((prev) => ({ ...prev, [bookingId]: err.message }));
    }
  }

  async function handleStatusChange(bookingId, status) {
    clearError(bookingId);
    try {
      if (status === "completed" || status === "cancelled") {
        await finishBooking(bookingId, status);
      } else {
        await setBookingStatus(bookingId, status);
      }
    } catch (err) {
      setErrorByBooking((prev) => ({ ...prev, [bookingId]: err.message }));
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-night-route">
        Bookings ({bookings.length})
      </h2>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 && (
          <p className="text-sm text-dusk-slate">No bookings yet.</p>
        )}
        {bookings.map((b) => {
          const assignedDriver = b.assignedDriverId ? driverById(b.assignedDriverId) : null;
          // Eligible = available, verified, active drivers, plus whichever
          // driver is already on this booking (so their name still shows).
          const eligibleDrivers = drivers.filter(
            (d) => isDriverAssignable(d) || d.id === b.assignedDriverId
          );

          return (
            <div key={b.id} className="card grid gap-4 lg:grid-cols-[1fr_auto_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display font-bold text-night-route">{b.fullName}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[b.status] || ""}`}>
                    {(b.status || "pending").replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-dusk-slate">{b.phone}</p>
                <div className="mt-3 grid gap-1 text-sm text-night-route/80 sm:grid-cols-2">
                  <p><span className="font-semibold">Pickup:</span> {b.pickup}</p>
                  <p><span className="font-semibold">Destination:</span> {b.destination}</p>
                  <p><span className="font-semibold">Date/Time:</span> {b.date} {b.time}</p>
                  <p><span className="font-semibold">Vehicle:</span> {b.vehicleType}</p>
                  {b.distanceKm != null && (
                    <p><span className="font-semibold">Road distance:</span> {b.distanceKm} km</p>
                  )}
                  {b.estimatedFare != null && (
                    <p><span className="font-semibold">Estimated fare:</span> {formatLKR(b.estimatedFare)}</p>
                  )}
                </div>
                {b.notes && <p className="mt-2 text-sm text-dusk-slate">Notes: {b.notes}</p>}
                {assignedDriver && (
                  <p className="mt-2 text-sm text-harbor-teal">
                    Assigned to {assignedDriver.fullName} · {assignedDriver.vehicleNumber}
                  </p>
                )}
                {errorByBooking[b.id] && (
                  <p className="mt-2 text-sm text-signal-coral">{errorByBooking[b.id]}</p>
                )}
              </div>

              <label className="text-xs font-semibold text-dusk-slate">
                Assign driver
                <select
                  className="input mt-1"
                  value={b.assignedDriverId || ""}
                  onChange={(e) => handleAssign(b.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {eligibleDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName}{d.id !== b.assignedDriverId && d.status === "busy" ? " (busy)" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-dusk-slate">
                Status
                <select
                  className="input mt-1"
                  value={b.status || "pending"}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}