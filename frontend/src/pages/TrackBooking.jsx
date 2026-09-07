import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatLKR } from "../lib/pricing.js";

const statusCopy = {
  pending: { label: "Pending confirmation", si: "තහවුරු කිරීම බලාපොරොත්තුවෙන්" },
  confirmed: { label: "Driver confirmed", si: "රියදුරු තහවුරු කර ඇත" },
  on_the_way: { label: "Driver on the way", si: "රියදුරු පැමිණෙමින්" },
  completed: { label: "Ride completed", si: "ගමන අවසන්" },
  cancelled: { label: "Cancelled", si: "අවලංගු කර ඇත" },
};

export default function TrackBooking() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(undefined); // undefined = loading, null = not found
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "bookings", bookingId),
      (snap) => setBooking(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      () => setBooking(null)
    );
    return unsub;
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.assignedDriverId) {
      setDriver(null);
      return;
    }
    const unsub = onSnapshot(doc(db, "drivers", booking.assignedDriverId), (snap) =>
      setDriver(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    );
    return unsub;
  }, [booking?.assignedDriverId]);

  if (booking === undefined) {
    return (
      <div className="section-pad bg-warm-paper">
        <div className="container-max max-w-xl text-center text-dusk-slate">Loading…</div>
      </div>
    );
  }

  if (booking === null) {
    return (
      <div className="section-pad bg-warm-paper">
        <div className="container-max max-w-xl text-center">
          <h1 className="font-display text-2xl font-bold text-night-route">Booking not found</h1>
          <p className="mt-2 text-sm text-dusk-slate">
            Double-check the link, or contact us directly if you need help.
          </p>
        </div>
      </div>
    );
  }

  const status = statusCopy[booking.status] || statusCopy.pending;

  return (
    <div className="section-pad bg-warm-paper">
      <div className="container-max max-w-xl">
        <div className="eyebrow text-harbor-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-harbor-teal" /> Booking status
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-night-route">
          {status.label}
        </h1>
        <p className="si mt-1 text-porch-amber">{status.si}</p>

        <div className="card mt-6 space-y-2 text-sm text-night-route/80">
          <p><span className="font-semibold">Pickup:</span> {booking.pickup}</p>
          <p><span className="font-semibold">Destination:</span> {booking.destination}</p>
          <p><span className="font-semibold">Date/Time:</span> {booking.date} {booking.time}</p>
          {booking.distanceKm != null && (
            <p><span className="font-semibold">Road distance:</span> {booking.distanceKm} km</p>
          )}
          {booking.estimatedFare != null && (
            <p><span className="font-semibold">Estimated fare:</span> {formatLKR(booking.estimatedFare)}</p>
          )}
        </div>

        {driver ? (
          <div className="card mt-6 flex items-center gap-4">
            {driver.photoUrl ? (
              <img src={driver.photoUrl} alt={driver.fullName} className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-dusk-slate/10" />
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-night-route">{driver.fullName}</h2>
              <p className="text-sm text-dusk-slate">Vehicle: {driver.vehicleNumber}</p>
              {driver.vehiclePhotoUrl && (
                <img src={driver.vehiclePhotoUrl} alt="Vehicle" className="mt-2 h-16 w-28 rounded-lg object-cover" />
              )}
            </div>
          </div>
        ) : (
          <div className="card mt-6 text-sm text-dusk-slate">
            A driver hasn't been assigned yet — we'll update this page as soon as one is.
          </div>
        )}
      </div>
    </div>
  );
}