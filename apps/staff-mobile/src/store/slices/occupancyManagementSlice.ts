/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';
import { Zone } from '@crowza/shared';

export interface CapacityAdjustment {
  zoneId: string;
  oldCapacity: number;
  newCapacity: number;
  reason: string;
  adjustedAt: string;
  adjustedBy: string;
}

export interface OccupancyManagementState {
  zones: Zone[];
  selectedZone: Zone | null;
  adjustmentHistory: CapacityAdjustment[];
  loading: boolean;
  error: string | null;
}

const initialState: OccupancyManagementState = {
  zones: [],
  selectedZone: null,
  adjustmentHistory: [],
  loading: false,
  error: null,
};

export const fetchManagedZones = createAsyncThunk(
  'occupancyManagement/fetchZones',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.get(`/venues/${venueId}/zones`);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones');
    }
  }
);

export const adjustZoneCapacity = createAsyncThunk(
  'occupancyManagement/adjustCapacity',
  async (
    payload: { zoneId: string; newCapacity: number; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await staffApiClient.patch(`/zones/${payload.zoneId}/capacity`, {
        capacity: payload.newCapacity,
        reason: payload.reason,
      });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to adjust capacity');
    }
  }
);

const occupancyManagementSlice = createSlice({
  name: 'occupancyManagement',
  initialState,
  reducers: {
    setZones: (state, action: PayloadAction<Zone[]>) => {
      state.zones = action.payload;
    },
    selectZone: (state, action: PayloadAction<Zone>) => {
      state.selectedZone = action.payload;
    },
    updateCapacity: (state, action: PayloadAction<{ zoneId: string; capacity: number }>) => {
      const zone = state.zones.find((z) => z.id === action.payload.zoneId);
      if (zone) {
        zone.capacity = action.payload.capacity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagedZones.fulfilled, (state, action) => {
        state.zones = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagedZones.pending, (state) => {
        state.loading = true;
      })
      .addCase(adjustZoneCapacity.fulfilled, (state, action) => {
        const { zoneId, capacity, adjustmentRecord } = action.payload;
        const zone = state.zones.find((z) => z.id === zoneId);
        if (zone) zone.capacity = capacity;
        if (adjustmentRecord) state.adjustmentHistory.push(adjustmentRecord);
      })
      .addCase(adjustZoneCapacity.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setZones, selectZone, updateCapacity } = occupancyManagementSlice.actions;
export default occupancyManagementSlice.reducer;
