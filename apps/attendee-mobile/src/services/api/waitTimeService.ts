/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import attendeeApiClient from './attendeeApiClient';

export const waitTimeService = {
  getWaitTimes: (venueId: string) => 
    attendeeApiClient.get('/queues', { params: { venueId } }),
};
