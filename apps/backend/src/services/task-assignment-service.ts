/**
 * Channel-Based Task Assignment System
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

export interface ChannelStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  averageCompletionTime: number; // minutes
  staffOnline: number;
  staffOffline: number;
  criticalTasksCount: number;
  urgentAlerts: number;
}

/**
 * Task Assignment Service
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

  /**
   * Initialize channels
   */
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
        staffCount: 0,
        activeTasks: 0,
        lastUpdated: Date.now(),
        priority: channelId === 'emergency' ? 'high' : 'medium',
      });
    });
  }

  /**
   * Register staff member to channels
   */
  registerStaffMember(
    id: string,
    name: string,
    channels: StaffChannel[],
    specialization?: string
  ): StaffMember {
    const staff: StaffMember = {
      id,
      name,
      channels,
      isActive: true,
      specialization,
    };
    this.staffMembers.set(id, staff);

    // Update channel counts
    channels.forEach((ch) => {
      const channel = this.channels.get(ch);
      if (channel) {
        channel.staffCount += 1;
      }
    });

    return staff;
  }

  /**
   * Update staff location
   */
  updateStaffLocation(
    staffId: string,
    zone: string,
    latitude: number,
    longitude: number
  ): void {
    const staff = this.staffMembers.get(staffId);
    if (staff) {
      staff.location = { zone, latitude, longitude };
    }
  }

  /**
   * Create and assign task
   */
  createTask(
    title: string,
    description: string,
    type: TaskType,
    priority: TaskPriority,
    channel: StaffChannel,
    createdBy: string,
    options?: {
      zone?: string;
      location?: { latitude: number; longitude: number };
      dueAt?: number;
      actionItems?: string[];
      requiresAcknowledgment?: boolean;
      assignSpecificStaff?: string[];
    }
  ): Task {
    const taskId = `task-${++this.taskIdCounter}-${Date.now()}`;
    const now = Date.now();

    // Get staff for this channel
    const channelStaff = this.getStaffForChannel(channel, options?.zone, options?.location);
    const assignedStaff = options?.assignSpecificStaff
      ? this.staffMembers.get(options.assignSpecificStaff[0])
        ? options.assignSpecificStaff.map((id) => this.staffMembers.get(id)!).filter(Boolean)
        : channelStaff.slice(0, 3)
      : channelStaff.slice(0, 3);

    const task: Task = {
      id: taskId,
      title,
      description,
      type,
      priority,
      channel,
      status: 'assigned',
      assignedTo: assignedStaff,
      createdBy,
      createdAt: now,
      dueAt: options?.dueAt,
      zone: options?.zone,
      location: options?.location,
      actionItems: options?.actionItems,
      requiresAcknowledgment: options?.requiresAcknowledgment ?? priority === 'critical',
      acknowledgments: {},
    };

    this.tasks.set(taskId, task);

    // Update channel
    const channelObj = this.channels.get(channel);
    if (channelObj) {
      channelObj.activeTasks += 1;
      channelObj.lastUpdated = now;
    }

    // Broadcast event
    this.broadcastEvent({
      type: 'task-created',
      taskId,
      channelId: channel,
      message: `New ${priority} task: ${title}`,
      timestamp: now,
    });

    return task;
  }

  /**
   * Acknowledge task (staff confirms they received it)
   */
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
        message: `${this.staffMembers.get(staffId)?.name || 'Staff'} acknowledged task`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: TaskStatus, notes?: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = Date.now();
      }
      if (notes) {
        task.notes = notes;
      }

      const channelObj = this.channels.get(task.channel);
      if (channelObj && status === 'completed') {
        channelObj.activeTasks = Math.max(0, channelObj.activeTasks - 1);
      }

      this.broadcastEvent({
        type: 'task-updated',
        taskId,
        channelId: task.channel,
        message: `Task status: ${status}`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get tasks for specific channel
   */
  getTasksForChannel(channel: StaffChannel, status?: TaskStatus): Task[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.channel === channel && (!status || task.status === status)
    );
  }

  /**
   * Get tasks assigned to specific staff
   */
  getTasksForStaff(staffId: string): Task[] {
    return Array.from(this.tasks.values()).filter((task) =>
      task.assignedTo.some((s) => s.id === staffId)
    );
  }

  /**
   * Get staff for channel (prioritize by location and availability)
   */
  private getStaffForChannel(
    channel: StaffChannel,
    zone?: string,
    location?: { latitude: number; longitude: number }
  ): StaffMember[] {
    const staff = Array.from(this.staffMembers.values()).filter((s) =>
      s.channels.includes(channel)
    );

    // Sort by location proximity if provided
    if (location && zone) {
      return staff.sort((a, b) => {
        const distA = this.calculateDistance(location, a.location);
        const distB = this.calculateDistance(location, b.location);
        return distA - distB;
      });
    }

    // Sort by task load (least busy first)
    return staff.sort((a, b) => {
      const tasksA = this.getTasksForStaff(a.id).length;
      const tasksB = this.getTasksForStaff(b.id).length;
      return tasksA - tasksB;
    });
  }

  /**
   * Calculate distance between two coordinates
   */
  private calculateDistance(
    loc1: { latitude: number; longitude: number } | undefined,
    loc2: { latitude: number; longitude: number } | undefined
  ): number {
    if (!loc1 || !loc2) return 999999;
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.latitude * Math.PI) / 180) *
        Math.cos((loc2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get channel statistics
   */
  getChannelStats(channel: StaffChannel): ChannelStats {
    const tasks = this.getTasksForChannel(channel);
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
    const criticalTasks = tasks.filter((t) => t.priority === 'critical');

    const completionTimes = completedTasks
      .filter((t) => t.completedAt)
      .map((t) => (t.completedAt! - t.createdAt) / 60000); // Convert to minutes

    const staffInChannel = Array.from(this.staffMembers.values()).filter((s) =>
      s.channels.includes(channel)
    );

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: tasks.filter((t) => t.status === 'assigned').length,
      averageCompletionTime:
        completionTimes.length > 0
          ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
          : 0,
      staffOnline: staffInChannel.filter((s) => s.isActive).length,
      staffOffline: staffInChannel.filter((s) => !s.isActive).length,
      criticalTasksCount: criticalTasks.length,
      urgentAlerts: criticalTasks.filter((t) => t.status !== 'completed').length,
    };
  }

  /**
   * Broadcast task event
   */
  broadcastEvent(event: TaskAssignmentEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Subscribe to task events
   */
  onTaskEvent(listener: (event: TaskAssignmentEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Create urgent alert task
   */
  createUrgentAlert(
    title: string,
    description: string,
    channel: StaffChannel,
    zone: string,
    createdBy: string
  ): Task {
    return this.createTask(title, description, 'incident-response', 'critical', channel, createdBy, {
      zone,
      requiresAcknowledgment: true,
    });
  }

  /**
   * Get all tasks for dashboard
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const allTasks = this.getAllTasks();
    const completedTasks = allTasks.filter((t) => t.status === 'completed');
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => sum + ((t.completedAt || 0) - t.createdAt), 0) /
          completedTasks.length /
          60000
        : 0;

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      completionRate: allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0,
      averageCompletionTime: Math.round(avgCompletionTime),
      criticalTasksCompleted: completedTasks.filter((t) => t.priority === 'critical').length,
      totalStaff: this.staffMembers.size,
      activeStaff: Array.from(this.staffMembers.values()).filter((s) => s.isActive).length,
    };
  }
}

// Export singleton instance
export const taskAssignmentService = TaskAssignmentService.getInstance();
