import { Link } from "react-router-dom";
import RouteSignature from "../components/RouteSignature.jsx";
import SafetyCard from "../components/SafetyCard.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink, LOCATION_URL, LOCATION_EMBED_URL } from "../lib/constants.js";

// ... keep your trustPoints and steps same ...

export default function Home() {
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
              <a href={LOCATION_URL} target="_blank" rel="noreferrer" className="btn-amber">
                📍 Our Location
              </a>
            </div>
          </div>
          <RouteSignature className="w-full drop-shadow-2xl" />
        </div>
      </section>

      {/* Trust */}
      <section className="section-pad bg-warm-paper">
        {/* ... your existing trust code ... keep as is ... */}
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

      {/* NEW LOCATION SECTION */}
      <section className="section-pad bg-warm-paper pt-0">
        <div className="container-max">
          <div className="card overflow-hidden p-0">
            <div className="grid lg:grid-cols-2">
              <div className="p-8">
                <div className="eyebrow text-harbor-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-harbor-teal" /> Find us
                </div>
                <h2 className="mt-3 font-display text-2xl font-extrabold text-night-route">Our Location</h2>
                <p className="mt-3 text-dusk-slate">
                  Click below to open in Google Maps and get directions.
                </p>
                <a
                  href={LOCATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-amber mt-6 inline-flex"
                >
                  Open in Google Maps
                </a>
              </div>
              <iframe
                src={LOCATION_EMBED_URL}
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
              ></iframe>
            </div>
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