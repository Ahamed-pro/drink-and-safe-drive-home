import { Link } from "react-router-dom";
import RouteSignature from "../components/RouteSignature.jsx";
import SafetyCard from "../components/SafetyCard.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "../lib/constants.js";

const LOCATION_URL =
  "https://www.google.com/maps/place/6%C2%B053'22.3%22N+79%C2%B052'21.0%22E/@6.8895287,79.8699262,17z/data=!3m1!4b1!4m4!3m3!8m2!3d6.8895287!4d79.8725011?hl=en&entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";

const trustPoints = [
  {
    title: "Vetted professional drivers",
    si: "පරීක්ෂා කරන ලද වෘත්තීය රියදුරන්",
    body: "Every driver is verified and trained before they're assigned to a booking.",
  },
  {
    title: "Your car, your comfort",
    si: "ඔබේ වාහනයම, ඔබේ සුවපහසුව",
    body: "We never send a vehicle — a driver comes to you and drives your own car home.",
  },
  {
    title: "No account needed",
    si: "ගිණුමක් අවශ්‍ය නැත",
    body: "Call, WhatsApp, or fill the form. Booking takes under a minute.",
  },
];

const steps = [
  { title: "Request a driver", si: "රියදුරෙකු ඉල්ලන්න", body: "Call, WhatsApp, or use the booking form with your pickup details." },
  { title: "We confirm & assign", si: "අප තහවුරු කර පවරයි", body: "A vetted driver is assigned and you get a confirmation call." },
  { title: "Driver arrives", si: "රියදුරු පැමිණේ", body: "Your driver meets you at the pickup point, on time." },
  { title: "Ride home, safely", si: "ආරක්ෂිතව නිවසට", body: "Your driver takes your own vehicle — and you — home safely." },
];

export default function Home() {
  function openLocation() {
    window.open(LOCATION_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night-route text-warm-paper">
        <div className="pointer-events-none absolute inset-0 bg-route-grid opacity-40" />
        <div className="container-max relative grid gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-28">
          <div>
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" />
              Driver-only pre-booking · Not a taxi service
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Drink &amp; Safe Drive Home
            </h1>
            <p className="si mt-4 text-xl font-semibold text-porch-amber sm:text-2xl">
              ඔබේ වාහනය. අපේ රියදුරු. ඔබේ ආරක්ෂිත ගමන.
            </p>
            <p className="mt-5 max-w-lg text-warm-paper/75">
              We don't send a car — we send a professional driver to take
              <strong className="text-warm-paper"> your own vehicle</strong>{" "}
              (and you) home safely. Pre-book in under a minute, no account
              required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pre-book" className="btn-amber">
                Pre-Book a Driver
              </Link>
              <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
                Call {PHONE_DISPLAY}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp">
                WhatsApp Us
              </a>
              <button type="button" onClick={openLocation} className="btn-ghost">
                Our Location
              </button>
            </div>
          </div>
          <RouteSignature className="w-full drop-shadow-2xl" />
        </div>
      </section>

      {/* Trust */}
      <section className="section-pad bg-warm-paper">
        <div className="container-max">
          <div className="eyebrow text-harbor-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-harbor-teal" /> Why trust us
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold text-night-route sm:text-4xl">
            A safety service first, a driver service second.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.title} className="card">
                <h3 className="font-display text-lg font-bold text-night-route">{point.title}</h3>
                <p className="si mt-1 text-sm text-porch-amber">{point.si}</p>
                <p className="mt-3 text-sm text-dusk-slate">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad bg-night-route text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> How it works
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">
            Four simple steps to a safe ride home.
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="font-display text-sm font-bold text-porch-amber">0{i + 1}</span>
                <h3 className="mt-3 font-display text-base font-bold">{step.title}</h3>
                <p className="si mt-1 text-xs text-warm-paper/60">{step.si}</p>
                <p className="mt-2 text-sm text-warm-paper/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section-pad bg-warm-paper">
        <div className="container-max grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow text-harbor-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-harbor-teal" /> Simple, honest pricing
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-night-route sm:text-4xl">
              No surprises. Ever.
            </h2>
            <p className="mt-4 max-w-md text-dusk-slate">
              A flat base fare, free kilometres up front, and clear per-km and
              waiting charges after that — all shown before you confirm.
            </p>
            <Link to="/pricing" className="btn-amber mt-6 inline-flex">
              See full pricing
            </Link>
          </div>
          <div className="card">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-pad bg-warm-paper pt-0">
        <div className="container-max">
          <SafetyCard />
        </div>
      </section>
    </div>
  );
}