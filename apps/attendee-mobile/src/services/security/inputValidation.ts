/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
/**
 * Security Validation & Input Sanitization
 * Comprehensive security layer for input validation, XSS prevention, and data sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const sanitized = sanitizeString(email);

  // RFC 5322 simplified regex
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    errors.push('Invalid email format');
  }

  if (sanitized.length > 254) {
    errors.push('Email too long (max 254 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate node ID format (alphanumeric with hyphens/underscores)
 */
export function validateNodeId(nodeId: string): ValidationResult {
  const errors: string[] = [];

  if (!nodeId || typeof nodeId !== 'string') {
    errors.push('Node ID is required');
    return { isValid: false, errors };
  }

  const sanitized = sanitizeString(nodeId);

  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    errors.push('Node ID contains invalid characters');
  }

  if (sanitized.length > 50) {
    errors.push('Node ID too long (max 50 characters)');
  }

  if (sanitized.length < 1) {
    errors.push('Node ID too short (min 1 character)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate venue ID
 */
export function validateVenueId(venueId: string): ValidationResult {
  return validateNodeId(venueId);
}

/**
 * Validate seat ID (section-row-number format)
 */
export function validateSeatId(seatId: string): ValidationResult {
  const errors: string[] = [];

  if (!seatId || typeof seatId !== 'string') {
    errors.push('Seat ID is required');
    return { isValid: false, errors };
  }

  const sanitized = sanitizeString(seatId);

  // Expected format: SECTION-ROW-NUMBER (e.g., A-1-1)
  if (!/^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/.test(sanitized)) {
    errors.push('Seat ID must be in format SECTION-ROW-NUMBER');
  }

  if (sanitized.length > 50) {
    errors.push('Seat ID too long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate coordinate (x, y values)
 */
export function validateCoordinate(
  x: any,
  y: any
): ValidationResult {
  const errors: string[] = [];

  if (typeof x !== 'number' || typeof y !== 'number') {
    errors.push('Coordinates must be numbers');
    return { isValid: false, errors };
  }

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    errors.push('Coordinates must be finite numbers');
    return { isValid: false, errors };
  }

  if (x < -180 || x > 180 || y < -90 || y > 90) {
    errors.push('Coordinates out of valid range');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: { x, y },
  };
}

/**
 * Validate occupancy value
 */
export function validateOccupancy(value: any): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== 'number') {
    errors.push('Occupancy must be a number');
    return { isValid: false, errors };
  }

  if (!Number.isFinite(value)) {
    errors.push('Occupancy must be a finite number');
    return { isValid: false, errors };
  }

  if (value < 0 || value > 100) {
    errors.push('Occupancy must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: Math.round(value),
  };
}

/**
 * Validate navigation mesh structure
 */
export function validateNavigationMesh(mesh: any): ValidationResult {
  const errors: string[] = [];

  if (!mesh || typeof mesh !== 'object') {
    errors.push('Navigation mesh must be an object');
    return { isValid: false, errors };
  }

  if (!Array.isArray(mesh.nodes)) {
    errors.push('Navigation mesh must have nodes array');
  } else if (mesh.nodes.length === 0) {
    errors.push('Navigation mesh must have at least one node');
  } else {
    // Validate each node
    mesh.nodes.forEach((node: any, index: number) => {
      if (!node.id) {
        errors.push(`Node ${index} missing id`);
      }

      const coordResult = validateCoordinate(node.x, node.y);
      if (!coordResult.isValid) {
        errors.push(`Node ${node.id}: ${coordResult.errors.join(', ')}`);
      }

      if (!['waypoint', 'seat', 'amenity', 'exit'].includes(node.type)) {
        errors.push(`Node ${node.id} has invalid type`);
      }

      if (typeof node.accessible !== 'boolean') {
        errors.push(`Node ${node.id} must have accessible boolean`);
      }
    });
  }

  if (!mesh.edges || typeof mesh.edges !== 'object') {
    errors.push('Navigation mesh must have edges object');
  }

  if (!Array.isArray(mesh.obstacles)) {
    errors.push('Navigation mesh must have obstacles array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate route parameters before calculation
 */
export function validateRouteRequest(
  startNodeId: string,
  endNodeId: string,
  avoidCrowded?: boolean
): ValidationResult {
  const errors: string[] = [];

  const startValidation = validateNodeId(startNodeId);
  if (!startValidation.isValid) {
    errors.push(`Start node: ${startValidation.errors.join(', ')}`);
  }

  const endValidation = validateNodeId(endNodeId);
  if (!endValidation.isValid) {
    errors.push(`End node: ${endValidation.errors.join(', ')}`);
  }

  if (startNodeId === endNodeId) {
    errors.push('Start and end nodes cannot be the same');
  }

  if (typeof avoidCrowded !== 'undefined' && typeof avoidCrowded !== 'boolean') {
    errors.push('avoidCrowded must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      startNodeId: startValidation.sanitized,
      endNodeId: endValidation.sanitized,
      avoidCrowded: avoidCrowded ?? true,
    },
  };
}

/**
 * Validate API response structure
 */
export function validateApiResponse(response: any): ValidationResult {
  const errors: string[] = [];

  if (!response || typeof response !== 'object') {
    errors.push('Response must be an object');
    return { isValid: false, errors };
  }

  if (typeof response.success !== 'boolean') {
    errors.push('Response must have success boolean');
  }

  if (response.data !== undefined && typeof response.data !== 'object') {
    errors.push('Response data must be an object if present');
  }

  if (response.error && typeof response.error !== 'string') {
    errors.push('Response error must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user permissions
 */
export function validatePermission(
  userRole: string,
  requiredPermissions: string[]
): ValidationResult {
  const errors: string[] = [];

  const validRoles = ['attendee', 'staff', 'admin'];
  const validPermissions = [
    'read:map',
    'read:occupancy',
    'write:occupancy',
    'read:navigation',
    'write:incident',
  ];

  if (!validRoles.includes(userRole)) {
    errors.push(`Invalid user role: ${userRole}`);
  }

  if (!Array.isArray(requiredPermissions)) {
    errors.push('Required permissions must be an array');
  } else {
    for (const perm of requiredPermissions) {
      if (!validPermissions.includes(perm)) {
        errors.push(`Invalid permission: ${perm}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting check
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request should be allowed
   */
  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(clientId) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add new request
    validRequests.push(now);
    this.requests.set(clientId, validRequests);

    return true;
  }

  /**
   * Get remaining requests for client
   */
  getRemainingRequests(clientId: string): number {
    const now = Date.now();
    const requests = this.requests.get(clientId) || [];
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Reset rate limit for client
   */
  reset(clientId: string): void {
    this.requests.delete(clientId);
  }
}

export default {
  sanitizeString,
  validateEmail,
  validateNodeId,
  validateVenueId,
  validateSeatId,
  validateCoordinate,
  validateOccupancy,
  validateNavigationMesh,
  validateRouteRequest,
  validateApiResponse,
  validatePermission,
  RateLimiter,
};
