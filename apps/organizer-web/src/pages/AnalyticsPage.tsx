import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Target, 
  Download, 
  ArrowUpRight,
  UserX,
  IndianRupee,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface EventAnalytics {
  eventId: string;
  title: string;
  registrations: number;
  attended: number;
  noShows: number;
  capacity: number;
  attendanceRate: number;
  revenue: number;
}

const AnalyticsPage: React.FC = () => {
  const [events] = useState<EventAnalytics[]>([
    {
      eventId: '1',
      title: 'Summer Music Festival',
      registrations: 450,
      attended: 420,
      noShows: 30,
      capacity: 500,
      attendanceRate: 93,
      revenue: 12594.00
    },
    {
      eventId: '2',
      title: 'Tech Conference 2024',
      registrations: 250,
      attended: 0,
      noShows: 0,
      capacity: 1000,
      attendanceRate: 0,
      revenue: 0
    },
    {
      eventId: '3',
      title: 'Networking Brunch',
      registrations: 125,
      attended: 115,
      noShows: 10,
      capacity: 150,
      attendanceRate: 92,
      revenue: 6248.75
    }
  ]);

  const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);
  const totalAttended = events.reduce((sum, e) => sum + e.attended, 0);
  const totalNoShows = events.reduce((sum, e) => sum + e.noShows, 0);
  const avgAttendanceRate = (events.reduce((sum, e) => sum + e.attendanceRate, 0) / events.length).toFixed(1);
  const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .kpi-card { transition: all 0.3s ease; }
        .kpi-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--color-primary); }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ 
          width: '3.5rem', 
          height: '3.5rem', 
          backgroundColor: 'var(--color-primary-light)', 
          color: 'var(--color-primary)', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 8px 16px var(--color-primary-glow)'
        }}>
          <BarChart3 size={28} />
        </div>
        <div>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.04em'
          }}>
            Analytics & Insights
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Live Mission Sync Active • Real-time performance metrics
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Registrations', value: totalRegistrations.toLocaleString(), sub: 'Across 3 events', icon: <Users size={20} />, color: 'var(--color-primary)' },
          { label: 'Total Attended', value: totalAttended.toLocaleString(), sub: 'Active participants', icon: <CheckCircle2 size={20} />, color: 'var(--color-success)' },
          { label: 'No Shows', value: totalNoShows.toLocaleString(), sub: 'Registration drop-off', icon: <UserX size={20} />, color: 'var(--color-error)' },
          { label: 'Attendance Rate', value: `${avgAttendanceRate}%`, sub: 'Average performance', icon: <TrendingUp size={20} />, color: 'var(--color-secondary)' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, sub: 'Gross earnings', icon: <IndianRupee size={20} />, color: 'var(--color-primary)' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            className="kpi-card"
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid var(--border-color)', 
              borderRadius: '28px', 
              padding: '2rem',
              animation: `slideInUp 0.6s ease-out ${0.1 * i}s both`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: `${kpi.color}15`, 
                color: kpi.color, 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                 {kpi.icon}
              </div>
              <Sparkles size={16} color="var(--border-color)" />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {kpi.label}
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {kpi.value}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Event Analytics Table */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        border: '1px solid var(--border-color)', 
        borderRadius: '32px', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow-md)',
        animation: 'slideInUp 0.8s ease-out 0.4s both'
      }}>
        <div style={{ padding: '1.75rem 2.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Event Performance Analysis
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Details</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registrations</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attended</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance Rate</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={event.eventId} style={{ borderBottom: idx < events.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{event.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>ID: #{event.eventId}</div>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '800', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                    {event.registrations.toLocaleString()}
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '700', color: 'var(--color-success)', fontSize: '1.1rem' }}>
                    {event.attended.toLocaleString()}
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: event.attendanceRate > 75 ? 'var(--color-success)' : 'var(--color-warning)', width: `${event.attendanceRate}%`, borderRadius: '100px' }} />
                      </div>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{event.attendanceRate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                    ₹{event.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analysis Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem', animation: 'slideInUp 0.8s ease-out 0.6s both' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
           <h3 style={{ fontSize: '1.125rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Zap size={20} color="var(--color-primary)" /> Attendance Flow
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {[
               { label: 'Total Registered', value: totalRegistrations, color: 'var(--color-primary)' },
               { label: 'Actually Attended', value: totalAttended, color: 'var(--color-success)' },
               { label: 'Unchecked / No-Show', value: totalNoShows, color: 'var(--color-error)' }
             ].map((item, i) => (
               <div key={i}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                   <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{item.label}</span>
                   <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)' }}>{item.value.toLocaleString()}</span>
                 </div>
                 <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: item.color, width: `${(item.value / totalRegistrations) * 100}%`, borderRadius: '100px', transition: 'width 1s ease-out' }} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-secondary)', borderRadius: '32px', padding: '2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Analytics Export</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: '500' }}>Download high-resolution reports for your stakeholders. Data includes attendee lists, revenue breakdown, and check-in times.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Download size={18} /> Download CSV
              </button>
              <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <FileText size={18} /> Detailed PDF
              </button>
            </div>
          </div>
          <BarChart3 size={200} style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.05, transform: 'rotate(-10deg)' }} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
