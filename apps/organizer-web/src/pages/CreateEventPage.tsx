import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createEvent, uploadEventFile } from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  IndianRupee, 
  Info, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Ticket, 
  Layout, 
  FileText,
  AlertCircle,
  Briefcase,
  Globe,
  Tag,
  Accessibility,
  CheckCircle,
  X,
  ArrowLeft,
  Settings
} from 'lucide-react';

interface CreateEventPageProps {
  onClose?: () => void;
  onEventCreated?: () => void;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({ onClose, onEventCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'entertainment',
    description: '',
    location: '',
    locationDetails: '',
    googleMapsLink: '',
    eventDate: '',
    duration: '',
    durationUnit: 'hours',
    maxCapacity: '',
    ticketPrice: '',
    currency: 'INR',
    ageRestriction: '',
    accessibilityInfo: '',
    parkingAvailable: false,
    notes: '',
    indoorMapFile: null as File | null,
    indoorMapFileName: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const categories = [
    'Entertainment', 'Conference', 'Workshop', 'Networking', 'Sports',
    'Food & Beverage', 'Art & Culture', 'Education', 'Health & Fitness', 'Other'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        indoorMapFile: file,
        indoorMapFileName: file.name
      }));
    }
  };

  const handleCreateEvent = async () => {
    if (!validateStep(7)) return;

    setLoading(true);
    setError('');

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        eventDate: formData.eventDate,
        duration: parseInt(formData.duration),
        durationUnit: formData.durationUnit,
        location: {
          name: formData.location,
          details: formData.locationDetails,
          googleMapsLink: formData.googleMapsLink
        },
        maxCapacity: parseInt(formData.maxCapacity),
        ticketPrice: parseFloat(formData.ticketPrice || '0'),
        currency: formData.currency,
        details: {
          ageRestriction: formData.ageRestriction,
          accessibility: formData.accessibilityInfo,
          parking: formData.parkingAvailable,
          notes: formData.notes
        }
      };

      if (!user?.uid) throw new Error('User not authenticated');

      const createResponse = await createEvent(user.uid, eventData);
      if (!createResponse.success) throw new Error(createResponse.error || 'Failed to create event');

      const createdEvent = createResponse.data as any;

      if (formData.indoorMapFile && createdEvent.id) {
        await uploadEventFile(user.uid, createdEvent.id, formData.indoorMapFile, 'floor_plan');
      }
      
      if (onEventCreated) onEventCreated();
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    setError('');
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) { setError('Event title is required'); return false; }
        if (!formData.description.trim()) { setError('Event description is required'); return false; }
        break;
      case 2:
        if (!formData.location.trim()) { setError('Location is required'); return false; }
        break;
      case 3:
        if (!formData.eventDate) { setError('Event date is required'); return false; }
        if (!formData.duration || parseInt(formData.duration) <= 0) { setError('Duration must be greater than 0'); return false; }
        break;
      case 4:
        if (!formData.maxCapacity || parseInt(formData.maxCapacity) <= 0) { setError('Capacity must be greater than 0'); return false; }
        break;
      case 6:
        if (!formData.indoorMapFile) { setError('Indoor map file is required'); return false; }
        break;
      case 7:
        if (!formData.agreeToTerms) { setError('You must agree to the terms'); return false; }
        break;
    }
    return true;
  };

  const handleNextStep = () => { if (validateStep(step)) setStep(step + 1); };
  const handlePreviousStep = () => { setError(''); setStep(step - 1); };

  const renderStepContent = () => {
    const headerStyle = {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: 'var(--text-primary)',
      marginBottom: '1.5rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    };

    const labelStyle = {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '700',
      color: 'var(--text-tertiary)',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    };

    const inputStyle = {
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      border: '2px solid var(--border-color)',
      fontSize: '1rem',
      backgroundColor: 'var(--bg-secondary)',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      boxSizing: 'border-box' as const
    };

    switch (step) {
      case 1:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><Layout size={24} color="var(--color-primary)" /> Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Summer Music Festival" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
                  {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about your event..." style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><MapPin size={24} color="var(--color-primary)" /> Location Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Venue Name *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Grand Ballroom, Plaza Hotel" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Location Details</label>
                <input type="text" name="locationDetails" value={formData.locationDetails} onChange={handleInputChange} placeholder="e.g., 3rd Floor, West Wing" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Google Maps Link</label>
                <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." style={inputStyle} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><Calendar size={24} color="var(--color-primary)" /> Date & Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Event Date *</label>
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Duration *</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 3" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Unit</label>
                  <select name="durationUnit" value={formData.durationUnit} onChange={handleInputChange} style={inputStyle}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><Ticket size={24} color="var(--color-primary)" /> Capacity & Pricing</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Maximum Capacity *</label>
                <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} placeholder="e.g., 500" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Ticket Price</label>
                  <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} placeholder="0.00" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} style={inputStyle}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><Info size={24} color="var(--color-primary)" /> Additional Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Age Restriction</label>
                <input type="text" name="ageRestriction" value={formData.ageRestriction} onChange={handleInputChange} placeholder="e.g., 18+" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Accessibility</label>
                <input type="text" name="accessibilityInfo" value={formData.accessibilityInfo} onChange={handleInputChange} placeholder="e.g., Wheelchair access" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="parkingAvailable" checked={formData.parkingAvailable} onChange={handleInputChange} id="parking" style={{ width: '1.25rem', height: '1.25rem' }} />
                <label htmlFor="parking" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Parking Available</label>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><Upload size={24} color="var(--color-primary)" /> Indoor Map</div>
            <div style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: '24px', 
              padding: '3rem', 
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              transition: 'all 0.3s ease'
            }}>
              <input type="file" id="map-upload" onChange={handleFileUpload} style={{ display: 'none' }} />
              <label htmlFor="map-upload" style={{ cursor: 'pointer' }}>
                <Upload size={48} color="var(--color-primary)" style={{ marginBottom: '1.5rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {formData.indoorMapFileName || 'Upload Indoor Map'}
                </div>
                <p style={{ color: 'var(--text-tertiary)' }}>PNG, JPG or PDF up to 10MB</p>
              </label>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>
            <div style={headerStyle}><CheckCircle2 size={24} color="var(--color-success)" /> Review & Confirm</div>
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)' }}>Event Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Date:</strong> {formData.eventDate}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Capacity:</strong> {formData.maxCapacity}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} id="terms" style={{ width: '1.25rem', height: '1.25rem' }} />
              <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                I agree to the terms and conditions and confirm all details are correct.
              </label>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
      padding: '2rem 1rem',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => onClose && onClose()} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: 'var(--text-tertiary)', 
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em' }}>
            Create New Event
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Step {step} of 7
            </span>
            <div style={{ width: '200px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(step / 7) * 100}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '32px', 
          border: '1px solid var(--border-color)', 
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
        }}>
          {renderStepContent()}
        </div>

        {error && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--color-error-light)', 
            color: 'var(--color-error)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            fontWeight: '600',
            border: '1px solid var(--color-error-border)'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: '1rem' }}>
          <button
            onClick={handlePreviousStep}
            disabled={step === 1}
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: step === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
              borderRadius: '16px',
              border: '2px solid var(--border-color)',
              fontWeight: '800',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={20} /> Previous
          </button>

          {step < 7 ? (
            <button
              onClick={handleNextStep}
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 20px var(--color-primary-glow)',
                transition: 'all 0.3s ease'
              }}
            >
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleCreateEvent}
              disabled={loading}
              style={{
                padding: '1rem 3rem',
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                borderRadius: '16px',
                border: 'none',
                fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 20px var(--color-success-glow)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating...' : <><CheckCircle size={20} /> Create Event</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
