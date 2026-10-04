import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import StarRatingInput from "../components/StarRatingInput.jsx";

const MESSAGE_MAX_LENGTH = 800;

// Lightweight, read-only, client-side duplicate guard: if this browser has
// already submitted feedback for a given booking id, remember that locally
// so we can warn before a second submission — without ever reading from
// Firestore to check. It's not a hard guarantee (a different browser or a
// cleared cache bypasses it), but it stops the common accidental
// double-submit without spending a single extra read.
function alreadySubmittedForBooking(bookingId) {
  if (!bookingId) return false;
  try {
    return localStorage.getItem(`feedback_submitted:${bookingId}`) === "1";
  } catch {
    return false;
  }
}

function rememberSubmittedForBooking(bookingId) {
  if (!bookingId) return;
  try {
    localStorage.setItem(`feedback_submitted:${bookingId}`, "1");
  } catch {
    // localStorage unavailable (private browsing, etc.) — safe to ignore.
  }
}

export default function Feedback() {
  const [customerName, setCustomerName] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please choose a star rating first.");
      return;
    }
    if (alreadySubmittedForBooking(bookingId.trim())) {
      setError(
        "It looks like feedback for this booking was already submitted from this device. Thank you — no need to send it again!"
      );
      return;
    }

    setStatus("submitting");
    try {
      await addDoc(collection(db, "feedback"), {
        customerName: customerName.trim(),
        bookingId: bookingId.trim() || null,
        driverName: driverName.trim() || null,
        rating,
        message: message.trim().slice(0, MESSAGE_MAX_LENGTH),
        status: "new",
        createdAt: serverTimestamp(),
      });
      rememberSubmittedForBooking(bookingId.trim());
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="section-pad bg-warm-paper">
        <div className="container-max max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-harbor-teal/15 text-harbor-teal">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-night-route">
            Thank you for your feedback!
          </h1>
          <p className="mt-2 text-sm text-dusk-slate">
            Your feedback helps us improve our service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> Rate us
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            How was your ride?
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">ඔබේ ගමන කෙසේද?</p>
          <p className="mt-4 max-w-xl text-warm-paper/70">
            Your feedback helps us keep every ride safe and reliable. No
            account needed — just a minute of your time.
          </p>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max max-w-xl">
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div>
              <h2 className="font-display text-xl font-bold text-night-route">
                Feedback form
              </h2>
              <p className="si text-sm text-dusk-slate">ප්‍රතිචාරය</p>
            </div>

            <label className="block text-sm font-semibold text-night-route">
              Your name <span className="text-signal-coral">*</span>
              <input
                required
                className="input mt-1.5"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-night-route">
              Booking / Ride ID (optional)
              <input
                className="input mt-1.5"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="From your booking confirmation or tracking link"
              />
            </label>

            <label className="block text-sm font-semibold text-night-route">
              Driver name (optional)
              <input
                className="input mt-1.5"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </label> 

            <div>
              <p className="text-sm font-semibold text-night-route">
                Your rating <span className="text-signal-coral">*</span>
              </p>
              <div className="mt-2">
                <StarRatingInput value={rating} onChange={setRating} />
              </div>
            </div>

            <label className="block text-sm font-semibold text-night-route">
              Your feedback (optional)
              <textarea
                className="input mt-1.5 min-h-[110px] resize-y"
                value={message}
                maxLength={MESSAGE_MAX_LENGTH}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience…"
              />
              <span className="mt-1 block text-right text-xs text-dusk-slate">
                {message.length}/{MESSAGE_MAX_LENGTH}
              </span>
            </label>

            {error && <p className="text-sm text-signal-coral">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting" || !customerName.trim() || rating < 1}
              className="btn-amber w-full sm:w-auto"
            >
              {status === "submitting" ? "Submitting…" : "Submit Feedback"}
            </button>

            {status === "error" && (
              <p className="text-sm text-signal-coral">
                Something went wrong — please try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
