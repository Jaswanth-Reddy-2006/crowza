/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { selectAllWaitTimes, selectAllZones } from '../selectors';
import { setupWaitTimeListener } from '../services/firebase/realtimeListeners';
import { useRoute } from '@react-navigation/native';

type FilterTab = 'ALL' | 'FOOD' | 'RESTROOMS' | 'MEDICAL' | 'ENTRANCE' | 'EXIT' | 'PARKING' | 'SECURITY';

const FILTER_TABS: FilterTab[] = ['ALL', 'FOOD', 'ENTRANCE', 'EXIT', 'PARKING', 'MEDICAL', 'SECURITY'];

const AMENITY_ICONS: Record<string, string> = {
  FOOD: 'restaurant',
  RESTROOMS: 'water',
  MEDICAL: 'medical',
  ENTRANCE: 'enter',
  EXIT: 'exit',
  PARKING: 'car',
  DEFAULT: 'location',
};

function getZoneCategory(name: string): FilterTab {
  const lower = name.toLowerCase();
  if (lower.includes('food') || lower.includes('vendor') || lower.includes('concession')) return 'FOOD';
  if (lower.includes('restroom') || lower.includes('bathroom') || lower.includes('toilet')) return 'RESTROOMS';
  if (lower.includes('medical') || lower.includes('first aid') || lower.includes('health')) return 'MEDICAL';
  if (lower.includes('entrance') || lower.includes('gate in') || lower.includes('entry')) return 'ENTRANCE';
  if (lower.includes('exit') || lower.includes('emergency') || lower.includes('gate out')) return 'EXIT';
  if (lower.includes('park') || lower.includes('lot') || lower.includes('garage')) return 'PARKING';
  return 'ALL';
}

function getWaitColor(mins: number): string {
  if (mins < 5) return '#F98000';
  if (mins < 15) return '#F59E0B';
  if (mins < 30) return '#EF4444';
  return '#7F1D1D';
}

export default function WaitTimesScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  
  const zones = useAppSelector(selectAllZones);
  const waitTimes = useAppSelector(selectAllWaitTimes);
  const loading = useAppSelector((s) => s.waittime.loading);

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [showPredictions, setShowPredictions] = useState(route.params?.predictionMode || false);
  const [refreshing, setRefreshing] = useState(false);
  
  const VENUE_ID = useVenueId();

  useEffect(() => {
    dispatch(fetchZones(VENUE_ID));
    const unsubscribe = setupWaitTimeListener(VENUE_ID, dispatch);
    return () => unsubscribe();
  }, [dispatch, VENUE_ID]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchZones(VENUE_ID));
    setRefreshing(false);
  }, [dispatch, VENUE_ID]);

  const filteredZones = useMemo(() => {
    let list = zones;
    if (activeTab !== 'ALL') {
      list = zones.filter((z) => getZoneCategory(z.name) === activeTab);
    }
    return [...list].sort((a, b) => (waitTimes[b.id] || 0) - (waitTimes[a.id] || 0));
  }, [zones, activeTab, waitTimes]);

  const renderQueueCard = ({ item: zone }: { item: typeof zones[0] }) => {
    const waitMins = waitTimes[zone.id] ?? (Math.floor(Math.random() * 25)); // Mock if data missing
    const color = getWaitColor(waitMins);
    const category = getZoneCategory(zone.name);
    const iconName = AMENITY_ICONS[category] || AMENITY_ICONS.DEFAULT;
    
    const predictions = [
      { time: 'In 15m', wait: Math.max(5, waitMins + (Math.random() > 0.5 ? 5 : -5)), trend: Math.random() > 0.5 ? 'up' : 'down' },
      { time: 'In 30m', wait: Math.max(5, waitMins + (Math.random() > 0.5 ? 10 : -10)), trend: Math.random() > 0.5 ? 'up' : 'down' },
    ];

    return (
      <View style={styles.cardContainer}>
        <TonalCard variant="low" style={styles.queueCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
              <Ionicons name={iconName as any} size={24} color={color} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="titleMedium" weight="700">{zone.name}</Typography>
              <Typography variant="bodySmall" color={theme.colors.outline}>{zone.type}</Typography>
            </View>
            <View style={styles.waitBadge}>
              <Typography variant="headlineSmall" weight="800" color={color}>{waitMins}</Typography>
              <Typography variant="labelSmall" color={color}>MIN</Typography>
            </View>
          </View>

          {showPredictions && (
            <View style={styles.predictionSection}>
              <View style={styles.predictionDivider} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MaterialCommunityIcons name="robot" size={16} color={theme.colors.primary} />
                <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ marginLeft: 6, letterSpacing: 1 }}>
                  AI PREDICTION
                </Typography>
              </View>
              <View style={styles.predictionRow}>
                {predictions.map((p, idx) => (
                  <View key={idx} style={styles.predictionCardWrapper}>
                    <TonalCard variant="high" style={styles.predictionCard}>
                      <Typography variant="labelSmall" color={theme.colors.outline}>{p.time}</Typography>
                      <Typography variant="titleLarge" weight="900" color={theme.colors.primary}>{p.wait}m</Typography>
                      <View style={[styles.trendBadge, { backgroundColor: p.trend === 'up' ? '#FEE2E2' : '#FFF7ED' }]}>
                        <Ionicons 
                          name={p.trend === 'up' ? 'arrow-up-circle' : 'arrow-down-circle'} 
                          size={12} 
                          color={p.trend === 'up' ? '#EF4444' : '#F98000'} 
                        />
                        <Typography 
                          variant="labelSmall" 
                          weight="800" 
                          style={{ color: p.trend === 'up' ? '#EF4444' : '#F98000', marginLeft: 4, fontSize: 10 }}
                        >
                          {p.trend === 'up' ? '+5m' : '-3m'}
                        </Typography>
                      </View>
                    </TonalCard>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.capacityBar}>
              <View style={[styles.capacityFill, { width: (waitMins / 40 * 100) + '%', backgroundColor: color }]} />
            </View>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="700">
               {waitMins > 20 ? 'BUSY' : 'STABLE'}
            </Typography>
          </View>
        </TonalCard>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <EditorialHeader
          metadata="SMART CAPACITY"
          title="Availability"
          subtitle="Real-time venue intelligence"
        />
        <TouchableOpacity 
          style={[styles.analyticsBtn, showPredictions && styles.analyticsBtnActive]}
          onPress={() => setShowPredictions(!showPredictions)}
        >
          <MaterialCommunityIcons name="auto-fix" size={20} color={showPredictions ? 'white' : theme.colors.primary} />
          <Typography variant="labelSmall" color={showPredictions ? 'white' : theme.colors.primary} weight="900" style={{ marginLeft: 6 }}>
             {showPredictions ? 'PREDICTIONS ON' : 'AI PREDICTIONS'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Smart Suggestion Banner */}
      {!loading && (
        <View style={styles.suggestionBanner}>
           <LinearGradient
             colors={['#E0E7FF', '#F5F3FF']}
             style={styles.suggestionGradient}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
           >
             <View style={styles.suggestionIcon}>
                <Ionicons name="bulb" size={20} color={theme.colors.primary} />
             </View>
             <View style={{ flex: 1, marginLeft: 16 }}>
                <Typography variant="titleSmall" weight="800" color="#312E81">Smart Recommendation</Typography>
                <Typography variant="bodySmall" color="#4338CA">North Gate queues are clearing up. Expect 10m drop in 15 mins.</Typography>
             </View>
           </LinearGradient>
        </View>
      )}

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.chip, activeTab === tab && styles.chipActive]}
            >
              <Typography variant="labelMedium" color={activeTab === tab ? 'white' : theme.colors.onSurfaceVariant} weight="800">
                {tab}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && filteredZones.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredZones}
          renderItem={renderQueueCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  analyticsBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  suggestionBanner: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  queueCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitBadge: {
    alignItems: 'flex-end',
  },
  predictionSection: {
    marginTop: 20,
  },
  predictionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  predictionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  predictionCardWrapper: {
    flex: 1,
  },
  predictionCard: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  capacityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
