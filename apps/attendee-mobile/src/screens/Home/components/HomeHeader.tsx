import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography, theme } from '@crowza/design-system';

interface HomeHeaderProps {
  title?: string;
  subtitle?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  title = '🎯 Smart Navigator', 
  subtitle = 'Advanced Venue Navigation' 
}) => {
  return (
    <LinearGradient
      colors={['#2196F3', '#1976D2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Typography variant="headlineLarge" color={theme.colors.onPrimary} weight="700">
          {title}
        </Typography>
        <Typography variant="bodyMedium" color={theme.colors.onPrimary}>
          {subtitle}
        </Typography>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerContent: {
    gap: 4,
  },
});
