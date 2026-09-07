/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "night-route": "#0E1424",
        "night-route-deep": "#080B15",
        "porch-amber": "#F5A623",
        "harbor-teal": "#1F9E82",
        "warm-paper": "#FBF8F2",
        "dusk-slate": "#5B6478",
        "signal-coral": "#E15241",
        "whatsapp-green": "#25D366",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sinhala: ["Noto Sans Sinhala", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(8, 11, 21, 0.45)",
        glow: "0 0 0 1px rgba(245, 166, 35, 0.25), 0 12px 30px -10px rgba(245, 166, 35, 0.35)",
      },
      backgroundImage: {
        "route-grid":
          "radial-gradient(circle at 1px 1px, rgba(251,248,242,0.06) 1px, transparent 0)",
      },
      keyframes: {
        "dash-travel": {
          to: { strokeDashoffset: "-1000" },
        },
        "car-drift": {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "dash-travel": "dash-travel 18s linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "car-drift": "car-drift 9s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
