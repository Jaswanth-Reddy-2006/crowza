import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import CreateEventPage from './CreateEventPage';
import MyEventsPage from './MyEventsPage';
import AnalyticsPage from './AnalyticsPage';
import PaymentsPage from './PaymentsPage';
import ProfilePage from './ProfilePage';
import StaffManagementPage from './StaffManagementPage';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  CreditCard, 
  User as UserIcon, 
  PlusCircle, 
  LogOut, 
  MoreVertical, 
  Bell,
  Settings,
  Circle,
  Users,
  ShieldCheck,
  ArrowRight,
  Key,
  MapPin
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'cancelled';
  attendees: number;
  views: number;
  ticketPrice?: number;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewingEventId, setViewingEventId] = useState<string | null>(null);

  const events: Event[] = [
    { id: 'ev-1', title: 'Tech Pulse Summit 2026', date: '2026-05-15', status: 'approved', attendees: 1250, views: 5400, ticketPrice: 199 },
    { id: 'ev-2', title: 'Global Music Festival', date: '2026-06-20', status: 'active', attendees: 8400, views: 22000, ticketPrice: 450 },
    { id: 'ev-3', title: 'Startup Pitch Arena', date: '2026-07-10', status: 'draft', attendees: 0, views: 120, ticketPrice: 0 }
  ];

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalViews = events.reduce((sum, e) => sum + e.views, 0);
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'staff', label: 'Staff Suite', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  const renderOverviewContent = () => (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--color-primary-light); }
      `}</style>

      {/* Hero Welcome */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            marginBottom: '0.75rem',
            letterSpacing: '-1px'
          }}>
            Hello {user?.name?.split(' ')[0] || 'Organizer'}!
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '500px' }}>
            Ready to lead your next big event? Here is your operational pulse.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button 
             onClick={() => setShowCreateModal(true)}
             style={{ padding: '0.85rem 1.5rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '14px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', boxShadow: '0 8px 16px var(--color-primary-glow)' }}
           >
             <PlusCircle size={20} fill="rgba(255,255,255,0.2)" /> Create New Event
           </button>
        </div>
      </div>

      {/* High Fidelity Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.75rem', 
        marginBottom: '3rem' 
      }}>
        {[
          { label: 'Total Events', val: totalEvents, sub: `${activeEvents} active now`, icon: Calendar, color: 'var(--color-primary)' },
          { label: 'Total Views', val: totalViews.toLocaleString(), sub: 'Platform footprint', icon: BarChart3, color: 'var(--color-secondary)' },
          { label: 'Live Attendees', val: totalAttendees.toLocaleString(), sub: 'Checked-in guests', icon: Users, color: '#10B981' },
          { label: 'Staff Available', val: '12', sub: 'Ready for deployment', icon: ShieldCheck, color: '#7C3AED' }
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ 
            backgroundColor: 'white', 
            border: '1px solid var(--border-color)', 
            borderRadius: '24px', 
            padding: '2rem', 
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', backgroundColor: `${stat.color}05`, borderRadius: '50%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
               <div style={{ width: '48px', height: '48px', backgroundColor: `${stat.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                 <stat.icon size={24} />
               </div>
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{stat.val}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left: Events */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={20} color="var(--color-primary)" /> Operational Timeline
          </h3>
          {events.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '28px', 
              padding: '5rem 2rem', 
              textAlign: 'center', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              backgroundImage: 'radial-gradient(circle at 50% 120%, var(--bg-secondary) 0%, white 100%)'
            }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-secondary)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                <Calendar size={48} strokeWidth={1} />
              </div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>No Launch Pad Activity</h4>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '340px', lineHeight: 1.6, fontWeight: '500' }}>
                You haven't initialized any events. Start by generating a new workspace for your upcoming performance.
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                style={{ padding: '0.9rem 2rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '16px', fontWeight: '800', color: 'white', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 20px var(--color-primary-glow)' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Assemble Event
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Event Details</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Impact</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: '1px solid var(--bg-secondary)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{ev.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{ev.date}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          fontSize: '0.75rem', 
                          fontWeight: '800', 
                          backgroundColor: ev.status === 'active' ? '#ECFDF5' : ev.status === 'approved' ? '#EFF6FF' : '#F9FAFB',
                          color: ev.status === 'active' ? '#059669' : ev.status === 'approved' ? '#2563EB' : 'var(--text-tertiary)',
                          textTransform: 'uppercase'
                        }}>
                          {ev.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{ev.attendees.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Attendees</div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => { setViewingEventId(ev.id); setActiveTab('staff'); }}
                          style={{ 
                            padding: '0.6rem 1.25rem', 
                            backgroundColor: 'var(--color-primary-light)', 
                            color: 'var(--color-primary)', 
                            border: 'none', 
                            borderRadius: '10px', 
                            fontWeight: '800', 
                            fontSize: '0.85rem', 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          View Suite <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Quick Actions / Staff Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-secondary)', borderRadius: '28px', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
               <ShieldCheck size={120} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '1rem' }}>Staff Readiness</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.5 }}>
              Your personnel are synced and ready for deployment. Access advanced monitoring in the Staff Suite.
            </p>
            <button 
              onClick={() => setActiveTab('staff')}
              style={{ width: '100%', padding: '0.85rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Enter Command Center <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '28px', padding: '1.75rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Operational Shortcuts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Issue Access Keys', icon: Key },
                  { label: 'Floor Plan Editor', icon: MapPin },
                  { label: 'Broadcast Message', icon: Bell },
                  { label: 'Audit Log', icon: ShieldCheck }
                ].map((action, i) => (
                  <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', width: '100%', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ color: 'var(--color-primary)' }}><action.icon size={18} /></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{action.label}</span>
                  </button>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navigation Header */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)', 
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)' 
      }}>
        <style>{`
          @media (max-width: 1024px) {
            .nav-links-desktop { display: none !important; }
          }
          @media (min-width: 1025px) {
            .hamburger-menu { display: none !important; }
          }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          .nav-tab-active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 3px;
            backgroundColor: var(--color-primary);
            borderRadius: 10px;
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
        
        <div style={{ 
          width: '100%', 
          padding: '0 2rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '56px' 
        }}>
          {/* Left: Logo */}
          <div onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Logo size="sm" />
          </div>

          {/* Right: Nav + Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Nav Links */}
            <div className="nav-links-desktop" style={{ display: 'flex', gap: '0.25rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.85rem',
                    backgroundColor: activeTab === tab.id ? 'var(--color-primary-light)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    position: 'relative'
                  }}
                  className={activeTab === tab.id ? 'nav-tab-active' : ''}
                  onMouseEnter={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                  onMouseLeave={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Actions & Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--text-primary)' }}>{user?.name || 'Organizer'}</span>
              </div>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '12px', 
                  backgroundColor: 'var(--color-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                {user?.name?.charAt(0) || 'O'}
              </div>
            </div>

            {/* Hamburger (Mobile) */}
            <button 
              className="hamburger-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-glow)',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}
            >
              <MoreVertical size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Navigation</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '1rem',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content - Add top padding for fixed header */}
      <div style={{ paddingTop: '56px' }}>
        {showCreateModal ? (
          <CreateEventPage onClose={() => setShowCreateModal(false)} />
        ) : (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>
            {/* Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Dashboard</span>
              <span>/</span>
              <span style={{ fontWeight: '700', color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                {tabs.find(t => t.id === activeTab)?.label || 'Overview'}
              </span>
            </div>

            {/* Page Title Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                fontWeight: '900', 
                color: 'var(--text-primary)', 
                margin: '0 0 0.5rem 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-1px'
              }}>
                {tabs.find(t => t.id === activeTab)?.label || 'Overview'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                {activeTab === 'overview' && 'Manage and track your events'}
                {activeTab === 'events' && 'View and manage all your events'}
                {activeTab === 'analytics' && 'Analyze event performance'}
                {activeTab === 'payments' && 'Track payments and revenue'}
                {activeTab === 'profile' && 'Update your profile information'}
              </p>
            </div>

            {/* Content */}
            { activeTab === 'overview' && renderOverviewContent()}
            { activeTab === 'events' && (
              <MyEventsPage 
                onEditEvent={(id) => console.log('Edit:', id)} 
                onViewEvent={(id) => { setViewingEventId(id); setActiveTab('staff'); }}
              />
            )}
            { activeTab === 'staff' && <StaffManagementPage eventId={viewingEventId} onBack={() => { setViewingEventId(null); setActiveTab('overview'); }} />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'payments' && <PaymentsPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
