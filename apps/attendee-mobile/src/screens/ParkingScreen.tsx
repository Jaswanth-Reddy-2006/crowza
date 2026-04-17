import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPOT_COLORS: Record<string, string> = {
  AVAILABLE: '#4CAF50',
  OCCUPIED: '#222222',
  RESERVED: '#26C6DA',
  VIP: '#FFD700',
};

const COLS = 12;

export default function ParkingScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();

  const [activeLot, setActiveLot] = useState('LOT A');
  const [savedSpot, setSavedSpot] = useState<string | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchZones(venueId));
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  }, [dispatch, venueId]);

  const mockSpots = useMemo(() => {
    return Array.from({ length: 96 }, () => {
      const rand = Math.random();
      if (rand < 0.1) return 'VIP';
      if (rand < 0.2) return 'RESERVED';
      if (rand < 0.7) return 'OCCUPIED';
      return 'AVAILABLE';
    });
  }, [activeLot]);

  const stats = useMemo(() => {
    const available = mockSpots.filter(s => s === 'AVAILABLE').length;
    return {
      available,
      pct: Math.round(((mockSpots.length - available) / mockSpots.length) * 100)
    };
  }, [mockSpots]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <EditorialHeader
        metadata="SMART PARKING"
        title="Arena Parking"
        subtitle="Manage your spot and live exit predictions."
        style={styles.header}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Lot Selector */}
        <View style={styles.lotSelector}>
          {['LOT A', 'LOT B', 'LOT C'].map((lot) => (
            <TouchableOpacity 
              key={lot} 
              onPress={() => setActiveLot(lot)}
              style={[styles.lotBtn, activeLot === lot && styles.lotBtnActive]}
            >
              <Typography 
                variant="labelLarge" 
                color={activeLot === lot ? theme.colors.primary : theme.colors.onSurfaceVariant}
              >
                {lot}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Global Stats */}
        <View style={styles.statsContainer}>
          <TonalCard variant="highest" style={styles.statsCard}>
             <View style={styles.statItem}>
                <Typography variant="displaySmall" color={theme.colors.onSurface}>{stats.available}</Typography>
                <Typography variant="labelSmall" color={theme.colors.outline}>OPEN SPOTS</Typography>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statItem}>
                <Typography variant="displaySmall" color={theme.colors.primary}>{stats.pct}%</Typography>
                <Typography variant="labelSmall" color={theme.colors.outline}>TOTAL FILL</Typography>
             </View>
          </TonalCard>
        </View>

        {/* Lot Status Overview */}
        <View style={styles.gridSection}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>
              LOT STATUS OVERVIEW
           </Typography>
           
           <View style={{ gap: 16 }}>
             {[
               { level: 'B1 - VIP', occupancy: 92, status: 'CRITICAL', color: '#FF5252' },
               { level: 'B2 - General', occupancy: 45, status: 'FLOWING', color: '#4CAF50' },
               { level: 'B3 - General', occupancy: 12, status: 'OPEN', color: '#4CAF50' },
               { level: 'Roof - Overflow', occupancy: 0, status: 'EMPTY', color: '#9E9E9E' },
             ].map((lvl, index) => (
               <TonalCard key={index} variant="low" style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                 <View style={{ flex: 1 }}>
                   <Typography variant="titleSmall" color={theme.colors.onSurface}>{lvl.level}</Typography>
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                     <View style={{ flex: 1, height: 4, backgroundColor: theme.colors.surfaceContainerHighest, borderRadius: 2, marginRight: 12 }}>
                        <View style={{ width: `${lvl.occupancy}%`, height: 4, backgroundColor: lvl.color, borderRadius: 2 }} />
                     </View>
                     <Typography variant="labelSmall" color={theme.colors.outline}>{lvl.occupancy}%</Typography>
                   </View>
                 </View>
                 <View style={{ marginLeft: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: `${lvl.color}20` }}>
                    <Typography variant="labelSmall" color={lvl.color} weight="800">{lvl.status}</Typography>
                 </View>
               </TonalCard>
             ))}
           </View>
        </View>

        {/* Saved Spot Card */}
        {savedSpot && (
          <View style={styles.savedSection}>
             <TonalCard variant="medium" style={styles.savedCard}>
                <View style={styles.savedHeader}>
                   <View>
                      <Typography variant="labelSmall" color={theme.colors.primary}>SAVED SPOT</Typography>
                      <Typography variant="headlineMedium" color={theme.colors.onSurface}>{savedSpot}</Typography>
                   </View>
                   <SignatureButton label="Clear" variant="tertiary" size="small" onPress={() => setSavedSpot(null)} />
                </View>
                <View style={[styles.timer, { marginTop: 16 }]}>
                   <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>EXIT FLOW DELAY</Typography>
                   <Typography variant="titleMedium" color={theme.colors.onSurface}>~14 Minutes</Typography>
                </View>
             </TonalCard>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>
              PARKING SERVICES
           </Typography>
           <View style={styles.gridContainer}>
              {[
                { label: 'Request Valet', icon: 'key-outline' },
                { label: 'Find EV Charging', icon: 'flashlight-outline' },
                { label: 'Find Nearest Gate', icon: 'walk-outline' },
                { label: 'Report Issue', icon: 'alert-circle-outline' }
              ].map((act, i) => (
                <TouchableOpacity key={i} style={styles.actionBtn}>
                   <Ionicons name={act.icon as any} size={24} color={theme.colors.primary} />
                   <Typography variant="labelSmall" color={theme.colors.onSurface} style={{ marginTop: 8 }}>{act.label}</Typography>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        {/* Directions */}
        <View style={styles.footer}>
           <SignatureButton 
             label="Navigate to Lot Entrance" 
             onPress={() => {}} 
             variant="primary" 
           />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  scroll: {
    paddingBottom: 100,
  },
  lotSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  lotBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainer,
  },
  lotBtnActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginHorizontal: 12,
  },
  gridSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  gridCard: {
    padding: 24,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  spot: {
    width: (SCREEN_WIDTH - 48 - 48 - (COLS - 1) * 6) / COLS,
    aspectRatio: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  savedSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  savedCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  actionsGrid: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    backgroundColor: theme.colors.surfaceContainer,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
});

