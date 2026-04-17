import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';
import { Typography } from './Typography';

interface EditorialHeaderProps {
  title: string;
  subtitle?: string;
  metadata?: string;
  style?: ViewStyle;
  dark?: boolean;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  title,
  subtitle,
  metadata,
  style,
  dark,
}) => {
  const textColor = dark ? 'white' : theme.colors.onSurface;
  const subColor = dark ? theme.colors.outline : theme.colors.onSurfaceVariant;

  return (
    <View style={[styles.container, style]}>
      {metadata && (
        <Typography variant="labelSmall" color={theme.colors.secondary} style={styles.metadata}>
          {metadata}
        </Typography>
      )}
      <Typography variant="displayLarge" color={textColor} style={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="bodyLarge" color={subColor} style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  metadata: {
    marginBottom: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    maxWidth: '80%',
  },
});
