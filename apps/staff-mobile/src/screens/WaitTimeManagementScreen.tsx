/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton, EditorialHeader } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchAllQueues, updateWaitEstimate } from '../store/slices/waitTimeManagementSlice';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getWaitConfig(mins: number) {
  if (mins >= 30) return { color: '#EF4444', label: 'HIGH DELAY', bg: '#FEF2F2' };
  if (mins >= 15) return { color: '#F97316', label: 'MODERATE', bg: '#FFF7ED' };
  return { color: theme.colors.primary, label: 'OPTIMAL', bg: theme.colors.primaryContainer + '40' };
}

import { OperationalHeader } from '../components/OperationalHeader';

export default function WaitTimeManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const { queues } = useAppSelector((s) => s.waitTimeManagement);

  const [selectedQueue, setSelectedQueue] = useState<any>(null);
  const [overrideVal, setOverrideVal] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchAllQueues(venueId));
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [dispatch]);

  const handleUpdate = async (zoneId: string, mins: number) => {
    await dispatch(updateWaitEstimate({ zoneId, minutes: mins }));
    setSelectedQueue(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary, paddingTop: insets.top }]}>
      <OperationalHeader
        metadata="QUEUE LOGISTICS"
        title="Wait Estimations"
        subtitle="Monitor and adjust real-time wait times to optimize attendee flow and satisfaction."
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
           {queues.map((q) => {
             const config = getWaitConfig(q.estimatedWaitMins);
             const isSelected = selectedQueue?.zoneId === q.zoneId;

             return (
               <View key={q.zoneId} style={styles.queueWrapper}>
                 <TonalCard variant="medium" style={[styles.queueCard, isSelected && { borderColor: theme.colors.primary, borderWidth: 1, backgroundColor: '#FFF' }]}>
                    <View style={styles.cardHeader}>
                       <View style={{ flex: 1 }}>
                          <Typography variant="titleLarge" weight="900" style={styles.zoneName}>{q.zoneName}</Typography>
                          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                             <Typography variant="labelSmall" color={config.color} weight="900">{config.label}</Typography>
                          </View>
                       </View>
                       <View style={styles.mainTime}>
                          <Typography variant="displaySmall" weight="900">{q.estimatedWaitMins}</Typography>
                          <Typography variant="labelSmall" color={theme.colors.outline} weight="900">MINS</Typography>
                       </View>
                    </View>

                    <View style={styles.trendRow}>
                       <View style={styles.trendVisual}>
                          {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.5, 0.4].map((h, i) => (
                            <View key={i} style={[styles.trendBar, { height: h * 24, backgroundColor: config.color, opacity: 0.2 + (i * 0.1) }]} />
                          ))}
                       </View>
                       <Typography variant="labelSmall" color={theme.colors.outline} weight="700">LIVE PATIENCE TREND</Typography>
                    </View>

                    {isSelected ? (
                      <View style={styles.editSection}>
                         <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ marginBottom: 12 }}>REVISE ESTIMATE</Typography>
                         <TextInput 
                           style={styles.input}
                           value={overrideVal}
                           onChangeText={setOverrideVal}
                           keyboardType="numeric"
                           autoFocus
                           placeholder="0"
                           placeholderTextColor={theme.colors.outline}
                         />
                         <View style={styles.editActions}>
                            <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdate(q.zoneId, parseInt(overrideVal, 10))}>
                               <Typography variant="labelSmall" color="white" weight="900">APPLY</Typography>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickActionBtn} onPress={() => handleUpdate(q.zoneId, Math.max(0, q.estimatedWaitMins - 5))}>
                               <Typography variant="labelSmall" color={theme.colors.primary} weight="900">-5M</Typography>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedQueue(null)}>
                               <Typography variant="labelSmall" color={theme.colors.outline} weight="900">CANCEL</Typography>
                            </TouchableOpacity>
                         </View>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.adjustBtn} 
                        onPress={() => { setSelectedQueue(q); setOverrideVal(String(q.estimatedWaitMins)); }}
                      >
                         <Typography variant="labelSmall" color={theme.colors.primary} weight="900">TAP TO MANUALLY ADJUST</Typography>
                         <Ionicons name="create-outline" size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                    )}
                 </TonalCard>
               </View>
             );
           })}
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
         <TonalCard variant="highest" style={styles.statsBar}>
            <View style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="900">VEHICLE INFLOW</Typography>
               <Typography variant="titleLarge" weight="900">Low</Typography>
            </View>
            <View style={styles.statBoxDivider} />
            <View style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="900">SYSTEM AVG</Typography>
               <Typography variant="titleLarge" weight="900">12m</Typography>
            </View>
         </TonalCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 160 },
  header: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
  grid: { paddingHorizontal: 20 },
  queueWrapper: { marginBottom: 16 },
  queueCard: { padding: 24, borderRadius: 28, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  zoneName: { marginBottom: 6 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  mainTime: { alignItems: 'center', backgroundColor: theme.colors.background, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.surfaceVariant, minWidth: 80 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  trendVisual: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  trendBar: { width: 3, borderRadius: 2 },
  adjustBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.surfaceVariant },
  editSection: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.surfaceVariant },
  input: { backgroundColor: theme.colors.background, borderRadius: 16, padding: 16, fontSize: 32, fontWeight: '900', color: theme.colors.onSurface, textAlign: 'center', borderWidth: 1, borderColor: theme.colors.primary, marginBottom: 20 },
  editActions: { flexDirection: 'row', gap: 10 },
  updateBtn: { flex: 2, backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  quickActionBtn: { flex: 1, backgroundColor: theme.colors.surfaceVariant, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.outlineVariant },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  footer: { position: 'absolute', left: 20, right: 20, bottom: 0 },
  statsBar: { flexDirection: 'row', padding: 24, borderRadius: 32, backgroundColor: theme.colors.surface, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxDivider: { width: 1, height: 32, backgroundColor: theme.colors.surfaceVariant },
});
