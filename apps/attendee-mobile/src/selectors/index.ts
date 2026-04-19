/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import { RootState } from '../store/store';

// Auth selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Venue selectors
export const selectCurrentVenue = (state: RootState) => state.venue.currentVenue;
export const selectAllZones = (state: RootState) => state.venue.zones;
export const selectAllEvents = (state: RootState) => state.venue.events;
export const selectSelectedZone = (state: RootState) => state.venue.selectedZone;

// Occupancy selectors
export const selectZoneOccupancy = (zoneId: string) => (state: RootState) =>
  state.occupancy.zones[zoneId];
export const selectAllZoneOccupancies = (state: RootState) => state.occupancy.zones;
export const selectHeatmapData = (state: RootState) => state.occupancy.heatmap;
export const selectOccupancyAlerts = (state: RootState) => state.occupancy.alerts;

// Wait time selectors
export const selectWaitTime = (zoneId: string) => (state: RootState) =>
  state.waittime.queues[zoneId];
export const selectAllWaitTimes = (state: RootState) => state.waittime.queues;

// Notifications selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.notifications.length;

// User selectors
export const selectUserProfile = (state: RootState) => state.user.profile;

// Settings selectors
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectNotificationsEnabled = (state: RootState) => state.settings.notificationsEnabled;
