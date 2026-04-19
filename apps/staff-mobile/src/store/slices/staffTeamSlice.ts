/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';
import { User, UserRole } from '@crowza/shared';

export interface StaffTeamState {
  teamMembers: User[];
  roles: UserRole[];
  permissions: Record<string, string[]>;
  loading: boolean;
  error: string | null;
}

const initialState: StaffTeamState = {
  teamMembers: [],
  roles: [],
  permissions: {},
  loading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  'staffTeam/fetchTeamMembers',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.get(`/venues/${venueId}/team`);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team');
    }
  }
);

export const updateStaffRole = createAsyncThunk(
  'staffTeam/updateStaffRole',
  async (payload: { staffId: string; role: UserRole }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.patch(`/staff/${payload.staffId}/role`, {
        role: payload.role,
      });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

const staffTeamSlice = createSlice({
  name: 'staffTeam',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<User[]>) => {
      state.teamMembers = action.payload;
    },
    updateRole: (state, action: PayloadAction<{ staffId: string; role: UserRole }>) => {
      const member = state.teamMembers.find((m) => m.id === action.payload.staffId);
      if (member) member.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload.members;
        state.roles = action.payload.roles;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStaffRole.fulfilled, (state, action) => {
        const member = state.teamMembers.find((m) => m.id === action.payload.id);
        if (member) member.role = action.payload.role;
      });
  },
});

export const { setTeam, updateRole } = staffTeamSlice.actions;
export default staffTeamSlice.reducer;
