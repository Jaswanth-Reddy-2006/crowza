/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WaitTimeState {
  queues: Record<string, number>; // zoneId -> waitMins
  trends: Record<string, number[]>; // zoneId -> historical data
  loading: boolean;
}

const initialState: WaitTimeState = {
  queues: {},
  trends: {},
  loading: false,
};

const waittimeSlice = createSlice({
  name: 'waittime',
  initialState,
  reducers: {
    setWaitTime: (state, action: PayloadAction<{ zoneId: string; waitMins: number }>) => {
      state.queues[action.payload.zoneId] = action.payload.waitMins;
    },
    setTrends: (state, action: PayloadAction<{ zoneId: string; trends: number[] }>) => {
      state.trends[action.payload.zoneId] = action.payload.trends;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setWaitTime, setTrends, setLoading } = waittimeSlice.actions;
export default waittimeSlice.reducer;
