/**
 * Advanced A* Pathfinding Engine for Indoor Navigation
 * Provides turn-by-turn navigation, seat-level accuracy, and heat map routing
 */

export interface Node {
  x: number;
  y: number;
  id: string;
  type: 'waypoint' | 'seat' | 'amenity' | 'exit';
  accessible: boolean;
}

export interface NavigationMesh {
  nodes: Node[];
  edges: Map<string, string[]>;
  obstacles: Array<{ x: number; y: number; width: number; height: number }>;
}

export interface RouteStep {
  index: number;
  from: Node;
  to: Node;
  direction: string; // N, NE, E, SE, S, SW, W, NW
  distance: number;
  instruction: string;
}

export interface Route {
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number; // in seconds
  svgPath: string;
  accessibility: boolean;
  landmarks: string[];
}

class AStarRouter {
  private navigationMesh: NavigationMesh;
  private heatMap: Map<string, number> = new Map();

  constructor(navigationMesh: NavigationMesh) {
    this.navigationMesh = navigationMesh;
  }

  /**
   * Heuristic function (Euclidean distance)
   */
  private heuristic(from: Node, to: Node): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate actual distance between two nodes
   */
  private distance(from: Node, to: Node): number {
    return this.heuristic(from, to);
  }

  /**
   * Check if line segment intersects with obstacles
   */
  private isPathClear(from: Node, to: Node): boolean {
    for (const obstacle of this.navigationMesh.obstacles) {
      if (this.lineIntersectsRect(from, to, obstacle)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Line-rectangle intersection detection
   */
  private lineIntersectsRect(
    p1: Node,
    p2: Node,
    rect: { x: number; y: number; width: number; height: number }
  ): boolean {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    const rectLeft = rect.x;
    const rectRight = rect.x + rect.width;
    const rectTop = rect.y;
    const rectBottom = rect.y + rect.height;

    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;

    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      const y = m * x + b;
      if (
        x >= rectLeft &&
        x <= rectRight &&
        y >= rectTop &&
        y <= rectBottom
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get neighbors considering heat map (avoids crowded areas)
   */
  private getNeighbors(node: Node): Node[] {
    const neighbors = this.navigationMesh.edges.get(node.id) || [];
    return neighbors
      .map((id) => this.navigationMesh.nodes.find((n) => n.id === id))
      .filter((n): n is Node => n !== undefined && n.accessible);
  }

  /**
   * Main A* algorithm
   */
  findPath(startId: string, endId: string, avoidCrowded = false): Node[] {
    const startNode = this.navigationMesh.nodes.find((n) => n.id === startId);
    const endNode = this.navigationMesh.nodes.find((n) => n.id === endId);

    if (!startNode || !endNode) {
      return [];
    }

    const openSet = new Set<string>([startNode.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    for (const node of this.navigationMesh.nodes) {
      gScore.set(node.id, Infinity);
      fScore.set(node.id, Infinity);
    }

    gScore.set(startNode.id, 0);
    fScore.set(
      startNode.id,
      this.heuristic(startNode, endNode)
    );

    while (openSet.size > 0) {
      let current = null;
      let lowestF = Infinity;

      for (const id of openSet) {
        const f = fScore.get(id) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = this.navigationMesh.nodes.find((n) => n.id === id);
        }
      }

      if (!current) break;

      if (current.id === endNode.id) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.delete(current.id);

      for (const neighbor of this.getNeighbors(current)) {
        let tentativeGScore =
          (gScore.get(current.id) || Infinity) + this.distance(current, neighbor);

        // Apply heat map penalty to avoid crowded areas
        if (avoidCrowded) {
          const crowdedness = this.heatMap.get(neighbor.id) || 0;
          tentativeGScore += crowdedness * 0.5;
        }

        if (tentativeGScore < (gScore.get(neighbor.id) || Infinity)) {
          cameFrom.set(neighbor.id, current.id);
          gScore.set(neighbor.id, tentativeGScore);
          fScore.set(
            neighbor.id,
            tentativeGScore + this.heuristic(neighbor, endNode)
          );

          if (!openSet.has(neighbor.id)) {
            openSet.add(neighbor.id);
          }
        }
      }
    }

    return [];
  }

  /**
   * Reconstruct path from A* result
   */
  private reconstructPath(cameFrom: Map<string, string>, current: Node): Node[] {
    const path: Node[] = [current];

    while (cameFrom.has(current.id)) {
      const prevId = cameFrom.get(current.id)!;
      const prev = this.navigationMesh.nodes.find((n) => n.id === prevId);
      if (prev) {
        path.unshift(prev);
        current = prev;
      } else {
        break;
      }
    }

    return path;
  }

  /**
   * Update heat map with crowded areas
   */
  updateHeatMap(occupancies: Record<string, number>): void {
    for (const [nodeId, occupancy] of Object.entries(occupancies)) {
      this.heatMap.set(nodeId, occupancy);
    }
  }
}

/**
 * Generate turn-by-turn directions from path
 */
export function generateDirections(path: Node[]): RouteStep[] {
  const steps: RouteStep[] = [];

  for (let i = 1; i < path.length; i++) {
    const from = path[i - 1];
    const to = path[i];
    const direction = getDirection(from, to);
    const distance = Math.sqrt(
      Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
    );

    steps.push({
      index: i,
      from,
      to,
      direction,
      distance,
      instruction: generateInstruction(direction, to, distance),
    });
  }

  return steps;
}

/**
 * Determine compass direction between two points
 */
function getDirection(from: Node, to: Node): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) return 'E';
  if (angle >= 22.5 && angle < 67.5) return 'SE';
  if (angle >= 67.5 && angle < 112.5) return 'S';
  if (angle >= 112.5 && angle < 157.5) return 'SW';
  if (angle >= 157.5 || angle < -157.5) return 'W';
  if (angle >= -157.5 && angle < -112.5) return 'NW';
  if (angle >= -112.5 && angle < -67.5) return 'N';
  return 'NE';
}

/**
 * Generate human-readable directions
 */
function generateInstruction(direction: string, to: Node, distance: number): string {
  const directionMap: Record<string, string> = {
    N: 'Head north',
    NE: 'Head northeast',
    E: 'Head east',
    SE: 'Head southeast',
    S: 'Head south',
    SW: 'Head southwest',
    W: 'Head west',
    NW: 'Head northwest',
  };

  const typeMap: Record<string, string> = {
    seat: `toward seat ${to.id}`,
    amenity: `toward ${to.id}`,
    exit: `toward exit`,
    waypoint: '',
  };

  const distanceText = distance > 100 ? `${Math.round(distance)}m` : 'a short way';
  return `${directionMap[direction]} ${distanceText} ${typeMap[to.type] || ''}`.trim();
}

/**
 * Generate SVG path string from route
 */
export function generateSvgPath(path: Node[]): string {
  if (path.length === 0) return '';

  let svgPath = `M ${path[0].x} ${path[0].y}`;
  for (let i = 1; i < path.length; i++) {
    svgPath += ` L ${path[i].x} ${path[i].y}`;
  }

  return svgPath;
}

/**
 * Calculate total distance and estimated time
 */
export function calculateRoute(
  navigationMesh: NavigationMesh,
  startId: string,
  endId: string,
  occupancies: Record<string, number> = {},
  avoidCrowded = true
): Route {
  const router = new AStarRouter(navigationMesh);

  if (Object.keys(occupancies).length > 0) {
    router.updateHeatMap(occupancies);
  }

  const path = router.findPath(startId, endId, avoidCrowded);
  const steps = generateDirections(path);
  const totalDistance = steps.reduce((sum, step) => sum + step.distance, 0);
  const estimatedTime = Math.round((totalDistance / 100) * 60); // Assume 1m per second

  const startNode = navigationMesh.nodes.find((n) => n.id === startId);
  const endNode = navigationMesh.nodes.find((n) => n.id === endId);
  const accessibility = path.every(
    (node) => navigationMesh.nodes.find((n) => n.id === node.id)?.accessible
  );

  const landmarks = steps
    .filter((step) => step.to.type === 'amenity')
    .map((step) => step.to.id);

  return {
    steps,
    totalDistance,
    estimatedTime,
    svgPath: generateSvgPath(path),
    accessibility,
    landmarks,
  };
}

export { AStarRouter };
