import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface ChipProps {
  label: string;
  style?: ViewStyle | ViewStyle[];
  color?: string;
  variant?: 'filled' | 'outlined';
}

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  style, 
  color = theme.colors.primary,
  variant = 'outlined' 
}) => {
  const isOutlined = variant === 'outlined';
  
  return (
    <View style={[
      styles.chip,
      isOutlined ? { borderColor: color, borderWidth: 1 } : { backgroundColor: color },
      style
    ]}>
      <Typography 
        variant="labelSmall" 
        color={isOutlined ? color : theme.colors.onPrimary}
        weight="700"
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
