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
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchAllQueues, updateWaitEstimate } from '../store/slices/waitTimeManagementSlice';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const SCREEN_WIDTH = Dimensions.get('window').width;

function getWaitConfig(mins: number) {
  if (mins >= 30) return { color: theme.colors.error, label: 'HIGH DELAY' };
  if (mins >= 15) return { color: '#FF9800', label: 'MODERATE' };
  return { color: theme.colors.primary, label: 'OPTIMAL' };
}

export default function WaitTimeManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const { queues } = useAppSelector((s) => s.waitTimeManagement);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 2 }}>QUEUE OPS</Typography>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Wait Times</Typography>
        </View>

        <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
           {queues.map((q) => {
             const config = getWaitConfig(q.estimatedWaitMins);
             const isSelected = selectedQueue?.zoneId === q.zoneId;

             return (
               <View key={q.zoneId} style={styles.queueWrapper}>
                 <TonalCard variant={isSelected ? "highest" : "medium"} style={{ ...styles.queueCard, ...(isSelected ? { borderColor: theme.colors.primary, borderWidth: 1 } : {}) }}>
                    <View style={styles.cardHeader}>
                       <View>
                          <Typography variant="titleLarge" color={theme.colors.onSurface} style={styles.zoneName}>{q.zoneName}</Typography>
                          <Typography variant="labelSmall" color={config.color}>{config.label}</Typography>
                       </View>
                       <View style={styles.mainTime}>
                          <Typography variant="displaySmall" color={theme.colors.onSurface}>{q.estimatedWaitMins}m</Typography>
                       </View>
                    </View>

                    {/* Simple Waveform Trend */}
                    <View style={styles.trendRow}>
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3].map((h, i) => (
                         <View key={i} style={[styles.trendBar, { height: h * 24, backgroundColor: config.color, opacity: 0.3 + (i * 0.1) }]} />
                       ))}
                       <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginLeft: 8 }}>LIVE TREND</Typography>
                    </View>

                    {isSelected ? (
                      <View style={styles.editSection}>
                         <Typography variant="labelSmall" color={theme.colors.primary}>MANUAL OVERRIDE (MINS)</Typography>
                         <TextInput 
                           style={styles.input}
                           value={overrideVal}
                           onChangeText={setOverrideVal}
                           keyboardType="numeric"
                           autoFocus
                           placeholder="Enter mins"
                           placeholderTextColor={theme.colors.outlineVariant}
                         />
                         <View style={styles.editActions}>
                            <SignatureButton label="UPDATE" onPress={() => handleUpdate(q.zoneId, parseInt(overrideVal, 10))} variant="primary" style={{ flex: 1 }} />
                            <SignatureButton label="REDUCE 5m" onPress={() => handleUpdate(q.zoneId, Math.max(0, q.estimatedWaitMins - 5))} variant="secondary" style={{ flex: 1 }} />
                            <SignatureButton label="CANCEL" onPress={() => setSelectedQueue(null)} variant="tertiary" style={{ flex: 1 }} />
                         </View>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.adjustBtn} onPress={() => { setSelectedQueue(q); setOverrideVal(String(q.estimatedWaitMins)); }}>
                         <Typography variant="labelSmall" color={theme.colors.primary}>ADJUST ESTIMATE • REDUCE TIME</Typography>
                      </TouchableOpacity>
                    )}
                 </TonalCard>
               </View>
             );
           })}
        </Animated.View>
      </ScrollView>

      {/* Stats Summary Bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
         <TonalCard variant="high" style={styles.statsBar}>
            <View style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline}>AVG WAIT</Typography>
               <Typography variant="titleLarge" color={theme.colors.onSurface}>14m</Typography>
            </View>
            <View style={styles.statBox}>
               <Typography variant="labelSmall" color={theme.colors.outline}>TOTAL QUEUE</Typography>
               <Typography variant="titleLarge" color={theme.colors.onSurface}>1.2k</Typography>
            </View>
         </TonalCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 140 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  grid: { paddingHorizontal: 16 },
  queueWrapper: { marginBottom: 16 },
  queueCard: { padding: 24, borderRadius: 32, gap: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneName: { fontWeight: '700' },
  mainTime: { alignItems: 'flex-end' },
  trendRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  trendBar: { width: 4, borderRadius: 2 },
  adjustBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginTop: 8,
  },
  editSection: { gap: 12, marginTop: 8 },
  input: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    color: theme.colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  editActions: { flexDirection: 'row', gap: 8 },
  footer: { position: 'absolute', left: 16, right: 16, bottom: 0 },
  statsBar: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center', gap: 4 },
});

