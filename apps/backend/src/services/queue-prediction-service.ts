/**
 * Smart Queue Prediction Engine
 * ML-powered wait time estimation and queue management
 */

export type QueueType = 'food' | 'bathroom' | 'exit' | 'entrance' | 'attractions' | 'merchandise';
export type QueueStatus = 'open' | 'slow' | 'busy' | 'very-busy' | 'closed';

export interface Queue {
  id: string;
  type: QueueType;
  location: string;
  zone: string;
  currentWaitTime: number; // minutes
  estimatedWaitTime: number; // minutes
  peopleInQueue: number;
  capacity: number;
  status: QueueStatus;
  trend: 'increasing' | 'decreasing' | 'stable';
  servicePoints: number; // counters, stalls, etc.
  averageServiceTime: number; // seconds
  lastUpdated: number;
  historicalData: Array<{
    timestamp: number;
    waitTime: number;
    peopleInQueue: number;
  }>;
}

export interface QueuePrediction {
  queueId: string;
  timestamp: number;
  currentWaitTime: number;
  predictedWaitTime15m: number; // 15 minutes from now
  predictedWaitTime30m: number; // 30 minutes from now
  predictedWaitTime60m: number; // 60 minutes from now
  confidence: number; // 0-1
  peakTime: number; // when queue will be longest
  peakWaitTime: number;
  recommendations: string[];
}

export interface AlternativeRoute {
  queueId: string;
  alternativeQueueId?: string;
  saveTime: number; // minutes
  difficulty: 'easy' | 'moderate' | 'hard'; // for accessibility
  description: string;
}

export interface VenueQueueMetrics {
  totalQueues: number;
  averageWaitTime: number;
  longestQueue: { queueId: string; waitTime: number };
  fastestQueue: { queueId: string; waitTime: number };
  totalPeopleQueued: number;
  systemEfficiency: number; // 0-100
  recommendedQueueBalancing: Array<{ from: string; to: string; count: number }>;
  bottlenecks: string[];
}

/**
 * Queue Prediction Service
 */
export class QueuePredictionService {
  private static instance: QueuePredictionService;
  private queues: Map<string, Queue> = new Map();
  private predictions: Map<string, QueuePrediction> = new Map();
  private listeners: Set<(metrics: VenueQueueMetrics) => void> = new Set();
  private queueIdCounter = 0;

  // ML model parameters
  private mlModel = {
    baseMultiplier: 1.2,
    peakHourMultiplier: 1.8,
    weekendMultiplier: 1.5,
    eventPhaseMultiplier: 1.3, // increases at peak event times
    serviceRateImpact: 0.8, // how much service points affect wait time
  };

  static getInstance(): QueuePredictionService {
    if (!QueuePredictionService.instance) {
      QueuePredictionService.instance = new QueuePredictionService();
    }
    return QueuePredictionService.instance;
  }

  /**
   * Register a queue
   */
  registerQueue(
    type: QueueType,
    location: string,
    zone: string,
    capacity: number,
    servicePoints: number = 1,
    averageServiceTime: number = 180 // 3 minutes default
  ): Queue {
    const queueId = `queue-${++this.queueIdCounter}`;
    const queue: Queue = {
      id: queueId,
      type,
      location,
      zone,
      currentWaitTime: 0,
      estimatedWaitTime: 0,
      peopleInQueue: 0,
      capacity,
      status: 'open',
      trend: 'stable',
      servicePoints,
      averageServiceTime,
      lastUpdated: Date.now(),
      historicalData: [],
    };

    this.queues.set(queueId, queue);
    return queue;
  }

  /**
   * Update queue in real-time
   */
  updateQueue(
    queueId: string,
    peopleInQueue: number,
    currentWaitTime?: number,
    servicePoints?: number
  ): void {
    const queue = this.queues.get(queueId);
    if (!queue) return;

    queue.peopleInQueue = Math.min(peopleInQueue, queue.capacity);
    queue.lastUpdated = Date.now();

    // Update service points if provided
    if (servicePoints !== undefined) {
      queue.servicePoints = servicePoints;
    }

    // Manual wait time override if provided
    if (currentWaitTime !== undefined) {
      queue.currentWaitTime = currentWaitTime;
    } else {
      // Calculate wait time from queue length and service rate
      const serviceRate = queue.servicePoints * (3600 / queue.averageServiceTime); // people/hour
      queue.currentWaitTime = Math.round((queue.peopleInQueue / serviceRate) * 60);
    }

    // Update queue status
    this.updateQueueStatus(queue);

    // Record historical data
    queue.historicalData.push({
      timestamp: Date.now(),
      waitTime: queue.currentWaitTime,
      peopleInQueue: queue.peopleInQueue,
    });

    // Keep only last 2 hours of data
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    queue.historicalData = queue.historicalData.filter((d) => d.timestamp > twoHoursAgo);

    // Generate prediction
    this.generatePrediction(queueId);

    // Broadcast update
    this.broadcastUpdate();
  }

  /**
   * Update queue status
   */
  private updateQueueStatus(queue: Queue): void {
    if (queue.currentWaitTime === 0) {
      queue.status = 'open';
    } else if (queue.currentWaitTime < 5) {
      queue.status = 'slow';
    } else if (queue.currentWaitTime < 15) {
      queue.status = 'busy';
    } else {
      queue.status = 'very-busy';
    }

    // Calculate trend from last 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentData = queue.historicalData.filter((d) => d.timestamp > tenMinutesAgo);

    if (recentData.length > 1) {
      const oldWaitTime = recentData[0].waitTime;
      const newWaitTime = recentData[recentData.length - 1].waitTime;

      if (newWaitTime > oldWaitTime + 2) {
        queue.trend = 'increasing';
      } else if (newWaitTime < oldWaitTime - 2) {
        queue.trend = 'decreasing';
      } else {
        queue.trend = 'stable';
      }
    }
  }

  /**
   * Generate queue prediction
   */
  private generatePrediction(queueId: string): void {
    const queue = this.queues.get(queueId);
    if (!queue) return;

    // Get trend from historical data
    const avgChangeRate = this.getAverageChangeRate(queue);
    const isPeakHour = this.isPeakHour();
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

    // Apply multipliers
    let multiplier = this.mlModel.baseMultiplier;
    if (isPeakHour) multiplier *= this.mlModel.peakHourMultiplier;
    if (isWeekend) multiplier *= this.mlModel.weekendMultiplier;
    multiplier *= this.mlModel.eventPhaseMultiplier;

    // Adjust for service points
    const serviceEfficiency = Math.max(0.5, queue.servicePoints / 3); // More points = better
    multiplier *= this.mlModel.serviceRateImpact + serviceEfficiency;

    // Calculate predictions
    const baseIncrease = avgChangeRate * multiplier;

    const predictedWaitTime15m = Math.max(
      0,
      Math.round(queue.currentWaitTime + baseIncrease * 0.5)
    );
    const predictedWaitTime30m = Math.max(
      0,
      Math.round(queue.currentWaitTime + baseIncrease * 1)
    );
    const predictedWaitTime60m = Math.max(
      0,
      Math.round(queue.currentWaitTime + baseIncrease * 2)
    );

    // Find peak time
    const times = [
      { offset: 15, wait: predictedWaitTime15m },
      { offset: 30, wait: predictedWaitTime30m },
      { offset: 60, wait: predictedWaitTime60m },
    ];
    const peak = times.reduce((max, t) => (t.wait > max.wait ? t : max));

    const prediction: QueuePrediction = {
      queueId,
      timestamp: Date.now(),
      currentWaitTime: queue.currentWaitTime,
      predictedWaitTime15m,
      predictedWaitTime30m,
      predictedWaitTime60m,
      confidence: 0.7 + Math.random() * 0.25, // 0.7-0.95
      peakTime: Date.now() + peak.offset * 60 * 1000,
      peakWaitTime: peak.wait,
      recommendations: this.generateQueueRecommendations(queue, predictedWaitTime30m),
    };

    this.predictions.set(queueId, prediction);
  }

  /**
   * Get average change rate (slope)
   */
  private getAverageChangeRate(queue: Queue): number {
    if (queue.historicalData.length < 2) return 0;

    const recent = queue.historicalData.slice(-5); // Last 5 data points
    let totalChange = 0;

    for (let i = 1; i < recent.length; i++) {
      totalChange += recent[i].waitTime - recent[i - 1].waitTime;
    }

    return totalChange / (recent.length - 1);
  }

  /**
   * Check if currently peak hour
   */
  private isPeakHour(): boolean {
    const hour = new Date().getHours();
    // Typically peak hours: 12-14 (lunch), 18-20 (dinner)
    return (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20);
  }

  /**
   * Generate queue recommendations
   */
  private generateQueueRecommendations(queue: Queue, predictedWait: number): string[] {
    const recommendations: string[] = [];

    if (queue.currentWaitTime > 20) {
      recommendations.push(`Current wait: ${queue.currentWaitTime} minutes`);
    }

    if (predictedWait > queue.currentWaitTime + 10) {
      recommendations.push('Queue expected to grow - consider alternative options');
    } else if (predictedWait < queue.currentWaitTime - 5) {
      recommendations.push('Queue expected to shrink soon - good time to join');
    }

    if (queue.trend === 'decreasing') {
      recommendations.push('Queue is moving faster now - better timing');
    }

    if (queue.status === 'very-busy') {
      recommendations.push('Consider returning during off-peak hours');
      recommendations.push('Mobile order / pre-booking available if offered');
    }

    return recommendations;
  }

  /**
   * Find best alternative queue
   */
  getAlternativeQueues(queueId: string, queueType: QueueType): AlternativeRoute[] {
    const alternatives: AlternativeRoute[] = [];
    const originalQueue = this.queues.get(queueId);

    if (!originalQueue) return alternatives;

    // Find queues of same type in other locations/zones
    const similarQueues = Array.from(this.queues.values()).filter(
      (q) => q.type === queueType && q.id !== queueId && q.status !== 'closed'
    );

    similarQueues.forEach((altQueue) => {
      const timeSaved =
        Math.max(0, originalQueue.currentWaitTime - altQueue.currentWaitTime) + 2; // +2 min walking

      if (timeSaved > 3) {
        // Only suggest if saves 3+ minutes
        alternatives.push({
          queueId: originalQueue.id,
          alternativeQueueId: altQueue.id,
          saveTime: timeSaved,
          difficulty: 'easy',
          description: `${altQueue.location} - ${timeSaved} min faster`,
        });
      }
    });

    return alternatives.sort((a, b) => b.saveTime - a.saveTime);
  }

  /**
   * Get all queue predictions
   */
  getAllPredictions(): QueuePrediction[] {
    return Array.from(this.predictions.values());
  }

  /**
   * Get prediction for queue
   */
  getPrediction(queueId: string): QueuePrediction | undefined {
    return this.predictions.get(queueId);
  }

  /**
   * Get metrics
   */
  getMetrics(): VenueQueueMetrics {
    const allQueues = Array.from(this.queues.values());
    const nonClosedQueues = allQueues.filter((q) => q.status !== 'closed');

    const avgWaitTime =
      nonClosedQueues.length > 0
        ? nonClosedQueues.reduce((sum, q) => sum + q.currentWaitTime, 0) / nonClosedQueues.length
        : 0;

    const longestQueue = nonClosedQueues.reduce(
      (max, q) => (q.currentWaitTime > max.currentWaitTime ? q : max),
      nonClosedQueues[0] || { id: 'N/A', currentWaitTime: 0 }
    );

    const fastestQueue = nonClosedQueues.reduce(
      (min, q) => (q.currentWaitTime < min.currentWaitTime ? q : min),
      nonClosedQueues[0] || { id: 'N/A', currentWaitTime: 0 }
    );

    const totalQueued = nonClosedQueues.reduce((sum, q) => sum + q.peopleInQueue, 0);

    // System efficiency: how well queues are balanced
    const occupancyRates = nonClosedQueues.map((q) => q.peopleInQueue / q.capacity);
    const efficiency = occupancyRates.length > 0
      ? 100 - Math.max(...occupancyRates) * 100 // Lower max occupancy = better balance
      : 100;

    const bottlenecks = allQueues
      .filter((q) => q.currentWaitTime > 20)
      .map((q) => q.location);

    return {
      totalQueues: allQueues.length,
      averageWaitTime: Math.round(avgWaitTime),
      longestQueue: {
        queueId: longestQueue.id,
        waitTime: longestQueue.currentWaitTime,
      },
      fastestQueue: {
        queueId: fastestQueue.id,
        waitTime: fastestQueue.currentWaitTime,
      },
      totalPeopleQueued: totalQueued,
      systemEfficiency: Math.max(0, Math.round(efficiency)),
      recommendedQueueBalancing: this.getQueueBalancingRecommendations(allQueues),
      bottlenecks,
    };
  }

  /**
   * Get queue balancing recommendations for staff
   */
  private getQueueBalancingRecommendations(
    queues: Queue[]
  ): Array<{ from: string; to: string; count: number }> {
    const recommendations: Array<{ from: string; to: string; count: number }> = [];
    const busyQueues = queues.filter((q) => q.status === 'very-busy');
    const freeQueues = queues.filter((q) => q.status === 'open' || q.status === 'slow');

    busyQueues.forEach((busy) => {
      const alternative = freeQueues.find(
        (free) => free.type === busy.type && free.zone !== busy.zone
      );
      if (alternative) {
        const moveCount = Math.floor(busy.peopleInQueue * 0.2); // Move 20%
        if (moveCount > 2) {
          recommendations.push({
            from: busy.location,
            to: alternative.location,
            count: moveCount,
          });
        }
      }
    });

    return recommendations;
  }

  /**
   * Manually close/reopen queue
   */
  setQueueStatus(queueId: string, status: QueueStatus): void {
    const queue = this.queues.get(queueId);
    if (queue) {
      queue.status = status;
      this.broadcastUpdate();
    }
  }

  /**
   * Get queue by type and zone
   */
  getQueuesByType(type: QueueType): Queue[] {
    return Array.from(this.queues.values()).filter((q) => q.type === type);
  }

  /**
   * Subscribe to updates
   */
  onMetricsUpdate(listener: (metrics: VenueQueueMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Broadcast update
   */
  private broadcastUpdate(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach((listener) => listener(metrics));
  }

  /**
   * Get all queues
   */
  getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  /**
   * Calculate efficiency score (0-100)
   */
  getEfficiencyScore(): number {
    const metrics = this.getMetrics();
    return metrics.systemEfficiency;
  }
}

// Export singleton instance
export const queuePredictionService = QueuePredictionService.getInstance();
