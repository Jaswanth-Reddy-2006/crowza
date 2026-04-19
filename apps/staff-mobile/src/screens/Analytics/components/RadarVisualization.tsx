import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme, TonalCard, Typography } from '@crowza/design-system';

interface RadarVisualizationProps {
  fadeAnim: Animated.Value;
  spin: Animated.AnimatedInterpolation<string>;
}

export const RadarVisualization: React.FC<RadarVisualizationProps> = ({
  fadeAnim,
  spin,
}) => {
  return (
    <Animated.View style={[styles.radarSection, { opacity: fadeAnim }]}>
      <TonalCard variant="highest" style={styles.radarCard}>
        <View style={styles.radarContainer}>
          {/* Simulated Radar Sweep */}
          <Animated.View style={[styles.radarSweep, { transform: [{ rotate: spin }] }]} />
          
          {/* Grid Lines */}
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.gridCircle, { width: i * 100, height: i * 100 }]} />
          ))}
          
          {/* Venue Grid & Heat Zones */}
          <View style={styles.venueGrid}>
             <View style={styles.stadiumOutline} />
             
             {/* Heat Zones with Glow Effect */}
             <View style={[styles.heatZone, { top: '25%', left: '35%', width: 70, height: 70, backgroundColor: theme.colors.error, opacity: 0.5 }]} />
             <View style={[styles.heatZone, { top: '55%', left: '15%', width: 45, height: 45, backgroundColor: theme.colors.primary, opacity: 0.4 }]} />
             <View style={[styles.heatZone, { top: '60%', left: '65%', width: 55, height: 55, backgroundColor: theme.colors.secondary, opacity: 0.4 }]} />
             
             {/* Zone Labels */}
             <View style={[styles.zoneLabel, { top: '30%', left: '40%' }]}><Typography variant="labelSmall" color="#FFF" weight="800">ZONE A</Typography></View>
             <View style={[styles.zoneLabel, { top: '58%', left: '18%' }]}><Typography variant="labelSmall" color="#FFF" weight="800">ZONE B</Typography></View>
          </View>

          {/* Status Bar */}
          <View style={styles.radarStatus}>
             <Typography variant="labelSmall" color="rgba(255,255,255,0.6)" weight="700">SCANNING SECTOR 04...</Typography>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
             <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
                <Typography variant="labelSmall" color="rgba(255,255,255,0.5)">CRITICAL</Typography>
             </View>
             <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                <Typography variant="labelSmall" color="rgba(255,255,255,0.5)">SECURE</Typography>
             </View>
          </View>
        </View>
      </TonalCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  radarSection: { paddingHorizontal: 16, marginBottom: 32 },
  radarCard: { borderRadius: 32, padding: 12, overflow: 'hidden' },
  radarContainer: { height: 320, backgroundColor: theme.colors.surface, borderRadius: 24, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  radarSweep: { position: 'absolute', width: 600, height: 600, backgroundColor: theme.colors.primaryGlow, borderRadius: 300, borderLeftWidth: 2, borderColor: theme.colors.primary },
  gridCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 1000 },
  venueGrid: { width: '80%', height: '80%', borderColor: theme.colors.outlineVariant, borderWidth: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
  stadiumOutline: { width: '70%', height: '85%', borderRadius: 100, borderWidth: 2, borderColor: theme.colors.primaryGlow },
  heatZone: { position: 'absolute', borderRadius: 100 },
  zoneLabel: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  radarStatus: { position: 'absolute', top: 16, right: 16 },
  legend: { position: 'absolute', bottom: 16, left: 16, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
});
