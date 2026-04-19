/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
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
import { theme, TonalCard, Typography, SignatureButton, EditorialHeader } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchIncidents, updateIncident } from '../store/slices/incidentManagementSlice';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SEVERITY_COLORS = {
  critical: '#BA1A1A',
  high: '#F97316',
  medium: '#EAB308',
  low: '#F98000',
} as const;

import { OperationalHeader } from '../components/OperationalHeader';

export default function IncidentManagementScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { incidents } = useAppSelector((s) => s.incidentManagement);

  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showTriage, setShowTriage] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchIncidents({}));
  }, [dispatch]);

  const openTriage = (incident: any) => {
    setSelectedIncident(incident);
    setShowTriage(true);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
  };

  const updateStatus = async (status: any) => {
    await dispatch(updateIncident({ id: selectedIncident.id, updates: { status } }));
    setShowTriage(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary, paddingTop: insets.top }]}>
      <OperationalHeader
        metadata="SECURITY OPERATIONS"
        title="Active Incidents"
        subtitle="Monitor and triage reported issues across the venue in real-time."
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.feed}>
           {(!incidents || incidents.length === 0) ? (
             <View style={styles.emptyState}>
               <TonalCard variant="low" style={styles.emptyCard}>
                  <Ionicons name="shield-checkmark" size={48} color={theme.colors.primary} />
                  <Typography variant="titleLarge" weight="900" style={{ marginTop: 16 }}>All Sectors Clear</Typography>
                  <Typography variant="bodySmall" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 8 }}>
                    No active security incidents or operational disruptions reported at this time.
                  </Typography>
               </TonalCard>
             </View>
           ) : (
             incidents.map((inc) => (
               <TouchableOpacity 
                 key={inc.id} 
                 style={styles.incidentWrapper}
                 onPress={() => openTriage(inc)}
               >
                 <TonalCard variant="medium" style={styles.incidentCard}>
                    <View style={styles.cardPriority} backgroundColor={(SEVERITY_COLORS as any)[inc.severity] || theme.colors.outline} />
                    
                    <View style={styles.cardHeader}>
                       <View style={[styles.severityBadge, { backgroundColor: `${(SEVERITY_COLORS as any)[inc.severity]}15` }]}>
                          <Typography variant="labelSmall" color={(SEVERITY_COLORS as any)[inc.severity]} weight="900">{inc.severity.toUpperCase()}</Typography>
                       </View>
                       <Typography variant="labelSmall" color={theme.colors.outline} weight="700">2m ago</Typography>
                    </View>

                    <Typography variant="titleLarge" weight="900" style={styles.title}>{inc.title}</Typography>
                    <Typography variant="bodyMedium" color={theme.colors.outline} numberOfLines={2}>{inc.description}</Typography>

                    <View style={styles.cardFooter}>
                       <View style={styles.locationTag}>
                          <Ionicons name="location" size={12} color={theme.colors.primary} />
                          <Typography variant="labelSmall" color={theme.colors.onSurface} weight="800" style={{ marginLeft: 4 }}>{inc.location || 'Zone A'}</Typography>
                       </View>
                       <View style={styles.statusChip}>
                          <Typography variant="labelSmall" color={theme.colors.primary} weight="900">{inc.status.replace('_', ' ').toUpperCase()}</Typography>
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
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 40 }]}>
               <View style={styles.handle} />
               
               <View style={styles.sheetHeader}>
                  <View style={[styles.sheetIcon, { backgroundColor: `${(SEVERITY_COLORS as any)[selectedIncident?.severity]}15` }]}>
                     <Ionicons name="alert-circle" size={32} color={(SEVERITY_COLORS as any)[selectedIncident?.severity]} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 20 }}>
                     <Typography variant="headlineSmall" weight="900">{selectedIncident?.title}</Typography>
                     <Typography variant="labelSmall" color={theme.colors.primary} weight="900">INCIDENT ID: {selectedIncident?.id?.slice(0, 8)}</Typography>
                  </View>
               </View>

               <Typography variant="bodyLarge" color={theme.colors.outline} style={{ marginBottom: 32 }}>
                 {selectedIncident?.description}
               </Typography>

               <Typography variant="labelSmall" color={theme.colors.outline} weight="900" style={{ marginBottom: 16 }}>REQUIRED ACTIONS</Typography>
               
               <View style={styles.actionGrid}>
                  {[
                    { label: 'Dispatch', status: 'assigned', icon: 'navigate', color: theme.colors.primary },
                    { label: 'Broadcast', status: 'alert_families', icon: 'megaphone', color: '#F97316' },
                    { label: 'Resolve', status: 'resolved', icon: 'checkmark-circle', color: '#F98000' },
                  ].map((action) => (
                    <TouchableOpacity 
                      key={action.status} 
                      style={styles.triageBtn}
                      onPress={() => action.status === 'alert_families' ? {} : updateStatus(action.status)}
                    >
                       <TonalCard variant="low" style={styles.triageActionCard}>
                          <Ionicons name={action.icon as any} size={28} color={action.color} />
                          <Typography variant="labelSmall" color={theme.colors.onSurface} weight="800" style={{ marginTop: 8 }}>{action.label.toUpperCase()}</Typography>
                       </TonalCard>
                    </TouchableOpacity>
                  ))}
               </View>

               <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTriage(false)}>
                  <Typography variant="labelLarge" color={theme.colors.outline} weight="900">CLOSE TRIAGE</Typography>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>

      {/* FAB: Report */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => {}}
      >
         <LinearGradient colors={[theme.colors.primary, '#EAB308']} style={styles.fabGradient}>
            <Ionicons name="add" size={32} color={theme.colors.onPrimary} />
         </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  feed: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyState: { paddingVertical: 60 },
  emptyCard: { padding: 40, borderRadius: 32, alignItems: 'center', backgroundColor: theme.colors.surface },
  incidentWrapper: { marginBottom: 16 },
  incidentCard: { borderRadius: 24, padding: 24, paddingLeft: 30, backgroundColor: theme.colors.surface, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  cardPriority: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  title: { marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  locationTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  statusChip: { backgroundColor: theme.colors.primaryContainer + '40', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32 },
  handle: { width: 40, height: 4, backgroundColor: theme.colors.outlineVariant, borderRadius: 2, alignSelf: 'center', marginBottom: 32 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  sheetIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  actionGrid: { flexDirection: 'row', gap: 12 },
  triageBtn: { flex: 1 },
  triageActionCard: { paddingVertical: 24, borderRadius: 24, alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  closeBtn: { marginTop: 40, alignSelf: 'center', padding: 12 },
  fab: { position: 'absolute', right: 24, width: 64, height: 64, borderRadius: 32, overflow: 'hidden', elevation: 8, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
  fabGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
