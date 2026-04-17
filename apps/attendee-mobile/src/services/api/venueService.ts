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
