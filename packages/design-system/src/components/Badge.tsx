import React from 'react';

export const Badge: React.FC<{ label: string; color?: string }> = ({ label, color }) => (
  <span className="badge" style={{ backgroundColor: color }}>
    {label}
  </span>
);
