import React, { useState } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Plus, 
  Settings,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Download,
  MoreVertical,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';

interface Payment {
  id: string;
  eventTitle: string;
  date: string;
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
}

const PaymentsPage: React.FC = () => {
  const [payments] = useState<Payment[]>([
    {
      id: 'PAY001',
      eventTitle: 'Summer Music Festival',
      date: '2024-06-15',
      amount: 450.00,
      fee: 99.99,
      status: 'completed',
      paymentMethod: 'Card'
    },
    {
      id: 'PAY002',
      eventTitle: 'Tech Conference 2024',
      date: '2024-07-20',
      amount: 0,
      fee: 199.99,
      status: 'pending',
      paymentMethod: 'Card'
    },
    {
      id: 'PAY003',
      eventTitle: 'Networking Brunch',
      date: '2024-05-10',
      amount: 6248.75,
      fee: 49.99,
      status: 'completed',
      paymentMethod: 'UPI'
    }
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          bg: 'var(--color-success)15', 
          text: 'var(--color-success)', 
          border: 'var(--color-success)30',
          icon: <CheckCircle2 size={14} />
        };
      case 'pending':
        return { 
          bg: 'var(--color-warning)15', 
          text: 'var(--color-warning)', 
          border: 'var(--color-warning)30',
          icon: <Clock size={14} />
        };
      case 'failed':
        return { 
          bg: 'var(--color-error)15', 
          text: 'var(--color-error)', 
          border: 'var(--color-error)30',
          icon: <AlertCircle size={14} />
        };
      default:
        return { 
          bg: 'var(--bg-tertiary)', 
          text: 'var(--text-tertiary)', 
          border: 'var(--border-color)',
          icon: <Clock size={14} />
        };
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payments.reduce((sum, p) => sum + p.fee, 0);
  const netEarnings = totalRevenue - totalFees;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .payment-card { transition: all 0.3s ease; }
        .payment-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--color-primary); }
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
          <CreditCard size={28} />
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
            Payments & Earnings
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Billing Terminal Active • Manage payouts and billing history
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Gross Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'var(--color-success)', icon: <TrendingUp size={20} /> },
          { label: 'Platform Fees', value: `₹${totalFees.toLocaleString()}`, color: 'var(--color-error)', icon: <IndianRupee size={20} /> },
          { label: 'Net Earnings', value: `₹${netEarnings.toLocaleString()}`, color: 'var(--color-primary)', icon: <Zap size={20} /> }
        ].map((stat, i) => (
          <div key={i} className="payment-card" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '28px', padding: '2rem', animation: `slideInUp 0.6s ease-out ${0.1 * i}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justify_content: 'center' }}>
                {stat.icon}
              </div>
              <Sparkles size={16} color="var(--border-color)" />
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', animation: 'slideInUp 0.8s ease-out 0.4s both' }}>
        <div style={{ padding: '1.75rem 2.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Transaction History</h3>
          </div>
          <button style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Export All
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Payment ID</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Source Event</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => {
                const style = getStatusStyle(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: idx < payments.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{p.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>{new Date(p.date).toLocaleDateString()} via {p.paymentMethod}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{p.eventTitle}</td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.1rem' }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                      <div style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}`, padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {style.icon} {p.status}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                      <button style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                        Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Methods Section */}
      <div style={{ marginTop: '4rem', animation: 'slideInUp 0.8s ease-out 0.6s both' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Settings size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Payout Destination</h3>
         </div>
         
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
           <div style={{ backgroundColor: 'white', border: '2px solid var(--color-primary)', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 12px 24px var(--color-primary-glow)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                   <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justify_content: 'center' }}>
                      <ShieldCheck size={28} />
                   </div>
                   <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase' }}>Primary</div>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Bank Transfer (NEFT/IMPS)</h4>
                <p style={{ color: 'var(--text-tertiary)', fontWeight: '600', marginBottom: '2rem' }}>HDFC Bank •••• 9012</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>Edit Account</button>
                  <button style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '16px', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                </div>
              </div>
              <IndianRupee size={150} style={{ position: 'absolute', bottom: '-30px', right: '-30px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
           </div>

           <div style={{ border: '3px dashed var(--border-color)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '3rem', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify_content: 'center' }}>
                <Plus size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Add Payout Method</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>UPI, Bank Account, or Wallet</p>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
