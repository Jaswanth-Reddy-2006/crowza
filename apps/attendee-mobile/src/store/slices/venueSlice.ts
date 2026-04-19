/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      gates: ['Gate A', 'Gate B', 'Gate C', 'Gate D'],
      amenities: ['Food Court', 'First Aid', 'VIP Lounge'],
    }
  },
  zones: [
    { id: 'zone_1', name: 'West Stands - Section A', polygon: [[100, 200], [400, 200], [500, 300], [200, 300]], type: 'STANDS', capacity: 5000, count: 0, status: 'OPEN' },
    { id: 'zone_2', name: 'East Stands - Section B', polygon: [[600, 200], [900, 200], [800, 300], [500, 300]], type: 'STANDS', capacity: 5000, count: 0, status: 'OPEN' },
    { id: 'zone_3', name: 'VIP Lounge - North', polygon: [[200, 700], [500, 700], [500, 800], [100, 800]], type: 'VIP', capacity: 200, count: 0, status: 'OPEN' },
    { id: 'zone_4', name: 'South Exit - Main', polygon: [[500, 700], [800, 700], [900, 800], [500, 800]], type: 'EXIT', capacity: 1000, count: 0, status: 'OPEN' },
    { id: 'zone_food_1', name: 'Curry Express - L1', polygon: [[50, 50], [150, 50], [150, 150], [50, 150]], type: 'AMENITY', capacity: 100, count: 0, status: 'OPEN' },
    { id: 'zone_med_1', name: 'First Aid - Gate 3', polygon: [[850, 50], [950, 50], [950, 150], [850, 150]], type: 'AMENITY', capacity: 50, count: 0, status: 'OPEN' },
    { id: 'zone_park_v', name: 'VIP Parking B1', polygon: [[300, 850], [700, 850], [700, 950], [300, 950]], type: 'AMENITY', capacity: 150, count: 0, status: 'OPEN' },
  ],
  events: [],
  selectedZone: null,
  loading: false,
  error: null,
};

export const fetchVenue = createAsyncThunk<Venue, string>(
  'venue/fetchVenue',
  async (venueId: string) => {
    try {
      const response = await attendeeApiClient.get(`/venues/${venueId}`);
      return response.data.data;
    } catch (error: unknown) {
      if (initialState.currentVenue) return initialState.currentVenue;
      throw new Error('Failed to fetch venue and no fallback available');
    }
  }
);

export const fetchZones = createAsyncThunk<Zone[], string>(
  'venue/fetchZones',
  async (venueId: string) => {
    try {
      const response = await attendeeApiClient.get(`/venues/${venueId}/zones`);
      return response.data.data;
    } catch (error: unknown) {
      return initialState.zones;
    }
  }
);

export const fetchEvents = createAsyncThunk<Event[]>(
  'venue/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendeeApiClient.get('/events');
      return response.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return rejectWithValue(message);
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
      .addCase(fetchVenue.fulfilled, (state, action: PayloadAction<Venue>) => {
        state.currentVenue = action.payload;
      })
      .addCase(fetchZones.fulfilled, (state, action: PayloadAction<Zone[]>) => {
        state.zones = action.payload;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload;
      });
  },
});

export const { selectZone } = venueSlice.actions;
export default venueSlice.reducer;

