import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import attendeeApiClient from '../../services/api/attendeeApiClient';
import { Venue, Zone, Event } from '@crowza/shared';

export interface VenueState {
  currentVenue: Venue | null;
  zones: Zone[];
  events: Event[];
  selectedZone: Zone | null;
  loading: boolean;
  error: string | null;
}

const initialState: VenueState = {
  currentVenue: {
    id: 'stadium_001',
    name: 'Crowza Imperial Stadium',
    location: 'Mumbai, India',
    capacity: 55000,
    status: 'ACTIVE',
    metadata: {
      gates: ['Gate A', 'Gate B', 'Gate C', 'Gate D'],
      amenities: ['Food Court', 'First Aid', 'VIP Lounge'],
    }
  } as any,
  zones: [
    { id: 'zone_1', name: 'West Stands - Section A', polygon: [[100, 200], [400, 200], [500, 300], [200, 300]], type: 'STANDS' },
    { id: 'zone_2', name: 'East Stands - Section B', polygon: [[600, 200], [900, 200], [800, 300], [500, 300]], type: 'STANDS' },
    { id: 'zone_3', name: 'VIP Lounge - North', polygon: [[200, 700], [500, 700], [500, 800], [100, 800]], type: 'VIP' },
    { id: 'zone_4', name: 'South Exit - Main', polygon: [[500, 700], [800, 700], [900, 800], [500, 800]], type: 'EXIT' },
    { id: 'zone_food_1', name: 'Curry Express - L1', polygon: [[50, 50], [150, 50], [150, 150], [50, 150]], type: 'AMENITY' },
    { id: 'zone_med_1', name: 'First Aid - Gate 3', polygon: [[850, 50], [950, 50], [950, 150], [850, 150]], type: 'AMENITY' },
    { id: 'zone_park_v', name: 'VIP Parking B1', polygon: [[300, 850], [700, 850], [700, 950], [300, 950]], type: 'AMENITY' },
  ] as any[],
  events: [],
  selectedZone: null,
  loading: false,
  error: null,
};

export const fetchVenue = createAsyncThunk(
  'venue/fetchVenue',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get(`/venues/${venueId}`);
      return response.data.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyError = error as any;
      return rejectWithValue(anyError.response?.data?.message || 'Failed to fetch venue');
    }
  }
);

export const fetchZones = createAsyncThunk(
  'venue/fetchZones',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get(`/venues/${venueId}/zones`);
      return response.data.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyError = error as any;
      return rejectWithValue(anyError.response?.data?.message || 'Failed to fetch zones');
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'venue/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get('/events');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    selectZone: (state, action: PayloadAction<Zone>) => {
      state.selectedZone = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenue.fulfilled, (state, action) => {
        state.currentVenue = action.payload;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      });
  },
});

export const { selectZone } = venueSlice.actions;
export default venueSlice.reducer;
