import { RootState } from '../store/store';

// Staff auth selectors
export const selectIsStaffAuthenticated = (state: RootState) => state.staffAuth.isAuthenticated;
export const selectStaffUser = (state: RootState) => state.staffAuth.staff;
export const selectStaffId = (state: RootState) => state.staffAuth.staffId;
export const selectUserRole = (state: RootState) => state.staffAuth.role;
export const selectStaffPermissions = (state: RootState) => state.staffAuth.permissions;
export const selectMfaPending = (state: RootState) => state.staffAuth.mfaPending;
export const selectStaffAuthToken = (state: RootState) => state.staffAuth.token;

// Dashboard selectors
export const selectOccupancyMetrics = (state: RootState) => state.dashboard.occupancyMetrics;
export const selectActiveIncidentCount = (state: RootState) => state.dashboard.incidentCount;
export const selectAvgWaitTime = (state: RootState) => state.dashboard.avgWaitTime;
export const selectDashboardAlerts = (state: RootState) => state.dashboard.alerts;
export const selectLastRefreshed = (state: RootState) => state.dashboard.lastRefreshed;

// Occupancy management selectors
export const selectManagedZones = (state: RootState) => state.occupancyManagement.zones;
export const selectSelectedManagedZone = (state: RootState) => state.occupancyManagement.selectedZone;
export const selectCapacityHistory = (state: RootState) => state.occupancyManagement.adjustmentHistory;

// Incident management selectors
export const selectAllIncidents = (state: RootState) => state.incidentManagement.incidents;
export const selectSelectedIncident = (state: RootState) => state.incidentManagement.selectedIncident;
export const selectAssignedIncidents = (state: RootState) => state.incidentManagement.assignedToMe;
export const selectIncidentFilters = (state: RootState) => state.incidentManagement.filters;

// Wait time management selectors
export const selectAllQueues = (state: RootState) => state.waitTimeManagement.queues;
export const selectWaitOverrides = (state: RootState) => state.waitTimeManagement.estimatedWaitOverrides;

// Parking selectors
export const selectParkingLots = (state: RootState) => state.parkingManagement.lots;
export const selectOccupancyByLot = (lotId: string) => (state: RootState) =>
  state.parkingManagement.occupancyByLot[lotId];

// Team selectors
export const selectTeamMembers = (state: RootState) => state.staffTeam.teamMembers;
export const selectTeamRoles = (state: RootState) => state.staffTeam.roles;

// Analytics selectors
export const selectOccupancyTrends = (state: RootState) => state.analytics.occupancyTrends;
export const selectIncidentSummary = (state: RootState) => state.analytics.incidentSummary;
export const selectReportUrl = (state: RootState) => state.analytics.reportUrl;
export const selectReportGenerating = (state: RootState) => state.analytics.reportGenerating;
