import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext.jsx";

// Being logged in isn't enough — the signed-in account also needs a matching
// document in the `admins` collection (keyed by uid). This lets an admin
// revoke another admin's dashboard access without deleting their login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkAdmin() {
      if (!user) {
        setCheckingRole(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "admins", user.uid));
        if (active) setIsAdmin(snap.exists());
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setCheckingRole(false);
      }
    }
    checkAdmin();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night-route text-warm-paper">
        Checking access…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
