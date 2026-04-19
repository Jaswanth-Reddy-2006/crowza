/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
/**
 * Indoor Navigation Service
 * Handles real-time location tracking, routing calculations, and navigation data sync
 * Integrates with Firebase for occupancy and real-time updates
 */

import { calculateRoute, Route, NavigationMesh } from '../utils/advancedRouting';
import { getCurrentLocation } from './locationService';

export interface IndoorLocation {
  x: number;
  y: number;
  floor: number;
  accuracy: number;
  timestamp: number;
  nodeId?: string;
}

export interface NavigationState {
  currentLocation: IndoorLocation | null;
  targetNodeId: string | null;
  currentRoute: Route | null;
  routeIndex: number;
  isNavigating: boolean;
  offCourse: boolean;
}

export interface IndoorMapFile {
  venueId: string;
  floor: number;
  navigationMesh: NavigationMesh;
  seatMap: Map<string, { section: string; row: string; number: string }>;
  amenityMap: Map<string, string>;
}

class IndoorNavigationService {
  private navigationState: NavigationState = {
    currentLocation: null,
    targetNodeId: null,
    currentRoute: null,
    routeIndex: 0,
    isNavigating: false,
    offCourse: false,
  };

  private indoorMaps: Map<string, IndoorMapFile> = new Map();
  private occupancies: Record<string, number> = {};
  private locationUpdateInterval: NodeJS.Timeout | null = null;
  private routeUpdateInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize navigation service with indoor map data
   */
  async initializeNavigation(mapFile: IndoorMapFile): Promise<void> {
    try {
      if (!mapFile.venueId || !mapFile.navigationMesh) {
        throw new Error('Invalid indoor map file');
      }

      this.indoorMaps.set(mapFile.venueId, mapFile);
    } catch (error) {
      console.error('Failed to initialize navigation:', error);
      throw error;
    }
  }

  /**
   * Update real-time occupancy data from Firebase
   */
  updateOccupancies(occupancies: Record<string, number>): void {
    this.occupancies = occupancies;

    // Recalculate route if actively navigating
    if (this.navigationState.isNavigating && this.navigationState.currentRoute) {
      this.recalculateRoute();
    }
  }

  /**
   * Start real-time location tracking
   */
  async startLocationTracking(venueId: string): Promise<void> {
    const mapFile = this.indoorMaps.get(venueId);
    if (!mapFile) {
      throw new Error(`No map data for venue: ${venueId}`);
    }

    // Clear existing interval
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }

    // Update location every 2 seconds
    this.locationUpdateInterval = setInterval(async () => {
      try {
        const location = await this.getIndoorLocation();
        this.navigationState.currentLocation = location;

        // Check if off course
        if (this.navigationState.isNavigating && this.navigationState.currentRoute) {
          this.checkOffCourse(location);
        }
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    }, 2000);
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking(): void {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  /**
   * Get current indoor location (placeholder for future trilateration)
   */
  private async getIndoorLocation(): Promise<IndoorLocation> {
    try {
      const location = await getCurrentLocation();

      // TODO: Implement BLE/WiFi trilateration for accurate indoor positioning
      // For now, use GPS as fallback
      return {
        x: location.coords.longitude,
        y: location.coords.latitude,
        floor: 0,
        accuracy: location.coords.accuracy || 10,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to get indoor location:', error);
      throw error;
    }
  }

  /**
   * Calculate route to destination
   */
  async calculateNavigation(
    venueId: string,
    targetNodeId: string,
    avoidCrowded = true
  ): Promise<Route> {
    const mapFile = this.indoorMaps.get(venueId);
    if (!mapFile) {
      throw new Error(`No map data for venue: ${venueId}`);
    }

    if (!this.navigationState.currentLocation?.nodeId) {
      throw new Error('Current location not determined');
    }

    try {
      const route = calculateRoute(
        mapFile.navigationMesh,
        this.navigationState.currentLocation.nodeId,
        targetNodeId,
        this.occupancies,
        avoidCrowded
      );

      this.navigationState.currentRoute = route;
      this.navigationState.targetNodeId = targetNodeId;
      this.navigationState.isNavigating = true;
      this.navigationState.routeIndex = 0;
      this.navigationState.offCourse = false;

      return route;
    } catch (error) {
      console.error('Route calculation failed:', error);
      throw error;
    }
  }

  /**
   * Recalculate route based on new conditions
   */
  private async recalculateRoute(): Promise<void> {
    if (
      this.navigationState.targetNodeId &&
      this.navigationState.currentLocation?.nodeId
    ) {
      try {
        // Find all map files that could apply
        for (const [venueId, mapFile] of this.indoorMaps) {
          const startNode = mapFile.navigationMesh.nodes.find(
            (n) => n.id === this.navigationState.currentLocation?.nodeId
          );
          const endNode = mapFile.navigationMesh.nodes.find(
            (n) => n.id === this.navigationState.targetNodeId
          );

          if (startNode && endNode) {
            await this.calculateNavigation(
              venueId,
              this.navigationState.targetNodeId
            );
            break;
          }
        }
      } catch (error) {
        console.error('Route recalculation failed:', error);
      }
    }
  }

  /**
   * Check if user has gone off course
   */
  private checkOffCourse(currentLocation: IndoorLocation): void {
    if (!this.navigationState.currentRoute || !currentLocation.nodeId) {
      return;
    }

    const currentStep =
      this.navigationState.currentRoute.steps[this.navigationState.routeIndex];
    if (!currentStep) {
      return;
    }

    // Simple heuristic: if user is more than 20m away from expected path
    const expectedX = currentStep.to.x;
    const expectedY = currentStep.to.y;
    const distance = Math.sqrt(
      Math.pow(currentLocation.x - expectedX, 2) +
        Math.pow(currentLocation.y - expectedY, 2)
    );

    this.navigationState.offCourse = distance > 20;
  }

  /**
   * Get next navigation step
   */
  getNextStep() {
    if (!this.navigationState.currentRoute) {
      return null;
    }

    return this.navigationState.currentRoute.steps[this.navigationState.routeIndex];
  }

  /**
   * Advance to next step when waypoint reached
   */
  advanceStep(): void {
    if (!this.navigationState.currentRoute) {
      return;
    }

    if (
      this.navigationState.routeIndex <
      this.navigationState.currentRoute.steps.length - 1
    ) {
      this.navigationState.routeIndex += 1;
    } else {
      this.stopNavigation();
    }
  }

  /**
   * Stop navigation
   */
  stopNavigation(): void {
    this.navigationState.isNavigating = false;
    this.navigationState.currentRoute = null;
    this.navigationState.targetNodeId = null;
    this.navigationState.routeIndex = 0;
  }

  /**
   * Get current navigation state
   */
  getNavigationState(): NavigationState {
    return { ...this.navigationState };
  }

  /**
   * Convert seat ID to readable format
   */
  getSeatLabel(seatId: string, venueId: string): string {
    const mapFile = this.indoorMaps.get(venueId);
    if (!mapFile) {
      return seatId;
    }

    const seat = mapFile.seatMap.get(seatId);
    if (!seat) {
      return seatId;
    }

    return `${seat.section}-${seat.row}${seat.number}`;
  }

  /**
   * Get nearby amenities
   */
  getNearbyAmenities(venueId: string, nodeId: string, radius = 50): string[] {
    const mapFile = this.indoorMaps.get(venueId);
    if (!mapFile) {
      return [];
    }

    const node = mapFile.navigationMesh.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return [];
    }

    const nearby: string[] = [];
    for (const amenityNode of mapFile.navigationMesh.nodes.filter(
      (n) => n.type === 'amenity'
    )) {
      const distance = Math.sqrt(
        Math.pow(amenityNode.x - node.x, 2) +
          Math.pow(amenityNode.y - node.y, 2)
      );

      if (distance <= radius) {
        nearby.push(mapFile.amenityMap.get(amenityNode.id) || amenityNode.id);
      }
    }

    return nearby;
  }
}

export const indoorNavigationService = new IndoorNavigationService();
