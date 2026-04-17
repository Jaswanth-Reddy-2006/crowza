import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';
import { Incident } from '@crowza/shared';

type IncidentStatus = 'reported' | 'assigned' | 'in_progress' | 'resolved';
type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentFilters {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assignedTo?: string;
}

export interface IncidentManagementState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  assignedToMe: Incident[];
  filters: IncidentFilters;
  loading: boolean;
  error: string | null;
}

const initialState: IncidentManagementState = {
  incidents: [],
  selectedIncident: null,
  assignedToMe: [],
  filters: {},
  loading: false,
  error: null,
};

export const fetchIncidents = createAsyncThunk(
  'incidentManagement/fetchIncidents',
  async (filters: IncidentFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters as any).toString();
      const response = await staffApiClient.get(`/incidents?${params}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incidentManagement/createIncident',
  async (data: Partial<Incident>, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.post('/incidents', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create incident');
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incidentManagement/updateIncident',
  async (payload: { id: string; updates: Partial<Incident> }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.patch(`/incidents/${payload.id}`, payload.updates);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update incident');
    }
  }
);

export const assignIncident = createAsyncThunk(
  'incidentManagement/assignIncident',
  async (payload: { incidentId: string; staffId: string }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.patch(`/incidents/${payload.incidentId}/assign`, {
        staffId: payload.staffId,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign incident');
    }
  }
);

const incidentManagementSlice = createSlice({
  name: 'incidentManagement',
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload;
    },
    selectIncident: (state, action: PayloadAction<Incident>) => {
      state.selectedIncident = action.payload;
    },
    updateStatus: (state, action: PayloadAction<{ id: string; status: IncidentStatus }>) => {
      const incident = state.incidents.find((i) => i.id === action.payload.id);
      if (incident) incident.status = action.payload.status;
    },
    setFilters: (state, action: PayloadAction<IncidentFilters>) => {
      state.filters = action.payload;
    },
    // Real-time: merge incoming incident from Firestore
    upsertIncident: (state, action: PayloadAction<Incident>) => {
      const idx = state.incidents.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.incidents[idx] = action.payload;
      } else {
        state.incidents.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => { state.loading = true; })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both object-wrapped and direct array responses
        state.incidents = action.payload?.incidents || (Array.isArray(action.payload) ? action.payload : []);
        state.assignedToMe = action.payload?.assignedToMe || [];
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.incidents.unshift(action.payload);
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        const idx = state.incidents.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) state.incidents[idx] = action.payload;
      })
      .addCase(assignIncident.fulfilled, (state, action) => {
        const idx = state.incidents.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) state.incidents[idx] = action.payload;
      });
  },
});

export const { setIncidents, selectIncident, updateStatus, setFilters, upsertIncident } =
  incidentManagementSlice.actions;
export default incidentManagementSlice.reducer;
