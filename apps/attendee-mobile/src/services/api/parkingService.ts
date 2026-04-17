import attendeeApiClient from './attendeeApiClient';

export const parkingService = {
  getParkingLots: (venueId: string) => 
    attendeeApiClient.get('/parking/lots', { params: { venueId } }),
  
  getLotAvailability: (lotId: string) => 
    attendeeApiClient.get(`/parking/lots/${lotId}/availability`),
};
