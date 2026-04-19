import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  Plus, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  User, 
  Sparkles, 
  Play, 
  ChevronRight, 
  Menu, 
  X,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Professional icons using Lucide
  const features = [
    {
      icon: <Plus size={24} />,
      title: 'Easy Event Creation',
      description: 'Create detailed events with images, descriptions, and pricing in minutes'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Secure Payments',
      description: 'Collect payments with our integrated payment system. Automatic fee calculation'
    },
    {
      icon: <Zap size={24} />,
      title: 'Real-time Sync',
      description: 'Events appear instantly in the attendee app after approval'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Analytics Dashboard',
      description: 'Track views, registrations, and event performance metrics'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Verification System',
      description: 'Submit events for review. Admin approval before going live'
    },
    {
      icon: <User size={24} />,
      title: 'Professional Profile',
      description: 'Build your organizer profile and establish credibility'
    },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        animation: 'slideInDown 0.5s ease-out'
      }}>
        <style>{`
          @keyframes slideInDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .nav-btn { transition: all 0.2s ease; }
          .nav-btn:hover { transform: translateY(-1px); }
          .float-animation { animation: float 6s ease-in-out infinite; }
        `}</style>
        
        <div style={{
          width: '100%',
          padding: '0 4rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
             {/* Note: In a real project we'd use media queries for this, mimicking the style here */}
             <style>{`
               @media (min-width: 1024px) { .desktop-nav { display: flex !important; } .mobile-toggle { display: none !important; } }
             `}</style>
            <button 
              onClick={() => navigate('/auth?mode=login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                fontWeight: '900', 
                cursor: 'pointer', 
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/auth?mode=register')}
              style={{ 
                backgroundColor: 'var(--color-secondary)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '12px', 
                border: 'none', 
                fontWeight: '900', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <button 
              onClick={() => navigate('/auth?mode=login')}
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-secondary)', border: 'none', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '700' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/auth?mode=register')}
              style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '800' }}
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main style={{ paddingTop: '160px', paddingBottom: '100px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          {/* Badge */}
          <div className="float-animation" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: '100px',
            marginBottom: '2rem',
            border: '1px solid var(--color-primary)',
          }}>
            <Sparkles size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Built for Modern Events
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: '900',
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: '1.5rem',
            animation: 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both'
          }}>
            Organize Events That <br />
            <span style={{ color: 'var(--color-primary)' }}>Scale Perfectly.</span>
          </h1>

          {/* Desc */}
          <p style={{
            maxWidth: '700px',
            margin: '0 auto 3rem',
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            fontWeight: '500',
            animation: 'slideInUp 0.8s ease-out 0.2s both'
          }}>
            The all-in-one solution for professional event organizers in India. 
            Manage registration, collect payments, and sync with attendees in real-time.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            animation: 'slideInUp 0.8s ease-out 0.3s both'
          }}>
            <button 
              onClick={() => navigate('/auth?mode=register')}
              style={{
                padding: '1.25rem 2.5rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '900',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 25px var(--color-primary-glow)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px var(--color-primary-glow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px var(--color-primary-glow)'; }}
            >
              Start Organizing Free <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              style={{
                padding: '1.25rem 2.5rem',
                backgroundColor: 'white',
                color: 'var(--text-primary)',
                fontSize: '1.125rem',
                fontWeight: '800',
                borderRadius: '16px',
                border: '2px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <Play size={20} fill="currentColor" /> Watch Quick Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section style={{ padding: '100px 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Professional Suite</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Comprehensive tools built for excellence.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {features.map((f, i) => (
              <div 
                key={i}
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem',
                  borderRadius: '24px',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  animation: `slideInUp 0.6s ease-out ${0.1 * i}s both`
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ 
                  width: '3.5rem', 
                  height: '3.5rem', 
                  backgroundColor: 'var(--color-primary-light)', 
                  color: 'var(--color-primary)', 
                  borderRadius: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: '500' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-secondary)', color: 'white', padding: '100px 1.5rem 50px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem', marginBottom: '80px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--color-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>C</div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>CROWZA</span>
              </div>
              <p style={{ maxWidth: '300px', opacity: 0.7, lineHeight: 1.6 }}>The professional choice for creating, managing, and scaling your events across India.</p>
            </div>
            <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1.5rem' }}>Product</h4>
                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Security</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1.5rem' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li>About Us</li>
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', textAlign: 'center', opacity: 0.5, fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} CROWZA Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Premium 'Coming Soon' Modal */}
      {showDemoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setShowDemoModal(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            }}
          />
          
          {/* Modal Content */}
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '480px',
            borderRadius: '32px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color)',
            animation: 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <button 
              onClick={() => setShowDemoModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--bg-secondary)',
                border: 'none',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={20} />
            </button>
            
            <div style={{
              width: '5rem',
              height: '5rem',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              margin: '0 auto 2rem',
              animation: 'pulse-slow 2s infinite'
            }}>
              <Play size={32} fill="currentColor" />
            </div>
            
            <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Coming Very Soon
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: '500' }}>
              We're putting the final touches on the interactive demo. It will be available for exploration in the next 24 hours.
            </p>
            
            <button 
              onClick={() => setShowDemoModal(false)}
              style={{
                width: '100%',
                padding: '1.25rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: '16px',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 10px 20px var(--color-primary-glow)'
              }}
            >
              I'll check back later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
