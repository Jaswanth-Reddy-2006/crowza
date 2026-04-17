import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeatMapData, ZoneOccupancy } from '@crowza/shared';

export interface OccupancyState {
  zones: Record<string, ZoneOccupancy>;
  heatmap: HeatMapData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alerts: any[];
  loading: boolean;
}

const initialState: OccupancyState = {
  zones: {},
  heatmap: null,
  alerts: [],
  loading: false,
};

const occupancySlice = createSlice({
  name: 'occupancy',
  initialState,
  reducers: {
    setZoneOccupancy: (state, action: PayloadAction<ZoneOccupancy>) => {
      state.zones[action.payload.id] = action.payload;
    },
    setHeatmap: (state, action: PayloadAction<HeatMapData>) => {
      state.heatmap = action.payload;
    },
    addAlert: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.alerts.push(action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setZoneOccupancy, setHeatmap, addAlert, clearAlerts, setLoading } = occupancySlice.actions;
export default occupancySlice.reducer;
