# Drive & Safe Drive Home

A driver-only pre-booking platform. Customers never book a vehicle — they
book a **professional driver** who drives the customer's own car (and them)
home safely. Not a taxi service.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express (admin-account bootstrapping only)
- **Data & Auth:** Firebase (Firestore + Firebase Authentication, admins only)

## Project structure

```
drive-safe-drive-home/
├── frontend/     React app — public site + admin dashboard
└── backend/      Express API — used only to create admin accounts
```

## 1. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project (or reuse the one already created).
2. Enable **Firestore Database** (production mode).
3. Enable **Authentication** → Sign-in method → **Email/Password**.
4. Add a **Web app** (</> icon) to get your web SDK config — you'll need these values for `frontend/.env`.
5. Go to **Project settings → Service accounts → Generate new private key** — you'll need these values for `backend/.env`.
6. Deploy the security rules in `frontend/firestore.rules` (Firestore → Rules tab, paste and publish — or use the Firebase CLI: `firebase deploy --only firestore:rules`).

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env       # fill in your Firebase web app config
npm install
npm run dev                # starts on http://localhost:5173
```

## 3. Backend setup

```bash
cd backend
cp .env.example .env       # fill in your service account + a secret string
npm install
npm run dev                # starts on http://localhost:4000
```

## 4. Create your first admin account

There is no admin sign-up page anywhere in the app on purpose — only an
existing admin (or you, during setup) can create admin accounts. With the
backend running:

```bash
curl -X POST http://localhost:4000/api/admins \
  -H "Content-Type: application/json" \
  -d '{
    "setupSecret": "the-ADMIN_SETUP_SECRET-value-from-backend/.env",
    "email": "admin@yourdomain.com",
    "password": "a-strong-password",
    "name": "Admin Name"
  }'
```

This creates both the Firebase Auth user and the matching `/admins/{uid}`
Firestore document the security rules and dashboard check for. Then sign in
at `http://localhost:5173/admin/login`.

## 5. How the data is organized (Firestore)

| Collection         | Who can write                  | Purpose |
|---------------------|---------------------------------|---------|
| `bookings`          | Anyone can **create**; only admins can read/update | Customer pre-booking requests |
| `drivers`            | Admins only                    | Driver records (name, phone, vehicle, active/inactive) |
| `settings/pricing`   | Admins only (publicly readable) | Live pricing shown on the Pricing page |
| `admins`             | Not writable from the client   | Marks which Auth accounts are admins |

## 6. Editing pricing

Pricing (base fare, free km, per-km rate, free wait time, waiting charge) is
**not hard-coded** — it lives in the `settings/pricing` Firestore document
and is edited from Admin Dashboard → Pricing. The public Pricing page
listens for live updates.

## Notes

- Customers never create accounts — they book by phone, WhatsApp, or the
  on-site form.
- Drivers never create their own accounts — only an admin adds them from
  Driver Management and assigns them to bookings.
- Never commit `frontend/.env` or `backend/.env` (both are already
  git-ignored) — they contain live credentials.
