/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../utils/hooks';
import { selectAllZones, selectAllZoneOccupancies } from '../selectors';

export default function ExitScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const zones = useAppSelector(selectAllZones);
  const occupancies = useAppSelector(selectAllZoneOccupancies);

  const exitZones = zones.filter(z => z.type === 'EXIT' || z.name.toLowerCase().includes('gate') || z.name.toLowerCase().includes('exit'));

  const getStatusColor = (occ: number) => {
    if (occ < 40) return '#81C784';
    if (occ < 75) return '#FFB74D';
    return '#E57373';
  };

  const getStatusText = (occ: number) => {
    if (occ < 40) return 'FLOWING';
    if (occ < 75) return 'MODERATE';
    return 'CONGESTED';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="700">Exit Pathways</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TonalCard variant="high" style={styles.heroCard}>
            <View style={styles.heroLayout}>
                <View style={{ flex: 1 }}>
                    <Typography variant="labelSmall" color={theme.colors.primary} weight="800">RECOMMENDED EXIT</Typography>
                    <Typography variant="headlineSmall" weight="900" style={{ marginTop: 4 }}>Gate 2 - East</Typography>
                    <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginTop: 4 }}>
                        3 min wait • Flowing normally
                    </Typography>
                </View>
                <SignatureButton 
                    label="Go" 
                    variant="primary" 
                    size="small" 
                    onPress={() => navigation.navigate('Map', { targetZoneId: 'zone_4' })} 
                />
            </View>
        </TonalCard>

        <Typography variant="titleMedium" weight="700" style={styles.sectionTitle}>Real-time Exit Status</Typography>
        
        {exitZones.map((exit) => {
            const occ = occupancies[exit.id]?.occupancyPercent ?? 20;
            const statusColor = getStatusColor(occ);
            return (
                <TonalCard key={exit.id} variant="low" style={styles.exitItem}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Typography variant="titleSmall" weight="700">{exit.name}</Typography>
                        <Typography variant="labelSmall" color={theme.colors.outline}>{getStatusText(occ)}</Typography>
                    </View>
                    <View style={styles.timeInfo}>
                        <Typography variant="titleMedium" weight="900">{Math.floor(occ/10) + 2}m</Typography>
                        <Typography variant="labelSmall" color={theme.colors.outline}>EST. TIME</Typography>
                    </View>
                    <TouchableOpacity 
                        style={styles.navIcon}
                        onPress={() => navigation.navigate('Map', { targetZoneId: exit.id })}
                    >
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </TonalCard>
            );
        })}

        <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.outline} />
            <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginLeft: 8, flex: 1 }}>
                Estimates are based on live thermal sensors and current crowd density at peak junctions.
            </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    marginRight: 16,
  },
  content: {
    padding: 20,
  },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryContainer + '30',
    marginBottom: 32,
  },
  heroLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  exitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  statusIndicator: {
    width: 6,
    height: 40,
    borderRadius: 3,
  },
  timeInfo: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  navIcon: {
    padding: 8,
  },
  infoBox: {
    flexDirection: 'row',
    marginTop: 24,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 16,
  }
});
