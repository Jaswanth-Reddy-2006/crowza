import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchManagedZones, adjustZoneCapacity } from '../store/slices/occupancyManagementSlice';

// Get window dimensions (for future responsive layout usage)
const SCREEN_WIDTH = Dimensions.get('window').width;

function getHeatConfig(pct: number) {
  if (pct >= 90) return { color: theme.colors.error, label: 'CRITICAL', bg: 'rgba(186,26,26,0.1)' };
  if (pct >= 75) return { color: '#FF9800', label: 'BUSY', bg: 'rgba(255,152,0,0.1)' };
  return { color: '#4CAF50', label: 'OPTIMAL', bg: 'rgba(76,175,80,0.1)' };
}

export default function OccupancyManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const { zones } = useAppSelector((s) => s.occupancyManagement);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [newCapacity, setNewCapacity] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchManagedZones(venueId));
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOverride = (zone: any) => {
    setSelectedZone(zone);
    setNewCapacity(String(zone.capacity));
    setShowOverride(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyOverride = async () => {
    const val = parseInt(newCapacity, 10);
    if (!val || val <= 0) return Alert.alert('Invalid Value', 'Enter a valid capacity limit.');
    
    await dispatch(adjustZoneCapacity({ 
      zoneId: selectedZone.id, 
      newCapacity: val, 
      reason: 'Manual Override' 
    }));
    setShowOverride(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 2 }}>OPERATIONS</Typography>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Zone Capacity</Typography>
        </View>

        <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
           {zones.map((zone) => {
             const pct = (zone as any).occupancyPercent || 65;
             const config = getHeatConfig(pct);
             
             return (
               <TouchableOpacity 
                 key={zone.id} 
                 style={styles.zoneWrapper}
                 onPress={() => handleOverride(zone)}
               >
                 <TonalCard variant="medium" style={styles.zoneCard}>
                    <View style={[styles.heatBadge, { backgroundColor: config.bg }]}>
                       <Typography variant="labelSmall" color={config.color}>{config.label}</Typography>
                    </View>
                    
                    <Typography variant="titleLarge" color={theme.colors.onSurface} weight="700" style={styles.zoneName}>{zone.name}</Typography>
                    
                    <View style={styles.statsRow}>
                       <View>
                          <Typography variant="displaySmall" color={theme.colors.onSurface}>{pct}%</Typography>
                          <Typography variant="labelSmall" color={theme.colors.outline}>OCCUPANCY</Typography>
                       </View>
                       <View style={styles.divider} />
                       <View>
                          <Typography variant="titleLarge" color={theme.colors.onSurface}>{zone.capacity}</Typography>
                          <Typography variant="labelSmall" color={theme.colors.outline}>LIMIT</Typography>
                       </View>
                    </View>

                    <View style={styles.progressContainer}>
                       <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: config.color }]} />
                    </View>

                    <Typography variant="labelSmall" color={theme.colors.primary} weight="bold" style={styles.actionText}>TAP TO OVERRIDE</Typography>
                 </TonalCard>
               </TouchableOpacity>
             );
           })}
        </Animated.View>
      </ScrollView>

      {/* Override Bottom Sheet */}
      <Modal visible={showOverride} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowOverride(false)} />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 40, backgroundColor: theme.colors.surface }]}>
               <View style={styles.handle} />
               <Typography variant="headlineSmall" color={theme.colors.onSurface}>Override Capacity</Typography>
               <Typography variant="bodyMedium" color={theme.colors.outline} style={{ marginBottom: 24 }}>
                 Manually adjust the structural capacity limit for {selectedZone?.name}.
               </Typography>

               <Typography variant="labelSmall" color={theme.colors.primary} style={{ marginBottom: 8 }}>NEW LIMIT</Typography>
               <TextInput 
                 style={styles.input}
                 value={newCapacity}
                 onChangeText={setNewCapacity}
                 keyboardType="numeric"
                 placeholderTextColor={theme.colors.outlineVariant}
                 autoFocus
               />

               <SignatureButton 
                 label="CONFIRM OVERRIDE" 
                 onPress={applyOverride} 
                 variant="primary" 
                 style={{ marginTop: 12 }}
               />
               <SignatureButton 
                 label="CANCEL" 
                 onPress={() => setShowOverride(false)} 
                 variant="secondary" 
                 style={{ marginTop: 8 }}
               />
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  grid: { paddingHorizontal: 16 },
  zoneWrapper: { marginBottom: 16 },
  zoneCard: {
    padding: 24,
    borderRadius: 32,
    gap: 16,
  },
  heatBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  zoneName: { },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.outlineVariant,
  },
  progressContainer: {
    height: 8,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 4 },
  actionText: { letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.outlineVariant,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 20,
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
});
