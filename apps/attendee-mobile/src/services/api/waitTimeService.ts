import attendeeApiClient from './attendeeApiClient';

export const waitTimeService = {
  getWaitTimes: (venueId: string) => 
    attendeeApiClient.get('/queues', { params: { venueId } }),
};
