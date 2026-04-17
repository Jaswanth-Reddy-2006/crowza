import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logoutStaff } from '../store/slices/staffAuthSlice';
import { Ionicons } from '@expo/vector-icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SCREEN_WIDTH = Dimensions.get('window').width;

const EVENT_HISTORY = [
  { id: '1', name: 'Champions League Final 2026', date: 'June 12, 2026', role: 'Chief Marshal', status: 'COMPLETED' },
  { id: '2', name: 'Global Tech Summit', date: 'May 28, 2026', role: 'Zone Supervisor', status: 'COMPLETED' },
  { id: '3', name: 'The Weeknd World Tour', date: 'April 15, 2026', role: 'Crowd Manager', status: 'COMPLETED' },
  { id: '4', name: 'Corporate Expo', date: 'March 10, 2026', role: 'Marshal', status: 'COMPLETED' },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const staff = useAppSelector((s) => s.staffAuth.staff);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: Platform.OS !== 'web' }).start();
  }, []);

  const handleLogout = () => {
    dispatch(logoutStaff());
    navigation.replace('StaffLogin');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.secondary }]} />
              <Typography variant="labelSmall" color={theme.colors.secondary} style={{ letterSpacing: 3 }}>COMMANDER IDENTITY</Typography>
           </View>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Operational Profile</Typography>
        </View>

        {/* Hero Identity Profile */}
        <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
           <TonalCard variant="high" style={styles.profileCard}>
               <View style={styles.profileHead}>
                  <View style={styles.avatar}>
                     <Typography variant="headlineMedium" color={theme.colors.onPrimary}>{(staff?.displayName?.[0] || 'S').toUpperCase()}</Typography>
                  </View>
                  <View style={{ flex: 1 }}>
                     <Typography variant="titleLarge" color={theme.colors.onSurface} weight="800">{staff?.displayName || 'Commander Staff'}</Typography>
                     <Typography variant="labelSmall" color={theme.colors.primary} weight="700">{staff?.role || 'OPERATIONS MANAGER'}</Typography>
                  </View>
                  <TouchableOpacity style={styles.editBtn}>
                     <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
               </View>

               <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                     <Typography variant="titleLarge" color={theme.colors.onSurface} weight="800">124</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline} weight="600">INCIDENTS</Typography>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                     <Typography variant="titleLarge" color={theme.colors.onSurface} weight="800">28</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline} weight="600">SHIFTS</Typography>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                     <Typography variant="titleLarge" color={theme.colors.primary} weight="800">4.9</Typography>
                     <Typography variant="labelSmall" color={theme.colors.outline} weight="600">RATING</Typography>
                  </View>
               </View>
           </TonalCard>
        </Animated.View>

        {/* Event History Section */}
        <View style={styles.section}>
            <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>EVENT HISTORY</Typography>
            <TonalCard variant="medium" style={styles.historyList}>
               {EVENT_HISTORY.map((event, i) => (
                 <View key={event.id} style={[styles.historyRow, i === EVENT_HISTORY.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.historyIcon}>
                       <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                       <Typography variant="titleSmall" color={theme.colors.onSurface} weight="700">{event.name}</Typography>
                       <Typography variant="labelSmall" color={theme.colors.outline}>{event.date} • {event.role}</Typography>
                    </View>
                    <View style={styles.statusBadge}>
                       <Typography variant="labelSmall" color={theme.colors.primary} weight="700">DONE</Typography>
                    </View>
                 </View>
               ))}
            </TonalCard>
        </View>

        {/* Operational Excellence Score */}
        <View style={styles.section}>
            <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>PERFORMANCE METRICS</Typography>
            <TonalCard variant="low" style={styles.metricsCard}>
               <View style={styles.metricRow}>
                  <Typography variant="bodyLarge" color={theme.colors.onSurface}>Response Velocity</Typography>
                  <Typography variant="titleLarge" color={theme.colors.primary} weight="800">Top 5%</Typography>
               </View>
               <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: '92%', backgroundColor: theme.colors.primary }]} />
               </View>
            </TonalCard>
        </View>

        <View style={[styles.section, { marginTop: 16, marginBottom: 80 }]}>
           <SignatureButton label="SIGN OUT COMMANDER" onPress={handleLogout} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  profileSection: { paddingHorizontal: 16, marginBottom: 32 },
  profileCard: { padding: 24, borderRadius: 32, gap: 24 },
  profileHead: { flexDirection: 'row', gap: 20, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  editBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: `${theme.colors.primary}15`, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.outlineVariant },
  statBox: { alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: theme.colors.outlineVariant },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionLabel: { marginBottom: 16, letterSpacing: 1, fontWeight: '700' },
  historyList: { borderRadius: 32, padding: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16, borderBottomWidth: 1, borderColor: theme.colors.outlineVariant },
  historyIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { backgroundColor: `${theme.colors.primary}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  metricsCard: { padding: 24, borderRadius: 24, gap: 16 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBarContainer: { height: 6, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 3 },
  progressBar: { height: '100%', borderRadius: 3 },
});
