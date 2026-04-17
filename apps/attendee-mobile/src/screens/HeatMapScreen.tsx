import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { theme, EditorialHeader, TonalCard, Typography } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { selectAllZones, selectAllZoneOccupancies } from '../selectors';
import { setupOccupancyListener } from '../services/firebase/realtimeListeners';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TIME_FILTERS = ['LIVE', '15M', '30M', '1H'];

function getOccupancyColor(pct: number): string {
  if (pct <= 30) return '#81C784'; // Soft Green
  if (pct <= 60) return '#FFD54F'; // Soft Amber
  if (pct <= 85) return '#FFB74D'; // Soft Orange
  return '#E57373'; // Soft Red
}

const DensityPulse = ({ x, y, color, intensity }: { x: number, y: number, color: string, intensity: number }) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.5 + (intensity * 0.5), duration: 2000, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, [intensity]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: color,
        opacity: opacity,
        transform: [{ scale }],
      }}
    />
  );
};

export default function HeatMapScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const zones = useAppSelector(selectAllZones);
  const occupancies = useAppSelector(selectAllZoneOccupancies);

  const [activeTime, setActiveTime] = useState('LIVE');
  const VENUE_ID = useVenueId();

  useEffect(() => {
    dispatch(fetchZones(VENUE_ID));
    const unsubscribe = setupOccupancyListener(VENUE_ID, dispatch);
    return () => unsubscribe();
  }, [dispatch, VENUE_ID]);

  const stats = useMemo(() => {
    const values = Object.values(occupancies);
    if (values.length === 0) return { avg: 0, count: 0 };
    return {
      avg: Math.round(values.reduce((s, o) => s + (o.occupancyPercent || 0), 0) / values.length),
      count: values.reduce((s, o) => s + (o.current || 0), 0)
    };
  }, [occupancies]);

  const drawPath = (polygon: number[][]) => {
    if (!polygon || polygon.length === 0) return "";
    return `M ${polygon[0][0]} ${polygon[0][1]} ` + 
           polygon.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ") + " Z";
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <EditorialHeader
        metadata="THERMAL DENSITY"
        title="Crowd Heatmap"
        subtitle="Visualizing real-time flow and density across the arena."
        style={styles.header}
      />

      {/* Hero Thermal View */}
      <View style={styles.thermalContainer}>
        <View style={styles.svgWrapper}>
          <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <Defs>
              <RadialGradient id="gradLow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#81C784" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="#81C784" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="gradHigh" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#E57373" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#E57373" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            {zones.map((zone) => {
              const occ = occupancies[zone.id]?.occupancyPercent ?? 0;
              const color = getOccupancyColor(occ);
              return (
                <G key={zone.id}>
                  <Path
                    d={drawPath(zone.polygon || [])}
                    fill={color}
                    fillOpacity={0.3}
                    stroke={color}
                    strokeWidth={2}
                  />
                </G>
              );
            })}
          </Svg>
          {/* Overlay Pulses */}
          {zones.map((zone) => {
            const occ = occupancies[zone.id]?.occupancyPercent ?? 0;
            if (occ < 60) return null;
            // Center calculation for pulses
            const centerX = (zone.polygon?.reduce((acc, p) => acc + p[0], 0) || 0) / (zone.polygon?.length || 1);
            const centerY = (zone.polygon?.reduce((acc, p) => acc + p[1], 0) || 0) / (zone.polygon?.length || 1);
            
            // Map 0-1000 SVG space to screen space (360x400 approx)
            const x = centerX * (360 / 1000); 
            const y = centerY * (400 / 1000);
            return (
              <DensityPulse 
                key={zone.id} 
                x={x} 
                y={y} 
                color={getOccupancyColor(occ)} 
                intensity={occ / 100} 
              />
            );
          })}
        </View>

        {/* Legend Overlay */}
        <View style={styles.legendOverlay}>
           <TonalCard variant="high" style={styles.legendCard}>
              <Typography variant="labelSmall" color={theme.colors.onSurface} weight="600">LIVE DENSITY</Typography>
              <View style={styles.legendItems}>
                <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                <View style={[styles.dot, { backgroundColor: '#FFC107' }]} />
                <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
                <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
              </View>
           </TonalCard>
          
          <View style={{ marginTop: 24, padding: 16, backgroundColor: theme.colors.surfaceContainerHighest, borderRadius: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary} />
              <Typography variant="labelLarge" style={{ marginLeft: 8 }} weight="700">Understanding Density</Typography>
            </View>
            <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>
              The heatmap shows real-time thermal occupancy. Green areas represent low traffic, while Red indicates heavy congestion. Our AI uses this data to suggest the fastest exit routes and least crowded amenities.
              {"\n\n"}
              Blue pulses indicate emerging hotspots where density is increasing rapidly.
            </Typography>
          </View>
        </View>
      </View>

      {/* Time Scrubber */}
      <View style={styles.scrubberSection}>
         <Typography variant="labelSmall" color={theme.colors.outline} style={styles.scrubberLabel}>
            TIME HORIZON
         </Typography>
         <View style={styles.scrubber}>
            {TIME_FILTERS.map((f) => (
              <TouchableOpacity 
                key={f} 
                onPress={() => setActiveTime(f)}
                style={[styles.scrubberItem, activeTime === f && styles.scrubberItemActive]}
              >
                <Typography 
                  variant="labelMedium" 
                  color={activeTime === f ? theme.colors.primary : theme.colors.onSurfaceVariant}
                >
                  {f}
                </Typography>
              </TouchableOpacity>
            ))}
         </View>
      </View>

      {/* Insights */}
      <View style={styles.insights}>
         <TonalCard variant="low" style={styles.insightCard}>
            <Typography variant="titleMedium" color={theme.colors.onSurface}>
               Peak Load Analysis
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={{ marginTop: 4 }}>
               Arena is currently at {stats.avg}% capacity. Major congestion detected near Gate 4.
            </Typography>
            <View style={styles.statGrid}>
               <View style={styles.stat}>
                  <Typography variant="displaySmall" color={theme.colors.onSurface}>84%</Typography>
                  <Typography variant="labelSmall" color={theme.colors.outline}>GATE 4 FLUIDITY</Typography>
               </View>
               <View style={styles.stat}>
                  <Typography variant="displaySmall" color={theme.colors.primary}>12m</Typography>
                  <Typography variant="labelSmall" color={theme.colors.outline}>EST. EXIT TIME</Typography>
               </View>
            </View>
         </TonalCard>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  thermalContainer: {
    height: 400,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginHorizontal: 16,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  legendOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  legendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrubberSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  scrubberLabel: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  scrubber: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 20,
    padding: 6,
    gap: 4,
  },
  scrubberItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
  },
  scrubberItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insights: {
    padding: 20,
    marginTop: 10,
  },
  insightCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  statGrid: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  stat: {
    gap: 4,
  },
});
