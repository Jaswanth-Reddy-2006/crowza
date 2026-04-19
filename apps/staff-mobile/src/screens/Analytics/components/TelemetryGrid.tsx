import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, TonalCard, Typography } from '@crowza/design-system';

interface OccupancyMetrics {
  currentOccupancy: number;
  capacity: number;
}

interface TelemetryGridProps {
  activeSegment: string;
  setActiveSegment: (seg: string) => void;
  occupancyMetrics: OccupancyMetrics | null;
  peakOccupancy: number;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({
  activeSegment,
  setActiveSegment,
  occupancyMetrics,
  peakOccupancy,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>TELEMETRY DATA</Typography>
        <View style={styles.segmentRow}>
          {['ALL', 'VIP'].map(seg => (
            <TouchableOpacity 
              key={seg} 
              onPress={() => setActiveSegment(seg)}
              style={[styles.segmentBtn, activeSegment === seg && styles.activeSegment]}
            >
              <Typography variant="labelSmall" color={activeSegment === seg ? theme.colors.primary : theme.colors.outline} weight="700">{seg}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsGrid}>
        <TonalCard variant="low" style={styles.statCard}>
          <View style={styles.statIcon}><Ionicons name="people" size={20} color={theme.colors.primary} /></View>
          <View>
            <Typography variant="headlineSmall" color={theme.colors.onSurface} weight="800">
              {occupancyMetrics?.currentOccupancy.toLocaleString() || '12,402'}
            </Typography>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="600">LIVE OCCUPANCY</Typography>
          </View>
        </TonalCard>
        <TonalCard variant="low" style={styles.statCard}>
          <View style={styles.statIcon}><Ionicons name="stats-chart" size={20} color={theme.colors.secondary} /></View>
          <View>
            <Typography variant="headlineSmall" color={theme.colors.onSurface} weight="800">{peakOccupancy.toLocaleString()}</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="600">PEAK FORECAST</Typography>
          </View>
        </TonalCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionLabel: { marginBottom: 16, letterSpacing: 1, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  segmentBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: theme.colors.surfaceContainerLow },
  activeSegment: { backgroundColor: `${theme.colors.primary}15`, borderWidth: 1, borderColor: theme.colors.primary },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, padding: 20, borderRadius: 24, gap: 12 },
  statIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
});
