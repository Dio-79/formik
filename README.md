# Formik — Backend Integration Assignment

Expo mobile app with Formik + Yup forms, Firebase Authentication, and Firestore data persistence.

## Backend choice

**Firebase (Option A)**

- Firebase Authentication for sign-up, sign-in, and sign-out
- Cloud Firestore for employee form submissions
- Firestore security rules restrict access to authenticated users and user-scoped records

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and add your Firebase project values:

```bash
cp .env.example .env
```

Required variables:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

3. In the [Firebase Console](https://console.firebase.google.com/):

   - Enable **Email/Password** authentication
   - Create a **Firestore** database
   - Deploy the rules from `firestore.rules` (Firestore → Rules → paste and publish)

   Or deploy from the terminal after installing Firebase CLI:

   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project formik-db1ad
   ```

4. Start the app:

```bash
npx expo start
```

Run on iOS simulator, Android emulator, or Expo Go.

## Test accounts

Create a test account from the in-app **Sign Up** screen, or use an account you create in Firebase Authentication.

Example flow:

1. Sign up with a new email/password
2. Submit the Employee form
3. Open **My Submissions** to verify the record appears

## Features implemented

### Authentication

- [x] Sign-Up screen
- [x] Sign-In screen
- [x] Sign-Out
- [x] Loading indicators during auth requests
- [x] Clear error messages (invalid credentials, weak password, network failure)
- [x] Redirect to authenticated area after login
- [x] Block unauthenticated access to protected screens

### Employee form persistence

- [x] **Create** — submit Employee Information Form to Firestore
- [x] **Read** — list stored submissions for the signed-in user
- [x] Records associated with authenticated `userId`

### Protected navigation & session handling

- [x] Protected routes for employee form and submissions list
- [x] Session restore on app launch via Firebase Auth persistence
- [x] Loading screen while session is being restored

### UX

- [x] Formik + Yup client-side validation
- [x] Empty state (“No submissions yet”)
- [x] Network error handling with retry on submissions screen
- [x] Consistent styling across screens

### CRUD checklist

| Operation | Status |
|-----------|--------|
| Create    | Yes    |
| Read      | Yes    |
| Update    | Yes    |
| Delete    | Yes    |

### Bonus features

| Feature        | Status |
|----------------|--------|
| Update record  | Yes    |
| Delete record  | Yes (with confirmation) |
| Password reset | Yes    |
| Profile screen | Yes    |

## Project structure

```
src/
  app/           # Expo Router screens
  contexts/      # Auth context and session handling
  lib/           # Firebase config and helpers
  styles/        # Shared form styles
firestore.rules  # Firestore security rules (deploy in Firebase Console)
```

## Troubleshooting

### `accounts:signInWithPassword` 400 in browser console

This usually means **wrong email or password** — Firebase returns HTTP 400 for invalid credentials. Use **Sign Up** to create a new account, or reset your password via **Forgot password?**

Also verify in Firebase Console → **Authentication** → **Sign-in method** that **Email/Password** is enabled.

### "Could not load submissions" / permission denied

1. Open [Firebase Console](https://console.firebase.google.com) → your project (`formik-db1ad`)
2. **Firestore Database** → create a database if you have not already (Native mode)
3. **Firestore** → **Rules** → replace with the contents of `firestore.rules` in this repo → **Publish**

Rules should look like:

```
allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
```

After publishing rules, tap **Retry** on the submissions screen.

## Security notes

- Do **not** commit `.env` or API keys to GitHub
- `.env` is listed in `.gitignore`
- Firestore rules ensure users can only read/write their own employee records
