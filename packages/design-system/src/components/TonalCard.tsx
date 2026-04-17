import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface TonalCardProps {
  children: React.ReactNode;
  variant?: 'low' | 'medium' | 'high' | 'highest';
  style?: ViewStyle;
  dark?: boolean;
}

export const TonalCard: React.FC<TonalCardProps> = ({
  children,
  variant = 'low',
  style,
  dark,
}) => {
  const getBackgroundColor = () => {
    if (dark) {
      switch (variant) {
        case 'medium': return '#1A1A1A';
        case 'high': return '#222222';
        case 'highest': return '#2D2D2D';
        default: return '#121212';
      }
    }

    switch (variant) {
      case 'medium': return theme.colors.surfaceContainer;
      case 'high': return theme.colors.surfaceContainerHigh;
      case 'highest': return theme.colors.surfaceContainerHighest;
      default: return theme.colors.surfaceContainerLow;
    }
  };

  return (
    <View style={[
      styles.card,
      { backgroundColor: getBackgroundColor() },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    // No borders as per "No-Line" rule
  },
});
