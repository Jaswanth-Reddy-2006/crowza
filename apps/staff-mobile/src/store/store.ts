/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import staffAuthReducer from './slices/staffAuthSlice';
import dashboardReducer from './slices/dashboardSlice';
import occupancyManagementReducer from './slices/occupancyManagementSlice';
import incidentManagementReducer from './slices/incidentManagementSlice';
import waitTimeManagementReducer from './slices/waitTimeManagementSlice';
import parkingManagementReducer from './slices/parkingManagementSlice';
import staffTeamReducer from './slices/staffTeamSlice';
import analyticsReducer from './slices/analyticsSlice';

const rootReducer = combineReducers({
  staffAuth: staffAuthReducer,
  dashboard: dashboardReducer,
  occupancyManagement: occupancyManagementReducer,
  incidentManagement: incidentManagementReducer,
  waitTimeManagement: waitTimeManagementReducer,
  parkingManagement: parkingManagementReducer,
  staffTeam: staffTeamReducer,
  analytics: analyticsReducer,
});

const persistConfig = {
  key: 'staff-root',
  storage: AsyncStorage,
  whitelist: ['staffAuth'], // Only persist auth for staff
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
