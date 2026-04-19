import { Organizer, CreateOrganizerDTO, UpdateOrganizerDTO } from '../models/organizerModel';
import { Event, CreateEventDTO, UpdateEventDTO, EventFile, EventPayment, EventAnalytics } from '../models/eventModel';

// File interface for file uploads
interface FileUpload {
  originalname: string;
  mimetype: string;
  size: number;
}

// Mock data storage (in production, use real database)
const organizers = new Map<string, Organizer>();
const events = new Map<string, Event>();
const eventFiles = new Map<string, EventFile>();
const eventPayments = new Map<string, EventPayment>();
const eventAnalytics = new Map<string, EventAnalytics>();

// Organizer Service
export class OrganizerService {
  async createOrganizer(data: CreateOrganizerDTO): Promise<Organizer> {
    const id = Math.random().toString(36).substring(7);
    const organizer: Organizer = {
      id,
      firebaseUid: data.firebaseUid,
      email: data.email,
      name: data.name,
      companyName: data.companyName,
      phone: data.phone,
      profilePictureUrl: data.profilePictureUrl || '',
      bio: data.bio || '',
      website: data.website || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    organizers.set(id, organizer);
    return organizer;
  }

  async getOrganizerById(id: string): Promise<Organizer | null> {
    return organizers.get(id) || null;
  }

  async getOrganizerByFirebaseUid(firebaseUid: string): Promise<Organizer | null> {
    for (const organizer of organizers.values()) {
      if (organizer.firebaseUid === firebaseUid) {
        return organizer;
      }
    }
    return null;
  }

  async updateOrganizer(id: string, data: UpdateOrganizerDTO): Promise<Organizer | null> {
    const organizer = organizers.get(id);
    if (!organizer) return null;

    const updated = {
      ...organizer,
      ...data,
      updatedAt: new Date(),
    };
    organizers.set(id, updated);
    return updated;
  }

  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    const result: Event[] = [];
    for (const event of events.values()) {
      if (event.organizerId === organizerId) {
        result.push(event);
      }
    }
    return result;
  }
}

// Event Service
export class EventService {
  async createEvent(organizerId: string, data: CreateEventDTO): Promise<Event> {
    const id = Math.random().toString(36).substring(7);
    
    // Calculate event fee based on expected attendees
    const eventFee = this.calculateEventFee(data.expectedAttendees);

    const event: Event = {
      id,
      organizerId,
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      expectedAttendees: data.expectedAttendees,
      maxAttendees: data.maxAttendees,
      ticketPrice: data.ticketPrice,
      eventFee,
      status: 'draft',
      tags: data.tags || [],
      details: data.details || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    events.set(id, event);

    // Create analytics record
    const analytics: EventAnalytics = {
      id: Math.random().toString(36).substring(7),
      eventId: id,
      views: 0,
      shares: 0,
      registrations: 0,
      attendees: 0,
      revenue: 0,
      updatedAt: new Date(),
    };
    eventAnalytics.set(analytics.id, analytics);

    return event;
  }

  async getEventById(id: string): Promise<Event | null> {
    return events.get(id) || null;
  }

  async updateEvent(id: string, data: UpdateEventDTO): Promise<Event | null> {
    const event = events.get(id);
    if (!event) return null;

    const updated = {
      ...event,
      ...data,
      updatedAt: new Date(),
    };
    events.set(id, updated);
    return updated;
  }

  async submitEventForReview(id: string): Promise<Event | null> {
    const event = events.get(id);
    if (!event) return null;

    const updated = {
      ...event,
      status: 'pending_review' as const,
      updatedAt: new Date(),
    };
    events.set(id, updated);
    return updated;
  }

  async approveEvent(id: string, approverId: string): Promise<Event | null> {
    const event = events.get(id);
    if (!event) return null;

    const updated = {
      ...event,
      status: 'approved' as const,
      approvedBy: approverId,
      updatedAt: new Date(),
    };
    events.set(id, updated);
    return updated;
  }

  async rejectEvent(id: string, reason: string): Promise<Event | null> {
    const event = events.get(id);
    if (!event) return null;

    const updated = {
      ...event,
      status: 'rejected' as const,
      rejectionReason: reason,
      updatedAt: new Date(),
    };
    events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return events.delete(id);
  }

  async getPendingEvents(): Promise<Event[]> {
    const result: Event[] = [];
    for (const event of events.values()) {
      if (event.status === 'pending_review') {
        result.push(event);
      }
    }
    return result;
  }

  async getEventAnalytics(eventId: string): Promise<EventAnalytics | null> {
    for (const analytics of eventAnalytics.values()) {
      if (analytics.eventId === eventId) {
        return analytics;
      }
    }
    return null;
  }

  private calculateEventFee(expectedAttendees: number): number {
    // Progressive fee structure
    if (expectedAttendees <= 100) return 49.99;
    if (expectedAttendees <= 500) return 99.99;
    if (expectedAttendees <= 1000) return 199.99;
    if (expectedAttendees <= 5000) return 399.99;
    return 799.99;
  }
}

// File Upload Service
export class FileUploadService {
  async uploadEventFile(eventId: string, file: FileUpload): Promise<EventFile> {
    const id = Math.random().toString(36).substring(7);
    const fileRecord: EventFile = {
      id,
      eventId,
      fileUrl: `/uploads/${id}-${file.originalname}`,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedAt: new Date(),
    };
    eventFiles.set(id, fileRecord);
    return fileRecord;
  }

  async getEventFiles(eventId: string): Promise<EventFile[]> {
    const result: EventFile[] = [];
    for (const file of eventFiles.values()) {
      if (file.eventId === eventId) {
        result.push(file);
      }
    }
    return result;
  }

  async deleteEventFile(fileId: string): Promise<boolean> {
    return eventFiles.delete(fileId);
  }
}

// Payment Service
export class PaymentService {
  async calculateEventFee(expectedAttendees: number): Promise<number> {
    if (expectedAttendees <= 100) return 49.99;
    if (expectedAttendees <= 500) return 99.99;
    if (expectedAttendees <= 1000) return 199.99;
    if (expectedAttendees <= 5000) return 399.99;
    return 799.99;
  }

  async createPaymentIntent(
    eventId: string,
    organizerId: string,
    amount: number
  ): Promise<EventPayment> {
    const id = Math.random().toString(36).substring(7);
    const payment: EventPayment = {
      id,
      eventId,
      organizerId,
      amount,
      status: 'pending',
      paymentMethod: 'stripe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    eventPayments.set(id, payment);
    return payment;
  }

  async getPaymentStatus(paymentId: string): Promise<EventPayment | null> {
    return eventPayments.get(paymentId) || null;
  }

  async completePayment(paymentId: string, transactionId: string): Promise<EventPayment | null> {
    const payment = eventPayments.get(paymentId);
    if (!payment) return null;

    const updated = {
      ...payment,
      status: 'completed' as const,
      transactionId,
      updatedAt: new Date(),
    };
    eventPayments.set(paymentId, updated);
    return updated;
  }

  async getOrganizerPayments(organizerId: string): Promise<EventPayment[]> {
    const result: EventPayment[] = [];
    for (const payment of eventPayments.values()) {
      if (payment.organizerId === organizerId) {
        result.push(payment);
      }
    }
    return result;
  }
}

export const organizerService = new OrganizerService();
export const eventService = new EventService();
export const fileUploadService = new FileUploadService();
export const paymentService = new PaymentService();
