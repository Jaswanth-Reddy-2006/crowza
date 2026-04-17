export enum IncidentType {
  SECURITY = 'security',
  MEDICAL = 'medical',
  MAINTENANCE = 'maintenance',
  CROWD_CONTROL = 'crowd_control',
  OTHER = 'other',
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved';
  location: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Alert {
  id: string;
  type: string;
  priority: number;
  message: string;
  targetZones?: string[];
  expiresAt: string;
}
