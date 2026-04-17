import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import {
  fetchParkingLots,
  closeLot,
  openLot,
} from '../store/slices/parkingManagementSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOTS = [
  { id: 'LOT-A', name: 'General North', capacity: 1200, status: 'OPEN' },
  { id: 'LOT-B', name: 'VIP South', capacity: 450, status: 'OPEN' },
  { id: 'LOT-P', name: 'Staff West', capacity: 200, status: 'FULL' },
];

export default function ParkingManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { lots, loading } = useAppSelector((s) => s.parkingManagement);

  const [activeTab, setActiveTab] = useState('LOT-A');
  const [isGateOpen, setIsGateOpen] = useState(true);
  
  const gateAnim = useRef(new Animated.Value(isGateOpen ? 1 : 0)).current;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const venueId = useAppSelector((s: any) => s.staffAuth.staff?.venueId || 'venue-1');

  useEffect(() => {
    dispatch(fetchParkingLots(venueId));
  }, [dispatch, venueId]);

  const toggleGate = () => {
    const newState = !isGateOpen;
    setIsGateOpen(newState);
    Animated.spring(gateAnim, {
      toValue: newState ? 1 : 0,
      useNativeDriver: Platform.OS !== 'web' ,
      tension: 40,
      friction: 7,
    }).start();
  };

  const handleLotClosing = (lotId: string) => {
    Alert.alert("Confirm Lockdown", `Are you sure you want to CLOSE ${lotId}? All gates will be locked immediately.`, [
      { text: "Cancel", style: "cancel" },
      { text: "LOCKDOWN", style: "destructive", onPress: () => dispatch(closeLot(lotId)) }
    ]);
  }

  const activeLotData = LOTS.find(l => l.id === activeTab);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 2 }}>TRAFFIC OPS</Typography>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Parking Ctrl</Typography>
        </View>

        {/* Lot Selector Tabs */}
        <View style={styles.tabContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
             {LOTS.map(lot => (
               <TouchableOpacity 
                 key={lot.id} 
                 onPress={() => setActiveTab(lot.id)}
                 style={[styles.tab, activeTab === lot.id && styles.activeTab]}
               >
                 <Typography variant="labelMedium" color={activeTab === lot.id ? theme.colors.primary : theme.colors.outline}>
                   {lot.id}
                 </Typography>
               </TouchableOpacity>
             ))}
           </ScrollView>
        </View>

        {/* Hero Occupancy Card */}
        <View style={styles.section}>
           <TonalCard variant="high" style={styles.heroCard}>
               <View style={styles.heroHeader}>
                  <View>
                     <Typography variant="titleLarge" color={theme.colors.onSurface}>{activeLotData?.name}</Typography>
                     <Typography variant="bodySmall" color={theme.colors.outline}>Cap: {activeLotData?.capacity} vehicles</Typography>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: activeLotData?.status === 'OPEN' ? `${theme.colors.primary}15` : `${theme.colors.error}15` }]}>
                     <Typography variant="labelSmall" color={activeLotData?.status === 'OPEN' ? theme.colors.primary : theme.colors.error}>{activeLotData?.status}</Typography>
                  </View>
               </View>

               <View style={styles.metricRow}>
                  <View style={styles.metric}>
                     <Typography variant="displaySmall" color={theme.colors.onSurface}>842</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline}>OCCUPIED</Typography>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.metric}>
                     <Typography variant="displaySmall" color={theme.colors.primary}>74%</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline}>UTILIZATION</Typography>
                  </View>
               </View>

              <View style={styles.progressTrack}>
                 <View style={[styles.progressFill, { width: '74%', backgroundColor: theme.colors.primary }]} />
              </View>
           </TonalCard>
        </View>

        {/* Gate Control Interactive */}
        <View style={styles.section}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>MAIN GATE OVERRIDE</Typography>
           <TonalCard variant="medium" style={styles.gateCard}>
               <View style={styles.gateVisual}>
                  <Animated.View style={[styles.gateArm, { 
                    transform: [{ 
                      rotate: gateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-90deg']
                      }) 
                    }] 
                  }]} />
                  <View style={[styles.gateLight, { backgroundColor: isGateOpen ? theme.colors.primary : theme.colors.error }]} />
               </View>
               <View style={styles.gateInfo}>
                  <Typography variant="titleMedium" color={theme.colors.onSurface}>Gate 04 (Main Entry)</Typography>
                  <Typography variant="bodySmall" color={theme.colors.outline}>Currently: {isGateOpen ? 'ALLOWING ENTRY' : 'BLOCKED'}</Typography>
                 <SignatureButton 
                   label={isGateOpen ? "CLOSE GATE" : "OPEN GATE"} 
                   onPress={toggleGate} 
                   variant={isGateOpen ? "secondary" : "primary"}
                   style={{ marginTop: 16 }}
                 />
              </View>
           </TonalCard>
        </View>

        {/* Predictions & AI Insights */}
        <View style={styles.section}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>PREDICTIVE FLOW</Typography>
           <View style={styles.grid}>
              <TonalCard variant="low" style={styles.smallCard}>
                 <Typography variant="labelSmall" color={theme.colors.outline}>EST. CLEAR TIME</Typography>
                 <Typography variant="titleLarge" color={theme.colors.onSurface}>45m</Typography>
              </TonalCard>
              <TonalCard variant="low" style={styles.smallCard}>
                 <Typography variant="labelSmall" color={theme.colors.outline}>INFLOW RATE</Typography>
                 <Typography variant="titleLarge" color={theme.colors.onSurface}>12v/min</Typography>
              </TonalCard>
           </View>
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
           <SignatureButton 
             label="INITIATE EMERGENCY LOCKDOWN" 
             onPress={() => handleLotClosing(activeTab)} 
             variant="secondary"
             style={{ borderColor: theme.colors.error }}
           />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  tabContainer: { marginBottom: 24 },
  tabScroll: { paddingHorizontal: 24 },
  tab: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: theme.colors.surfaceContainerLow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: { backgroundColor: `${theme.colors.primary}15`, borderColor: theme.colors.primary },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  heroCard: { padding: 24, borderRadius: 32, gap: 24 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  metric: { alignItems: 'center', gap: 4 },
  divider: { width: 1, height: 40, backgroundColor: theme.colors.outlineVariant },
  progressTrack: { height: 6, backgroundColor: theme.colors.surfaceContainer, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  label: { marginBottom: 16, letterSpacing: 1 },
  gateCard: { padding: 24, borderRadius: 32, flexDirection: 'row', gap: 24, alignItems: 'center' },
  gateVisual: { width: 80, height: 80, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  gateArm: { width: 40, height: 4, backgroundColor: theme.colors.primary, borderRadius: 2, position: 'absolute', left: 40, transformOrigin: 'left' },
  gateLight: { width: 12, height: 12, borderRadius: 6, position: 'absolute', top: 10, right: 10 },
  gateInfo: { flex: 1 },
  grid: { flexDirection: 'row', gap: 16 },
  smallCard: { flex: 1, padding: 20, borderRadius: 24, gap: 8 },
});

