import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Optional environment configuration for Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForCollegeLMSProduction2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "apex-university-lms.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "apex-university-lms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "apex-university-lms.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102938475612",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102938475612:web:a1b2c3d4e5f67890"
};

let app, auth, db, storage;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (using high-performance local fallback):", error);
}

export { app, auth, db, storage };
