/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';

export interface OccupancyMetrics {
  totalCapacity: number;
  currentOccupancy: number;
  occupancyPercentage: number;
  criticalZones: number;
}

export interface DashboardState {
  occupancyMetrics: OccupancyMetrics | null;
  incidentCount: number;
  avgWaitTime: number;
  alerts: any[];
  loading: boolean;
  lastRefreshed: string | null;
}

const initialState: DashboardState = {
  occupancyMetrics: null,
  incidentCount: 0,
  avgWaitTime: 0,
  alerts: [],
  loading: false,
  lastRefreshed: null,
};

export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const [occupancyRes, incidentsRes, waitTimesRes] = await Promise.all([
        staffApiClient.get(`/venues/${venueId}/occupancy-summary`),
        staffApiClient.get('/incidents?status=active'),
        staffApiClient.get('/queues/average'),
      ]);
      return {
        occupancyMetrics: occupancyRes.data.data,
        incidentCount: incidentsRes.data.data.total,
        avgWaitTime: waitTimesRes.data.data.avgWaitMins,
      };
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard metrics');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<Partial<DashboardState>>) => {
      return { ...state, ...action.payload };
    },
    updateMetrics: (state, action: PayloadAction<Partial<DashboardState>>) => {
      return { ...state, ...action.payload, lastRefreshed: new Date().toISOString() };
    },
    addAlert: (state, action: PayloadAction<any>) => {
      state.alerts.push(action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.occupancyMetrics = action.payload.occupancyMetrics;
        state.incidentCount = action.payload.incidentCount;
        state.avgWaitTime = action.payload.avgWaitTime;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchDashboardMetrics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setMetrics, updateMetrics, addAlert, clearAlerts } = dashboardSlice.actions;
export default dashboardSlice.reducer;
