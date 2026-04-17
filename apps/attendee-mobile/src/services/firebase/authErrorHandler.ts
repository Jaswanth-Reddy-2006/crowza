/**
 * Firebase Error Handler
 * Translates Firebase errors to user-friendly messages and handles recovery
 */

import { FirebaseError } from 'firebase/app';
import { auditLogger } from '../security/auditLogger';

export type FirebaseErrorCode =
  | 'auth/weak-password'
  | 'auth/email-already-in-use'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/account-exists-with-different-credential'
  | 'auth/network-request-failed'
  | 'auth/user-cancelled'
  | 'auth/unauthorized-domain'
  | 'auth/invalid-api-key'
  | 'auth/too-many-requests'
  | 'auth/invalid-oauth-provider'
  | 'auth/cancelled-popup-request'
  | 'auth/popup-blocked'
  | 'auth/popup-closed-by-user';

export interface AuthError {
  code: FirebaseErrorCode;
  message: string;
  userMessage: string;
  recoveryAction?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Convert Firebase errors to user-friendly messages
 */
export function handleFirebaseAuthError(error: any, userId?: string): AuthError {
  const firebaseError = error as FirebaseError;
  const code = firebaseError.code as FirebaseErrorCode;

  const errorMap: Record<FirebaseErrorCode, AuthError> = {
    'auth/weak-password': {
      code,
      message: firebaseError.message,
      userMessage:
        'Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.',
      recoveryAction: 'retry',
      severity: 'warning',
    },
    'auth/email-already-in-use': {
      code,
      message: firebaseError.message,
      userMessage: 'This email is already registered. Please sign in or use a different email.',
      recoveryAction: 'switch_to_login',
      severity: 'info',
    },
    'auth/user-not-found': {
      code,
      message: firebaseError.message,
      userMessage: 'User account not found. Please check your email or sign up.',
      recoveryAction: 'switch_to_signup',
      severity: 'warning',
    },
    'auth/wrong-password': {
      code,
      message: firebaseError.message,
      userMessage: 'Incorrect password. Please try again.',
      recoveryAction: 'retry',
      severity: 'warning',
    },
    'auth/invalid-email': {
      code,
      message: firebaseError.message,
      userMessage: 'Invalid email address format. Please check and try again.',
      recoveryAction: 'retry',
      severity: 'warning',
    },
    'auth/operation-not-allowed': {
      code,
      message: firebaseError.message,
      userMessage:
        'Email/password authentication is not enabled. Please contact support.',
      recoveryAction: 'contact_support',
      severity: 'critical',
    },
    'auth/network-request-failed': {
      code,
      message: firebaseError.message,
      userMessage:
        'Network connection failed. Please check your internet connection and try again.',
      recoveryAction: 'retry',
      severity: 'error',
    },
    'auth/too-many-requests': {
      code,
      message: firebaseError.message,
      userMessage:
        'Too many login attempts. Please wait a few minutes and try again.',
      recoveryAction: 'retry_later',
      severity: 'warning',
    },
    'auth/invalid-api-key': {
      code,
      message: firebaseError.message,
      userMessage:
        'Application configuration error. Please contact support.',
      recoveryAction: 'contact_support',
      severity: 'critical',
    },
    'auth/user-cancelled': {
      code,
      message: firebaseError.message,
      userMessage: 'Authentication was cancelled.',
      recoveryAction: 'retry',
      severity: 'info',
    },
    'auth/unauthorized-domain': {
      code,
      message: firebaseError.message,
      userMessage:
        'Domain not authorized. Please contact support.',
      recoveryAction: 'contact_support',
      severity: 'critical',
    },
    'auth/account-exists-with-different-credential': {
      code,
      message: firebaseError.message,
      userMessage:
        'Account already exists with different credentials. Please sign in with your original method.',
      recoveryAction: 'retry',
      severity: 'warning',
    },
    'auth/invalid-oauth-provider': {
      code,
      message: firebaseError.message,
      userMessage: 'OAuth provider is not configured correctly.',
      recoveryAction: 'contact_support',
      severity: 'critical',
    },
    'auth/cancelled-popup-request': {
      code,
      message: firebaseError.message,
      userMessage: 'Login was cancelled.',
      recoveryAction: 'retry',
      severity: 'info',
    },
    'auth/popup-blocked': {
      code,
      message: firebaseError.message,
      userMessage:
        'Login popup was blocked. Please allow popups and try again.',
      recoveryAction: 'retry',
      severity: 'warning',
    },
    'auth/popup-closed-by-user': {
      code,
      message: firebaseError.message,
      userMessage: 'Login popup was closed.',
      recoveryAction: 'retry',
      severity: 'info',
    },
  };

  const authError =
    errorMap[code] || {
      code: code as FirebaseErrorCode,
      message: firebaseError.message,
      userMessage:
        'An authentication error occurred. Please try again or contact support.',
      recoveryAction: 'retry',
      severity: 'error' as const,
    };

  // Log security event
  if (userId) {
    auditLogger.logAuthEvent(
      userId,
      'AUTH_FAILED',
      false,
      {
        code,
        message: authError.userMessage,
        severity: authError.severity,
      }
    );
  }

  return authError;
}

/**
 * Validate email before Firebase call
 */
export function validateEmailFormat(email: string): { valid: boolean; message?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }

  // RFC 5322 simplified
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { valid: false, message: 'Email is too long' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  strong: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];

  if (!password || password.length < 8) {
    feedback.push('At least 8 characters required');
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('At least one uppercase letter required');
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('At least one lowercase letter required');
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('At least one number required');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('At least one special character required');
  }

  return {
    strong: feedback.length === 0,
    feedback,
  };
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: FirebaseErrorCode): boolean {
  const recoverableErrors: FirebaseErrorCode[] = [
    'auth/wrong-password',
    'auth/user-not-found',
    'auth/network-request-failed',
    'auth/too-many-requests',
    'auth/weak-password',
    'auth/invalid-email',
  ];

  return recoverableErrors.includes(error);
}

/**
 * Should retry error
 */
export function shouldRetryError(error: FirebaseErrorCode): boolean {
  const retryableErrors: FirebaseErrorCode[] = [
    'auth/network-request-failed',
    'auth/too-many-requests',
  ];

  return retryableErrors.includes(error);
}

/**
 * Get retry delay in ms
 */
export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
}

export default {
  handleFirebaseAuthError,
  validateEmailFormat,
  validatePasswordStrength,
  isRecoverableError,
  shouldRetryError,
  getRetryDelay,
};
