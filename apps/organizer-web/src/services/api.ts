/**
 * API Service Layer
 * Handles all communication between frontend and backend
 * Base URL: http://localhost:3000
 */

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Make authenticated API requests
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { auth?: { userId?: string; token?: string } } = {}
): Promise<ApiResponse<T>> {
  const { auth, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add auth headers if token provided
  if (auth?.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============ Organizer API ============

export interface OrganizerProfile {
  id: string;
  organizationName: string;
  businessType: string;
  yearsInBusiness?: number;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email: string;
  profileVerified?: boolean;
  createdAt: string;
}

export async function getOrganizerProfile(organizerId: string) {
  return apiCall<OrganizerProfile>(`/organizers/${organizerId}`);
}

export async function updateOrganizerProfile(organizerId: string, data: Partial<OrganizerProfile>) {
  return apiCall<OrganizerProfile>(`/organizers/${organizerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ============ Event API ============

export interface EventData {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  duration: number;
  durationUnit: 'hours' | 'days';
  location: {
    name: string;
    details?: string;
    googleMapsLink?: string;
  };
  maxCapacity: number;
  ticketPrice: number;
  currency: string;
  details?: {
    ageRestriction?: string;
    accessibility?: string;
    parking?: boolean;
    notes?: string;
  };
}

export interface Event extends EventData {
  id: string;
  organizerId: string;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'completed';
  registrations: number;
  attended?: number;
  noShows?: number;
  createdAt: string;
  updatedAt: string;
}

export async function createEvent(organizerId: string, data: EventData) {
  return apiCall<Event>(`/organizers/${organizerId}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrganizerEvents(organizerId: string) {
  return apiCall<Event[]>(`/organizers/${organizerId}/events`);
}

export async function getEventDetails(organizerId: string, eventId: string) {
  return apiCall<Event>(`/organizers/${organizerId}/events/${eventId}`);
}

export async function updateEvent(organizerId: string, eventId: string, data: Partial<EventData>) {
  return apiCall<Event>(`/organizers/${organizerId}/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(organizerId: string, eventId: string) {
  return apiCall<{ success: boolean }>(`/organizers/${organizerId}/events/${eventId}`, {
    method: 'DELETE',
  });
}

// ============ Analytics API ============

export interface EventAnalytics {
  eventId: string;
  eventTitle: string;
  registrations: number;
  attended: number;
  noShows: number;
  attendanceRate: number;
  revenue: number;
  currency: string;
}

export async function getEventAnalytics(organizerId: string, eventId: string) {
  return apiCall<EventAnalytics>(`/organizers/${organizerId}/events/${eventId}/analytics`);
}

export async function getOrganizerAnalytics(organizerId: string) {
  return apiCall<{
    totalEvents: number;
    totalRegistrations: number;
    totalAttended: number;
    averageAttendanceRate: number;
    totalRevenue: number;
    events: EventAnalytics[];
  }>(`/organizers/${organizerId}/analytics`);
}

// ============ Payments API ============

export interface Payment {
  id: string;
  eventId: string;
  eventTitle: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  invoiceUrl?: string;
}

export async function getOrganizerPayments(organizerId: string) {
  return apiCall<Payment[]>(`/organizers/${organizerId}/payments`);
}

export async function getPaymentDetails(organizerId: string, paymentId: string) {
  return apiCall<Payment>(`/organizers/${organizerId}/payments/${paymentId}`);
}

// ============ File Upload API ============

export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export async function uploadEventFile(
  organizerId: string,
  eventId: string,
  file: File,
  fileType: 'indoorMap' | 'promotional' | 'other'
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', fileType);

  try {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events/${eventId}/files`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser will set it with boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as FileUploadResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File upload failed',
    };
  }
}

// ============ Health Check ============

export async function healthCheck() {
  return apiCall<{ status: string; timestamp: string }>('/health');
}

export default {
  // Organizer
  getOrganizerProfile,
  updateOrganizerProfile,
  
  // Events
  createEvent,
  getOrganizerEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  
  // Analytics
  getEventAnalytics,
  getOrganizerAnalytics,
  
  // Payments
  getOrganizerPayments,
  getPaymentDetails,
  
  // Files
  uploadEventFile,
  
  // Health
  healthCheck,
};
