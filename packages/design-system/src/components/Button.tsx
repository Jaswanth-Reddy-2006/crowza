import React from 'react';

interface ButtonProps {
  label: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onPress, type = 'primary', disabled }) => {
  return (
    <button onClick={onPress} disabled={disabled} className={`btn btn-${type}`}>
      {label}
    </button>
  );
};
