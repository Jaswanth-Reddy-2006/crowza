import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Dynamic Background Element */}
      <div className="ambient-glow glow-1 animate-pulse-slow"></div>
      <div className="ambient-glow glow-2 animate-float"></div>

      {/* Navigation Bar */}
      <nav className="nav-container container flex justify-between items-center">
        <div className="nav-logo flex items-center gap-2">
          <div className="logo-icon"></div>
          <h2>CROWZA</h2>
        </div>
        <div className="nav-actions flex gap-4">
          <button className="btn btn-outline" onClick={() => navigate('/auth?mode=login')}>SIGN IN</button>
          <button className="btn btn-primary" onClick={() => navigate('/auth?mode=register')}>REGISTER EVENT</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-container container flex-col items-center text-center mt-8 gap-6 animate-fade-in">
        <div className="badge-pill mb-4">
          <span className="dot bg-primary"></span>
          <span className="text-secondary text-sm font-semibold tracking-wide">ORGANIZER COMMAND CENTER</span>
        </div>
        
        <h1 className="hero-title">
          Master Your Venue.<br />
          <span className="text-gradient">Real-Time Intelligence.</span>
        </h1>
        
        <p className="hero-subtitle text-secondary-color max-w-2xl mx-auto">
          Deploy the ultimate command center for your next major event. Monitor incident heatmaps, 
          manage crowd flow capacities natively, and dispatch staff instantly natively from the command bridge.
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <button className="btn btn-primary btn-large" onClick={() => navigate('/auth?mode=register')}>
            INITIALIZE PLATFORM
          </button>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="container mt-8 grid-features animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="card-glass flex-col gap-4">
          <div className="feature-icon text-primary">Radar</div>
          <h3>Live Telemetry</h3>
          <p className="text-muted">Monitor venue-wide occupancy levels and queue durations with real-time hardware integrations.</p>
        </div>
        
        <div className="card-glass flex-col gap-4">
          <div className="feature-icon text-error">Rapid Response</div>
          <h3>Incident Dispatch</h3>
          <p className="text-muted">Instantly identify anomalies, assign security workflows, and track resolution metrics on the fly.</p>
        </div>

        <div className="card-glass flex-col gap-4">
          <div className="feature-icon text-secondary">Control Matrix</div>
          <h3>Role Governance</h3>
          <p className="text-muted">Maintain secure delegation across Attendee, Operator, and Event Manager permissions securely.</p>
        </div>
      </section>

      {/* Embedded CSS specific to landing page layout to supplement index.css */}
      <style dangerouslySetInnerHTML={{__html: `
        .landing-wrapper {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding-bottom: 80px;
        }
        
        .ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: -1;
          opacity: 0.5;
        }
        
        .glow-1 {
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: var(--color-secondary-glow);
        }
        
        .glow-2 {
          bottom: -200px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: var(--color-primary-glow);
        }

        .nav-container {
          height: 90px;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
          box-shadow: 0 0 15px var(--color-secondary-glow);
        }

        .nav-logo h2 {
          letter-spacing: 4px;
          font-weight: 800;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary-glow);
        }

        .hero-title {
          font-size: 5rem;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.8;
          margin-bottom: 40px;
        }

        .btn-large {
          padding: 16px 36px;
          font-size: 1.125rem;
        }

        .grid-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-top: 100px;
        }

        .feature-icon {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .mx-auto { margin-left: auto; margin-right: auto; }
        .max-w-2xl { max-width: 800px; }
        .tracking-wide { letter-spacing: 2px; }
        .text-sm { font-size: 0.875rem; }
      `}} />
    </div>
  );
};

export default LandingPage;
