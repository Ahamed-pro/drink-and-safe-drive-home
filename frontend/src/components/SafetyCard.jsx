export default function SafetyCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-porch-amber/30 bg-night-route p-8 text-warm-paper sm:p-10">
      <div className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" />
        අද මතක තබාගන්න
      </div>
      <p className="si mt-4 text-xl font-semibold leading-relaxed sm:text-2xl">
        මතක තබාගන්න — බීමෙන් පසු ඔබම රිය පැදවීමෙන් වළකින්න. ඔබේ ජීවිතයත්,
        අනෙක් අයගේ ජීවිතත් වටිනා නිසා. රියදුරෙකු වෙන්කරවාගෙන ආරක්ෂිතව නිවසට යන්න.
      </p>
      <p className="mt-4 max-w-xl text-sm text-warm-paper/60">
        Remember: never drive after drinking. Your life and everyone else's on
        the road matters. Book a professional driver and get home safely.
      </p>
    </div>
  );
}
