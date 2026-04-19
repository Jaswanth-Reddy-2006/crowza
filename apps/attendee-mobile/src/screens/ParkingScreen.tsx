/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PARKING_LEVELS = [
  { id: 'b1', level: 'Level B1', name: 'VIP & STAGE ACCESS', occupancy: 94, status: 'CRITICAL', color: '#EF4444', meta: '24 spots left' },
  { id: 'b2', level: 'Level B2', name: 'GENERAL EAST', occupancy: 68, status: 'MODERATE', color: '#F59E0B', meta: '142 spots left' },
  { id: 'b3', level: 'Level B3', name: 'GENERAL WEST', occupancy: 32, status: 'AVAILABLE', color: '#F98000', meta: '480 spots left' },
];

export default function ParkingScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState('Overview');
  const [savedSpot, setSavedSpot] = useState<string | null>('B2 - Row D, 12');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(fetchZones(venueId));
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [dispatch, venueId]);

  const renderOverview = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
         <Typography variant="titleMedium" weight="900">Level Occupancy</Typography>
         <Typography variant="labelSmall" color={theme.colors.primary} weight="800">LIVE FEED</Typography>
      </View>
      {PARKING_LEVELS.map((lvl) => (
        <TonalCard key={lvl.id} variant="low" style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.levelInfo}>
              <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ letterSpacing: 1 }}>{lvl.level}</Typography>
              <Typography variant="titleMedium" weight="800" style={{ marginTop: 2 }}>{lvl.name}</Typography>
              <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginTop: 4 }}>{lvl.meta}</Typography>
            </View>
            <View style={styles.occupancyCircle}>
               <Typography variant="titleLarge" color={lvl.color} weight="900">{lvl.occupancy}%</Typography>
            </View>
          </View>
          <View style={styles.progressContainer}>
             <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${lvl.occupancy}%`, backgroundColor: lvl.color }]} />
             </View>
          </View>
        </TonalCard>
      ))}
    </View>
  );

  const renderMyVehicle = () => (
    <View style={styles.section}>
      {savedSpot ? (
        <View style={styles.vehicleView}>
          <TonalCard variant="highest" style={styles.vehicleHero} dark>
            <LinearGradient
              colors={['#1E1B4B', '#312E81', '#1E1B4B']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.vehicleHeader}>
               <Animated.View style={[styles.pulseIcon, { transform: [{ scale: pulseAnim }] }]}>
                  <MaterialCommunityIcons name="car-connected" size={48} color="white" />
               </Animated.View>
               <View style={{ marginLeft: 20 }}>
                  <Typography variant="labelSmall" color="rgba(255,255,255,0.6)" weight="900">CURRENT POSITION</Typography>
                  <Typography variant="headlineMedium" color="white" weight="900">{savedSpot}</Typography>
               </View>
            </View>
            
            <View style={styles.vehicleStats}>
               <View style={styles.vehicleStat}>
                  <Typography variant="labelSmall" color="rgba(255,255,255,0.6)" weight="800">EST. EXIT TIME</Typography>
                  <Typography variant="titleLarge" color="white" weight="900">12 MIN</Typography>
               </View>
               <View style={styles.statDivider} />
               <View style={styles.vehicleStat}>
                  <Typography variant="labelSmall" color="rgba(255,255,255,0.6)" weight="800">WALK TO CAR</Typography>
                  <Typography variant="titleLarge" color="white" weight="900">4 MIN</Typography>
               </View>
            </View>

            <SignatureButton 
              label="START GUIDED NAVIGATION" 
              variant="primary" 
              onPress={() => navigation.navigate('Map', { target: 'parking', spot: savedSpot })}
              style={styles.locatorBtn}
              icon="navigate"
            />
          </TonalCard>

          <TonalCard variant="low" style={styles.reminderCard}>
             <Ionicons name="notifications" size={20} color={theme.colors.primary} />
             <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={{ flex: 1, marginLeft: 12 }}>
                We'll notify you 20 mins before your predicted exit window to avoid traffic surges.
             </Typography>
          </TonalCard>
        </View>
      ) : (
        <View style={styles.emptyState}>
           <MaterialCommunityIcons name="car-off" size={64} color={theme.colors.outlineVariant} />
           <Typography variant="titleLarge" weight="800" style={{ marginTop: 24 }}>Where's your car?</Typography>
           <Typography variant="bodyMedium" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 12 }}>
              Save your parking spot to get live exit flow updates and turn-by-turn walking directions back to your car.
           </Typography>
           <SignatureButton 
              label="PIN CURRENT SPOT" 
              variant="secondary" 
              onPress={() => setSavedSpot('B2 - Row D, 12')}
              style={{ marginTop: 32, width: '100%' }}
           />
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="900">Parking Hub</Typography>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <EditorialHeader
          metadata="ARENA LOGISTICS"
          title="Dynamic Status"
          subtitle="Intelligent parking and vehicle locating"
        />
      </View>

      <View style={styles.tabContainer}>
         <View style={styles.tabBar}>
            {['Overview', 'My Vehicle', 'Services'].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[styles.tab, activeTab === t && styles.tabActive]}
              >
                <Typography 
                   variant="labelMedium" 
                   weight="900" 
                   color={activeTab === t ? theme.colors.primary : theme.colors.outline}
                >
                   {t.toUpperCase()}
                </Typography>
                {activeTab === t && <View style={styles.indicator} />}
              </TouchableOpacity>
            ))}
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
         <View style={styles.statsSummary}>
            <View style={styles.summaryBox}>
               <Typography variant="displaySmall" weight="900" color={theme.colors.primary}>582</Typography>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="800" style={{ letterSpacing: 1 }}>SPOTS AVAILABLE</Typography>
            </View>
            <View style={styles.summaryBox}>
               <Typography variant="displaySmall" weight="900" color={theme.colors.onSurface}>04m</Typography>
               <Typography variant="labelSmall" color={theme.colors.outline} weight="800" style={{ letterSpacing: 1 }}>AVG INFLOW</Typography>
            </View>
         </View>

         {activeTab === 'Overview' && renderOverview()}
         {activeTab === 'My Vehicle' && renderMyVehicle()}
         {activeTab === 'Services' && (
           <View style={styles.section}>
              <View style={styles.servicesGrid}>
                 {[
                   { id: 1, name: 'Valet Service', desc: 'VIP drop-off at Gate A', icon: 'key' },
                   { id: 2, name: 'EV Charging', desc: '12 active stations B2', icon: 'flash' },
                   { id: 3, name: 'Shuttle Bus', desc: 'Runs every 5 minutes', icon: 'bus' },
                   { id: 4, name: 'Roadside', desc: 'Tire & battery support', icon: 'tools' },
                 ].map(s => (
                   <TonalCard key={s.id} variant="low" style={styles.serviceCard}>
                      <View style={styles.serviceIcon}>
                         <MaterialCommunityIcons name={s.icon as any} size={28} color={theme.colors.primary} />
                      </View>
                      <Typography variant="titleSmall" weight="900" style={{ marginTop: 16 }}>{s.name}</Typography>
                      <Typography variant="bodySmall" color={theme.colors.outline} numberOfLines={2} style={{ marginTop: 6, textAlign: 'center' }}>
                         {s.desc}
                      </Typography>
                   </TonalCard>
                 ))}
              </View>
           </View>
         )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  tabContainer: {
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 32,
  },
  tab: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  scroll: {
    paddingBottom: 40,
  },
  statsSummary: {
    flexDirection: 'row',
    padding: 24,
    gap: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
  },
  occupancyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  vehicleView: {
    gap: 20,
  },
  vehicleHero: {
    padding: 28,
    borderRadius: 32,
    minHeight: 300,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
  },
  vehicleStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  locatorBtn: {
    marginTop: 24,
    width: '100%',
  },
  reminderCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer + '30',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 32,
    marginTop: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceCard: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',
    minHeight: 180,
  },
  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
