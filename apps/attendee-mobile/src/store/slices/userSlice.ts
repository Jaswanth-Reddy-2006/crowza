import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import attendeeApiClient from '../../services/api/attendeeApiClient';
import { User } from '@crowza/shared';

export interface UserProfile extends User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: any;
  savedLocations: string[];
}

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get('/auth/user');
      return response.data.data.user;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyError = error as any;
      return rejectWithValue(anyError.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Record<string, unknown>>) => {
      if (state.profile) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload };
      }
    },
    addSavedLocation: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.savedLocations.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { setProfile, updatePreferences, addSavedLocation } = userSlice.actions;
export default userSlice.reducer;
