import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-night-route px-6 py-16 text-warm-paper">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-porch-amber" /> Admin only
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-warm-paper/60">
          Access restricted to Drink &amp; Safe Drive Home administrators.
        </p>

        <label className="mt-6 block text-sm font-semibold">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-night-route px-4 py-2.5 text-sm text-warm-paper outline-none focus:border-porch-amber"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-night-route px-4 py-2.5 text-sm text-warm-paper outline-none focus:border-porch-amber"
          />
        </label>

        {error && <p className="mt-3 text-sm text-signal-coral">{error}</p>}

        <button type="submit" disabled={loading} className="btn-amber mt-6 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
