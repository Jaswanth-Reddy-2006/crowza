import attendeeApiClient from './attendeeApiClient';

export const occupancyService = {
  getOccupancy: (zoneId: string) => 
    attendeeApiClient.get(`/zones/${zoneId}/occupancy`),
  
  getHeatmap: (venueId: string) => 
    attendeeApiClient.get('/heatmap', { params: { venueId } }),
};
