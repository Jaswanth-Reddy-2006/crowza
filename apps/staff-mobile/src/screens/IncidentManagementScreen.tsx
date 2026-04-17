import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchIncidents, updateIncident } from '../store/slices/incidentManagementSlice';
import { Ionicons } from '@expo/vector-icons';

// Get window dimensions (for future responsive layout usage)
const SCREEN_WIDTH = Dimensions.get('window').width;

const SEVERITY_COLORS = {
  critical: '#BA1A1A',
  high: '#FF9800',
  medium: '#FFC107',
  low: '#4CAF50',
} as const;

export default function IncidentManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { incidents } = useAppSelector((s) => s.incidentManagement);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showTriage, setShowTriage] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchIncidents({}));
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openTriage = (incident: any) => {
    setSelectedIncident(incident);
    setShowTriage(true);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateStatus = async (status: any) => {
    await dispatch(updateIncident({ id: selectedIncident.id, updates: { status } }));
    setShowTriage(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 2 }}>TRIAGE FEED</Typography>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Incidents</Typography>
        </View>

        <View style={styles.feed}>
           {(!incidents || incidents.length === 0) ? (
             <View style={styles.emptyState}>
               <Ionicons name="shield-checkmark-outline" size={64} color={theme.colors.outline} />
               <Typography variant="titleMedium" color={theme.colors.outline} style={{ marginTop: 16 }}>All Sectors Clear</Typography>
               <Typography variant="bodySmall" color={theme.colors.outline}>No active incidents reported in the current quadrant.</Typography>
             </View>
           ) : (
             incidents.map((inc) => (
               <TouchableOpacity 
                 key={inc.id} 
                 style={styles.incidentWrapper}
                 onPress={() => openTriage(inc)}
               >
                 <TonalCard variant="medium" style={{ ...styles.incidentCard, borderLeftColor: (SEVERITY_COLORS as any)[inc.severity] || theme.colors.outline }}>
                    <View style={styles.cardHeader}>
                       <View style={[styles.severityBadge, { backgroundColor: `${(SEVERITY_COLORS as any)[inc.severity]}20` }]}>
                          <Typography variant="labelSmall" color={(SEVERITY_COLORS as any)[inc.severity]}>{inc.severity.toUpperCase()}</Typography>
                       </View>
                       <Typography variant="labelSmall" color={theme.colors.outline}>2m ago</Typography>
                    </View>

                    <Typography variant="titleLarge" color={theme.colors.onSurface} weight="700" style={styles.title}>{inc.title}</Typography>
                    <Typography variant="bodyMedium" color={theme.colors.outline} numberOfLines={2}>{inc.description}</Typography>

                    <View style={styles.cardFooter}>
                       <View style={styles.locationTag}>
                          <Typography variant="labelSmall" color={theme.colors.onSurfaceVariant}>📍 {inc.location || 'Zone A'}</Typography>
                       </View>
                       <View style={[styles.statusChip, { backgroundColor: `${theme.colors.primary}15` }]}>
                          <Typography variant="labelSmall" color={theme.colors.primary}>{inc.status.replace('_', ' ').toUpperCase()}</Typography>
                       </View>
                    </View>
                 </TonalCard>
               </TouchableOpacity>
             ))
           )}
        </View>
      </ScrollView>

      {/* Triage Modal */}
      <Modal visible={showTriage} transparent animationType="fade">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowTriage(false)} />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 40, backgroundColor: theme.colors.surface }]}>
               <View style={styles.handle} />
               <View style={[styles.triageHeader, { borderLeftColor: (SEVERITY_COLORS as any)[selectedIncident?.severity] || theme.colors.outline }]}>
                  <Typography variant="headlineSmall" color={theme.colors.onSurface}>{selectedIncident?.title}</Typography>
                  <Typography variant="bodyMedium" color={theme.colors.outline}>{selectedIncident?.description}</Typography>
               </View>

               <Typography variant="labelSmall" color={theme.colors.primary} style={{ marginBottom: 16 }}>ACTION REQUIRED</Typography>
               
               <View style={styles.actionGrid}>
                  {[
                    { label: 'Dispatch', status: 'assigned', icon: '🚙' },
                    { label: 'Families', status: 'alert_families', icon: '📣' },
                    { label: 'Resolved', status: 'resolved', icon: '✅' },
                  ].map((action) => (
                    <TouchableOpacity 
                      key={action.status} 
                      style={styles.triageBtn}
                      onPress={() => action.status === 'alert_families' ? {} : updateStatus(action.status)}
                    >
                       <TonalCard variant="low" style={styles.triageActionCard}>
                          <Typography variant="headlineSmall">{action.icon}</Typography>
                          <Typography variant="labelSmall" color={theme.colors.onSurface} weight="700">{action.label}</Typography>
                       </TonalCard>
                    </TouchableOpacity>
                  ))}
               </View>

               <SignatureButton 
                 label="CLOSE" 
                 onPress={() => setShowTriage(false)} 
                 variant="secondary" 
                 style={{ marginTop: 24 }}
               />
            </View>
         </View>
      </Modal>

      {/* FAB: Report */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => {}}
      >
         <Typography variant="displaySmall" color="white">+</Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  feed: { paddingBottom: 100 },
  incidentWrapper: { marginBottom: 16, paddingHorizontal: 16 },
  incidentCard: { borderLeftWidth: 4, borderRadius: 16, padding: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100, gap: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: { marginBottom: 8 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  locationTag: {
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusChip: {
    backgroundColor: 'rgba(255,152,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
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
  triageHeader: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  triageBtn: { flex: 1 },
  triageActionCard: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation.highest,
  },
});
