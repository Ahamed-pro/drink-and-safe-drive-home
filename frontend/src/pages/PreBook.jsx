import BookingForm from "../components/BookingForm.jsx";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "../lib/constants.js";

export default function PreBook() {
  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> Pre-book
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            Get a driver on the way.
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">රියදුරෙකු පෙර වෙන්කරවා ගන්න</p>
          <p className="mt-4 max-w-xl text-warm-paper/70">
            No account needed. Fill the form below, or reach us directly —
            whichever is easiest.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_TEL}`} className="btn-ghost">Call {PHONE_DISPLAY}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max max-w-2xl">
          <BookingForm />
        </div>
      </section>
    </div>
  );
}
