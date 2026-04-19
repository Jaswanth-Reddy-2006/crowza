import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Building,
  Globe,
  Phone,
  Calendar,
  Layers,
  Bell
} from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    companyWebsite: '',
    businessType: 'other',
    yearsInBusiness: '0-2',
    officeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    eventFrequency: 'monthly',
    expectedMonthlyEvents: '1-5',
    notificationPreference: 'email'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name required';
      if (!formData.businessType) newErrors.businessType = 'Business type required';
    } else if (step === 2) {
      if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Address required';
      if (!formData.city.trim()) newErrors.city = 'City required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem('organizerProfile', JSON.stringify(formData));
        navigate('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Organization', subtitle: 'Tell us about your organization', icon: <Settings size={24} /> },
    { number: 2, title: 'Location', subtitle: 'Add your contact information', icon: <MapPin size={24} /> },
    { number: 3, title: 'Preferences', subtitle: 'Set your event preferences', icon: <Sparkles size={24} /> }
  ];

  const businessTypes = [
    { value: 'entertainment', label: 'Entertainment & Events' },
    { value: 'corporate', label: 'Corporate Events' },
    { value: 'nonprofit', label: 'Non-Profit Organization' },
    { value: 'education', label: 'Education & Training' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'other', label: 'Other' }
  ];

  const renderStepContent = () => {
    const fieldStyles = {
      label: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.02em' },
      input: { width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '14px', fontSize: '1rem', fontFamily: 'inherit', transition: 'all 0.3s ease', boxSizing: 'border-box' as const },
      errorText: { color: 'var(--color-error)', fontSize: '0.85rem', marginTop: '0.375rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' },
      container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }
    };

    switch (currentStep) {
      case 1:
        return (
          <div style={{ animation: 'slideInUp 0.5s ease-out' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><Building size={16} color="var(--color-primary)" /> Organization Name</label>
              <input 
                type="text" 
                name="organizationName" 
                value={formData.organizationName} 
                onChange={handleInputChange} 
                placeholder="Enterprise Events Ltd." 
                style={{ ...fieldStyles.input, borderColor: errors.organizationName ? 'var(--color-error)' : 'var(--border-color)' }} 
              />
              {errors.organizationName && <div style={fieldStyles.errorText}>{errors.organizationName}</div>}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><Layers size={16} color="var(--color-primary)" /> Business Type</label>
              <select name="businessType" value={formData.businessType} onChange={handleInputChange} style={{ ...fieldStyles.input, cursor: 'pointer' }}>
                {businessTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
              </select>
            </div>
            <div style={fieldStyles.container}>
              <div>
                <label style={fieldStyles.label}><Calendar size={16} color="var(--color-primary)" /> Years in Business</label>
                <select name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleInputChange} style={{ ...fieldStyles.input, cursor: 'pointer' }}>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div>
                <label style={fieldStyles.label}><Globe size={16} color="var(--color-primary)" /> Website (Optional)</label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} placeholder="https://example.com" style={fieldStyles.input} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ animation: 'slideInUp 0.5s ease-out' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><MapPin size={16} color="var(--color-primary)" /> Office Address</label>
              <input 
                type="text" 
                name="officeAddress" 
                value={formData.officeAddress} 
                onChange={handleInputChange} 
                placeholder="123 Business Park, Sector 44" 
                style={{ ...fieldStyles.input, borderColor: errors.officeAddress ? 'var(--color-error)' : 'var(--border-color)' }} 
              />
              {errors.officeAddress && <div style={fieldStyles.errorText}>{errors.officeAddress}</div>}
            </div>
            <div style={fieldStyles.container}>
              <div>
                <label style={fieldStyles.label}>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Bangalore" style={{ ...fieldStyles.input, borderColor: errors.city ? 'var(--color-error)' : 'var(--border-color)' }} />
                {errors.city && <div style={fieldStyles.errorText}>{errors.city}</div>}
              </div>
              <div>
                <label style={fieldStyles.label}>State/Province</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Karnataka" style={fieldStyles.input} />
              </div>
            </div>
            <div style={fieldStyles.container}>
              <div>
                <label style={fieldStyles.label}>ZIP Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="560001" style={{ ...fieldStyles.input, borderColor: errors.zipCode ? 'var(--color-error)' : 'var(--border-color)' }} />
                {errors.zipCode && <div style={fieldStyles.errorText}>{errors.zipCode}</div>}
              </div>
              <div>
                <label style={fieldStyles.label}><Phone size={16} color="var(--color-primary)" /> Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+91 98765 43210" style={fieldStyles.input} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ animation: 'slideInUp 0.5s ease-out' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><Calendar size={16} color="var(--color-primary)" /> Event Frequency</label>
              <select name="eventFrequency" value={formData.eventFrequency} onChange={handleInputChange} style={{ ...fieldStyles.input, cursor: 'pointer' }}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><Layers size={16} color="var(--color-primary)" /> Expected Monthly Events</label>
              <select name="expectedMonthlyEvents" value={formData.expectedMonthlyEvents} onChange={handleInputChange} style={{ ...fieldStyles.input, cursor: 'pointer' }}>
                <option value="1-5">1-5 events</option>
                <option value="6-10">6-10 events</option>
                <option value="11-20">11-20 events</option>
                <option value="20+">20+ events</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={fieldStyles.label}><Bell size={16} color="var(--color-primary)" /> Notification Preference</label>
              <select name="notificationPreference" value={formData.notificationPreference} onChange={handleInputChange} style={{ ...fieldStyles.input, cursor: 'pointer' }}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both Email & SMS</option>
              </select>
            </div>
            <div style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderRadius: '16px', padding: '1.25rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} color="var(--color-primary)" />
              <div style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: '700' }}>You're all set! Your professional profile is ready to go.</div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '6rem 1.5rem', fontFamily: 'inherit' }}>
      <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        input:focus, select:focus { outline: none; border-color: var(--color-primary) !important; box-shadow: 0 0 0 4px var(--color-primary-light) !important; }
      `}</style>

      <div style={{ maxWidth: '640px', margin: '0 auto', animation: 'fadeIn 0.6s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 8px 16px var(--color-primary-glow)',
            animation: 'slideInUp 0.8s ease-out'
          }}>
             {steps[currentStep-1].icon}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.25rem, 5vw, 3rem)', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            marginBottom: '1rem',
            letterSpacing: '-0.03em'
          }}>Complete Your Profile</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{steps[currentStep - 1].subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', position: 'relative', padding: '0 1rem' }}>
          <div style={{ position: 'absolute', top: '2.5rem', left: '10%', right: '10%', height: '6px', backgroundColor: 'var(--bg-tertiary)', zIndex: 0, borderRadius: '4px' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: 'var(--color-primary)', 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, 
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 
              borderRadius: '4px', 
              boxShadow: '0 0 15px var(--color-primary-glow)' 
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1, width: '100%' }}>
            {steps.map((step) => (
              <div key={step.number} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ 
                  width: '5rem', 
                  height: '5rem', 
                  borderRadius: '20px', 
                  backgroundColor: currentStep >= step.number ? 'white' : 'white', 
                  color: currentStep >= step.number ? 'var(--color-primary)' : 'var(--text-tertiary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.25rem', 
                  fontWeight: '900', 
                  margin: '0 auto 1.25rem', 
                  transition: 'all 0.4s ease',
                  border: currentStep >= step.number ? '3px solid var(--color-primary)' : '3px solid var(--border-color)',
                  boxShadow: currentStep >= step.number ? '0 10px 20px var(--color-primary-glow)' : 'none'
                }}>
                  {currentStep > step.number ? <CheckCircle2 size={28} /> : <span>{step.number}</span>}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '800', 
                  color: currentStep >= step.number ? 'var(--text-primary)' : 'var(--text-tertiary)', 
                  transition: 'color 0.4s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '32px', 
          padding: '3rem', 
          boxShadow: 'var(--shadow-xl)', 
          marginBottom: '3rem', 
          border: '1px solid var(--border-color)',
          animation: 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {renderStepContent()}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'space-between' }}>
          <button 
            onClick={handleBack} 
            disabled={currentStep === 1} 
            style={{ 
              padding: '1.125rem 2rem', 
              border: '2px solid var(--border-color)', 
              backgroundColor: '#FFFFFF', 
              color: currentStep === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)', 
              fontWeight: '800', 
              borderRadius: '16px', 
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer', 
              fontSize: '1.125rem', 
              transition: 'all 0.3s ease', 
              opacity: currentStep === 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => { if (currentStep !== 1) e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { if (currentStep !== 1) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <ChevronLeft size={20} /> Back
          </button>
          <button 
            onClick={handleNext} 
            style={{ 
              padding: '1.125rem 3rem', 
              backgroundColor: 'var(--color-primary)', 
              color: '#FFFFFF', 
              fontWeight: '900', 
              borderRadius: '16px', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.125rem', 
              boxShadow: '0 8px 16px var(--color-primary-glow)', 
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px var(--color-primary-glow)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px var(--color-primary-glow)'; }}
          >
            {currentStep === 3 ? (
              <>Complete Setup <CheckCircle2 size={20} /></>
            ) : (
              <>Next Step <ChevronRight size={20} /></>
            )}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          STEP {currentStep} OF {steps.length}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
