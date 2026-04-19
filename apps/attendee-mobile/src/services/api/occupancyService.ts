/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import attendeeApiClient from './attendeeApiClient';

export const occupancyService = {
  getOccupancy: (zoneId: string) => 
    attendeeApiClient.get(`/zones/${zoneId}/occupancy`),
  
  getHeatmap: (venueId: string) => 
    attendeeApiClient.get('/heatmap', { params: { venueId } }),
};
