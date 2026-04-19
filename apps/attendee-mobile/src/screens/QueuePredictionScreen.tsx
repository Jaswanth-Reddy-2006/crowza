/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Queue {
  id: string;
  name: string;
  location: string;
  waitTime: number; // in minutes
  capacity: number;
  currentCount: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  prediction15min: number;
  prediction30min: number;
  prediction60min: number;
  confidence: number; // 0-100
  icon: string;
}

export default function QueuePredictionScreen() {
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
  
  const queues: Queue[] = [
    {
      id: '1',
      name: 'Food Court - Main',
      location: 'Central Area',
      waitTime: 18,
      capacity: 200,
      currentCount: 145,
      trend: 'increasing',
      prediction15min: 22,
      prediction30min: 28,
      prediction60min: 35,
      confidence: 92,
      icon: '🍔',
    },
    {
      id: '2',
      name: 'Restrooms - Level 2',
      location: 'Main Building',
      waitTime: 8,
      capacity: 50,
      currentCount: 32,
      trend: 'stable',
      prediction15min: 9,
      prediction30min: 8,
      prediction60min: 6,
      confidence: 88,
      icon: '🚽',
    },
    {
      id: '3',
      name: 'VIP Lounge Entrance',
      location: 'Premium Zone',
      waitTime: 5,
      capacity: 100,
      currentCount: 45,
      trend: 'decreasing',
      prediction15min: 4,
      prediction30min: 2,
      prediction60min: 0,
      confidence: 95,
      icon: '⭐',
    },
    {
      id: '4',
      name: 'Merchandise Shop',
      location: 'Main Plaza',
      waitTime: 25,
      capacity: 80,
      currentCount: 72,
      trend: 'increasing',
      prediction15min: 30,
      prediction30min: 38,
      prediction60min: 45,
      confidence: 85,
      icon: '🛍️',
    },
    {
      id: '5',
      name: 'Parking Exit',
      location: 'Parking Area',
      waitTime: 12,
      capacity: 150,
      currentCount: 95,
      trend: 'stable',
      prediction15min: 13,
      prediction30min: 15,
      prediction60min: 20,
      confidence: 90,
      icon: '🚗',
    },
    {
      id: '6',
      name: 'Information Desk',
      location: 'Main Entrance',
      waitTime: 3,
      capacity: 30,
      currentCount: 12,
      trend: 'stable',
      prediction15min: 3,
      prediction30min: 4,
      prediction60min: 2,
      confidence: 85,
      icon: 'ℹ️',
    }
  ];

  const renderQueueCard = ({ item }: { item: Queue }) => {
    const occupancy = item.currentCount / item.capacity;
    const occupancyColor = occupancy > 0.8 ? '#EF4444' : occupancy > 0.5 ? '#F59E0B' : '#10B981';
    
    return (
      <TouchableOpacity 
        style={styles.queueCard} 
        onPress={() => setSelectedQueue(item)}
      >
        <TonalCard variant="low" style={styles.cardInner}>
          <View style={styles.cardHeader}>
             <View style={styles.iconBox}>
                <Typography style={{ fontSize: 24 }}>{item.icon}</Typography>
             </View>
             <View style={styles.nameSection}>
                <Typography variant="titleMedium" weight="900">{item.name}</Typography>
                <Typography variant="bodySmall" color={theme.colors.outline}>{item.location}</Typography>
             </View>
             <View style={styles.waitTimeBox}>
                <Typography variant="headlineSmall" weight="900" color={theme.colors.primary}>{item.waitTime}</Typography>
                <Typography variant="labelSmall" color={theme.colors.outline}>MIN</Typography>
             </View>
          </View>

          <View style={styles.metricsRow}>
             <View style={styles.metricItem}>
                <Typography variant="labelSmall" color={theme.colors.outline} weight="900">OCCUPANCY</Typography>
                <View style={styles.progressBg}>
                   <View style={[styles.progressFill, { width: `${occupancy * 100}%`, backgroundColor: occupancyColor }]} />
                </View>
             </View>
             <View style={styles.trendBox}>
                <Ionicons 
                  name={item.trend === 'increasing' ? 'trending-up' : item.trend === 'decreasing' ? 'trending-down' : 'remove'} 
                  size={16} 
                  color={item.trend === 'increasing' ? '#EF4444' : item.trend === 'decreasing' ? '#10B981' : theme.colors.outline} 
                />
                <Typography variant="labelSmall" weight="700" style={{ marginLeft: 4 }}>
                   {item.trend.toUpperCase()}
                </Typography>
             </View>
          </View>
        </TonalCard>
      </TouchableOpacity>
    );
  };

  if (selectedQueue) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailHeader}>
           <TouchableOpacity onPress={() => setSelectedQueue(null)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
           </TouchableOpacity>
           <Typography variant="titleLarge" weight="900">Intelligence Report</Typography>
           <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.detailContent}>
           <View style={styles.heroSection}>
              <Typography style={{ fontSize: 64, marginBottom: 15 }}>{selectedQueue.icon}</Typography>
              <Typography variant="headlineMedium" weight="900">{selectedQueue.name}</Typography>
              <Typography variant="bodyLarge" color={theme.colors.outline}>{selectedQueue.location}</Typography>
           </View>

           <View style={styles.predictionGrid}>
              <TonalCard variant="medium" style={styles.predictionCard}>
                 <Typography variant="labelSmall" weight="900" color={theme.colors.outline}>CURRENT</Typography>
                 <Typography variant="displaySmall" weight="900" color={theme.colors.primary}>{selectedQueue.waitTime}m</Typography>
              </TonalCard>
              <TonalCard variant="medium" style={styles.predictionCard}>
                 <Typography variant="labelSmall" weight="900" color={theme.colors.outline}>IN 30 MIN</Typography>
                 <Typography variant="displaySmall" weight="900" color="#F59E0B">{selectedQueue.prediction30min}m</Typography>
              </TonalCard>
           </View>

           <Typography variant="titleMedium" weight="900" style={styles.sectionTitle}>Wait Time Forecast</Typography>
           <View style={styles.forecastBox}>
              {[
                { time: '15m', val: selectedQueue.prediction15min },
                { time: '30m', val: selectedQueue.prediction30min },
                { time: '60m', val: selectedQueue.prediction60min }
              ].map(f => (
                <View key={f.time} style={styles.forecastRow}>
                   <Typography variant="bodyLarge" weight="700">{f.time} From Now</Typography>
                   <Typography variant="bodyLarge" weight="900" color={theme.colors.primary}>{f.val} min</Typography>
                </View>
              ))}
           </View>

           <TouchableOpacity 
              style={styles.notifyBtn}
              onPress={() => Alert.alert("Intelligence Active", "We will notify you when the line is under 10 minutes.")}
           >
              <Ionicons name="notifications" size={20} color="white" />
              <Typography color="white" weight="900" style={{ marginLeft: 10 }}>NOTIFY WHEN CLEAR</Typography>
           </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={queues}
        renderItem={renderQueueCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// Stub for TonalCard if not available in this scope, but it should be imported from design-system
import { TonalCard } from '@crowza/design-system';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  list: { padding: 20, gap: 16 },
  queueCard: { marginBottom: 12 },
  cardInner: { padding: 16, borderRadius: 24, backgroundColor: theme.colors.surface },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 50, height: 50, borderRadius: 16, backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  nameSection: { flex: 1, marginLeft: 16 },
  waitTimeBox: { alignItems: 'center', backgroundColor: theme.colors.primary + '10', padding: 10, borderRadius: 16, minWidth: 60 },
  metricsRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center', gap: 16 },
  metricItem: { flex: 1 },
  progressBg: { height: 6, backgroundColor: theme.colors.surfaceVariant, borderRadius: 3, marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  trendBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  detailContent: { paddingHorizontal: 20, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginVertical: 40 },
  predictionGrid: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  predictionCard: { flex: 1, padding: 20, alignItems: 'center', borderRadius: 24, backgroundColor: theme.colors.surface },
  sectionTitle: { marginBottom: 16 },
  forecastBox: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 40 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant },
  notifyBtn: { backgroundColor: theme.colors.primary, height: 64, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
});
