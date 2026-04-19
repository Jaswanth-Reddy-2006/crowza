import { theme } from '@crowza/design-system';

export interface NavigationOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  estimatedTime: number;
  cost?: number;
  distance: number;
  description: string;
}

export interface VenueLocation {
  id: string;
  name: string;
  icon: string;
  description: string;
  building: string;
  zone: string;
  lat: number;
  lon: number;
  capacity: number;
  operatingHours: string;
  accessibility: string[];
  facilities: string[];
  activities: string[];
  parking?: { location: string; price: number }[];
  artInstallations: string[];
}

export const VENUE_DESTINATIONS: VenueLocation[] = [
  {
    id: 'main-hall',
    icon: '🎸',
    name: 'Main Hall - Zone 1',
    building: 'Building A',
    zone: 'Zone 1',
    description: 'Concert venue and performances',
    lat: 40.7128,
    lon: -74.006,
    capacity: 2000,
    operatingHours: '10 AM - 11 PM',
    accessibility: ['Wheelchairs', 'Elevators', 'ASL interpreters'],
    facilities: ['Restrooms', 'Concessions', 'WiFi', 'First Aid'],
    activities: ['Concerts', 'Dance performances', 'Light shows'],
    parking: [
      { location: 'Lot A', price: 10 },
      { location: 'Lot B', price: 8 },
    ],
    artInstallations: ['Digital light show', '3D projections'],
  },
  {
    id: 'food-court',
    icon: '🍽️',
    name: 'Food Court - Zone 3',
    building: 'Building A',
    zone: 'Zone 3',
    description: 'International cuisine and dining',
    lat: 40.7145,
    lon: -74.0055,
    capacity: 500,
    operatingHours: '11 AM - 10 PM',
    accessibility: ['Wheelchairs', 'Elevators'],
    facilities: ['Seating (150 tables)', 'Restrooms', 'WiFi', 'Concessions'],
    activities: ['International cuisine', 'Fast food', 'Live cooking demos', 'Beverages'],
    parking: [{ location: 'Lot B', price: 8 }],
    artInstallations: ['Food truck murals', 'Photography displays'],
  },
  {
    id: 'vip-lounge',
    icon: '⭐',
    name: 'VIP Lounge - Zone 4',
    building: 'Building A',
    zone: 'Zone 4',
    description: 'Premium lounge with networking',
    lat: 40.7125,
    lon: -74.0095,
    capacity: 200,
    operatingHours: '12 PM - Late night',
    accessibility: ['Wheelchairs', 'Premium access'],
    facilities: ['Premium seating', 'Private restrooms', 'Concierge', 'Bar'],
    activities: ['Networking', 'Meet & greet', 'Premium service'],
    parking: [{ location: 'Valet', price: 15 }],
    artInstallations: ['Art gallery', 'Sculptures', 'Premium art collection'],
  },
  {
    id: 'art-gallery',
    icon: '🎨',
    name: 'Art Gallery - Zone 5',
    building: 'Building B',
    zone: 'Zone 5',
    description: 'Interactive art exhibitions and installations',
    lat: 40.713,
    lon: -74.0065,
    capacity: 300,
    operatingHours: '10 AM - 6 PM',
    accessibility: ['Wheelchairs', 'Elevators', 'Accessible restrooms'],
    facilities: ['Lecture hall', 'Storage', 'WiFi', 'First Aid'],
    activities: ['Art displays', 'Artist talks', 'Workshops', 'Interactive installations'],
    parking: [{ location: 'Lot C', price: 5 }],
    artInstallations: ['Rotating exhibitions', 'Interactive installations', 'Virtual reality art'],
  },
  {
    id: 'info-desk',
    icon: 'ℹ️',
    name: 'Info Desk - Main Entrance',
    building: 'Building A',
    zone: 'Entrance',
    description: 'Information center and check-in',
    lat: 40.7132,
    lon: -74.0075,
    capacity: 100,
    operatingHours: '9 AM - 10 PM',
    accessibility: ['Wheelchairs', 'Ground level'],
    facilities: ['Information desk', 'Lost & found', 'WiFi'],
    activities: ['Check-in', 'Information', 'Guest services'],
    parking: [{ location: 'Lot A', price: 10 }],
    artInstallations: ['Entrance signage', 'Welcome sculptures'],
  },
  {
    id: 'first-aid',
    icon: '🚑',
    name: 'First Aid Station',
    building: 'Building A',
    zone: 'Medical',
    description: 'Medical center and emergency services',
    lat: 40.7140,
    lon: -74.0045,
    capacity: 50,
    operatingHours: '24/7 Available',
    accessibility: ['Wheelchairs', 'Ground level', 'Elevators'],
    facilities: ['Medical staff', 'Restrooms', 'Emergency exits'],
    activities: ['Medical support', 'Emergency services', 'First aid'],
    artInstallations: [],
  },
  {
    id: 'parking-a',
    icon: '🅿️',
    name: 'Parking Lot A',
    building: 'Outdoor',
    zone: 'Parking',
    description: 'Premium parking lot near main entrance',
    lat: 40.7135,
    lon: -74.0022,
    capacity: 200,
    operatingHours: '24/7',
    accessibility: ['Accessible parking spaces', 'Elevators'],
    facilities: ['Parking spaces', 'Lighting', 'Security'],
    activities: ['Vehicle parking', 'EV charging'],
    parking: [{ location: 'Lot A', price: 10 }],
    artInstallations: [],
  },
  {
    id: 'parking-b',
    icon: '🅿️',
    name: 'Parking Lot B',
    building: 'Outdoor',
    zone: 'Parking',
    description: 'Standard parking near food court',
    lat: 40.7115,
    lon: -74.0088,
    capacity: 300,
    operatingHours: '24/7',
    accessibility: ['Accessible parking spaces'],
    facilities: ['Parking spaces', 'Lighting'],
    activities: ['Vehicle parking'],
    parking: [{ location: 'Lot B', price: 8 }],
    artInstallations: [],
  },
  {
    id: 'restroom',
    icon: '🚽',
    name: 'Public Restrooms',
    building: 'Building A',
    zone: 'Facilities',
    description: 'Clean and accessible restroom facilities',
    lat: 40.713,
    lon: -74.0062,
    capacity: 80,
    operatingHours: '10 AM - 10 PM',
    accessibility: ['Wheelchair accessible', 'Family restrooms', 'Baby changing stations'],
    facilities: ['Restrooms', 'Hand dryers', 'Mirrors', 'WiFi'],
    activities: ['Restroom facilities', 'Family amenities'],
    artInstallations: [],
  },
];

export const TRANSPORT_OPTIONS: NavigationOption[] = [
  {
    id: 'walk',
    name: 'Walk',
    icon: 'walk',
    color: theme.colors.primary,
    estimatedTime: 12,
    distance: 0.8,
    description: 'Most direct route',
  },
  {
    id: 'car',
    name: 'Drive',
    icon: 'car',
    color: '#2196F3',
    estimatedTime: 8,
    cost: 5,
    distance: 0.8,
    description: 'Fastest option',
  },
  {
    id: 'bus',
    name: 'Shuttle',
    icon: 'bus',
    color: '#FF9800',
    estimatedTime: 15,
    cost: 3,
    distance: 1.2,
    description: 'Scheduled service',
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: 'car',
    color: theme.colors.primary,
    estimatedTime: 5,
    distance: 0.5,
    description: 'Zone B-4 available',
  },
];
