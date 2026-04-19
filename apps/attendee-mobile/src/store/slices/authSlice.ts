/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth } from '../../services/firebase/config';
import { User } from '@crowza/shared';
import {
  handleFirebaseAuthError,
  validateEmailFormat,
  validatePasswordStrength,
  AuthError,
} from '../../services/firebase/authErrorHandler';
import { auditLogger } from '../../services/security/auditLogger';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
  retryCount: number;
  lastError?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  retryCount: 0,
};

export const loginWithEmail = createAsyncThunk<User, { email: string; password: string }, { rejectValue: AuthError }>(
  'auth/loginWithEmail',
  async (credentials, { rejectWithValue }) => {
    try {
      const emailValidation = validateEmailFormat(credentials.email);
      if (!emailValidation.valid) {
        return rejectWithValue({
          code: 'auth/invalid-email',
          message: emailValidation.message,
          userMessage: emailValidation.message,
          severity: 'warning',
        });
      }

      if (!credentials.password) {
        return rejectWithValue({
          code: 'auth/invalid-email',
          message: 'Password is required',
          userMessage: 'Password is required',
          severity: 'warning',
        });
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email.trim(),
        credentials.password
      );
      const fbUser = userCredential.user;

      auditLogger.logAuthEvent(fbUser.uid, 'AUTH_LOGIN', true);

      return {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        role: 'USER', // Default role for type safety
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const authError = handleFirebaseAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const signupWithEmail = createAsyncThunk<User, { name: string; email: string; password: string }, { rejectValue: AuthError }>(
  'auth/signupWithEmail',
  async (details, { rejectWithValue }) => {
    try {
      const emailValidation = validateEmailFormat(details.email);
      if (!emailValidation.valid) {
        return rejectWithValue({
          code: 'auth/invalid-email',
          message: emailValidation.message,
          userMessage: emailValidation.message,
          severity: 'warning',
        });
      }

      const passwordValidation = validatePasswordStrength(details.password);
      if (!passwordValidation.strong) {
        return rejectWithValue({
          code: 'auth/weak-password',
          message: 'Password does not meet security requirements',
          userMessage: `Password too weak: ${passwordValidation.feedback.join(', ')}`,
          severity: 'warning',
        });
      }

      if (!details.name || details.name.trim().length < 2) {
        return rejectWithValue({
          code: 'auth/invalid-email',
          message: 'Name must be at least 2 characters',
          userMessage: 'Name must be at least 2 characters',
          severity: 'warning',
        });
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        details.email.trim(),
        details.password
      );
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: details.name.trim() });
      auditLogger.logAuthEvent(fbUser.uid, 'AUTH_LOGIN', true);

      return {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: details.name.trim(),
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const authError = handleFirebaseAuthError(error);
      return rejectWithValue(authError);
    }
  }
);

export const logout = createAsyncThunk<void, string | undefined, { rejectValue: AuthError }>(
  'auth/logout',
  async (userId, { rejectWithValue }) => {
    try {
      if (userId) {
        auditLogger.logAuthEvent(userId, 'AUTH_LOGOUT', true);
      }
      await signOut(auth);
    } catch (error: unknown) {
      const authError = handleFirebaseAuthError(error, userId);
      return rejectWithValue(authError);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.retryCount = 0;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
        state.retryCount += 1;
      })
      .addCase(signupWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.retryCount = 0;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
        state.retryCount += 1;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.retryCount = 0;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AuthError;
      });
  },
});

export const { clearError, resetRetryCount } = authSlice.actions;
export default authSlice.reducer;

