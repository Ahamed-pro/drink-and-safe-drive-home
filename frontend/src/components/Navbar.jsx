
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/constants.js";

const links = [
  { to: "/", label: "මුල් පිටුව", sub: "Home" },
  { to: "/how-it-works", label: "සේවාව", sub: "How It Works" },
  { to: "/pricing", label: "මිල ගණන්", sub: "Pricing" },
  { to: "/about", label: "අප ගැන", sub: "About" },
  { to: "/contact", label: "සම්බන්ධ වන්න", sub: "Contact" },
  { to: "/feedback", label: "ප්‍රතිචාරය", sub: "Rate Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night-route/95 backdrop-blur">
      <div className="container-max flex items-center gap-6 px-6 py-4 sm:px-10 lg:px-16">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-porch-amber font-display text-sm font-extrabold text-night-route-deep">
            DS
          </span>

          <span className="whitespace-nowrap font-display text-lg font-bold text-warm-paper">
            Drink <span className="text-porch-amber">&amp;</span> Safe Drive Home
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-semibold transition ${
                  isActive
                    ? "text-porch-amber"
                    : "text-warm-paper/80 hover:text-warm-paper"
                }`
              }
            >
              {link.sub}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-ghost whitespace-nowrap !px-4 !py-2.5 xl:!px-5"
          >
            Call {PHONE_DISPLAY}
          </a>

          <Link
            to="/pre-book"
            className="btn-amber whitespace-nowrap !px-4 !py-2.5 xl:!px-5"
          >
            Pre-Book a Driver
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-warm-paper lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            {open ? (
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-white/10 bg-night-route px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold ${
                    isActive
                      ? "text-porch-amber"
                      : "text-warm-paper/85"
                  }`
                }
              >
                {link.sub}{" "}
                <span className="si text-warm-paper/50">
                  · {link.label}
                </span>
              </NavLink>
            ))}

            <div className="mt-2 flex flex-col gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="btn-ghost"
              >
                Call {PHONE_DISPLAY}
              </a>

              <Link
                to="/pre-book"
                className="btn-amber"
                onClick={() => setOpen(false)}
              >
                Pre-Book a Driver
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
