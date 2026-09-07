import { Link } from "react-router-dom";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "../lib/constants.js";

const bookingWays = [
  { title: "Call us", si: "අමතන්න", body: `Call ${PHONE_DISPLAY} any time and we'll take your details over the phone.` },
  { title: "WhatsApp us", si: "වට්ස්ඇප් කරන්න", body: "Send a WhatsApp message with your pickup point and time." },
  { title: "Use the form", si: "පෝරමය පුරවන්න", body: "Fill the pre-booking form on our website — takes under a minute." },
];

const steps = [
  { title: "Tell us where & when", si: "කොහෙද, කවදාද කියන්න", body: "Share your pickup location, destination, date, time, and vehicle type." },
  { title: "We assign a driver", si: "රියදුරෙකු පවරයි", body: "Our team matches you with a vetted, available driver near you." },
  { title: "Confirmation call", si: "තහවුරු කිරීමේ ඇමතුම", body: "We call to confirm the booking and share your driver's details." },
  { title: "Driver meets you", si: "රියදුරු ඔබව හමුවේ", body: "Your driver arrives on time at the pickup point — 15 minutes free wait included." },
  { title: "Safe ride home", si: "ආරක්ෂිත ගමන", body: "Your driver takes your own vehicle, and you, home safely." },
];

export default function HowItWorks() {
  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> How it works
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            Booking a driver, step by step.
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">සේවාව ක්‍රියා කරන ආකාරය</p>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max">
          <h2 className="font-display text-2xl font-bold text-night-route">Three ways to book</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {bookingWays.map((way) => (
              <div key={way.title} className="card">
                <h3 className="font-display text-lg font-bold text-night-route">{way.title}</h3>
                <p className="si mt-1 text-sm text-porch-amber">{way.si}</p>
                <p className="mt-3 text-sm text-dusk-slate">{way.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_TEL}`} className="btn-amber !text-night-route-deep">Call {PHONE_DISPLAY}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp">WhatsApp Us</a>
            <Link to="/pre-book" className="btn-ghost !border-night-route/20 !text-night-route hover:!bg-night-route/5">
              Use the form
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-night-route text-warm-paper">
        <div className="container-max">
          <h2 className="font-display text-2xl font-bold">From request to a safe ride home</h2>
          <ol className="mt-8 space-y-6 border-l border-white/15 pl-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-porch-amber font-display text-xs font-extrabold text-night-route-deep">
                  {i + 1}
                </span>
                <h3 className="font-display text-base font-bold">{step.title}</h3>
                <p className="si text-xs text-warm-paper/60">{step.si}</p>
                <p className="mt-1 text-sm text-warm-paper/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
