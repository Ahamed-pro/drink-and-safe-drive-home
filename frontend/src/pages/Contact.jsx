import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "../lib/constants.js";

export default function Contact() {
  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> Contact
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            Talk to us any time.
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">අපව අමතන්න</p>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max grid gap-6 sm:grid-cols-3">
          <a href={`tel:${PHONE_TEL}`} className="card transition hover:-translate-y-1">
            <h2 className="font-display text-lg font-bold text-night-route">Call</h2>
            <p className="mt-2 text-sm text-dusk-slate">{PHONE_DISPLAY}</p>
          </a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="card transition hover:-translate-y-1">
            <h2 className="font-display text-lg font-bold text-night-route">WhatsApp</h2>
            <p className="mt-2 text-sm text-dusk-slate">{PHONE_DISPLAY}</p>
          </a>
          <div className="card">
            <h2 className="font-display text-lg font-bold text-night-route">Service area</h2>
            <p className="mt-2 text-sm text-dusk-slate">Negombo &amp; surrounding areas, Sri Lanka</p>
          </div>
        </div>
      </section>
    </div>
  );
}
