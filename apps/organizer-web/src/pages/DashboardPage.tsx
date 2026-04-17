import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../index.css';

interface EventData {
  id?: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_id: string;
}

const VENUE_SERVICE_URL = 'http://localhost:3004';

const DashboardPage = () => {
  const { user, logoutProvider } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    name: '',
    date: '',
    start_time: '',
    end_time: '',
    venue_id: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Typically pass auth token in headers
      const res = await axios.get(`${VENUE_SERVICE_URL}/events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('crowza_organizer_token')}` }
      });
      if (res.data?.status === 'success') {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${VENUE_SERVICE_URL}/events`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('crowza_organizer_token')}` }
      });
      setShowCreateForm(false);
      setFormData({ name: '', date: '', start_time: '', end_time: '', venue_id: '' });
      fetchEvents(); // Refresh list
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('Error creating event. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="nav-container container flex justify-between items-center">
        <div className="nav-logo flex items-center gap-2">
          <div className="logo-icon small"></div>
          <h4>COMMANDER DECK</h4>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-secondary font-semibold text-sm">
            {user?.displayName || user?.email} | {user?.role.toUpperCase()}
          </span>
          <button className="btn btn-outline text-sm" onClick={logoutProvider}>LOGOUT</button>
        </div>
      </nav>

      <main className="container mt-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1>Active Operations</h1>
            <p className="text-muted mt-2">Manage all registered events and deployments.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'CANCEL DEPLOYMENT' : 'DEPLOY NEW EVENT'}
          </button>
        </div>

        {showCreateForm && (
          <div className="card-glass mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 className="mb-4 text-primary">Initialize New Event Container</h3>
            <form onSubmit={handleCreateEvent} className="grid-form">
              <div className="input-group">
                <label className="input-label">Event Name</label>
                <input type="text" className="input-field" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="E.g. Neon Nights 2026" />
              </div>
              <div className="input-group">
                <label className="input-label">Deploy Date</label>
                <input type="date" className="input-field" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Time</label>
                <input type="time" className="input-field" required value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">End Time</label>
                <input type="time" className="input-field" required value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Target Venue ID</label>
                <input type="text" className="input-field" required value={formData.venue_id} onChange={(e) => setFormData({...formData, venue_id: e.target.value})} placeholder="venue-uid-1234" />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                 <button type="submit" className="btn btn-primary" disabled={loading}>
                   {loading ? 'DEPLOYING...' : 'CONFIRM DEPLOYMENT'}
                 </button>
              </div>
            </form>
          </div>
        )}

        <div className="events-grid">
          {events.length === 0 ? (
            <div className="empty-state text-center card-glass">
              <p className="text-muted">No active operations found. Deploy an event to begin.</p>
            </div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="card-glass event-card flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="badge-pill-sm text-primary border-primary">LIVE</span>
                     <span className="text-muted text-sm">{evt.venue_id}</span>
                  </div>
                  <h3 className="mb-2">{evt.name}</h3>
                  <p className="text-secondary text-sm font-semibold">{evt.date}</p>
                  <p className="text-muted text-sm">{evt.start_time} - {evt.end_time}</p>
                </div>
                <button className="btn btn-outline mt-4 w-full">ENTER COMMAND HUB</button>
              </div>
            ))
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-wrapper {
          min-height: 100vh;
        }

        .logo-icon.small {
          width: 16px;
          height: 16px;
        }

        .grid-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 24px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .badge-pill-sm {
          padding: 4px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 100px;
          border: 1px solid var(--color-primary);
          background: rgba(0, 230, 118, 0.1);
        }

        .w-full { width: 100%; }
        .empty-state { padding: 64px 24px; grid-column: 1 / -1; }
      `}} />
    </div>
  );
};

export default DashboardPage;
