import SafetyCard from "../components/SafetyCard.jsx";

export default function About() {
  return (
    <div>
      <section className="bg-night-route section-pad text-warm-paper">
        <div className="container-max">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> About us
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            We drive your car home. Never our own.
          </h1>
          <p className="si mt-4 text-lg text-porch-amber">අප ගැන</p>
          <p className="mt-5 max-w-2xl text-warm-paper/75">
            Drink &amp; Safe Drive Home exists for one reason: to stop drunk
            and unsafe driving. We are not a taxi or ride-hailing company. We
            never dispatch a vehicle — instead, a trained, vetted driver
            comes to you and drives your own car (with you in it) home
            safely.
          </p>
        </div>
      </section>

      <section className="section-pad bg-warm-paper">
        <div className="container-max grid gap-8 sm:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-xl font-bold text-night-route">Our mission</h2>
            <p className="si mt-1 text-sm text-porch-amber">අපගේ මෙහෙවර</p>
            <p className="mt-3 text-sm text-dusk-slate">
              To make it effortless to make the safe choice — so no one ever
              has to drive home after drinking, or hand their car keys to
              someone unfit to drive.
            </p>
          </div>
          <div className="card">
            <h2 className="font-display text-xl font-bold text-night-route">Who we serve</h2>
            <p className="si mt-1 text-sm text-porch-amber">අප සේවය කරන අය</p>
            <p className="mt-3 text-sm text-dusk-slate">
              Anyone who owns or is responsible for a vehicle and needs a
              professional driver to get it — and themselves — home safely,
              any night of the week.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-warm-paper pt-0">
        <div className="container-max">
          <SafetyCard />
        </div>
      </section>
    </div>
  );
}
