// Server-side only. This uses a Firebase service account, which has full
// admin rights — it must NEVER be shipped to the frontend or committed to
// git. Loaded from environment variables (see .env.example).
import admin from "firebase-admin";
import "dotenv/config";

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    "\nMissing Firebase service account credentials.\n" +
      "Create backend/.env (copy backend/.env.example) and fill in\n" +
      "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY\n" +
      "from Firebase Console > Project settings > Service accounts >\n" +
      "Generate new private key.\n"
  );
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Render literal "\n" in the .env value as real newlines.
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
