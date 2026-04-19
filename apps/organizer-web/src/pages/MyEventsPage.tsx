import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateEventPage from './CreateEventPage';
import { getOrganizerEvents } from '../services/api';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  Edit3,
  Search,
  Filter,
  PlusCircle
} from 'lucide-react';

interface MyEventsPageProps {
  onEditEvent?: (eventId: string) => void;
  onViewEvent?: (eventId: string) => void;
}

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'completed';
  attendees: number;
  capacity: number;
  ticketPrice?: number;
  fee: number;
  views?: number;
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    date: '2024-06-15',
    status: 'active',
    attendees: 450,
    capacity: 500,
    ticketPrice: 29.99,
    fee: 99.99,
    views: 1250
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    date: '2024-07-20',
    status: 'approved',
    attendees: 0,
    capacity: 1000,
    fee: 199.99,
    views: 320
  },
  {
    id: '3',
    title: 'Networking Brunch',
    date: '2024-05-10',
    status: 'completed',
    attendees: 115,
    capacity: 150,
    ticketPrice: 0,
    fee: 49.99,
    views: 180
  }
];

const MyEventsPage: React.FC<MyEventsPageProps> = ({ onEditEvent, onViewEvent }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const result = await getOrganizerEvents(user.uid);
        if (result.success && result.data) {
          // Map backend event format to local Event interface
          const mappedEvents: Event[] = (result.data as any[]).map((evt: any) => ({
            id: evt.id,
            title: evt.title,
            date: evt.eventDate,
            status: evt.status || 'pending',
            attendees: evt.attended || 0,
            capacity: evt.maxCapacity || 0,
            ticketPrice: evt.ticketPrice,
            fee: evt.fee || 0,
            views: evt.views || 0
          }));
          setEvents(mappedEvents);
        } else {
          setError(result.error || 'Failed to load events');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.uid]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)', border: 'var(--color-primary)' };
      case 'approved':
        return { bg: 'var(--color-success-light)', text: 'var(--color-success-dark)', border: 'var(--color-success)' };
      case 'pending':
        return { bg: 'var(--color-warning-light)', text: 'var(--color-warning-dark)', border: 'var(--color-warning)' };
      case 'draft':
        return { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
      case 'completed':
        return { bg: 'var(--bg-secondary)', text: 'var(--text-tertiary)', border: 'var(--border-color)' };
      default:
        return { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header with Create Event Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            backgroundColor: 'var(--color-primary-light)', 
            color: 'var(--color-primary)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Calendar size={20} strokeWidth={1.5} />
          </div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            margin: 0
          }}>
            My Events
          </h2>
        </div>
        
        {!showCreateModal && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <PlusCircle size={16} strokeWidth={2} />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {showCreateModal && (
        <div style={{ marginBottom: '2.5rem' }}>
          <CreateEventPage onClose={() => setShowCreateModal(false)} />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6B7280' }}>Loading your events...</p>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'var(--color-error-light)', border: '1px solid var(--color-error-border)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--color-error-dark)' }}>Error: {error}</p>
        </div>
      )}

      {!loading && events.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#9CA3AF' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>No events yet.</p>
          <p>Create your first event to get started!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(300px, 100%, 380px), 1fr))', gap: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
        {events.map((event) => {
          const colors = getStatusColor(event.status);
          const occupancyPercent = (event.attendees / event.capacity) * 100;

          return (
            <div
              key={event.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2rem',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                animation: 'slideIn 0.5s ease-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onClick={() => onEditEvent?.(event.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: '900', color: '#1C1C1E', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: '1.3' }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', color: '#6B7280', fontWeight: '700' }}>
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
                    fontWeight: '800',
                    textTransform: 'capitalize',
                    border: `2px solid ${colors.border}`,
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                >
                  {event.status}
                </div>
              </div>

              {/* Occupancy Progress */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)', marginBottom: '0.75rem', color: '#6B7280', fontWeight: '700' }}>
                  <span>Occupancy</span>
                  <span>{event.attendees}/{event.capacity}</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--color-primary)',
                      width: `${occupancyPercent}%`,
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 0 8px var(--color-primary-glow)'
                    }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1.5px solid #E5E7EB' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Views</p>
                  <p style={{ fontSize: 'clamp(1.4rem, 2vw, 1.7rem)', fontWeight: '900', color: '#1C1C1E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{event.views || 0}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Fee</p>
                  <p style={{ fontSize: 'clamp(1.4rem, 2vw, 1.7rem)', fontWeight: '900', color: '#1C1C1E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{event.fee}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button
                  style={{
                    flex: 1,
                    padding: 'clamp(0.8rem, 1.2vw, 1rem) 1.25rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    fontWeight: '900',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: '0 6px 16px var(--color-primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px var(--color-primary-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 16px var(--color-primary-glow)';
                  }}
                >
                  <Edit3 size={18} strokeWidth={2} />
                  <span>Edit</span>
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: 'clamp(0.8rem, 1.2vw, 1rem) 1.25rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewEvent?.(event.id);
                  }}
                >
                  <ExternalLink size={18} strokeWidth={2} />
                  <span>View</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && !showCreateModal && (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.4 }}>✦</div>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: '900', color: '#1C1C1E', marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No events yet
          </p>
          <p style={{ fontSize: '1.05rem', color: '#6B7280', fontWeight: '700' }}>Create your first event to get started</p>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
