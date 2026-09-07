import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// This panel deliberately does NOT use onSnapshot. Feedback is only ever
// fetched with a one-off getDocs() call, and only when an admin opens this
// tab (AdminDashboard only mounts the active tab's component) or clicks
// "Load more" / "Refresh" — never a standing realtime listener. That keeps
// Firestore reads to "however many the admin actually looks at," which
// matters on a limited/free Firebase plan.
const PAGE_SIZE = 20;

const statusOptions = ["new", "read", "resolved"];
const statusStyles = {
  new: "bg-porch-amber/15 text-porch-amber",
  read: "bg-harbor-teal/15 text-harbor-teal",
  resolved: "bg-dusk-slate/15 text-dusk-slate",
};

function Stars({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= rating ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L12 16.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L12 3.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function FeedbackPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  // Filtering happens over whatever pages have already been loaded, so
  // switching the filter never triggers another read.
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadFirstPage() {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(query(collection(db, "feedback"), orderBy("createdAt", "desc"), limit(PAGE_SIZE)));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message || "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const snap = await getDocs(
        query(collection(db, "feedback"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE))
      );
      setItems((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message || "Could not load more feedback.");
    } finally {
      setLoadingMore(false);
    }
  }

  // Fires once when the admin opens this tab (AdminDashboard only mounts
  // the selected tab), not on every render and not on a timer/listener.
  useEffect(() => {
    loadFirstPage();
  }, []);

  async function handleStatusChange(id, status) {
    // Optimistic local update — avoids an extra read to confirm the write.
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    try {
      await updateDoc(doc(db, "feedback", id), { status });
    } catch (err) {
      setError(err.message || "Could not update status.");
      loadFirstPage(); // fall back to a fresh read only if something went wrong
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this feedback? This cannot be undone.")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    try {
      await deleteDoc(doc(db, "feedback", id));
    } catch (err) {
      setError(err.message || "Could not delete feedback.");
      loadFirstPage();
    }
  }

  const visibleItems = statusFilter === "all" ? items : items.filter((it) => (it.status || "new") === statusFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-night-route">
          Feedback ({visibleItems.length}{statusFilter !== "all" ? ` of ${items.length} loaded` : ""})
        </h2>
        <div className="flex items-center gap-2">
          <select
            className="input !w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={loadFirstPage} className="btn-ghost !border-night-route/20 !px-4 !py-2 !text-night-route hover:!bg-night-route/5">
            Refresh
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-dusk-slate">
        The status filter only applies to feedback already loaded below — use
        "Load more" to bring in older feedback before filtering across it.
      </p>

      {error && <p className="mt-4 text-sm text-signal-coral">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-dusk-slate">Loading feedback…</p>
      ) : visibleItems.length === 0 ? (
        <p className="mt-6 text-sm text-dusk-slate">No feedback to show.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleItems.map((f) => (
            <div key={f.id} className="card grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display font-bold text-night-route">{f.customerName}</h3>
                  <Stars rating={f.rating} />
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[f.status] || statusStyles.new}`}>
                    {f.status || "new"}
                  </span>
                </div>
                <div className="mt-2 grid gap-1 text-sm text-night-route/80 sm:grid-cols-2">
                  {f.bookingId && <p><span className="font-semibold">Booking ID:</span> {f.bookingId}</p>}
                  {f.driverName && <p><span className="font-semibold">Driver:</span> {f.driverName}</p>}
                  {f.createdAt?.toDate && (
                    <p><span className="font-semibold">Submitted:</span> {f.createdAt.toDate().toLocaleString()}</p>
                  )}
                </div>
                {f.message && <p className="mt-2 text-sm text-dusk-slate">{f.message}</p>}
              </div>

              <div className="flex flex-col items-start gap-2 lg:items-end">
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(f.id, s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        (f.status || "new") === s ? statusStyles[s] : "bg-black/5 text-dusk-slate hover:bg-black/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="rounded-full bg-signal-coral/10 px-3 py-1.5 text-xs font-semibold text-signal-coral hover:bg-signal-coral/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="btn-ghost !border-night-route/20 !text-night-route hover:!bg-night-route/5 mt-6"
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
