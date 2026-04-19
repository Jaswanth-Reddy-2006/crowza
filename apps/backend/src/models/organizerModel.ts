// Organizer database model and types
export interface Organizer {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  companyName: string;
  phone: string;
  profilePictureUrl?: string;
  bio?: string;
  website?: string;
  status: 'active' | 'suspended';
  stripeCustomerId?: string;
  taxId?: string;
  bankAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizerDTO {
  firebaseUid: string;
  email: string;
  name: string;
  companyName: string;
  phone: string;
  profilePictureUrl?: string;
  bio?: string;
  website?: string;
}

export interface UpdateOrganizerDTO {
  name?: string;
  companyName?: string;
  phone?: string;
  profilePictureUrl?: string;
  bio?: string;
  website?: string;
  stripeCustomerId?: string;
  taxId?: string;
}

// SQL for PostgreSQL
export const organizerSchema = `
CREATE TABLE IF NOT EXISTS organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  profile_picture_url VARCHAR(500),
  bio TEXT,
  website VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  tax_id VARCHAR(50),
  bank_account_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_status CHECK (status IN ('active', 'suspended'))
);

CREATE INDEX idx_organizers_firebase_uid ON organizers(firebase_uid);
CREATE INDEX idx_organizers_email ON organizers(email);
`;
