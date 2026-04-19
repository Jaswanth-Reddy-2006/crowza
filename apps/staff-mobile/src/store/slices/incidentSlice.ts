/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Incident } from '@shared/types/incident';

export interface IncidentState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentState = {
  incidents: [],
  loading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload;
      state.loading = false;
    },
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.unshift(action.payload);
    },
    updateIncidentStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const index = state.incidents.findIndex((incident: Incident) => incident.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index].status = action.payload.status as any;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setIncidents, addIncident, updateIncidentStatus, setLoading } = incidentSlice.actions;
export default incidentSlice.reducer;
