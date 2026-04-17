import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchZones } from '../store/slices/venueSlice';
import { selectAllWaitTimes, selectAllZones } from '../selectors';
import { setupWaitTimeListener } from '../services/firebase/realtimeListeners';

type FilterTab = 'ALL' | 'FOOD' | 'RESTROOMS' | 'MEDICAL' | 'ENTRANCE' | 'EXIT' | 'PARKING' | 'SECURITY';

const FILTER_TABS: FilterTab[] = ['ALL', 'FOOD', 'ENTRANCE', 'EXIT', 'PARKING', 'MEDICAL', 'SECURITY'];

const AMENITY_ICONS: Record<string, string> = {
  FOOD: '🍽️',
  RESTROOMS: '🚻',
  MEDICAL: '⚕️',
  ENTRANCE: '🚪',
  EXIT: '🏃',
  PARKING: '🅿️',
  DEFAULT: '📍',
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
  if (mins < 5) return '#4CAF50';
  if (mins < 15) return '#FFB300';
  if (mins < 30) return '#FF9100';
  return '#FF5252';
}

function getStatusText(mins: number): string {
  if (mins === 0) return 'NO WAIT';
  if (mins < 10) return 'FLOWING';
  if (mins < 25) return 'MODERATE';
  return 'BUSY';
}

export default function WaitTimesScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const zones = useAppSelector(selectAllZones);
  const waitTimes = useAppSelector(selectAllWaitTimes);
  const loading = useAppSelector((s) => s.waittime.loading);

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  
  const VENUE_ID = useVenueId();

  useEffect(() => {
    dispatch(fetchZones(VENUE_ID));

    // Setup real-time listener
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
    // Sort by wait time descending for interesting view
    return [...list].sort((a, b) => (waitTimes[b.id] || 0) - (waitTimes[a.id] || 0));
  }, [zones, activeTab, waitTimes]);

  const renderQueueCard = useCallback(
    ({ item: zone }: { item: typeof zones[0] }) => {
      const waitMins = waitTimes[zone.id] ?? 0;
      const color = getWaitColor(waitMins);
      const category = getZoneCategory(zone.name);
      const icon = AMENITY_ICONS[category] ?? AMENITY_ICONS.DEFAULT;
      
      // Mock historical data for trend chart
      const historical = [10, 15, 8, 20, 25, 18, 12, 5];

      return (
        <TonalCard variant="low" style={styles.queueCard}>
          <View style={styles.cardTop}>
            <View style={styles.iconCircle}>
              <Typography variant="bodyLarge">{icon}</Typography>
            </View>
            <View style={styles.cardInfo}>
              <Typography variant="titleMedium" color={theme.colors.onSurface} weight="600">
                {zone.name}
              </Typography>
              <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>
                {zone.type.toUpperCase()} · ZONE {zone.id.split('-').pop()?.toUpperCase()}
              </Typography>
            </View>
            <View style={styles.waitTarget}>
              <Typography variant="labelSmall" color={color} weight="800" style={{ letterSpacing: 1 }}>
                {getStatusText(waitMins)}
              </Typography>
              <Typography variant="displaySmall" color={color} style={{ lineHeight: 32 }}>
                {waitMins}
              </Typography>
              <Typography variant="labelSmall" color={theme.colors.onSurfaceVariant}>
                MINS
              </Typography>
            </View>
          </View>

          {/* Historical Trend SVG */}
          <View style={styles.trendContainer}>
            <Typography variant="labelSmall" color={theme.colors.outline} style={styles.trendLabel}>
              LAST 2 HOURS
            </Typography>
            <Svg height="40" width="100%">
              {historical.map((val, i) => (
                <Rect
                  key={i}
                  x={`${i * 12.5}%`}
                  y={40 - (val / 30) * 40}
                  width="8%"
                  height={(val / 30) * 40}
                  fill={i === historical.length - 1 ? color : theme.colors.surfaceContainerHighest}
                  rx="4"
                />
              ))}
            </Svg>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.queueMetric}>
              <Typography variant="labelSmall" color={theme.colors.onSurfaceVariant}>
                CURRENT QUEUE
              </Typography>
              <Typography variant="bodyMedium" color={theme.colors.onSurface}>
                ~{Math.ceil(waitMins / 3) * 4} people
              </Typography>
            </View>
            <SignatureButton
              label="Directions"
              onPress={() => {}}
              variant="tertiary"
              size="small"
            />
          </View>
        </TonalCard>
      );
    },
    [waitTimes]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <EditorialHeader
        metadata="REAL-TIME QUEUES"
        title="Wait Times"
        subtitle="Avoid the crowds with live capacity tracking"
        style={styles.header}
      />

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          contentContainerStyle={styles.tabs}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Typography
                variant="labelMedium"
                color={activeTab === tab ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
              >
                {tab}
              </Typography>
            </TouchableOpacity>
          )}
        />
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabsWrapper: {
    marginBottom: 20,
  },
  tabs: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: theme.colors.surfaceContainer,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  queueCard: {
    padding: 20,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  waitTarget: {
    alignItems: 'flex-end',
  },
  trendContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.surfaceContainerHighest,
  },
  trendLabel: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueMetric: {
    gap: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

