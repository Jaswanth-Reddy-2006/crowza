import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, TonalCard, Typography } from '@crowza/design-system';

interface AudienceItem {
  label: string;
  count: string;
  pct: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface AudienceBreakdownProps {
  data?: AudienceItem[];
}

export const AudienceBreakdown: React.FC<AudienceBreakdownProps> = ({ 
  data = [
    { label: 'General Seating', count: '8,200', pct: 65, icon: 'person-outline' },
    { label: 'VIP / Hospitality', count: '1,400', pct: 12, icon: 'star-outline' },
    { label: 'Operations & Media', count: '450', pct: 4, icon: 'shield-checkmark-outline' },
  ]
}) => {
  return (
    <View style={styles.section}>
      <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>AUDIENCE SEGMENTATION</Typography>
      <TonalCard variant="medium" style={styles.breakdownList}>
         {data.map((item, i) => (
           <View key={i} style={[styles.breakdownRow, i === data.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.breakdownIcon}><Ionicons name={item.icon} size={20} color={theme.colors.primary} /></View>
              <View style={{ flex: 1 }}>
                 <Typography variant="titleSmall" color={theme.colors.onSurface} weight="700">{item.label}</Typography>
                 <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${item.pct}%`, backgroundColor: theme.colors.primary }]} />
                 </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                 <Typography variant="titleSmall" color={theme.colors.onSurface} weight="800">{item.count}</Typography>
                 <Typography variant="labelSmall" color={theme.colors.outline} weight="700">{item.pct}%</Typography>
              </View>
           </View>
         ))}
      </TonalCard>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionLabel: { marginBottom: 16, letterSpacing: 1, fontWeight: '700' },
  breakdownList: { borderRadius: 32, padding: 8 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderBottomWidth: 1, borderColor: theme.colors.outlineVariant },
  breakdownIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  progressContainer: { height: 4, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 2, marginTop: 8, width: '100%' },
  progressBar: { height: '100%', borderRadius: 2 },
});
