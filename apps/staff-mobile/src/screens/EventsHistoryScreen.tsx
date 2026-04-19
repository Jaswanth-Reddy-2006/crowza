/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../utils/hooks';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function EventsHistoryScreen() {
  const insets = useSafeAreaInsets();
  const eventHistory = useAppSelector((s) => s.staffAuth.eventHistory || []);

  const renderEventItem = ({ item }: { item: any }) => (
    <TonalCard variant="medium" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Typography variant="titleMedium" weight="900" color={theme.colors.onSurface}>{item.name}</Typography>
          <Typography variant="labelSmall" color={theme.colors.outline}>{item.date}</Typography>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.outlineVariant} />
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Typography variant="labelSmall" color={theme.colors.primary} weight="900">ROLE</Typography>
          <Typography variant="bodyMedium" weight="700">{item.role}</Typography>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Typography variant="labelSmall" color={theme.colors.primary} weight="900">TASKS</Typography>
          <Typography variant="bodyMedium" weight="700">{item.tasksCompleted} Completed</Typography>
        </View>
      </View>

      <Typography variant="bodySmall" color={theme.colors.outline} style={styles.location}>
        <Ionicons name="location-outline" size={12} /> {item.location}
      </Typography>
    </TonalCard>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={eventHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <EditorialHeader
              metadata="HISTORY"
              title="Your Venue Journey"
              subtitle="Review your past contributions and professional growth across all Crowza-powered events."
            />
            <View style={styles.statsRow}>
              <LinearGradient colors={['#F98000', '#EA580C']} style={styles.statBox}>
                <Typography variant="displaySmall" color="white" weight="900">{eventHistory.length}</Typography>
                <Typography variant="labelSmall" color="rgba(255,255,255,0.8)" weight="800">EVENTS</Typography>
              </LinearGradient>
              <LinearGradient colors={[theme.colors.tertiary, theme.colors.outline]} style={styles.statBox}>
                <Typography variant="displaySmall" color="white" weight="900">35</Typography>
                <Typography variant="labelSmall" color="rgba(255,255,255,0.8)" weight="800">TOTAL HOURS</Typography>
              </LinearGradient>
            </View>
            <Typography variant="titleLarge" weight="900" style={styles.sectionTitle}>Past Events</Typography>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statBox: { flex: 1, padding: 20, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  sectionTitle: { marginBottom: 16 },
  card: { padding: 20, borderRadius: 28, marginBottom: 16, backgroundColor: theme.colors.surface },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 44, height: 44, borderRadius: 14, backgroundColor: theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1, marginLeft: 16 },
  detailsRow: { flexDirection: 'row', backgroundColor: theme.colors.background, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  detailItem: { flex: 1 },
  divider: { width: 1, height: '100%', backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 16 },
  location: { opacity: 0.8 },
});
