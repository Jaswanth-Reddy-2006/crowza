/**
 * Channel-Based Task Assignment System - Client side service
 * For coordinating staff across venue departments
 */

export type StaffChannel = 'security' | 'crowd-control' | 'medical' | 'tech' | 'guest-services' | 'valet' | 'emergency';
export type TaskPriority = 'critical' | 'high' | 'normal' | 'low';
export type TaskStatus = 'assigned' | 'acknowledged' | 'in-progress' | 'completed' | 'cancelled';
export type TaskType = 'incident-response' | 'crowd-management' | 'assistance' | 'check-in' | 'inspection' | 'coordination';

export interface StaffMember {
  id: string;
  name: string;
  channels: StaffChannel[];
  location?: {
    zone: string;
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  specialization?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  channel: StaffChannel;
  status: TaskStatus;
  assignedTo: StaffMember[];
  createdBy: string;
  createdAt: number;
  dueAt?: number;
  completedAt?: number;
  zone?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  actionItems?: string[];
  notes?: string;
  attachments?: string[];
  requiresAcknowledgment: boolean;
  acknowledgments: Record<string, number>; // staffId -> timestamp
}

export interface Channel {
  id: string;
  name: StaffChannel;
  description: string;
  staffCount: number;
  activeTasks: number;
  lastUpdated: number;
  zone?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TaskAssignmentEvent {
  type: 'task-created' | 'task-acknowledged' | 'task-updated' | 'task-completed' | 'staff-joined' | 'urgent-alert';
  taskId?: string;
  channelId: string;
  staffId?: string;
  message: string;
  timestamp: number;
}

/**
 * Task Assignment Service - Singleton Client Implementation
 * In a real app, this would use WebSockets or Firebase for real-time sync.
 */
export class TaskAssignmentService {
  private static instance: TaskAssignmentService;
  private tasks: Map<string, Task> = new Map();
  private channels: Map<string, Channel> = new Map();
  private staffMembers: Map<string, StaffMember> = new Map();
  private listeners: Set<(event: TaskAssignmentEvent) => void> = new Set();
  private taskIdCounter = 0;

  static getInstance(): TaskAssignmentService {
    if (!TaskAssignmentService.instance) {
      TaskAssignmentService.instance = new TaskAssignmentService();
    }
    return TaskAssignmentService.instance;
  }

  constructor() {
    this.initializeChannels();
    this.seedMockData();
  }

  initializeChannels(): void {
    const channelConfigs: Array<[StaffChannel, string]> = [
      ['security', 'Security & Access Control'],
      ['crowd-control', 'Crowd Management'],
      ['medical', 'Medical & First Aid'],
      ['tech', 'Technical Support'],
      ['guest-services', 'Guest Services'],
      ['valet', 'Parking & Valet'],
      ['emergency', 'Emergency Response'],
    ];

    channelConfigs.forEach(([channelId, description]) => {
      this.channels.set(channelId, {
        id: channelId,
        name: channelId,
        description,
        staffCount: 3,
        activeTasks: 0,
        lastUpdated: Date.now(),
        priority: channelId === 'emergency' ? 'high' : 'medium',
      });
    });
  }

  private seedMockData() {
    // Basic mock data for UI testing
    const now = Date.now();
    this.tasks.set('t1', {
      id: 't1',
      title: 'Perimeter Check - Gate A',
      description: 'Perform scheduled security sweep of the main entry point.',
      type: 'assistance',
      priority: 'high',
      channel: 'security',
      status: 'assigned',
      assignedTo: [{ id: 's1', name: 'Commander Riker', channels: ['security'], isActive: true }],
      createdBy: 'sys',
      createdAt: now - 3600000,
      requiresAcknowledgment: true,
      acknowledgments: {},
    });
  }

  acknowledgeTask(taskId: string, staffId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.acknowledgments[staffId] = Date.now();
      task.status = 'acknowledged';
      this.broadcastEvent({
        type: 'task-acknowledged',
        taskId,
        channelId: task.channel,
        staffId,
        message: 'Task acknowledged',
        timestamp: Date.now()
      });
    }
  }

  updateTaskStatus(taskId: string, status: TaskStatus, notes?: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      if (status === 'completed') task.completedAt = Date.now();
      if (notes) task.notes = notes;
      this.broadcastEvent({
        type: 'task-updated',
        taskId,
        channelId: task.channel,
        message: `Task status updated to ${status}`,
        timestamp: Date.now()
      });
    }
  }

  getTasksForChannel(channel: StaffChannel, status?: TaskStatus): Task[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.channel === channel && (!status || task.status === status)
    );
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  onTaskEvent(listener: (event: TaskAssignmentEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private broadcastEvent(event: TaskAssignmentEvent): void {
    this.listeners.forEach(l => l(event));
  }
}

export const taskAssignmentService = TaskAssignmentService.getInstance();
