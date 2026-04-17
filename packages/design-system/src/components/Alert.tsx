import React from 'react';

export const Alert: React.FC<{ message: string; type: 'info' | 'warning' | 'error' }> = ({
  message,
  type,
}) => <div className={`alert alert-${type}`}>{message}</div>;
