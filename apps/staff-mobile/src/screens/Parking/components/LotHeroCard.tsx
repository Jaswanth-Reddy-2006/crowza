import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme, TonalCard, Typography } from '@crowza/design-system';

interface LotHeroCardProps {
  lot: {
    name: string;
    capacity: number;
    occupancy: number;
    status: string;
  };
  utilization: number;
}

export const LotHeroCard: React.FC<LotHeroCardProps> = ({ lot, utilization }) => {
  return (
    <View style={styles.section}>
      <TonalCard variant="highest" style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={{ flex: 1 }}>
            <Typography variant="titleLarge" weight="900">{lot.name}</Typography>
            <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginTop: 4 }}>
              MAX CAPACITY: {lot.capacity} VEHICLES
            </Typography>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: lot.status === 'OPEN' ? '#FFF7ED' : '#FEF2F2' }]}>
            <div style={[styles.statusDot, { backgroundColor: lot.status === 'OPEN' ? '#F98000' : '#EF4444' }]} />
            <Typography variant="labelSmall" color={lot.status === 'OPEN' ? '#F98000' : '#991B1B'} weight="900">{lot.status}</Typography>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Typography variant="displaySmall" weight="900">{lot.occupancy}</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="900">OCCUPIED</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.metric}>
            <Typography variant="displaySmall" color={theme.colors.primary} weight="900">{utilization}%</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="900">UTILIZATION</Typography>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${utilization}%`, backgroundColor: utilization > 85 ? '#EF4444' : theme.colors.primary }]} />
        </View>
      </TonalCard>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginBottom: 40 },
  heroCard: { padding: 24, borderRadius: 32, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  metric: { alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: theme.colors.outlineVariant },
  progressTrack: { height: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
});
