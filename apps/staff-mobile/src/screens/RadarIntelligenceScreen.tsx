import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { VenueFloorPlan } from '../components/VenueFloorPlan';

// Modular Components
import { IntelligenceNodeCard } from './Radar/components/IntelligenceNodeCard';
import { SectorSensorList } from './Radar/components/SectorSensorList';

export interface IntelNode {
  id: string;
  name: string;
  type: string;
  polygon: number[][];
}

const STADIUM_ZONES: IntelNode[] = [
  { id: 'north_stand', name: 'North Stand', type: 'stand', polygon: [[200, 50], [800, 50], [700, 200], [300, 200]] },
  { id: 'south_stand', name: 'South Stand', type: 'stand', polygon: [[200, 950], [800, 950], [700, 800], [300, 800]] },
  { id: 'pavilion', name: 'Pavilion', type: 'premium', polygon: [[50, 400], [50, 600], [150, 600], [150, 400]] },
  { id: 'elite_restaurant', name: 'Elite Restaurant', type: 'amenity', polygon: [[850, 400], [850, 600], [950, 600], [950, 400]] },
  { id: 'east_wing', name: 'East Wing', type: 'stand', polygon: [[700, 250], [900, 250], [900, 750], [700, 750]] },
  { id: 'west_wing', name: 'West Wing', type: 'stand', polygon: [[100, 250], [300, 250], [300, 750], [100, 750]] },
];

const ROUTE_TO_RESTAURANT = "150,500 250,500 250,400 500,400 750,400 850,500";
const SECTOR_SENSORS = [
  { id: '1', name: 'Sector A-4', status: 'optimal', density: 'Low' },
  { id: '2', name: 'Sector B-1', status: 'critical', density: 'Heavy' },
  { id: '3', name: 'VIP Gallery', status: 'optimal', density: 'Stable' },
];

export default function RadarIntelligenceScreen() {
  const insets = useSafeAreaInsets();
  const [activeNode, setActiveNode] = useState<IntelNode>(STADIUM_ZONES[0]);

  const [navigationActive, setNavigationActive] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
         <View>
            <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={{ letterSpacing: 2 }}>STADIUM RADAR • LIVE</Typography>
            <Typography variant="headlineMedium" weight="900">Narendra Modi Stadium</Typography>
         </View>
         <TouchableOpacity style={styles.layerBtn}><Ionicons name="layers-outline" size={20} color="black" /></TouchableOpacity>
      </View>

      <View style={styles.mapShell}>
         <VenueFloorPlan
            zones={STADIUM_ZONES} selectedZoneId={activeNode.id}
            onZonePress={(id) => {
              const found = STADIUM_ZONES.find(z => z.id === id);
              if (found) setActiveNode(found);
            }}
            routePoints={navigationActive ? ROUTE_TO_RESTAURANT : undefined}
         />
         {navigationActive && (
            <View style={styles.navBar} pointerEvents="none">
               <View style={styles.navBadge}>
                  <Ionicons name="navigate" size={16} color="#FFF" />
                  <Typography variant="labelSmall" color="#FFF" weight="900" style={{ marginLeft: 8 }}>NAVIGATING TO RESTAURANT</Typography>
               </View>
            </View>
         )}
      </View>

      <View style={[styles.controlSheet, { marginBottom: insets.bottom + 10 }]}>
         <IntelligenceNodeCard 
            activeNode={activeNode}
            navigationActive={navigationActive}
            setNavigationActive={setNavigationActive}
         />
         <SectorSensorList sensors={SECTOR_SENSORS} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  layerBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  mapShell: { flex: 1, marginHorizontal: 16, borderRadius: 40, backgroundColor: '#F9FAFB', overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  navBar: { position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center' },
  navBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, elevation: 10 },
  controlSheet: { paddingHorizontal: 24, marginTop: 20 },
});
