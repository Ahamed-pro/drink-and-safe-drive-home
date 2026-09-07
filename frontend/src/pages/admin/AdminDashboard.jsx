import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import BookingsPanel from "./BookingsPanel.jsx";
import DriversPanel from "./DriversPanel.jsx";
import PricingPanel from "./PricingPanel.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";

const tabs = [
  { key: "bookings", label: "Bookings" },
  { key: "drivers", label: "Drivers" },
  { key: "pricing", label: "Pricing" },
  { key: "feedback", label: "Feedback" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("bookings");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-warm-paper">
      <div className="border-b border-black/10 bg-night-route text-warm-paper">
        <div className="container-max flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-16">
          <div>
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" />
              Admin Dashboard
            </div>

            <p className="mt-1 text-sm text-warm-paper/60">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost !px-5 !py-2"
          >
            Log out
          </button>
        </div>

        <div className="container-max flex flex-wrap gap-2 px-6 pb-4 sm:px-10 lg:px-16">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-porch-amber text-night-route-deep"
                  : "bg-white/5 text-warm-paper/70 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-max px-6 py-10 sm:px-10 lg:px-16">
        {tab === "bookings" && <BookingsPanel />}

        {tab === "drivers" && <DriversPanel />}

        {tab === "pricing" && <PricingPanel />}

        {tab === "feedback" && <FeedbackPanel />}
      </div>
    </div>
  );
}