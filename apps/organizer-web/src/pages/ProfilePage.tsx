import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateOrganizerProfile } from '../services/api';
import { 
  User, 
  Settings, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building, 
  Briefcase, 
  Save, 
  X, 
  LogOut, 
  Trash2, 
  Key, 
  Shield, 
  CheckCircle,
  Share2,
  MessageCircle,
  Link,
  ChevronLeft
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logoutProvider } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileData, setProfileData] = useState({
    organizationName: 'Acme Events Inc',
    businessType: 'entertainment',
    website: 'https://acmevents.com',
    phoneNumber: '+91 XXXXX XXXXX',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    bio: 'Professional event organizer with 5+ years of experience',
    socialMedia: {
      twitter: '@acmevents',
      facebook: 'acmevents',
      instagram: '@acmevents'
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof profileData], [child]: value }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Save to localStorage
      localStorage.setItem('organizerProfile', JSON.stringify(profileData));

      // Persist to backend
      if (user?.uid) {
        const result = await updateOrganizerProfile(user.uid, {
          organizationName: profileData.organizationName,
          businessType: profileData.businessType,
          website: profileData.website,
          phone: profileData.phoneNumber,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to save profile');
        }
      }

      setMessage({ type: 'success', text: 'Profile saved successfully' });
      setEditMode(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          input, textarea, select { font-size: 16px !important; min-height: 44px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '3.5rem', 
            height: '3.5rem', 
            backgroundColor: 'var(--color-primary-light)', 
            color: 'var(--color-primary)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <User size={28} />
          </div>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.04em'
          }}>
            Profile & Settings
          </h2>
        </div>
        <button
          onClick={() => {
            if (editMode) handleSave();
            else setEditMode(true);
          }}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: editMode ? 'var(--color-success)' : 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: editMode ? '0 4px 12px var(--color-success-glow)' : '0 4px 12px var(--color-primary-glow)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.9rem',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'brightness(1)';
            }
          }}
        >
          {editMode ? <Save size={18} /> : <Settings size={18} />}
          <span>{editMode ? (loading ? 'Saving...' : 'Save Changes') : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          backgroundColor: message.type === 'success' ? 'var(--color-success-light)' : 'var(--color-error-light)',
          border: `1px solid ${message.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`,
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: message.type === 'success' ? 'var(--color-success-dark)' : 'var(--color-error-dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Avatar & Basic Info */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '32px',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              flexShrink: 0,
              boxShadow: '0 8px 16px var(--color-primary-glow)'
            }}
          >
            <User size={56} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1C1C1E', marginBottom: '0.5rem' }}>
              {profileData.organizationName}
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} />
              {user?.email}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: '800' }}>
                   <CheckCircle size={14} />
                   <span>Verified</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</p>
                <p style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>January 2024</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Events Created</p>
                <p style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Building size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
               Organization Details
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={profileData.organizationName}
                onChange={handleInputChange}
                disabled={!editMode}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: editMode ? 'text' : 'default',
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Business Type
              </label>
              <select
                name="businessType"
                value={profileData.businessType}
                onChange={handleInputChange}
                disabled={!editMode}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: editMode ? 'pointer' : 'default',
                  boxSizing: 'border-box'
                }}
              >
                <option value="entertainment">Entertainment</option>
                <option value="corporate">Corporate</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="education">Education</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <MapPin size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
               Contact Information
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!editMode}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={!editMode}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                State
              </label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                disabled={!editMode}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Briefcase size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
               About
            </h4>
          </div>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            disabled={!editMode}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              backgroundColor: editMode ? '#FFFFFF' : 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              minHeight: '120px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <CheckCircle size={18} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => setEditMode(false)}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Shield size={18} color="var(--color-primary)" />
          <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
             Account Security & Actions
          </h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <button
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <Key size={20} />
            <span>Change Password</span>
          </button>
          <button
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <Shield size={20} />
            <span>Two-Factor Auth</span>
          </button>
          <button
            onClick={() => logoutProvider()}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-error-light)',
              color: 'var(--color-error)',
              border: '1px solid var(--color-error-border)',
              borderRadius: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <button
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-error-light)',
              color: 'var(--color-error)',
              border: '1px solid var(--color-error-border)',
              borderRadius: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <Trash2 size={20} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
