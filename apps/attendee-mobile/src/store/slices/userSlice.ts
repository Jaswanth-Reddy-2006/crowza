/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import attendeeApiClient from '../../services/api/attendeeApiClient';
import { User } from '@crowza/shared';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  [key: string]: unknown;
}

export interface UserProfile extends User {
  preferences: UserPreferences;
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

export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get('/auth/user');
      return response.data.data.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      return rejectWithValue(message);
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
    updatePreferences: (state, action: PayloadAction<UserPreferences>) => {
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
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
      });
  },
});

export const { setProfile, updatePreferences, addSavedLocation } = userSlice.actions;
export default userSlice.reducer;

