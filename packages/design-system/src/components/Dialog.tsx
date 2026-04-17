import React from 'react';

export const Dialog: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => (isOpen ? <div className="dialog-overlay"><div className="dialog-content">{children}</div></div> : null);
