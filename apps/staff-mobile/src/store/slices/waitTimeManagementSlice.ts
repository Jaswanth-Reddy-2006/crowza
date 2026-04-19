/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import staffApiClient from '../../services/api/staffApiClient';

export interface QueueEntry {
  zoneId: string;
  zoneName: string;
  estimatedWaitMins: number;
  queueLength: number;
}

export interface WaitTimeManagementState {
  queues: QueueEntry[];
  selectedQueue: QueueEntry | null;
  estimatedWaitOverrides: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: WaitTimeManagementState = {
  queues: [],
  selectedQueue: null,
  estimatedWaitOverrides: {},
  loading: false,
  error: null,
};

export const fetchAllQueues = createAsyncThunk(
  'waitTimeManagement/fetchAllQueues',
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.get('/queues', { params: { venueId } });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queues');
    }
  }
);

export const updateWaitEstimate = createAsyncThunk(
  'waitTimeManagement/updateWaitEstimate',
  async (payload: { zoneId: string; minutes: number }, { rejectWithValue }) => {
    try {
      const response = await staffApiClient.post(`/queues/${payload.zoneId}/wait-estimate`, {
        estimatedWaitMins: payload.minutes,
      });
      return { zoneId: payload.zoneId, minutes: payload.minutes, data: response.data.data };
    } catch (error: unknown) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wait estimate');
    }
  }
);

const waitTimeManagementSlice = createSlice({
  name: 'waitTimeManagement',
  initialState,
  reducers: {
    setQueues: (state, action: PayloadAction<QueueEntry[]>) => {
      state.queues = action.payload;
    },
    updateWait: (state, action: PayloadAction<{ zoneId: string; waitMins: number }>) => {
      const queue = state.queues.find((q) => q.zoneId === action.payload.zoneId);
      if (queue) queue.estimatedWaitMins = action.payload.waitMins;
    },
    overrideWait: (state, action: PayloadAction<{ zoneId: string; minutes: number }>) => {
      state.estimatedWaitOverrides[action.payload.zoneId] = action.payload.minutes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQueues.fulfilled, (state, action) => {
        state.queues = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllQueues.pending, (state) => { state.loading = true; })
      .addCase(updateWaitEstimate.fulfilled, (state, action) => {
        const queue = state.queues.find((q) => q.zoneId === action.payload.zoneId);
        if (queue) queue.estimatedWaitMins = action.payload.minutes;
        state.estimatedWaitOverrides[action.payload.zoneId] = action.payload.minutes;
      })
      .addCase(updateWaitEstimate.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setQueues, updateWait, overrideWait } = waitTimeManagementSlice.actions;
export default waitTimeManagementSlice.reducer;
