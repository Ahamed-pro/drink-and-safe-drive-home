// The one signature visual for the brand: a glowing dotted route travelling
// from a "venue" pin to a "home" pin at night, with a small car icon riding
// the line. It's the literal thing this service does — get your car home
// safely — rendered as the hero's centerpiece instead of a generic gradient.
export default function RouteSignature({ className = "" }) {
  return (
    <svg
      viewBox="0 0 640 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Route map showing a car travelling from a venue to home at night"
    >
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#1c2540" />
          <stop offset="100%" stopColor="#0E1424" />
        </radialGradient>
        <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#1F9E82" />
        </linearGradient>
      </defs>

      <rect width="640" height="360" rx="28" fill="url(#skyGlow)" />

      {/* stars */}
      {[
        [60, 40], [120, 80], [200, 30], [300, 60], [400, 35],
        [480, 70], [560, 45], [90, 140], [540, 130],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="#FBF8F2" opacity="0.5" />
      ))}

      {/* the route */}
      <path
        id="nightRoutePath"
        d="M96 268 C 150 200, 210 260, 270 210 S 400 150, 460 190 S 560 150, 552 96"
        stroke="url(#routeGlow)"
        strokeWidth="3"
        className="dotted-route animate-dash-travel"
        fill="none"
      />

      {/* venue pin */}
      <g transform="translate(80,240)">
        <circle r="14" fill="#E15241" opacity="0.18" className="animate-pulse-soft" />
        <circle r="7" fill="#E15241" />
        <path d="M0 -18 L0 -2" stroke="#E15241" strokeWidth="2" />
      </g>
      <text x="60" y="286" fill="#FBF8F2" fontSize="12" fontFamily="Inter, sans-serif" opacity="0.8">
        Venue
      </text>

      {/* home pin */}
      <g transform="translate(552,90)">
        <circle r="16" fill="#1F9E82" opacity="0.2" className="animate-pulse-soft" />
        <path
          d="M-10 4 L0 -8 L10 4 V14 H-10 Z"
          fill="#1F9E82"
        />
      </g>
      <text x="524" y="60" fill="#FBF8F2" fontSize="12" fontFamily="Inter, sans-serif" opacity="0.8">
        Home
      </text>

      {/* car marker riding the path */}
      <g
        className="animate-car-drift"
        style={{ offsetPath: "path('M96 268 C 150 200, 210 260, 270 210 S 400 150, 460 190 S 560 150, 552 96')" }}
      >
        <circle r="7" fill="#F5A623" />
      </g>
    </svg>
  );
}
