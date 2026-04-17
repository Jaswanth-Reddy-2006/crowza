import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchDashboardMetrics } from '../store/slices/dashboardSlice';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();

  const { occupancyMetrics, incidentCount, avgWaitTime, lastRefreshed } = useAppSelector((s) => s.dashboard);
  const staff = useAppSelector((s) => s.staffAuth.staff);
  const occupancyPct = occupancyMetrics?.occupancyPercentage || 0;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchDashboardMetrics(venueId));
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: Platform.OS !== 'web' }),
      ])
    ).start();
  }, [dispatch, venueId]);

  const OPERATIONAL_ACTIONS = [
    { label: 'Incidents', icon: 'alert-circle-outline', color: theme.colors.error, screen: 'Incidents' },
    { label: 'Gate/Parking', icon: 'car-outline', color: theme.colors.tertiary, screen: 'Parking' },
    { label: 'Queues', icon: 'time-outline', color: theme.colors.primary, screen: 'WaitTimes' },
    { label: 'Occupancy', icon: 'people-outline', color: theme.colors.secondary, screen: 'Occupancy' },
    { label: 'Intelligence', icon: 'stats-chart-outline', color: theme.colors.primary, screen: 'Radar' },
    { label: 'Broadcast', icon: 'megaphone-outline', color: theme.colors.secondary, screen: 'Dashboard' },
    { label: 'Map Status', icon: 'pulse-outline', color: theme.colors.tertiary, screen: 'Radar' },
    { label: 'Commander', icon: 'person-outline', color: theme.colors.primary, screen: 'Profile' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Superior Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
           <View style={styles.headerTop}>
               <View>
                  <Typography variant="labelSmall" color={theme.colors.primary} style={styles.venueTag}>OPERATIONS • {venueId.toUpperCase()}</Typography>
                  <Typography variant="headlineMedium" color={theme.colors.onSurface} weight="800">Commander {staff?.displayName?.split(' ')[0] || 'Staff'}</Typography>
               </View>
              <TouchableOpacity style={styles.liveIndicator} onPress={() => navigation.navigate('Radar')}>
                 <Animated.View style={[styles.pulse, { opacity: pulseAnim }]} />
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="700">LIVE</Typography>
              </TouchableOpacity>
           </View>
           {lastRefreshed && (
             <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginTop: 4 }}>
                Last Telemetry Sync: {new Date(lastRefreshed).toLocaleTimeString()}
             </Typography>
           )}
        </View>

        {/* Live Venue Hero */}
         <View style={styles.heroSection}>
            <TonalCard variant="highest" style={styles.heroCard}>
               <View style={styles.metricItem}>
                  <Typography variant="displayMedium" color={theme.colors.onSurface} weight="800">{occupancyPct.toFixed(0)}%</Typography>
                  <Typography variant="labelSmall" color={theme.colors.outline} weight="600">CAPACITY</Typography>
               </View>
               <View style={styles.heroDivider} />
               <View style={styles.metricItem}>
                  <Typography variant="displayMedium" color={incidentCount > 0 ? theme.colors.error : theme.colors.primary} weight="800">{incidentCount}</Typography>
                  <Typography variant="labelSmall" color={theme.colors.outline} weight="600">ACTIVE EVENTS</Typography>
               </View>
            </TonalCard>
         </View>

        {/* Command Grid - All Buttons */}
        <View style={styles.section}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>COMMAND CENTER CONSOLE</Typography>
           <View style={styles.actionGrid}>
              {OPERATIONAL_ACTIONS.map((action, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.actionBtn} 
                  onPress={() => action.screen !== 'Dashboard' && navigation.navigate(action.screen)}
                >
                   <TonalCard variant="low" style={styles.actionCard}>
                      <Ionicons name={action.icon as any} size={26} color={action.color} />
                      <Typography variant="labelSmall" color={theme.colors.onSurfaceVariant} weight="700" style={{ fontSize: 9 }}>{action.label.toUpperCase()}</Typography>
                   </TonalCard>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        {/* My Day - Tasks Preview */}
         <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>PRIORITY INTERVENTIONS</Typography>
               <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="700">MANAGE ALL</Typography>
               </TouchableOpacity>
            </View>
            <TonalCard variant="medium" style={styles.taskPreview}>
               <View style={styles.taskRow}>
                  <View style={[styles.taskIndicator, { backgroundColor: theme.colors.error }]} />
                  <View style={{ flex: 1 }}>
                     <Typography variant="titleSmall" color={theme.colors.onSurface}>Perimeter Breach Alert</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline}>URGENT SECURITY • GATE 4</Typography>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
               </View>
               <View style={styles.taskRowDivider} />
               <View style={styles.taskRow}>
                  <View style={[styles.taskIndicator, { backgroundColor: theme.colors.primary }]} />
                  <View style={{ flex: 1 }}>
                     <Typography variant="titleSmall" color={theme.colors.onSurface}>Intelligence Briefing</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline}>ROUTINE • COMMAND HUB</Typography>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
               </View>
            </TonalCard>
         </View>

        {/* Intelligence Quick Stats */}
        <View style={[styles.section, { marginBottom: 40 }]}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>OPERATIONAL INTELLIGENCE</Typography>
           <View style={styles.shiftGrid}>
               <TonalCard variant="low" style={styles.shiftCard}>
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="700">WAIT TIME</Typography>
                  <Typography variant="headlineSmall" color={theme.colors.onSurface} weight="800">{avgWaitTime || 0}m</Typography>
               </TonalCard>
               <TonalCard variant="low" style={styles.shiftCard}>
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="700">EFFICIENCY</Typography>
                  <Typography variant="headlineSmall" color={theme.colors.onSurface} weight="800">98%</Typography>
               </TonalCard>
           </View>
        </View>
      </ScrollView>

      {/* SOS Fixed Button */}
      <View style={[styles.sosContainer, { bottom: insets.bottom + 16 }]}>
         <SignatureButton 
           label="EMERGENCY SOS" 
           onPress={() => {}} 
           variant="primary" 
           style={styles.sosButton}
         />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 120 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  venueTag: { letterSpacing: 2, marginBottom: 4 },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
  heroSection: { paddingHorizontal: 16, marginBottom: 24 },
  heroCard: { flexDirection: 'row', padding: 32, borderRadius: 32, justifyContent: 'center' },
  metricItem: { flex: 1, alignItems: 'center', gap: 6 },
  heroDivider: { width: 1, backgroundColor: theme.colors.outlineVariant, marginHorizontal: 20 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { letterSpacing: 1, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  actionBtn: { width: (SCREEN_WIDTH - 32 - 30) / 4 },
  actionCard: { height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 4 },
  taskPreview: { borderRadius: 24, padding: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  taskIndicator: { width: 4, height: 32, borderRadius: 2 },
  taskRowDivider: { height: 1, backgroundColor: theme.colors.outlineVariant, marginHorizontal: 16 },
  shiftGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  shiftCard: { flex: 1, padding: 20, borderRadius: 24, gap: 8 },
  sosContainer: { position: 'absolute', left: 24, right: 24 },
  sosButton: { backgroundColor: theme.colors.error, height: 56, borderRadius: 28 },
});
