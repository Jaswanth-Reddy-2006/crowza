import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import Logo from '../components/Logo';
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  ChevronLeft, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    fullName: '',
    phoneNumber: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData.email, formData.password, {
          fullName: formData.fullName,
          organizationName: formData.organizationName,
          phoneNumber: formData.phoneNumber
        });
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-primary)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse-light { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .auth-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .input-icon-group { position: relative; margin-bottom: 1.25rem; }
        .input-icon-group svg { position: absolute; left: 1rem; top: 2.3rem; color: var(--text-tertiary); pointer-events: none; transition: color 0.3s ease; }
        .input-icon-group input:focus + svg { color: var(--color-primary); }
      `}</style>

      {/* Left Side - Visual (Hidden on mobile) */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--color-secondary)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'none',
        lg: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem'
      }} className="auth-visual">
        <style>{` @media (min-width: 1024px) { .auth-visual { display: flex !important; } } `}</style>
        
        {/* Animated Background Gradients */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.4
        }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'slideInLeft 0.8s ease-out' }}>
          <div style={{
            marginBottom: '4rem',
            color: 'white'
          }} onClick={() => navigate('/')}>
            <Logo size="lg" color="var(--color-primary)" />
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '2rem',
            letterSpacing: '-0.03em'
          }}>
            Powerful Events, <br />
            <span style={{ color: 'var(--color-primary)' }}>Simplified.</span>
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '450px',
            lineHeight: 1.6,
            fontWeight: '500',
            marginBottom: '4rem'
          }}>
            Join our community of elite organizers and transform how you manage registrations and payments.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <ShieldCheck size={20} />, text: 'Verified Payment Processing' },
              { icon: <Sparkles size={20} />, text: 'Real-time Attendee Sync' },
              { icon: <Building size={20} />, text: 'Enterprise Grade Security' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontWeight: '600' }}>
                <div style={{ color: 'var(--color-primary)' }}>{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        minHeight: '100vh',
        overflowY: 'auto',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }} className="auth-card">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '2.5rem',
              padding: 0,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <ChevronLeft size={18} /> Back to Home
          </button>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              {mode === 'login' ? 'Login to manage your events' : 'Create an account to host your first event'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(186, 26, 26, 0.05)',
              border: '1px solid var(--color-error)',
              borderRadius: '12px',
              color: 'var(--color-error)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mode === 'register' && (
                <>
                  <div className="input-icon-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} required />
                    <User size={20} />
                  </div>
                  <div className="input-icon-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Organization Name</label>
                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="Acme Events" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} required />
                    <Building size={20} />
                  </div>
                  <PhoneInput value={formData.phoneNumber} onChange={(val) => setFormData({ ...formData, phoneNumber: val })} />
                </>
              )}

              <div className="input-icon-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@company.com" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} required />
                <Mail size={20} />
              </div>

              <div className="input-icon-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} required />
                <Lock size={20} />
              </div>

              {mode === 'register' && (
                <div className="input-icon-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} required />
                  <Lock size={20} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.125rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.125rem',
                fontWeight: '800',
                cursor: 'pointer',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 20px var(--color-primary-glow)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px var(--color-primary-glow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px var(--color-primary-glow)'; }}
            >
              {loading ? 'Processing...' : (
                <>
                  {mode === 'login' ? 'Login' : 'Create Account'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: 0
                }}
              >
                {mode === 'login' ? 'Register Now' : 'Login Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
