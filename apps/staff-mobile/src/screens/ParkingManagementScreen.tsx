import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography } from '@crowza/design-system';
import { useAppDispatch, useVenueId } from '../utils/hooks';
import { fetchParkingLots, closeLot } from '../store/slices/parkingManagementSlice';
import { OperationalHeader } from '../components/OperationalHeader';

// Modular Components
import { LotHeroCard } from './Parking/components/LotHeroCard';
import { GateControlCard } from './Parking/components/GateControlCard';
import { TrafficInsights } from './Parking/components/TrafficInsights';

export interface ParkingLot {
  id: string;
  name: string;
  capacity: number;
  status: string;
  occupancy: number;
}

const MOCK_LOTS: ParkingLot[] = [
  { id: 'LOT-A', name: 'General North', capacity: 1200, status: 'OPEN', occupancy: 842 },
  { id: 'LOT-B', name: 'VIP South', capacity: 450, status: 'OPEN', occupancy: 310 },
  { id: 'LOT-P', name: 'Staff West', capacity: 200, status: 'FULL', occupancy: 200 },
];


export default function ParkingManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();

  const [activeTab, setActiveTab] = useState('LOT-A');

  const [isGateOpen, setIsGateOpen] = useState(true);
  
  const gateAnim = useRef(new Animated.Value(isGateOpen ? 1 : 0)).current;

  useEffect(() => {
    dispatch(fetchParkingLots(venueId));
  }, [dispatch, venueId]);

  const toggleGate = () => {
    const newState = !isGateOpen;
    setIsGateOpen(newState);
    Animated.spring(gateAnim, {
      toValue: newState ? 1 : 0,
      useNativeDriver: Platform.OS !== 'web',
      tension: 40,
      friction: 7,
    }).start();
  };

  const handleLotClosing = (lotId: string) => {
    Alert.alert("Confirm Lockdown", `Are you sure you want to CLOSE ${lotId}? All gates will be locked immediately.`, [
      { text: "Cancel", style: "cancel" },
      { text: "LOCKDOWN", style: "destructive", onPress: () => dispatch(closeLot(lotId)) }
    ]);
  };

  const activeLotData = MOCK_LOTS.find(l => l.id === activeTab) || MOCK_LOTS[0];
  const utilization = Math.round((activeLotData.occupancy / activeLotData.capacity) * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary, paddingTop: insets.top }]}>
      <OperationalHeader
        metadata="TRAFFIC & ACCESS"
        title="Parking Control"
        subtitle="Manage vehicle inflow, monitor lot utilization, and control entry points."
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
             {MOCK_LOTS.map(lot => (
               <TouchableOpacity 
                 key={lot.id} 
                 onPress={() => setActiveTab(lot.id)}
                 style={[styles.tab, activeTab === lot.id && styles.activeTab]}
               >
                 <Typography variant="labelSmall" color={activeTab === lot.id ? 'white' : theme.colors.outline} weight="900">
                   {lot.id}
                 </Typography>
               </TouchableOpacity>
             ))}
           </ScrollView>
        </View>

        <LotHeroCard lot={activeLotData} utilization={utilization} />

        <GateControlCard 
          isGateOpen={isGateOpen}
          toggleGate={toggleGate}
          gateAnim={gateAnim}
        />

        <TrafficInsights />

        <View style={[styles.section, { marginBottom: 60 }]}>
           <TouchableOpacity style={styles.lockdownBtn} onPress={() => handleLotClosing(activeTab)}>
              <Typography variant="labelLarge" color="white" weight="900">TRIGGER EMERGENCY LOCKDOWN</Typography>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  tabContainer: { marginBottom: 32 },
  tabScroll: { paddingHorizontal: 20 },
  tab: { 
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, 
    backgroundColor: theme.colors.surfaceVariant, marginRight: 10,
    borderWidth: 1, borderColor: theme.colors.outlineVariant,
  },
  activeTab: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  section: { paddingHorizontal: 20, marginBottom: 40 },
  lockdownBtn: { backgroundColor: theme.colors.error, paddingVertical: 20, borderRadius: 16, alignItems: 'center', elevation: 4 },
});
