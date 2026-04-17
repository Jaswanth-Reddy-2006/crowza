/**
 * Firebase Initialization Helper
 * Verifies Firebase configuration and handles initialization errors
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

interface FirebaseInitResult {
  success: boolean;
  message: string;
  app?: any;
  auth?: any;
  db?: any;
}

export async function initializeFirebaseWithValidation(): Promise<FirebaseInitResult> {
  try {
    // Check if already initialized
    if (getApps().length > 0) {
      return {
        success: true,
        message: 'Firebase already initialized',
        app: getApps()[0],
        auth: getAuth(getApps()[0]),
        db: getFirestore(getApps()[0]),
      };
    }

    // Check required environment variables
    const requiredEnvVars = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing Firebase configuration: ${missingVars.join(', ')}`,
      };
    }

    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Enable emulators in development (optional)
    if (__DEV__) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      } catch (error) {
        console.warn('Auth emulator already connected or not available');
      }

      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (error) {
        console.warn('Firestore emulator already connected or not available');
      }
    }

    return {
      success: true,
      message: 'Firebase initialized successfully',
      app,
      auth,
      db,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Firebase initialization error: ${error.message}`,
    };
  }
}

/**
 * Verify Firebase configuration
 */
export async function verifyFirebaseConfig(): Promise<{
  isValid: boolean;
  checks: Record<string, boolean>;
  issues: string[];
}> {
  const checks: Record<string, boolean> = {};
  const issues: string[] = [];

  // Check 1: API Key exists
  checks['apiKeyConfigured'] = Boolean(process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
  if (!checks['apiKeyConfigured']) {
    issues.push('Firebase API Key not configured (EXPO_PUBLIC_FIREBASE_API_KEY)');
  }

  // Check 2: Project ID exists
  checks['projectIdConfigured'] = Boolean(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  );
  if (!checks['projectIdConfigured']) {
    issues.push('Firebase Project ID not configured (EXPO_PUBLIC_FIREBASE_PROJECT_ID)');
  }

  // Check 3: Auth Domain exists
  checks['authDomainConfigured'] = Boolean(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
  if (!checks['authDomainConfigured']) {
    issues.push('Firebase Auth Domain not configured (EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN)');
  }

  // Check 4: App ID exists
  checks['appIdConfigured'] = Boolean(process.env.EXPO_PUBLIC_FIREBASE_APP_ID);
  if (!checks['appIdConfigured']) {
    issues.push('Firebase App ID not configured (EXPO_PUBLIC_FIREBASE_APP_ID)');
  }

  // Check 5: Email/Password auth enabled in console
  checks['emailPasswordAuthEnabled'] = true; // This can't be checked client-side
  // Note: Ensure Email/Password authentication is enabled in Firebase Console

  return {
    isValid: Object.values(checks).every((check) => check),
    checks,
    issues,
  };
}

/**
 * Common Firebase troubleshooting helper
 */
export function getFirebaseErrorHelp(errorCode: string): string {
  const helpMap: Record<string, string> = {
    'auth/operation-not-allowed':
      'Email/Password authentication is not enabled in your Firebase project. \nGo to Firebase Console → Authentication → Sign-in method → Enable "Email/Password"',
    'auth/invalid-api-key':
      'Invalid Firebase API Key. \nCheck your environment variables and ensure they match your Firebase project settings.',
    'auth/network-request-failed':
      'Network error connecting to Firebase. \nCheck your internet connection and ensure Firebase APIs are not blocked.',
    'auth/too-many-requests':
      'Too many login attempts. Please wait a few minutes before trying again.',
    'auth/user-not-found':
      'No user account found with this email. Please check your email or create a new account.',
    'auth/wrong-password':
      'Incorrect password. Please try again or use "Forgot Password" to reset.',
  };

  return (
    helpMap[errorCode] ||
    'An authentication error occurred. Please try again or contact support.'
  );
}

export default {
  initializeFirebaseWithValidation,
  verifyFirebaseConfig,
  getFirebaseErrorHelp,
};
