/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import attendeeApiClient from './attendeeApiClient';

export const parkingService = {
  getParkingLots: (venueId: string) => 
    attendeeApiClient.get('/parking/lots', { params: { venueId } }),
  
  getLotAvailability: (lotId: string) => 
    attendeeApiClient.get(`/parking/lots/${lotId}/availability`),
};
