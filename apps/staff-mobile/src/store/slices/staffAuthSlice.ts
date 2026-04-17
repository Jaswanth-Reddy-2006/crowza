import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../../services/firebase/config';
import { User, UserRole } from '@crowza/shared';

export interface StaffAuthState {
  staff: User | null;
  staffId: string | null;
  role: UserRole | null;
  permissions: string[];
  isAuthenticated: boolean;
  joinedEventId: string | null;
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
  loading: false,
  error: null,
  mfaPending: false,
  token: null,
};

export const loginStaff = createAsyncThunk(
  'staffAuth/loginStaff',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const fbUser = userCredential.user;
      
      // For now, we assume any firebase user can be staff if they have a staff email
      // In a real app, you would check custom claims or a 'staff' collection in Firestore
      return {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        role: UserRole.OPERATOR, 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Staff login failed');
    }
  }
);

export const registerStaff = createAsyncThunk(
  'staffAuth/registerStaff',
  async (data: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Staff registration failed');
    }
  }
);

export const logoutStaff = createAsyncThunk('staffAuth/logoutStaff', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

export const joinEvent = createAsyncThunk(
  'staffAuth/joinEvent',
  async (code: string, { rejectWithValue }) => {
    try {
      // Mock validation: Codes starting with 'EVENT-' are valid
      if (!code.startsWith('EVENT-')) {
        throw new Error('Invalid invitation code. Please check with the host.');
      }
      return { eventId: code.replace('EVENT-', 'venue-') };
    } catch (error: any) {
      return rejectWithValue(error.message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStaff.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload as any;
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
      .addCase(registerStaff.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload as any;
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
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.joinedEventId = action.payload.eventId;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = staffAuthSlice.actions;
export default staffAuthSlice.reducer;
