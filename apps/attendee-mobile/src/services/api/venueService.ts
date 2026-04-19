/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import attendeeApiClient from './attendeeApiClient';

export const venueService = {
  getVenue: (venueId: string) => 
    attendeeApiClient.get(`/venues/${venueId}`),
  
  getZones: (venueId: string) => 
    attendeeApiClient.get(`/venues/${venueId}/zones`),
  
  getEvents: () => 
    attendeeApiClient.get('/events'),
  
  searchZone: (query: string) => 
    attendeeApiClient.get(`/zones?search=${query}`),
};
