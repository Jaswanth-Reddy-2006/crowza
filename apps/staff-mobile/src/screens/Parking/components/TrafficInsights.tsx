import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, TonalCard, Typography } from '@crowza/design-system';

export const TrafficInsights: React.FC = () => {
  return (
    <View style={styles.section}>
      <Typography variant="labelSmall" color={theme.colors.outline} weight="900" style={styles.label}>AI TRAFFIC INSIGHTS</Typography>
      <View style={styles.insightGrid}>
        <TonalCard variant="low" style={styles.smallCard}>
          <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
          <View style={{ marginTop: 12 }}>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="800">EST. CLEARANCE</Typography>
            <Typography variant="titleLarge" weight="900">24m</Typography>
          </View>
        </TonalCard>
        <TonalCard variant="low" style={styles.smallCard}>
          <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
          <View style={{ marginTop: 12 }}>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="800">INFLOW RATE</Typography>
            <Typography variant="titleLarge" weight="900">8v/m</Typography>
          </View>
        </TonalCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginBottom: 40 },
  label: { marginBottom: 16, letterSpacing: 1 },
  insightGrid: { flexDirection: 'row', gap: 12 },
  smallCard: { flex: 1, padding: 20, borderRadius: 24, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
});
