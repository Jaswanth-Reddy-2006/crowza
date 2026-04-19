/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';

export interface AnalyticsTrend {
  timestamp: string;
  value: number;
  label: string;
}

export interface IncidentSummary {
  total: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
}

export interface AnalyticsState {
  occupancyTrends: AnalyticsTrend[];
  incidentSummary: IncidentSummary | null;
  waitTimeTrends: AnalyticsTrend[];
  reportGenerating: boolean;
  reportUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  occupancyTrends: [],
  incidentSummary: null,
  waitTimeTrends: [],
  reportGenerating: false,
  reportUrl: null,
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (dateRange: { from: string; to: string }, { rejectWithValue }) => {
    try {
      const [occupancyRes, incidentsRes, waitTimesRes] = await Promise.all([
        staffApiClient.get('/analytics/occupancy', { params: dateRange }),
        staffApiClient.get('/analytics/incidents', { params: dateRange }),
        staffApiClient.get('/analytics/wait-times', { params: dateRange }),
      ]);
      return {
        occupancyTrends: occupancyRes.data.data.trends,
        incidentSummary: incidentsRes.data.data,
        waitTimeTrends: waitTimesRes.data.data.trends,
      };
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const generateReport = createAsyncThunk(
  'analytics/generateReport',
  async (params: { venueId: string; dateRange: { from: string; to: string } }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.post('/analytics/report', params);
      return response.data.data.reportUrl;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearReport: (state) => {
      state.reportUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.occupancyTrends = action.payload.occupancyTrends;
        state.incidentSummary = action.payload.incidentSummary;
        state.waitTimeTrends = action.payload.waitTimeTrends;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateReport.pending, (state) => { state.reportGenerating = true; })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.reportGenerating = false;
        state.reportUrl = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.reportGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReport } = analyticsSlice.actions;
export default analyticsSlice.reducer;
