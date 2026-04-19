import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';
import { Typography } from './Typography';

interface SignatureButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
  icon?: string;
}

export const SignatureButton: React.FC<SignatureButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  disabled = false,
  icon,
}) => {
  const height = size === 'small' ? 40 : size === 'large' ? 64 : 56;
  const containerStyle: any[] = [styles.container, { height }, style];

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        style={[containerStyle, { 
          backgroundColor: disabled ? theme.colors.outlineVariant : theme.colors.primary, 
          alignItems: 'center', 
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        }]}
      >
        <Typography variant="bodyLarge" color={theme.colors.onPrimary} style={styles.label}>
          {label.toUpperCase()}
        </Typography>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        style={[
          ...containerStyle, 
          styles.secondaryContainer, 
          { borderColor: `${theme.colors.outline}26`, opacity: disabled ? 0.4 : 1 },
        ]}
      >
        <Typography variant="bodyLarge" color={theme.colors.secondary} style={styles.label}>
          {label}
        </Typography>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.tertiaryContainer, { height: 'auto' }, style]}>
      <Typography variant="bodyLarge" color={theme.colors.tertiary} style={styles.label}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: theme.roundness,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    alignItems: 'center',
  },
  tertiaryContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
  },
});
