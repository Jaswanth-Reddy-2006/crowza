export interface OccupancyData {
  zoneId: string;
  occupancyPercent: number;
  lastUpdatedAt: string;
  confidenceLevel: number;
}

export interface ZoneOccupancy {
  id: string;
  name: string;
  current: number;
  max: number;
  occupancyPercent: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface WaitTime {
  zoneId: string;
  estimatedWaitMins: number;
  updatedAt: string;
  historicalAvg: number;
}

export interface HeatMapData {
  zones: Record<string, number>; // zoneId -> occupancyPercent
  timestamp: string;
}
