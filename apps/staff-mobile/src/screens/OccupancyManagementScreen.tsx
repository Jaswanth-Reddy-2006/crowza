/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchManagedZones, adjustZoneCapacity } from '../store/slices/occupancyManagementSlice';
import { Ionicons } from '@expo/vector-icons';
import { OperationalHeader } from '../components/OperationalHeader';
import { VenueFloorPlan } from '../components/VenueFloorPlan';

const MAP_ZONES = [
  { id: 'zone_1', name: 'West Stand', type: 'stand', polygon: [[100, 200], [450, 200], [450, 300], [200, 300]] },
  { id: 'zone_2', name: 'East Stand', type: 'stand', polygon: [[550, 200], [900, 200], [800, 300], [550, 300]] },
  { id: 'zone_3', name: 'VIP Lounge', type: 'premium', polygon: [[450, 200], [550, 200], [550, 300], [450, 300]] },
  { id: 'zone_4', name: 'South Deck', type: 'stand', polygon: [[100, 800], [900, 800], [800, 700], [200, 700]] },
  { id: 'zone_5', name: 'Food Plaza', type: 'amenity', polygon: [[10, 100], [200, 100], [200, 250], [10, 250]] },
];

function getOccupancyConfig(occupancy: number) {
  if (occupancy >= 0.9) return { color: '#EF4444', label: 'CRITICAL', bg: '#FEF2F2' };
  if (occupancy >= 0.7) return { color: '#F97316', label: 'HIGH', bg: '#FFF7ED' };
  return { color: '#F98000', label: 'OPTIMAL', bg: '#FFF7ED' };
}

export default function OccupancyManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const { zones } = useAppSelector((s) => s.occupancyManagement);

  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [newCapacity, setNewCapacity] = useState('');
  const [heatMapActive, setHeatMapActive] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchManagedZones(venueId));
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [dispatch]);

  const handleOverride = (zone: any) => {
    setSelectedZone(zone);
    setNewCapacity(String(zone.capacity));
    setShowOverride(true);
  };

  const applyOverride = async () => {
    const val = parseInt(newCapacity, 10);
    if (!val || val <= 0) return;
    await dispatch(adjustZoneCapacity({ zoneId: selectedZone.id, newCapacity: val, reason: 'Manual Override' }));
    setShowOverride(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary, paddingTop: insets.top }]}>
      <OperationalHeader
        metadata="CROWD DYNAMICS"
        title="Zone Occupancy"
        subtitle="Monitor structural load and manage capacity limits across all venue sectors."
      />
      
      <View style={styles.controlsRow}>
         <TouchableOpacity 
           style={[styles.toggleBtn, heatMapActive && styles.toggleBtnActive]} 
           onPress={() => setHeatMapActive(!heatMapActive)}
         >
            <Ionicons name={heatMapActive ? "grid-outline" : "map-outline"} size={20} color={heatMapActive ? "white" : theme.colors.primary} />
            <Typography variant="labelSmall" color={heatMapActive ? "white" : theme.colors.primary} weight="900" style={{ marginLeft: 8 }}>
               {heatMapActive ? "SWITCH TO GRID" : "ACTIVATE HEATMAP"}
            </Typography>
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {heatMapActive ? (
          <Animated.View style={[styles.mapWrapper, { opacity: fadeAnim }]}>
              <VenueFloorPlan
                zones={MAP_ZONES}
                occupancies={zones.reduce((acc: any, z: any) => ({ ...acc, [z.id]: z.occupancy }), {})}
                heatMapMode={true}
              />
          </Animated.View>
        ) : (
          <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
             {zones.map((zone) => {
                const config = getOccupancyConfig(zone.occupancy);
                return (
                  <TouchableOpacity key={zone.id} style={styles.zoneCardWrapper} onPress={() => handleOverride(zone)}>
                    <TonalCard variant="low" style={styles.zoneCard}>
                      <View style={[styles.statusStrip, { backgroundColor: config.color }]} />
                      <Typography variant="titleMedium" weight="900">{zone.name}</Typography>
                      <View style={styles.occupancyRow}>
                         <Typography variant="displaySmall" weight="900">{(zone.occupancy * 100).toFixed(0)}%</Typography>
                         <View style={{ alignItems: 'flex-end' }}>
                            <Typography variant="labelSmall" color={config.color} weight="900">{config.label}</Typography>
                            <Typography variant="bodySmall" color={theme.colors.outline}>{zone.capacity} MAX</Typography>
                         </View>
                      </View>
                      <View style={styles.progressContainer}>
                         <View style={[styles.progressBar, { width: `${zone.occupancy * 100}%`, backgroundColor: config.color }]} />
                      </View>
                    </TonalCard>
                  </TouchableOpacity>
                );
             })}
          </Animated.View>
        )}
      </ScrollView>

      {/* Override Modal */}
      <Modal visible={showOverride} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 40 }]}>
               <Typography variant="headlineSmall" weight="900" style={{ marginBottom: 8 }}>Manual Override</Typography>
               <Typography variant="bodyMedium" color={theme.colors.outline} style={{ marginBottom: 32 }}>Adjusting capacity for {selectedZone?.name}. Ensure safety protocols are followed.</Typography>
               
               <Typography variant="labelSmall" weight="900" style={{ marginBottom: 16 }}>NEW CAPACITY LIMIT</Typography>
               <TextInput
                 style={styles.input}
                 value={newCapacity}
                 onChangeText={setNewCapacity}
                 keyboardType="numeric"
                 autoFocus
               />
               
               <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowOverride(false)}>
                     <Typography variant="labelLarge" color={theme.colors.outline} weight="900">CANCEL</Typography>
                  </TouchableOpacity>
                  <SignatureButton
                    title="APPLY CHANGES"
                    onPress={applyOverride}
                    style={{ flex: 2 }}
                  />
               </View>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  controlsRow: { paddingHorizontal: 20, marginBottom: 20 },
  toggleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.surfaceVariant, 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  toggleBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  grid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  zoneCardWrapper: { width: (Dimensions.get('window').width - 52) / 2 },
  zoneCard: { padding: 20, borderRadius: 24, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant, overflow: 'hidden' },
  statusStrip: { position: 'absolute', left: 0, right: 0, top: 0, height: 4 },
  occupancyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, marginBottom: 16 },
  progressContainer: { height: 6, backgroundColor: theme.colors.surfaceVariant, borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  mapWrapper: { height: 500, marginHorizontal: 20, borderRadius: 32, overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32 },
  input: { backgroundColor: theme.colors.surfaceVariant, borderRadius: 16, padding: 20, fontSize: 24, fontWeight: '900', color: theme.colors.onSurface, marginBottom: 32 },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  cancelBtn: { padding: 12 },
});
