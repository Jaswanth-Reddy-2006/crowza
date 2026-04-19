/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, G, Defs, RadialGradient, Stop, Text as SvgText, Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { selectAllZones, selectAllZoneOccupancies } from '../selectors';
import { setupOccupancyListener } from '../services/firebase/realtimeListeners';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TIME_FILTERS = ['LIVE', '15M', '30M', '1H'];

function getOccupancyColor(pct: number): string {
  if (pct <= 30) return '#F98000'; // Brand Primary Orange
  if (pct <= 60) return '#F59E0B'; // Amber
  if (pct <= 85) return '#EF4444'; // Red
  return '#7F1D1D'; // Deep Maroon
}

const FlowArrow = ({ start, end, delay = 0 }: { start: number[], end: number[], delay?: number }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [delay]);

  const x = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [start[0], end[0]],
  });

  const y = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [start[1], end[1]],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: opacity,
        transform: [{ scale: 0.8 }],
      }}
    >
      <Ionicons name="chevron-forward-circle" size={16} color={theme.colors.primary} />
    </Animated.View>
  );
};

export default function HeatMapScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
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
    const values = Object.values(occupancies || {});
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
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <EditorialHeader
          metadata="LIVE DENSITY"
          title="Crowd Heatmap"
          subtitle="Real-time thermal flow analysis"
        />
        <TonalCard variant="low" style={styles.safetyBadge}>
          <View style={styles.pulseDot} />
          <Typography variant="labelSmall" color="#F98000" weight="800" style={{ marginLeft: 6 }}>SYSTEM SECURE</Typography>
        </TonalCard>
      </View>

      <View style={styles.thermalContainer}>
        {/* SVG Base Layers */}
        <View style={styles.svgWrapper}>
          <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            {zones.map((zone) => {
              const occ = occupancies[zone.id]?.occupancyPercent ?? 0;
              const color = getOccupancyColor(occ);
              return (
                <Path
                  key={zone.id}
                  d={drawPath(zone.polygon || [])}
                  fill={color}
                  fillOpacity={0.3}
                  stroke={color}
                  strokeWidth={2}
                />
              );
            })}
          </Svg>
        </View>

        {/* Animated Flow Layer */}
        <View style={styles.flowOverlay}>
           <FlowArrow start={[200, 800]} end={[500, 500]} delay={0} />
           <FlowArrow start={[200, 800]} end={[500, 500]} delay={1000} />
           <FlowArrow start={[800, 800]} end={[500, 500]} delay={500} />
           <FlowArrow start={[500, 200]} end={[500, 450]} delay={1500} />
        </View>

        {/* Floating Pill Legend */}
        <View style={styles.floatingLegend}>
           <TonalCard variant="highest" style={styles.legendPill} dark>
              <Typography variant="labelSmall" color="white" weight="900">THERMAL LOAD</Typography>
              <View style={styles.legendColors}>
                 <View style={[styles.colorDot, { backgroundColor: '#F98000' }]} />
                 <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                 <View style={[styles.colorDot, { backgroundColor: '#EF4444' }]} />
                 <View style={[styles.colorDot, { backgroundColor: '#7F1D1D' }]} />
              </View>
           </TonalCard>
        </View>
      </View>

      {/* Time Horizon Control */}
      <View style={styles.controlSection}>
         <View style={styles.scrubber}>
            {TIME_FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveTime(f)}
                style={[styles.scrubberBtn, activeTime === f && styles.scrubberBtnActive]}
                activeOpacity={0.8}
              >
                <Typography 
                  variant="labelSmall" 
                  weight="900" 
                  color={activeTime === f ? theme.colors.primary : theme.colors.outline}
                >
                  {f}
                </Typography>
              </TouchableOpacity>
            ))}
         </View>
      </View>

      {/* AI Insight Card */}
      <View style={styles.insightSection}>
         <TonalCard variant="low" style={styles.aiCard}>
           <View style={styles.aiHeader}>
              <View style={styles.aiIcon}>
                 <MaterialCommunityIcons name="robot-glow" size={24} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                 <Typography variant="titleSmall" weight="900">AI Traffic Prediction</Typography>
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="800">OPTIMAL FLOW DETECTED</Typography>
              </View>
           </View>
           <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={styles.aiText}>
             The <Typography weight="800" color={theme.colors.onSurface}>East Concourse</Typography> currently has 40% less density than typical. Retoute through Gate 4 for fastest venue navigation.
           </Typography>
           <SignatureButton 
             label="Reroute Me" 
             variant="tertiary" 
             icon="navigate-circle"
             onPress={() => {}} 
             style={{ marginTop: 12 }}
           />
         </TonalCard>

         <View style={styles.gridStats}>
            <TonalCard variant="medium" style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="800">AVG OCCUPANCY</Typography>
               <Typography variant="headlineSmall" weight="900" color={theme.colors.primary}>{stats.avg}%</Typography>
            </TonalCard>
            <TonalCard variant="medium" style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="800">LIVE SENSORS</Typography>
               <Typography variant="headlineSmall" weight="900">124</Typography>
            </TonalCard>
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
  },
  thermalContainer: {
    height: 380,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
  },
  flowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingLegend: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 12,
  },
  legendColors: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  controlSection: {
    paddingHorizontal: 40,
    marginTop: 24,
  },
  scrubber: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 100,
    padding: 4,
  },
  scrubberBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 100,
  },
  scrubberBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightSection: {
    padding: 20,
    gap: 16,
  },
  aiCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: {
    lineHeight: 22,
  },
  gridStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F98000',
  },
});
