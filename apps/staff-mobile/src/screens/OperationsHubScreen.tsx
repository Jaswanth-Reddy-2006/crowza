/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MODULES = [
  { id: 'Incidents', title: 'Incidents', category: 'SECURITY', icon: 'shield-alert', color: [theme.colors.error, '#991B1B'], count: '3 Active' },
  { id: 'Radar', title: 'Mission Radar', category: 'INTELLIGENCE', icon: 'scan', color: [theme.colors.primary, '#EAB308'], count: 'Live Map' },
  { id: 'Occupancy', title: 'Zone Occupancy', category: 'CROWD', icon: 'people', color: [theme.colors.primary, theme.colors.primaryDark], count: '85% Load' },
  { id: 'Parking', title: 'Parking Control', category: 'TRAFFIC', icon: 'car', color: [theme.colors.tertiary, theme.colors.outline], count: 'Lot A 92%' },
  { id: 'WaitTimes', title: 'Wait Times', category: 'SERVICE', icon: 'time', color: [theme.colors.primary, theme.colors.primaryDark], count: '12m Avg' },
  { id: 'Team', title: 'Staff Team', category: 'PERSONNEL', icon: 'people-circle', color: ['#8B5CF6', '#5B21B6'], count: '42 Online' },
];

export default function OperationsHubScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <EditorialHeader
              metadata="MISSION COMMAND"
              title="Operations Hub"
              subtitle="Access specialized modules to monitor and manage every aspect of the venue operation."
            />
        </View>

        <View style={styles.grid}>
          {MODULES.map((module) => (
            <TouchableOpacity 
              key={module.id} 
              style={styles.moduleWrapper}
              onPress={() => navigation.navigate(module.id)}
            >
              <TonalCard variant="medium" style={styles.moduleCard}>
                 <LinearGradient colors={module.color} style={styles.iconContainer}>
                    <Ionicons name={module.icon as any} size={28} color="white" />
                 </LinearGradient>
                 
                 <View style={styles.moduleInfo}>
                    <Typography variant="labelSmall" color={theme.colors.outline} weight="900" style={{ letterSpacing: 1.5 }}>{module.category}</Typography>
                    <Typography variant="titleLarge" weight="900" style={{ marginTop: 2 }}>{module.title}</Typography>
                    
                    <View style={styles.statusRow}>
                       <View style={styles.statusDot} />
                       <Typography variant="labelSmall" color={theme.colors.outline} weight="700">{module.count.toUpperCase()}</Typography>
                    </View>
                 </View>
                 
                 <Ionicons name="chevron-forward" size={20} color={theme.colors.outlineVariant} style={styles.arrow} />
              </TonalCard>
            </TouchableOpacity>
          ))}
        </View>

        <TonalCard variant="low" style={styles.broadcastCard}>
           <Ionicons name="megaphone-outline" size={24} color={theme.colors.primary} />
           <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="titleMedium" weight="900">Official Broadcast</Typography>
              <Typography variant="bodySmall" color={theme.colors.outline}>Send a message to the entire staff team.</Typography>
           </View>
           <TouchableOpacity style={styles.broadcastBtn}>
              <Typography variant="labelSmall" color="white" weight="900">SEND</Typography>
           </TouchableOpacity>
        </TonalCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginBottom: 32, marginTop: 10 },
  grid: { gap: 16 },
  moduleWrapper: { width: '100%' },
  moduleCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 28, 
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  iconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  moduleInfo: { flex: 1, marginLeft: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary },
  arrow: { marginLeft: 8 },
  broadcastCard: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 32, marginTop: 40, backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.outlineVariant },
  broadcastBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
});
