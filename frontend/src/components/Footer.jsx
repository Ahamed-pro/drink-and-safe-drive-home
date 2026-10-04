import { Link } from "react-router-dom";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "../lib/constants.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-route-deep text-warm-paper">
      <div className="container-max grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-4 lg:px-16">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-porch-amber font-display text-sm font-extrabold text-night-route-deep">
              DS
            </span>
            <span className="font-display text-lg font-bold">Drink &amp; Safe Drive Home</span>
          </div>
          <p className="mt-4 text-sm text-warm-paper/60 si">
            ඔබේ වාහනය. අපේ රියදුරු. ඔබේ ආරක්ෂිත ගමන.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-porch-amber">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-warm-paper/70">
            <li><Link to="/how-it-works" className="hover:text-warm-paper">How It Works</Link></li>
            <li><Link to="/pricing" className="hover:text-warm-paper">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-warm-paper">About Us</Link></li>
            <li><Link to="/pre-book" className="hover:text-warm-paper">Pre-Book a Driver</Link></li>
            <li><Link to="/feedback" className="hover:text-warm-paper">Rate Us &amp; Feedback</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-porch-amber">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-warm-paper/70">
            <li>
              <a href={`tel:${PHONE_TEL}`} className="hover:text-warm-paper">
                Call {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-warm-paper">
                WhatsApp {PHONE_DISPLAY}
              </a>
            </li>
            <li>Narahenpita &amp; surrounding areas, Sri Lanka</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-porch-amber">Admin</h3>
          <ul className="mt-4 space-y-2 text-sm text-warm-paper/70">
            <li><Link to="/admin/login" className="hover:text-warm-paper">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-warm-paper/40">
        © {new Date().getFullYear()} Drink &amp; Safe Drive Home. All rights reserved.
      </div>
    </footer>
  );
}