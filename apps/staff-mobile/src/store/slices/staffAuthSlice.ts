/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth } from '../../services/firebase/config';
import { User, UserRole } from '@crowza/shared';

export interface EventHistoryEntry {
  id: string;
  name: string;
  date: string;
  role: string;
  location: string;
  tasksCompleted: number;
}

export interface StaffAuthState {
  staff: User | null;
  staffId: string | null;
  role: UserRole | null;
  permissions: string[];
  isAuthenticated: boolean;
  joinedEventId: string | null;
  eventHistory: EventHistoryEntry[];
  loading: boolean;
  error: string | null;
  mfaPending: boolean;
  token: string | null;
}

const initialState: StaffAuthState = {
  staff: null,
  staffId: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  joinedEventId: null,
  eventHistory: [
    { id: '1', name: 'Global Tech Summit 2024', date: '2024-03-15', role: 'Team Lead', location: 'Section A, Gate 4', tasksCompleted: 12 },
    { id: '2', name: 'Starlight Music Festival', date: '2024-02-10', role: 'Security Ops', location: 'Main Stage Perimeter', tasksCompleted: 8 },
    { id: '3', name: 'Winter Charity Gala', date: '2023-12-22', role: 'Front of House', location: 'VIP Lounge', tasksCompleted: 15 },
  ],
  loading: false,
  error: null,
  mfaPending: false,
  token: null,
};

export const loginStaff = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'staffAuth/loginStaff',
  async (credentials, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const fbUser = userCredential.user;
      
      return {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        role: UserRole.OPERATOR, 
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Staff login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerStaff = createAsyncThunk<User, { email: string; password: string; displayName: string }, { rejectValue: string }>(
  'staffAuth/registerStaff',
  async (data, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;
      
      await updateProfile(fbUser, { displayName: data.displayName });
      
      return {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: data.displayName,
        role: UserRole.OPERATOR,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Staff registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutStaff = createAsyncThunk<void, void, { rejectValue: string }>(
  'staffAuth/logoutStaff', 
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const joinEvent = createAsyncThunk<{ eventId: string }, string, { rejectValue: string }>(
  'staffAuth/joinEvent',
  async (code, { rejectWithValue }) => {
    try {
      if (!code || code.trim().length === 0) {
        throw new Error('Active mission code required.');
      }
      return { eventId: `venue-${code.toLowerCase()}` };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Join failed';
      return rejectWithValue(message);
    }
  }
);

const staffAuthSlice = createSlice({
  name: 'staffAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    leaveEvent: (state) => {
      state.joinedEventId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStaff.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const user = action.payload;
        state.staff = user;
        state.staffId = user.id;
        state.role = user.role;
        state.isAuthenticated = true;
      })
      .addCase(loginStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStaff.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const user = action.payload;
        state.staff = user;
        state.staffId = user.id;
        state.role = user.role;
        state.isAuthenticated = true;
      })
      .addCase(registerStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutStaff.fulfilled, (state) => {
        state.staff = null;
        state.staffId = null;
        state.role = null;
        state.isAuthenticated = false;
        state.joinedEventId = null;
      })
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action: PayloadAction<{ eventId: string }>) => {
        state.loading = false;
        state.joinedEventId = action.payload.eventId;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, leaveEvent } = staffAuthSlice.actions;
export default staffAuthSlice.reducer;

