export interface Venue {
  id: string;
  name: string;
  capacity: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export interface Zone {
  id: string;
  venueId: string;
  name: string;
  type: 'gate' | 'restroom' | 'concession' | 'seating' | 'parking';
  capacity: number;
  polygon: number[][]; // Array of coordinates
}

export interface Event {
  id: string;
  venueId: string;
  name: string;
  date: string;
  startTime: string;
  expectedAttendance: number;
}
