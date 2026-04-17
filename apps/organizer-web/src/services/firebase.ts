import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Use same config as other apps but via Vite env variables, 
// or fallback to hardcoded if env missing for rapid proto.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBlpF0eH0wccKA4LkGDR-Xid3fqLbgPYr0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "crowza.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "crowza",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "crowza.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "626426589835",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:626426589835:web:a553b4464bf7b5874a5a8e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
