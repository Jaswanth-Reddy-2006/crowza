import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  Key, 
  MoreVertical, 
  Plus, 
  MapPin, 
  Clock, 
  Activity,
  ArrowLeft,
  Settings,
  Eye,
  Trash2,
  Edit3,
  Unlock,
  Circle,
  Share2,
  Zap,
  Cpu,
  TrendingUp,
  Radio,
  X
} from 'lucide-react';

interface StaffHead {
  id: string;
  name: string;
  course: 'SECURITY' | 'SUPPORT' | 'VIP_HOST' | 'MEDIC' | 'TECH';
  status: 'active' | 'offline';
  efficiency: number;
  permissions: string[];
  lastUpdate: string;
}

interface VenueSystem {
  id: string;
  name: string;
  status: 'online' | 'standby' | 'alert';
  load: number;
  capacity: number;
  pulseType: 'heartbeat' | 'wave' | 'static';
}

interface StaffManagementProps {
  eventId: string | null;
  onBack: () => void;
}

const StaffManagementPage: React.FC<StaffManagementProps> = ({ eventId, onBack }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pulseValue, setPulseValue] = useState(94);
  const [copied, setCopied] = useState(false);

  // New Staff State
  const [newStaffName, setNewStaffName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<StaffHead['course']>('SUPPORT');
  const [heads, setHeads] = useState<StaffHead[]>([
    { 
      id: 'OP-011', 
      name: 'Sarah Connor', 
      course: 'SUPPORT', 
      status: 'active', 
      efficiency: 94,
      permissions: ['heatmaps', 'broadcast'],
      lastUpdate: '2s ago'
    },
    { 
      id: 'OP-422', 
      name: 'Marcus Wright', 
      course: 'SECURITY', 
      status: 'active', 
      efficiency: 88,
      permissions: ['heatmaps', 'emergency'],
      lastUpdate: '5s ago'
    },
    { 
      id: 'OP-883', 
      name: 'Elena Fisher', 
      course: 'TECH', 
      status: 'active', 
      efficiency: 99,
      permissions: ['broadcast', 'emergency'],
      lastUpdate: 'Just now'
    }
  ]);

  // Live Pulse Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseValue(prev => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        return Math.min(100, Math.max(85, prev + diff));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    if (!newStaffName.trim()) return;
    
    const newHead: StaffHead = {
      id: `OP-${Math.floor(Math.random() * 900) + 100}`,
      name: newStaffName,
      course: selectedCourse,
      status: 'active',
      efficiency: 100,
      permissions: ['heatmaps'],
      lastUpdate: 'Just now'
    };

    setHeads([newHead, ...heads]);
    setNewStaffName('');
    setShowAssignModal(false);
  };

  const systems: VenueSystem[] = [
    { id: 'S-01', name: 'Alphanumeric Grid Alpha', status: 'online', load: 450, capacity: 600, pulseType: 'heartbeat' },
    { id: 'S-02', name: 'VIP Bio-Barrier', status: 'online', load: 85, capacity: 150, pulseType: 'wave' },
    { id: 'S-03', name: 'Service Portal Relay', status: 'standby', load: 0, capacity: 50, pulseType: 'static' },
  ];

  const handleShareInvite = () => {
    const missionCode = eventId ? `MISSION-${eventId.toUpperCase()}` : 'MISSION-GLOBAL-ALPHA';
    navigator.clipboard.writeText(missionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCourseStyle = (course: string) => {
    switch(course) {
      case 'SECURITY': return { bg: '#FEE2E2', text: '#EF4444', icon: ShieldAlert };
      case 'SUPPORT': return { bg: '#F0F9FF', text: '#0EA5E9', icon: Radio };
      case 'TECH': return { bg: '#F5F3FF', text: '#8B5CF6', icon: Cpu };
      case 'VIP_HOST': return { bg: '#FFF7ED', text: '#F97316', icon: Zap };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: Circle };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(249, 128, 0, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(249, 128, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(249, 128, 0, 0); } }
        .command-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 32px; padding: 2rem; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .command-card:hover { transform: translateY(-4px); border-color: var(--color-primary); box-shadow: 0 20px 40px rgba(249, 128, 0, 0.1); }
        .live-indicator { animation: pulse-glow 2s infinite; }
        .course-badge { padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.75rem; font-weight: 800; display: flex; alignItems: center; gap: 0.5rem; letter-spacing: 0.05em; }
      `}</style>

      {/* COMMAND HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={onBack}
            style={{ width: '48px', height: '48px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Event Command Center</h2>
              <div className="live-indicator" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>Operational Oversight • Mission: <span style={{ color: 'var(--color-primary)' }}>{eventId ? eventId.toUpperCase() : 'ZULU-PRIME'}</span></p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleShareInvite}
            style={{ padding: '1rem 1.5rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '18px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}
          >
            <Share2 size={18} color={copied ? '#10B981' : 'var(--text-secondary)'} />
            {copied ? 'Mission Code Copied' : 'Share Mission Invite'}
          </button>
          <button 
            onClick={() => setShowAssignModal(true)}
            style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '18px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 20px var(--color-primary-glow)' }}
          >
            <Plus size={20} /> Deploy New Head
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
         {[
           { label: 'NETWORK STATUS', val: 'ENCRYPTED', icon: ShieldCheck, color: '#10B981' },
           { label: 'STAFF PULSE', val: `${pulseValue}%`, icon: Activity, color: '#F98000' },
           { label: 'ACTIVE SECTORS', val: '04', icon: MapPin, color: '#6366F1' },
           { label: 'MISSION TIME', val: '02:44:12', icon: Clock, color: '#8B5CF6' }
         ].map(m => (
           <div key={m.label} className="command-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${m.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                 <m.icon size={24} />
              </div>
              <div>
                 <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{m.label}</p>
                 <p style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{m.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* MAIN CONSOLE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         {/* LEFT: COMMAND HIERARCHY */}
         <div className="command-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={20} color="var(--color-primary)" /> Operational Heads
               </h3>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}>Filter: Course</button>
               </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                     <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>PERSONNEL</th>
                     <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>MISSION COURSE</th>
                     <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>EFFICIENCY</th>
                     <th style={{ textAlign: 'right', padding: '1rem 2rem', fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>OPS</th>
                  </tr>
               </thead>
               <tbody>
                  {heads.map(head => {
                    const style = getCourseStyle(head.course);
                    return (
                      <tr key={head.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                         <td style={{ padding: '1.25rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                               <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: style.bg, color: style.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                                  {head.name.charAt(0)}
                               </div>
                               <div>
                                  <p style={{ fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{head.name}</p>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>UID: {head.id}</p>
                               </div>
                            </div>
                         </td>
                         <td style={{ padding: '1.25rem 2rem' }}>
                            <div className="course-badge" style={{ backgroundColor: style.bg, color: style.text }}>
                               <style.icon size={14} />
                               {head.course}
                            </div>
                         </td>
                         <td style={{ padding: '1.25rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                               <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${head.efficiency}%`, backgroundColor: head.efficiency > 90 ? '#10B981' : '#F98000', borderRadius: '3px' }} />
                               </div>
                               <span style={{ fontSize: '0.75rem', fontWeight: '800', color: head.efficiency > 90 ? '#10B981' : '#F98000' }}>{head.efficiency}%</span>
                            </div>
                         </td>
                         <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                            <button style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                               <MoreVertical size={16} />
                            </button>
                         </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>

         {/* RIGHT: SYSTEM TELEMETRY */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="command-card" style={{ flex: 1 }}>
               <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Cpu size={18} color="var(--color-primary)" /> System Pulse
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {systems.map(sys => (
                    <div key={sys.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '4px', height: '32px', borderRadius: '2px', backgroundColor: sys.status === 'online' ? '#10B981' : '#F98000' }} />
                       <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{sys.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>{sys.status.toUpperCase()} • {sys.load}/{sys.capacity} CAP</p>
                       </div>
                       {sys.pulseType === 'heartbeat' && <Activity size={16} color="#10B981" style={{ animation: 'pulse-glow 1s infinite' }} />}
                    </div>
                  ))}
               </div>
            </div>

            <div className="command-card" style={{ backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <TrendingUp size={24} color="var(--color-primary)" />
                  <p style={{ fontWeight: '900', fontSize: '1.1rem' }}>Real-time Pulse</p>
               </div>
               <p style={{ opacity: 0.7, fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>The overall command hierarchy is operating at peak efficiency. All sector heads are online and reporting secure telemetry.</p>
               <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {[40, 60, 45, 80, 50, 90, 70, 85, 95, 60, 75].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 8 ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
                  ))}
               </div>
            </div>
         </div>
      </div>
      </div>

      {/* DEPLOYMENT MODAL */}
      {showAssignModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 100, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ 
            width: '450px', 
            backgroundColor: 'white', 
            borderRadius: '32px', 
            padding: '2.5rem', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAssignModal(false)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)' }}
            >
              <X size={24} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Deploy Personnel</h3>
            <p style={{ color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '2.5rem' }}>Assign a new tactical head to the mission hierarchy.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Personnel Name</label>
                <input 
                  type="text" 
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Enter full name..."
                  style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: '600', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Mission Course</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {(['SECURITY', 'SUPPORT', 'TECH', 'VIP_HOST'] as const).map(course => (
                    <button
                      key={course}
                      onClick={() => setSelectedCourse(course)}
                      style={{ 
                        padding: '0.75rem', 
                        borderRadius: '12px', 
                        border: '2px solid',
                        borderColor: selectedCourse === course ? 'var(--color-primary)' : 'var(--border-color)',
                        backgroundColor: selectedCourse === course ? 'var(--color-primary-light)' : 'white',
                        color: selectedCourse === course ? 'var(--color-primary)' : 'var(--text-secondary)',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {course.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleDeploy}
                disabled={!newStaffName.trim()}
                style={{ 
                  marginTop: '1rem',
                  width: '100%', 
                  padding: '1.25rem', 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontWeight: '900', 
                  fontSize: '1rem',
                  cursor: 'pointer',
                  opacity: newStaffName.trim() ? 1 : 0.5,
                  boxShadow: '0 10px 20px var(--color-primary-glow)'
                }}
              >
                Execute Deployment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage;
