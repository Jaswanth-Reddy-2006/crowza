import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', color = 'var(--color-primary)', showText = true }) => {
  const sizes = {
    sm: { box: '2rem', font: '1rem', icon: 16 },
    md: { box: '2.5rem', font: '1.25rem', icon: 20 },
    lg: { box: '3.5rem', font: '1.75rem', icon: 28 }
  };

  const current = sizes[size];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <div style={{
        width: current.box,
        height: current.box,
        backgroundColor: color,
        borderRadius: size === 'lg' ? '16px' : '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: `0 4px 12px ${color === 'var(--color-primary)' ? 'var(--color-primary-glow)' : 'rgba(0,0,0,0.1)'}`,
        flexShrink: 0
      }}>
        <Sparkles size={current.icon} fill="currentColor" />
      </div>
      {showText && (
        <span style={{ 
          fontSize: current.font, 
          fontWeight: '900', 
          color: 'inherit', 
          letterSpacing: '-0.04em',
          fontFamily: "'Inter', sans-serif"
        }}>
          CROWZA
        </span>
      )}
    </div>
  );
};

export default Logo;
