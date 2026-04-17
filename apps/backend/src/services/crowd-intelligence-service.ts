/**
 * Real-Time Crowd Intelligence Dashboard
 * Advanced crowd monitoring with predictive analytics
 */

export type CrowdLevel = 'empty' | 'low' | 'moderate' | 'crowded' | 'critical';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export interface ZoneOccupancy {
  zoneId: string;
  zoneName: string;
  currentOccupancy: number;
  capacity: number;
  occupancyPercentage: number;
  crowdLevel: CrowdLevel;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendRate: number; // people per minute
  estimatedPeakTime?: number; // timestamp
  safetyScore: number; // 0-100
  densityHeatmap: number[]; // Grid of density values
}

export interface CrowdPrediction {
  zoneId: string;
  timestamp: number;
  predictedOccupancy: number;
  confidence: number; // 0-1
  predictedCrowdLevel: CrowdLevel;
  peakTime: number;
  peakOccupancy: number;
  recommendations: string[];
}

export interface CrowdAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'capacity-warning' | 'overcrowding' | 'unusual-pattern' | 'evacuation-needed' | 'bottleneck';
  severity: AlertSeverity;
  message: string;
  createdAt: number;
  resolvedAt?: number;
  suggestedActions: string[];
}

export interface VenueHeatmap {
  timestamp: number;
  zones: ZoneOccupancy[];
  globalOccupancy: number; // weighted average
  criticalZones: string[]; // zone IDs that are overcrowded
  bottlenecks: Array<{ zoneId: string; severity: 'high' | 'medium' | 'low' }>;
  evacuationPressure: number; // 0-100, impact if evacuation needed
  recommendedActions: string[];
}

export interface CrowdMetrics {
  totalAttendees: number;
  averageZoneOccupancy: number;
  peakZone: { zoneId: string; occupancy: number };
  emptyZones: string[];
  criticalZones: string[];
  flowRate: number; // people entering/exiting per minute
  estimatedEventDuration: number; // minutes
  safetyRating: number; // 0-100
}

/**
 * Real-Time Crowd Intelligence Service
 */
export class CrowdIntelligenceService {
  private static instance: CrowdIntelligenceService;
  private zones: Map<string, ZoneOccupancy> = new Map();
  private alerts: Map<string, CrowdAlert> = new Map();
  private predictions: Map<string, CrowdPrediction> = new Map();
  private historicalData: Array<{ timestamp: number; data: ZoneOccupancy[] }> = [];
  private listeners: Set<(heatmap: VenueHeatmap) => void> = new Set();
  private alertListeners: Set<(alert: CrowdAlert) => void> = new Set();
  private alertIdCounter = 0;

  // ML model for predictions (simplified)
  private mlModel = {
    weights: { occupancy: 0.4, trend: 0.3, time: 0.2, eventPhase: 0.1 },
    timeFactors: {
      morning: 0.5,
      afternoon: 0.8,
      evening: 1.0,
      night: 0.6,
    },
  };

  static getInstance(): CrowdIntelligenceService {
    if (!CrowdIntelligenceService.instance) {
      CrowdIntelligenceService.instance = new CrowdIntelligenceService();
    }
    return CrowdIntelligenceService.instance;
  }

  /**
   * Initialize zones
   */
  initializeZones(zonesConfig: Array<{ id: string; name: string; capacity: number }>): void {
    zonesConfig.forEach((zone) => {
      this.zones.set(zone.id, {
        zoneId: zone.id,
        zoneName: zone.name,
        currentOccupancy: 0,
        capacity: zone.capacity,
        occupancyPercentage: 0,
        crowdLevel: 'empty',
        trend: 'stable',
        trendRate: 0,
        safetyScore: 100,
        densityHeatmap: Array(100).fill(0), // 10x10 grid
      });
    });
  }

  /**
   * Update zone occupancy (called real-time from location tracking)
   */
  updateZoneOccupancy(zoneId: string, occupancy: number): void {
    const zone = this.zones.get(zoneId);
    if (!zone) return;

    const previousOccupancy = zone.currentOccupancy;
    zone.currentOccupancy = Math.min(occupancy, zone.capacity);
    zone.occupancyPercentage = (zone.currentOccupancy / zone.capacity) * 100;

    // Calculate trend
    zone.trendRate = zone.currentOccupancy - previousOccupancy;
    if (zone.trendRate > 2) zone.trend = 'increasing';
    else if (zone.trendRate < -2) zone.trend = 'decreasing';
    else zone.trend = 'stable';

    // Determine crowd level
    const percentage = zone.occupancyPercentage;
    if (percentage < 20) zone.crowdLevel = 'empty';
    else if (percentage < 50) zone.crowdLevel = 'low';
    else if (percentage < 75) zone.crowdLevel = 'moderate';
    else if (percentage < 90) zone.crowdLevel = 'crowded';
    else zone.crowdLevel = 'critical';

    // Calculate safety score
    zone.safetyScore = Math.max(0, 100 - zone.occupancyPercentage);

    // Check for alerts
    this.checkCrowdAlerts(zone);

    // Generate prediction
    this.generatePrediction(zoneId);

    // Broadcast update
    this.broadcastUpdate();
  }

  /**
   * Update density heatmap (heat grid within zone)
   */
  updateDensityHeatmap(zoneId: string, densityGrid: number[]): void {
    const zone = this.zones.get(zoneId);
    if (zone && densityGrid.length === zone.densityHeatmap.length) {
      zone.densityHeatmap = densityGrid;
    }
  }

  /**
   * Check for crowd alerts
   */
  private checkCrowdAlerts(zone: ZoneOccupancy): void {
    const alertKey = `${zone.zoneId}-occupancy`;
    const existingAlert = this.alerts.get(alertKey);

    // Capacity warning (85%)
    if (zone.occupancyPercentage >= 85 && !existingAlert) {
      this.createAlert({
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
        type: 'capacity-warning',
        severity: 'warning',
        message: `Zone ${zone.zoneName} reaching capacity (${Math.round(zone.occupancyPercentage)}%)`,
        suggestedActions: [
          'Increase staff in zone',
          'Redirect incoming visitors to alternate areas',
          'Prepare evacuation routes',
        ],
      });
    }

    // Overcrowding alert (95%+)
    if (zone.occupancyPercentage >= 95 && !existingAlert) {
      this.createAlert({
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
        type: 'overcrowding',
        severity: 'critical',
        message: `CRITICAL: Zone ${zone.zoneName} is overcrowded (${Math.round(zone.occupancyPercentage)}%)`,
        suggestedActions: [
          'IMMEDIATELY restrict entry',
          'Begin managed egress',
          'Activate emergency protocols',
          'Alert incident response team',
        ],
      });
    }

    // Clear alert if occupancy drops
    if (zone.occupancyPercentage < 80 && existingAlert) {
      this.resolveAlert(alertKey);
    }
  }

  /**
   * Generate crowd prediction using ML model
   */
  private generatePrediction(zoneId: string): void {
    const zone = this.zones.get(zoneId);
    if (!zone) return;

    // Simple ML model (in production, use TensorFlow or similar)
    const timeOfDay = this.getTimeOfDayFactor();
    const trendWeight = zone.trendRate > 0 ? 1 : 0.5;

    const score =
      this.mlModel.weights.occupancy * (zone.occupancyPercentage / 100) +
      this.mlModel.weights.trend * trendWeight +
      this.mlModel.weights.time * timeOfDay +
      this.mlModel.weights.eventPhase * 0.7; // Assume 70% through event

    const predictedPercentage = Math.min(100, score * 120); // Apply multiplier for buffer
    const predictedOccupancy = Math.round((predictedPercentage / 100) * zone.capacity);
    const peakTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    const peakOccupancy = Math.min(zone.capacity, predictedOccupancy + Math.round(zone.capacity * 0.1));

    const prediction: CrowdPrediction = {
      zoneId,
      timestamp: Date.now(),
      predictedOccupancy,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      predictedCrowdLevel: this.getOccupancyLevel((predictedOccupancy / zone.capacity) * 100),
      peakTime,
      peakOccupancy,
      recommendations: this.generateRecommendations(zone, predictedOccupancy),
    };

    this.predictions.set(zoneId, prediction);
  }

  /**
   * Get crowd level for occupancy percentage
   */
  private getOccupancyLevel(percentage: number): CrowdLevel {
    if (percentage < 20) return 'empty';
    if (percentage < 50) return 'low';
    if (percentage < 75) return 'moderate';
    if (percentage < 90) return 'crowded';
    return 'critical';
  }

  /**
   * Generate recommendations based on zone state
   */
  private generateRecommendations(zone: ZoneOccupancy, predicted: number): string[] {
    const recommendations: string[] = [];

    if (zone.occupancyPercentage > 80) {
      recommendations.push('Increase staff presence for crowd control');
      recommendations.push('Activate backup exits');
    }

    if (zone.trendRate > 5) {
      recommendations.push('Monitor entry points closely');
      recommendations.push('Prepare to divert traffic to other zones');
    }

    if (predicted > zone.capacity * 0.9) {
      recommendations.push('Consider limiting new entries');
      recommendations.push('Position medical staff nearby');
    }

    if (zone.crowdLevel === 'critical') {
      recommendations.push('Activate emergency egress procedures');
      recommendations.push('Notify incident response team');
    }

    return recommendations;
  }

  /**
   * Get time-of-day factor for predictions
   */
  private getTimeOfDayFactor(): number {
    const hour = new Date().getHours();
    if (hour < 12) return this.mlModel.timeFactors.morning;
    if (hour < 17) return this.mlModel.timeFactors.afternoon;
    if (hour < 21) return this.mlModel.timeFactors.evening;
    return this.mlModel.timeFactors.night;
  }

  /**
   * Get current venue heatmap
   */
  getVenueHeatmap(): VenueHeatmap {
    const zones = Array.from(this.zones.values());
    const criticalZones = zones
      .filter((z) => z.crowdLevel === 'critical' || z.occupancyPercentage >= 90)
      .map((z) => z.zoneId);

    const bottlenecks = zones
      .filter((z) => z.trendRate > 5)
      .map((z) => ({
        zoneId: z.zoneId,
        severity: z.trendRate > 10 ? 'high' : 'medium' as const,
      }));

    const totalAttendees = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
    const globalOccupancy = (totalAttendees / totalCapacity) * 100;

    const evacuationPressure = Math.min(
      100,
      zones.reduce((sum, z) => sum + z.occupancyPercentage, 0) / zones.length
    );

    return {
      timestamp: Date.now(),
      zones,
      globalOccupancy: Math.round(globalOccupancy),
      criticalZones,
      bottlenecks,
      evacuationPressure: Math.round(evacuationPressure),
      recommendedActions: this.getGlobalRecommendations(zones, globalOccupancy),
    };
  }

  /**
   * Get global recommendations for entire venue
   */
  private getGlobalRecommendations(zones: ZoneOccupancy[], globalOccupancy: number): string[] {
    const recommendations: string[] = [];

    if (globalOccupancy > 80) {
      recommendations.push('Venue approaching full capacity');
      recommendations.push('Consider opening additional areas');
    }

    const criticalZones = zones.filter((z) => z.crowdLevel === 'critical');
    if (criticalZones.length > 0) {
      recommendations.push(`${criticalZones.length} zones at critical capacity`);
      recommendations.push('Activate crowd control measures in critical zones');
    }

    const bottlenecks = zones.filter((z) => z.trendRate > 10);
    if (bottlenecks.length > 0) {
      recommendations.push('Rapid influx detected - prepare for bottlenecks');
      recommendations.push('Redirect traffic to alternative routes');
    }

    return recommendations;
  }

  /**
   * Create crowd alert
   */
  private createAlert(alert: Omit<CrowdAlert, 'id' | 'createdAt'>): CrowdAlert {
    const fullAlert: CrowdAlert = {
      ...alert,
      id: `alert-${++this.alertIdCounter}`,
      createdAt: Date.now(),
    };

    this.alerts.set(fullAlert.id, fullAlert);

    // Notify listeners
    this.alertListeners.forEach((listener) => listener(fullAlert));

    return fullAlert;
  }

  /**
   * Resolve alert
   */
  private resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolvedAt = Date.now();
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): CrowdAlert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolvedAt);
  }

  /**
   * Get metrics
   */
  getMetrics(): CrowdMetrics {
    const zones = Array.from(this.zones.values());
    const totalAttendees = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
    const averageOccupancy = zones.length > 0 ? zones.reduce((sum, z) => sum + z.occupancyPercentage, 0) / zones.length : 0;
    const peakZone = zones.reduce((max, z) => (z.occupancyPercentage > max.occupancyPercentage ? z : max), zones[0]);
    const emptyZones = zones.filter((z) => z.crowdLevel === 'empty').map((z) => z.zoneId);
    const criticalZones = zones.filter((z) => z.crowdLevel === 'critical').map((z) => z.zoneId);

    const averageTrendRate = zones.reduce((sum, z) => sum + z.trendRate, 0) / zones.length;

    return {
      totalAttendees,
      averageZoneOccupancy: Math.round(averageOccupancy),
      peakZone: {
        zoneId: peakZone?.zoneId || 'N/A',
        occupancy: Math.round(peakZone?.occupancyPercentage || 0),
      },
      emptyZones,
      criticalZones,
      flowRate: Math.abs(averageTrendRate),
      estimatedEventDuration: 180, // minutes (placeholder)
      safetyRating: Math.round(100 - averageOccupancy),
    };
  }

  /**
   * Broadcast heatmap update
   */
  private broadcastUpdate(): void {
    const heatmap = this.getVenueHeatmap();
    this.listeners.forEach((listener) => listener(heatmap));
  }

  /**
   * Subscribe to heatmap updates
   */
  onHeatmapUpdate(listener: (heatmap: VenueHeatmap) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to alert events
   */
  onAlert(listener: (alert: CrowdAlert) => void): () => void {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  /**
   * Get prediction for zone
   */
  getPrediction(zoneId: string): CrowdPrediction | undefined {
    return this.predictions.get(zoneId);
  }

  /**
   * Get all predictions
   */
  getAllPredictions(): CrowdPrediction[] {
    return Array.from(this.predictions.values());
  }
}

// Export singleton instance
export const crowdIntelligenceService = CrowdIntelligenceService.getInstance();
