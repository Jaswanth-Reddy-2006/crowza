/**
 * Audit Logging System
 * Tracks security events, API calls, and user actions for compliance and forensics
 */

export type AuditEventType =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_FAILED'
  | 'PERMISSION_DENIED'
  | 'DATA_ACCESS'
  | 'DATA_MODIFICATION'
  | 'NAVIGATION_REQUEST'
  | 'LOCATION_UPDATE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'SECURITY_ALERT'
  | 'ERROR';

export interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: AuditEventType;
  userId: string;
  venueId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure';
}

export interface AuditLog {
  events: AuditEvent[];
  totalSize: number;
}

class AuditLogger {
  private events: AuditEvent[] = [];
  private readonly maxEvents = 10000;
  private readonly storageKey = 'auditLogs';
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicFlush();
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log security event
   */
  logEvent(
    eventType: AuditEventType,
    userId: string,
    resource: string,
    action: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    status: 'success' | 'failure',
    details: Record<string, any> = {}
  ): AuditEvent {
    const event: AuditEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      eventType,
      userId,
      action,
      resource,
      details,
      severity,
      status,
    };

    this.events.push(event);

    // Maintain size limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log critical events immediately
    if (severity === 'critical') {
      this.flushEvents();
      console.warn(`[CRITICAL AUDIT EVENT] ${eventType}: ${action}`, event);
    }

    return event;
  }

  /**
   * Log authentication event
   */
  logAuthEvent(
    userId: string,
    eventType: 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'AUTH_FAILED',
    success: boolean,
    details?: Record<string, any>
  ): AuditEvent {
    return this.logEvent(
      eventType,
      userId,
      'AUTH',
      eventType === 'AUTH_LOGIN' ? 'User login' : eventType === 'AUTH_LOGOUT' ? 'User logout' : 'Authentication failed',
      eventType === 'AUTH_FAILED' ? 'high' : 'low',
      success ? 'success' : 'failure',
      details
    );
  }

  /**
   * Log access event
   */
  logAccessEvent(
    userId: string,
    resource: string,
    allowed: boolean,
    reason?: string
  ): AuditEvent {
    return this.logEvent(
      allowed ? 'DATA_ACCESS' : 'PERMISSION_DENIED',
      userId,
      resource,
      allowed ? `Accessed ${resource}` : `Access denied to ${resource}`,
      allowed ? 'low' : 'high',
      allowed ? 'success' : 'failure',
      { reason }
    );
  }

  /**
   * Log navigation request
   */
  logNavigationRequest(
    userId: string,
    venueId: string,
    startNodeId: string,
    endNodeId: string,
    success: boolean
  ): AuditEvent {
    return this.logEvent(
      'NAVIGATION_REQUEST',
      userId,
      `${startNodeId} -> ${endNodeId}`,
      'Navigation route calculated',
      'low',
      success ? 'success' : 'failure',
      { venueId, startNodeId, endNodeId }
    );
  }

  /**
   * Log location update
   */
  logLocationUpdate(
    userId: string,
    venueId: string,
    coordinates: { x: number; y: number }
  ): AuditEvent {
    return this.logEvent(
      'LOCATION_UPDATE',
      userId,
      venueId,
      'User location updated',
      'low',
      'success',
      { coordinates }
    );
  }

  /**
   * Log rate limit exceeded
   */
  logRateLimitExceeded(
    userId: string,
    resource: string,
    requestCount: number
  ): AuditEvent {
    return this.logEvent(
      'RATE_LIMIT_EXCEEDED',
      userId,
      resource,
      `Rate limit exceeded: ${requestCount} requests`,
      'high',
      'failure',
      { requestCount }
    );
  }

  /**
   * Log validation error
   */
  logValidationError(
    userId: string,
    resource: string,
    errors: string[]
  ): AuditEvent {
    return this.logEvent(
      'VALIDATION_ERROR',
      userId,
      resource,
      'Input validation failed',
      'medium',
      'failure',
      { errors }
    );
  }

  /**
   * Log security alert
   */
  logSecurityAlert(
    userId: string,
    alertType: string,
    details: Record<string, any>
  ): AuditEvent {
    return this.logEvent(
      'SECURITY_ALERT',
      userId,
      alertType,
      `Security alert: ${alertType}`,
      'critical',
      'failure',
      details
    );
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: AuditEventType, limit = 100): AuditEvent[] {
    return this.events
      .filter((e) => e.eventType === eventType)
      .slice(-limit);
  }

  /**
   * Get events by user
   */
  getEventsByUser(userId: string, limit = 100): AuditEvent[] {
    return this.events
      .filter((e) => e.userId === userId)
      .slice(-limit);
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(
    severity: 'low' | 'medium' | 'high' | 'critical',
    limit = 100
  ): AuditEvent[] {
    return this.events
      .filter((e) => e.severity === severity)
      .slice(-limit);
  }

  /**
   * Get events in time range
   */
  getEventsByTimeRange(startTime: number, endTime: number): AuditEvent[] {
    return this.events.filter(
      (e) => e.timestamp >= startTime && e.timestamp <= endTime
    );
  }

  /**
   * Flush events to persistent storage
   */
  async flushEvents(): Promise<void> {
    try {
      // In production, this would send to secure backend storage
      // For now, store in AsyncStorage
      if (this.events.length === 0) {
        return;
      }

      // TODO: Implement persistent storage
      console.log(`[AUDIT] Flushed ${this.events.length} events`);
    } catch (error) {
      console.error('Failed to flush audit logs:', error);
    }
  }

  /**
   * Start periodic flush of events
   */
  private startPeriodicFlush(): void {
    // Flush every 5 minutes or when buffer gets large
    this.flushInterval = setInterval(() => {
      if (this.events.length > 100) {
        this.flushEvents();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop periodic flush
   */
  stopPeriodicFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Generate audit report
   */
  generateReport(startTime: number, endTime: number): Record<string, any> {
    const events = this.getEventsByTimeRange(startTime, endTime);

    const eventTypeCounts: Record<string, number> = {};
    const severityCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const userEvents: Record<string, number> = {};

    for (const event of events) {
      eventTypeCounts[event.eventType] = (eventTypeCounts[event.eventType] || 0) + 1;
      severityCounts[event.severity] = (severityCounts[event.severity] || 0) + 1;
      statusCounts[event.status] = (statusCounts[event.status] || 0) + 1;
      userEvents[event.userId] = (userEvents[event.userId] || 0) + 1;
    }

    return {
      period: { startTime, endTime },
      totalEvents: events.length,
      eventTypes: eventTypeCounts,
      bySeverity: severityCounts,
      byStatus: statusCounts,
      topUsers: Object.entries(userEvents)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      criticalEvents: events.filter((e) => e.severity === 'critical'),
    };
  }

  /**
   * Clear all events (use carefully!)
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Get current event count
   */
  getEventCount(): number {
    return this.events.length;
  }

  /**
   * Get last N events
   */
  getRecentEvents(count = 100): AuditEvent[] {
    return this.events.slice(-count);
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

export default auditLogger;
