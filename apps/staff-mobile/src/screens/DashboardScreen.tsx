import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { leaveEvent } from '../store/slices/staffAuthSlice';
import { LinearGradient } from 'expo-linear-gradient';

const QUICK_ACTIONS = [
  { id: 'scan', label: 'Quick Scan', icon: 'qrcode-scan' as const, color: '#7C3AED' },
  { id: 'map', label: 'Venue Radar', icon: 'map-outline' as const, color: '#F98000' },
  { id: 'note', label: 'Add Note', icon: 'pencil-box-outline' as const, color: '#10B981' },
  { id: 'incident', label: 'Reporting', icon: 'alert-octagon' as const, color: '#EF4444' }
];

const TASK_PREVIEW = [
  { id: '1', title: 'Verify VIP Section A-4', status: 'pending', time: '14:30', urgent: true },
  { id: '2', title: 'Media Team Coordination', status: 'active', time: '15:15', urgent: false }
];

type RootStackParamList = {
  Radar: undefined;
  Tasks: undefined;
  JoinEvent: undefined;
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { staff, joinedEventId } = useAppSelector((s) => s.staffAuth);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        {joinedEventId ? (
          /* MISSION ACTIVE - Elite Dash */
          <>
            <View style={styles.activeHeader}>
               <View>
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ letterSpacing: 2 }}>OPERATIONAL UNIT • 05</Typography>
                 <Typography variant="headlineLarge" weight="900" style={{ marginTop: 4 }}>Mission Terminal</Typography>
               </View>
               <TouchableOpacity style={styles.efficiencyCircle}>
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="900">EFFICIENCY</Typography>
                  <Typography variant="titleLarge" weight="900">92%</Typography>
               </TouchableOpacity>
            </View>

            {/* Quick Action Ribbon */}
            <View style={styles.actionRibbon}>
               {QUICK_ACTIONS.map(action => (
                 <TouchableOpacity key={action.id} style={styles.actionItem} onPress={() => action.id === 'map' && navigation.navigate('Radar')}>
                    <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                       <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
                    </View>
                    <Typography variant="labelSmall" weight="800" style={{ marginTop: 8, color: 'rgba(0,0,0,0.6)' }}>{action.label.toUpperCase()}</Typography>
                 </TouchableOpacity>
               ))}
            </View>

            {/* Tasks Block */}
            <View style={styles.tasksBlock}>
               <View style={styles.blockHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="list" size={20} color={theme.colors.primary} />
                    <Typography variant="titleMedium" weight="900">Assigned Missions</Typography>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                    <Typography variant="labelSmall" color={theme.colors.primary} weight="900">VIEW ALL</Typography>
                  </TouchableOpacity>
               </View>
               
               {TASK_PREVIEW.map(task => (
                 <TonalCard key={task.id} variant="low" style={[styles.taskCard, task.urgent && styles.urgentCard]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                         {task.urgent && <Ionicons name="flash" size={12} color={theme.colors.primary} />}
                         <Typography variant="bodyMedium" weight="800">{task.title}</Typography>
                      </View>
                      <Typography variant="labelSmall" color={theme.colors.outline} weight="700">TARGET WINDOW: {task.time}</Typography>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: task.status === 'pending' ? '#F5F5F5' : '#EEF2FF' }]}>
                      <Typography variant="labelSmall" color={task.status === 'pending' ? '#6B7280' : '#4F46E5'} weight="900">{task.status.toUpperCase()}</Typography>
                    </View>
                 </TonalCard>
               ))}
            </View>

            {/* Venue Stats Pulse */}
            <View style={styles.pulseBlock}>
               <Typography variant="titleMedium" weight="900" style={{ marginBottom: 16 }}>Venue Pulse</Typography>
               <View style={styles.pulseGrid}>
                  <View style={styles.pulseItem}>
                    <Typography variant="headlineSmall" weight="900">1,240</Typography>
                    <Typography variant="labelSmall" color={theme.colors.outline}>PEOPLE AT VENUE</Typography>
                  </View>
                  <View style={styles.pulseDivider} />
                  <View style={styles.pulseItem}>
                    <Typography variant="headlineSmall" weight="900" color="#10B981">SAFE</Typography>
                    <Typography variant="labelSmall" color={theme.colors.outline}>SECURITY STATUS</Typography>
                  </View>
               </View>
            </View>

            <TouchableOpacity 
              style={styles.terminateBtn}
              onPress={() => dispatch(leaveEvent())}
            >
               <Typography variant="labelLarge" color={theme.colors.outline} weight="900">TERMINATE SESSION</Typography>
            </TouchableOpacity>
          </>
        ) : (
          /* IDLE MODE - Professional Home Base */
          <>
            <EditorialHeader
              metadata="SQUADRON CORE"
              title={`Welcome, ${staff?.displayName?.split(' ')[0] || 'Team'}`}
              subtitle="Access your archival duties, performance metrics, and initialize active mission sessions."
            />

            <TonalCard variant="highest" style={styles.activateCard}>
               <LinearGradient colors={['#1F2937', '#111827']} style={styles.activateGradient}>
                  <View style={{ zIndex: 1, flex: 1 }}>
                    <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ letterSpacing: 2 }}>MISSION GATEWAY</Typography>
                    <Typography variant="headlineSmall" color="#FFF" weight="900" style={{ marginTop: 8 }}>Ready for Operations?</Typography>
                    <Typography variant="bodyMedium" color="rgba(255,255,255,0.6)" style={{ marginVertical: 12 }}>
                      Authorize your current shift with the venue commander to unlock the Stadium Map and Mission Radar.
                    </Typography>
                    <TouchableOpacity style={styles.goBtn} onPress={() => navigation.navigate('JoinEvent')}>
                       <Typography variant="labelLarge" color="#000" weight="900">ACTIVATE CODE</Typography>
                       <Ionicons name="flash" size={18} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <MaterialCommunityIcons name="shield-airplane" size={140} color="rgba(255,255,255,0.05)" style={styles.shieldIcon} />
               </LinearGradient>
            </TonalCard>

            <View style={styles.historySection}>
               <View style={styles.blockHeader}>
                  <Typography variant="titleLarge" weight="900">Performance Overview</Typography>
               </View>
               <View style={styles.statsRow}>
                  <TonalCard variant="low" style={styles.statBox}>
                    <Typography variant="headlineMedium" weight="900">124</Typography>
                    <Typography variant="labelSmall" color={theme.colors.outline} weight="900">MISSIONS DONE</Typography>
                  </TonalCard>
                  <TonalCard variant="low" style={styles.statBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                       <Ionicons name="star" size={16} color={theme.colors.primary} />
                       <Typography variant="headlineMedium" weight="900">4.9</Typography>
                    </View>
                    <Typography variant="labelSmall" color={theme.colors.outline} weight="900">OPS RATING</Typography>
                  </TonalCard>
               </View>
            </View>

            <View style={{ marginTop: 32 }}>
               <Typography variant="titleMedium" weight="900" style={{ marginBottom: 16 }}>Upcoming Deployments</Typography>
               <TonalCard variant="medium" style={styles.eventHintCard}>
                  <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                  <View style={{ marginLeft: 16 }}>
                     <Typography variant="bodyMedium" weight="800">Global Music Expo 2026</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline}>May 12 • Narendra Modi Stadium</Typography>
                  </View>
               </TonalCard>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  efficiencyCircle: { alignItems: 'center', backgroundColor: 'rgba(249, 128, 0, 0.05)', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(249, 128, 0, 0.1)' },
  actionRibbon: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  actionItem: { alignItems: 'center' },
  actionIconBox: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  tasksBlock: { marginBottom: 40 },
  blockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 12, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#F3F4F6' },
  urgentCard: { borderColor: theme.colors.primary + '30', backgroundColor: theme.colors.primary + '03' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  pulseBlock: { marginBottom: 40 },
  pulseGrid: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  pulseItem: { flex: 1, alignItems: 'center' },
  pulseDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB', marginHorizontal: 10 },
  terminateBtn: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  activateCard: { borderRadius: 32, overflow: 'hidden', marginVertical: 32, borderWidth: 1, borderColor: '#374151' },
  activateGradient: { padding: 32, flexDirection: 'row', alignItems: 'center' },
  goBtn: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, alignSelf: 'flex-start' },
  shieldIcon: { position: 'absolute', right: -30, bottom: -30 },
  historySection: { marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 28, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  eventHintCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#F3F4F6' },
});
