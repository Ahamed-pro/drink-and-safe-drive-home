import { useState } from "react";

export default function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating out of 5 stars">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hovered || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            className="p-0.5"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill={filled ? "#F5A623" : "none"}
              stroke="#F5A623"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L12 16.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L12 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
