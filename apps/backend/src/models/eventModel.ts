// Event database model and types
export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  expectedAttendees: number;
  maxAttendees: number;
  ticketPrice?: number;
  eventFee: number;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'active' | 'cancelled';
  featuredImageUrl?: string;
  bannerImageUrl?: string;
  tags: string[];
  details: Record<string, unknown>;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  expectedAttendees: number;
  maxAttendees: number;
  ticketPrice?: number;
  tags?: string[];
  details?: Record<string, unknown>;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  expectedAttendees?: number;
  maxAttendees?: number;
  ticketPrice?: number;
  featuredImageUrl?: string;
  bannerImageUrl?: string;
  tags?: string[];
  details?: Record<string, unknown>;
}

export interface EventFile {
  id: string;
  eventId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface EventPayment {
  id: string;
  eventId: string;
  organizerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAnalytics {
  id: string;
  eventId: string;
  views: number;
  shares: number;
  registrations: number;
  attendees: number;
  revenue: number;
  updatedAt: Date;
}

// SQL for PostgreSQL
export const eventSchema = `
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(500) NOT NULL,
  expected_attendees INTEGER NOT NULL CHECK (expected_attendees > 0),
  max_attendees INTEGER NOT NULL CHECK (max_attendees >= expected_attendees),
  ticket_price DECIMAL(10, 2),
  event_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  featured_image_url VARCHAR(500),
  banner_image_url VARCHAR(500),
  tags TEXT[],
  details JSONB,
  approved_by UUID REFERENCES organizers(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_status CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'active', 'cancelled')),
  CONSTRAINT check_date_order CHECK (end_date > start_date)
);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);

CREATE TABLE IF NOT EXISTS event_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_files_event_id ON event_files(event_id);

CREATE TABLE IF NOT EXISTS event_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_payment_status CHECK (status IN ('pending', 'completed', 'failed'))
);

CREATE INDEX idx_event_payments_event_id ON event_payments(event_id);
CREATE INDEX idx_event_payments_organizer_id ON event_payments(organizer_id);
CREATE INDEX idx_event_payments_status ON event_payments(status);

CREATE TABLE IF NOT EXISTS event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  attendees INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_analytics_event_id ON event_analytics(event_id);
`;
