import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT_ID || 'venue-experience-platform';
  
  try {
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // Fallback initialization for semi-offline/unconfigured state
      admin.initializeApp({
        projectId,
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Initialize with just project ID as a last resort
    admin.initializeApp({ projectId });
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const adminApp = admin;
