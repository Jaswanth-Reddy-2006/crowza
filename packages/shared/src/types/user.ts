export enum UserRole {
  ATTENDEE = 'attendee',
  OPERATOR = 'operator',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  venueId?: string;
  firebaseUid: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'high_contrast';
  accessibilityEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}
