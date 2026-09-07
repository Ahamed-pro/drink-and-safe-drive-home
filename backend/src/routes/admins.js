import { Router } from "express";
import { adminAuth, adminDb } from "../firebaseAdmin.js";

const router = Router();

// Creates a Firebase Auth user AND the matching /admins/{uid} Firestore
// document that the security rules and frontend check for admin access.
// This is the ONLY supported way to create an admin — there is no signup
// form anywhere in the app, by design (drivers and customers never get
// accounts). Protect this route with ADMIN_SETUP_SECRET and only call it
// yourself (e.g. with curl or Postman) when onboarding a new administrator.
router.post("/", async (req, res) => {
  const { setupSecret, email, password, name } = req.body || {};

  if (!process.env.ADMIN_SETUP_SECRET || setupSecret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: "Invalid or missing setup secret." });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  try {
    let userRecord;
    let alreadyExisted = false;

    try {
      userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: name || undefined,
      });
    } catch (err) {
      // If the Auth account already exists (e.g. a previous attempt created
      // it but failed before the Firestore write below — such as Firestore
      // not being enabled yet), reuse that existing account instead of
      // failing outright, so this endpoint can be safely re-run.
      if (err.code === "auth/email-already-exists") {
        userRecord = await adminAuth.getUserByEmail(email);
        alreadyExisted = true;
      } else {
        throw err;
      }
    }

    await adminDb.collection("admins").doc(userRecord.uid).set({
      email,
      name: name || "",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      note: alreadyExisted
        ? "Auth account already existed — admin access has now been (re)granted for it. The original password is unchanged; use it to log in."
        : undefined,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;