/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchAnalytics } from '../store/slices/analyticsSlice';

// Modular Components
import { RadarVisualization } from './Analytics/components/RadarVisualization';
import { TelemetryGrid } from './Analytics/components/TelemetryGrid';
import { AudienceBreakdown } from './Analytics/components/AudienceBreakdown';

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
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.primary }]} />
              <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 3 }}>RADAR ACTIVE</Typography>
           </View>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Crowd Intelligence</Typography>
        </View>

        <RadarVisualization fadeAnim={fadeAnim} spin={spin} />

        <TelemetryGrid 
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
          occupancyMetrics={occupancyMetrics}
          peakOccupancy={peakOccupancy}
        />

        <AudienceBreakdown />

        <View style={[styles.section, { marginBottom: 80 }]}>
           <SignatureButton label="GENERATE HEATMAP EXPORT" onPress={() => {}} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  section: { paddingHorizontal: 24, marginBottom: 32 },
});
