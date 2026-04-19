import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newContent = `import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    durationUnit: 'hours' as 'hours' | 'days',
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        indoorMapFile: file,
        indoorMapFileName: file.name
      }));
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
        if (!formData.locationDetails.trim() && !formData.googleMapsLink.trim()) { 
          setError('Please provide either location details or Google Maps link'); return false; 
        }
        break;
      case 3:
        if (!formData.eventDate) { setError('Event date is required'); return false; }
        if (!formData.duration || parseInt(formData.duration) <= 0) { setError('Event duration must be greater than 0'); return false; }
        break;
      case 4:
        if (!formData.maxCapacity || parseInt(formData.maxCapacity) <= 0) { setError('Maximum capacity must be greater than 0'); return false; }
        if (!formData.ticketPrice || parseFloat(formData.ticketPrice) < 0) { setError('Ticket price must be a valid number'); return false; }
        break;
      case 6:
        if (!formData.indoorMapFile) { setError('Indoor map file is required'); return false; }
        break;
      case 7:
        if (!formData.agreeToTerms) { setError('You must agree to the terms and conditions'); return false; }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleCreateEvent = async () => {
    if (!validateStep(7)) return;
    setLoading(true);

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
        ticketPrice: parseFloat(formData.ticketPrice),
        currency: formData.currency,
        details: {
          ageRestriction: formData.ageRestriction,
          accessibility: formData.accessibilityInfo,
          parking: formData.parkingAvailable,
          notes: formData.notes
        }
      };

      // TODO: Integrate with backend API
      // const response = await fetch(\`/api/organizers/\${user?.uid}/events\`, {...});
      console.log('Event created:', eventData);
      console.log('Indoor map file:', formData.indoorMapFile?.name);
      
      onEventCreated?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = ['Basic Info', 'Location', 'Date & Time', 'Capacity & Pricing', 'Additional Info', 'Indoor Map', 'Confirm'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFB', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', overflow: 'auto' }}>
            {progressSteps.map((stepName, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '60px' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', backgroundColor: idx < step ? '#10B981' : idx === step - 1 ? '#2563EB' : '#E5E7EB', color: idx < step || idx === step - 1 ? '#FFFFFF' : '#9CA3AF', marginBottom: '0.5rem' }}>{idx < step ? '✓' : idx + 1}</div>
                <p style={{ fontSize: '0.65rem', fontWeight: '600', color: idx === step - 1 ? '#2563EB' : '#6B7280', textAlign: 'center' }}>{stepName}</p>
              </div>
            ))}
          </div>
          <div style={{ height: '2px', backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#2563EB', width: \`\${((step - 1) / (progressSteps.length - 1)) * 100}%\`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', borderLeft: '4px solid #EF4444' }}>
            <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>{error}</p>
          </div>
        )}

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>✦ Basic Event Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Event Title <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Summer Music Festival 2024" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Category <span style={{ color: '#EF4444' }}>*</span></label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                    {['Entertainment', 'Conference', 'Workshop', 'Networking', 'Sports', 'Food & Beverage', 'Art & Culture', 'Education', 'Health & Fitness', 'Other'].map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Description <span style={{ color: '#EF4444' }}>*</span></label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your event in detail..." rows={4} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>◈ Event Location</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Location Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Convention Center" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Location Details</label>
                  <textarea name="locationDetails" value={formData.locationDetails} onChange={handleInputChange} placeholder="Hall, Floor, Address..." rows={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Google Maps Link (Optional)</label>
                  <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>⚙ Date & Duration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Event Date <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Duration <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} min="1" placeholder="e.g., 2, 8, 24" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Unit <span style={{ color: '#EF4444' }}>*</span></label>
                    <select name="durationUnit" value={formData.durationUnit} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>☑ Capacity & Pricing</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Maximum Capacity <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} min="1" placeholder="e.g., 500" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Ticket Price <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} min="0" step="0.01" placeholder="e.g., 500" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Currency <span style={{ color: '#EF4444' }}>*</span></label>
                    <select name="currency" value={formData.currency} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>▰ Additional Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Age Restriction (Optional)</label>
                  <input type="text" name="ageRestriction" value={formData.ageRestriction} onChange={handleInputChange} placeholder="e.g., 18+" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Accessibility Information (Optional)</label>
                  <textarea name="accessibilityInfo" value={formData.accessibilityInfo} onChange={handleInputChange} placeholder="Wheelchair accessible, Sign language interpreter..." rows={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" name="parkingAvailable" checked={formData.parkingAvailable} onChange={handleInputChange} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }} />
                  <label style={{ fontSize: '0.875rem', color: '#1C1C1E', cursor: 'pointer' }}>Parking available</label>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any other details..." rows={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}
          {step === 6 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>◉ Indoor Venue Map</h2>
              <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #FBBF24', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400E', marginBottom: '0.5rem' }}>⚠ Important: Indoor Venue Map Required</p>
                <p style={{ fontSize: '0.875rem', color: '#B45309' }}>If you don't have an indoor map yet, we cannot create your event. Upload a floor plan showing all areas.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E', marginBottom: '0.5rem' }}>Upload Floor Plan <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ border: '2px dashed #E5E7EB', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                  <input type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} id="mapFileInput" />
                  <label htmlFor="mapFileInput" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1C1C1E' }}>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>PDF, JPG, PNG (Max 20MB)</p>
                  </label>
                </div>
                {formData.indoorMapFile && (
                  <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>✓ {formData.indoorMapFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {step === 7 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '1.5rem' }}>✦ Review & Confirm</h2>
              <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BFDBFE', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Date:</strong> {formData.eventDate}</p>
                  <p><strong>Duration:</strong> {formData.duration} {formData.durationUnit}</p>
                  <p><strong>Capacity:</strong> {parseInt(formData.maxCapacity).toLocaleString()}</p>
                  <p><strong>Price:</strong> {formData.currency === 'INR' ? '₹' : '$'}{parseFloat(formData.ticketPrice).toFixed(2)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', marginTop: '0.125rem' }} />
                <label style={{ fontSize: '0.875rem', color: '#1C1C1E' }}>I confirm all information is accurate and agree to the terms.</label>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <button onClick={handlePreviousStep} disabled={step === 1} style={{ padding: '0.75rem 1.5rem', backgroundColor: step === 1 ? '#F3F4F6' : '#FFFFFF', border: '1px solid #D1D5DB', color: step === 1 ? '#D1D5DB' : '#6B7280', borderRadius: '0.5rem', cursor: step === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}>◄ Back</button>
          <button onClick={step === 7 ? handleCreateEvent : handleNextStep} disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}>{loading ? 'Creating...' : step === 7 ? '✦ Create Event' : 'Next ▶'}</button>
          {onClose && <button onClick={onClose} disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}>Close</button>}
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
`;

const filePath = path.join(__dirname, 'src/pages/CreateEventPage.tsx');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ CreateEventPage.tsx generated successfully!');
