/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';

type LotStatus = 'open' | 'closed' | 'full';

export interface ParkingLot {
  id: string;
  name: string;
  totalSpots: number;
  availableSpots: number;
  status: LotStatus;
}

export interface SpotStatus {
  spotId: string;
  lotId: string;
  occupied: boolean;
}

export interface ParkingManagementState {
  lots: ParkingLot[];
  spotStatus: SpotStatus[];
  occupancyByLot: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: ParkingManagementState = {
  lots: [],
  spotStatus: [],
  occupancyByLot: {},
  loading: false,
  error: null,
};

export const fetchParkingLots = createAsyncThunk(
  'parkingManagement/fetchLots',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.get('/parking/lots', { params: { venueId } });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parking lots');
    }
  }
);

export const updateParkingLotStatus = createAsyncThunk(
  'parkingManagement/updateStatus',
  async (payload: { lotId: string; status: LotStatus }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.patch(`/parking/lots/${payload.lotId}/status`, {
        status: payload.status,
      });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update parking status');
    }
  }
);

const parkingManagementSlice = createSlice({
  name: 'parkingManagement',
  initialState,
  reducers: {
    setLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.lots = action.payload;
    },
    updateSpotStatus: (state, action: PayloadAction<SpotStatus>) => {
      const spot = state.spotStatus.find(
        (s) => s.spotId === action.payload.spotId
      );
      if (spot) {
        spot.occupied = action.payload.occupied;
      } else {
        state.spotStatus.push(action.payload);
      }
      // Recalculate occupancy
      const lotSpots = state.spotStatus.filter((s) => s.lotId === action.payload.lotId);
      state.occupancyByLot[action.payload.lotId] = lotSpots.filter((s) => s.occupied).length;
    },
    closeLot: (state, action: PayloadAction<string>) => {
      const lot = state.lots.find((l) => l.id === action.payload);
      if (lot) lot.status = 'closed';
    },
    openLot: (state, action: PayloadAction<string>) => {
      const lot = state.lots.find((l) => l.id === action.payload);
      if (lot) lot.status = 'open';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingLots.pending, (state) => { state.loading = true; })
      .addCase(fetchParkingLots.fulfilled, (state, action) => {
        state.loading = false;
        state.lots = action.payload;
      })
      .addCase(fetchParkingLots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateParkingLotStatus.fulfilled, (state, action) => {
        const lot = state.lots.find((l) => l.id === action.payload.id);
        if (lot) lot.status = action.payload.status;
      });
  },
});

export const { setLots, updateSpotStatus, closeLot, openLot } = parkingManagementSlice.actions;
export default parkingManagementSlice.reducer;
