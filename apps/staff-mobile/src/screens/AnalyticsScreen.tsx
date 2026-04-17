import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchAnalytics } from '../store/slices/analyticsSlice';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RadarScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const { occupancyMetrics } = useAppSelector((s) => s.dashboard);
  const { occupancyTrends, loading } = useAppSelector((s) => s.analytics);

  const [activeSegment, setActiveSegment] = useState('ALL');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(fetchAnalytics({ from: today, to: today }));
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: Platform.OS !== 'web' }).start();
    
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 4000, easing: t => t, useNativeDriver: Platform.OS !== 'web' })
    ).start();
  }, [dispatch]);

  const peakOccupancy = occupancyTrends.length > 0 
    ? Math.max(...occupancyTrends.map(t => t.value)) 
    : 14200;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.primary }]} />
              <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 3 }}>RADAR ACTIVE</Typography>
           </View>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Crowd Intelligence</Typography>
        </View>

        {/* Live Window Map (Heatmap Visual) */}
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

        {/* Crowd Intelligence Section */}
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

        {/* Audience Breakdown Cards */}
        <View style={styles.section}>
            <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>AUDIENCE SEGMENTATION</Typography>
            <TonalCard variant="medium" style={styles.breakdownList}>
               {[
                 { label: 'General Seating', count: '8,200', pct: 65, icon: 'person-outline' },
                 { label: 'VIP / Hospitality', count: '1,400', pct: 12, icon: 'star-outline' },
                 { label: 'Operations & Media', count: '450', pct: 4, icon: 'shield-checkmark-outline' },
               ].map((item, i) => (
                 <View key={i} style={[styles.breakdownRow, i === 2 && { borderBottomWidth: 0 }]}>
                    <View style={styles.breakdownIcon}><Ionicons name={item.icon as any} size={20} color={theme.colors.primary} /></View>
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

        <View style={[styles.section, { marginBottom: 80 }]}>
           <SignatureButton label="GENERATE HEATMAP EXPORT" onPress={() => {}} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  radarSection: { paddingHorizontal: 16, marginBottom: 32 },
  radarCard: { borderRadius: 32, padding: 12, overflow: 'hidden' },
  radarContainer: { height: 320, backgroundColor: '#050505', borderRadius: 24, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  radarSweep: { position: 'absolute', width: 600, height: 600, backgroundColor: 'rgba(255, 152, 0, 0.05)', borderRadius: 300, borderLeftWidth: 2, borderColor: theme.colors.primary },
  venueGrid: { width: '80%', height: '80%', borderColor: 'rgba(255,152,0,0.1)', borderWidth: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
  stadiumOutline: { width: '70%', height: '85%', borderRadius: 100, borderWidth: 2, borderColor: 'rgba(255,152,0,0.2)' },
  heatZone: { position: 'absolute', borderRadius: 100 },
  zoneLabel: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  legend: { position: 'absolute', bottom: 16, left: 16, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionLabel: { marginBottom: 16, letterSpacing: 1, fontWeight: '700' },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  segmentBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: theme.colors.surfaceContainerLow },
  activeSegment: { backgroundColor: `${theme.colors.primary}15`, borderWidth: 1, borderColor: theme.colors.primary },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, padding: 20, borderRadius: 24, gap: 12 },
  breakdownList: { borderRadius: 32, padding: 8 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderBottomWidth: 1, borderColor: theme.colors.outlineVariant },
  breakdownIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  progressContainer: { height: 4, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 2, marginTop: 8, width: '100%' },
  progressBar: { height: '100%', borderRadius: 2 },
});
