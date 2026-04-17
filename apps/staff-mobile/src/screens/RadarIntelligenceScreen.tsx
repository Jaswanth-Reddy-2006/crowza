import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../utils/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for heat map nodes
const HOTSPOTS = [
  { id: '1', name: 'Main Gate', occupancy: 0.85, x: 120, y: 180, growth: '+12%' },
  { id: '2', name: 'Zone B', occupancy: 0.92, x: 280, y: 220, growth: '+5%' },
  { id: '3', name: 'Food Court', occupancy: 0.45, x: 180, y: 350, growth: '-2%' },
  { id: '4', name: 'North Stand', occupancy: 0.78, x: 250, y: 120, growth: '+8%' },
];

export default function RadarIntelligenceScreen() {
  const insets = useSafeAreaInsets();
  const [activeNode, setActiveNode] = useState(HOTSPOTS[0]);
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      {/* HUD Header */}
      <View style={[styles.hudHeader, { paddingTop: insets.top + 20 }]}>
         <View>
            <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 3 }}>RADAR INTELLIGENCE</Typography>
            <Typography variant="headlineMedium" color="white" weight="800">Operational Map</Typography>
         </View>
         <TouchableOpacity style={styles.syncBtn}>
            <Ionicons name="sync" size={20} color={theme.colors.primary} />
         </TouchableOpacity>
      </View>

      {/* Main Radar View */}
      <View style={styles.radarContainer}>
         <View style={styles.radarCircle}>
            {/* Grid Lines */}
            <View style={styles.gridV} />
            <View style={styles.gridH} />
            
            {/* Hotspots */}
            {HOTSPOTS.map((node) => (
              <TouchableOpacity 
                key={node.id} 
                style={[styles.node, { left: node.x, top: node.y }]}
                onPress={() => setActiveNode(node)}
              >
                 <Animated.View style={[
                   styles.nodePulse, 
                   { 
                     opacity: pulseAnim, 
                     transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
                     backgroundColor: node.occupancy > 0.8 ? theme.colors.error : theme.colors.primary
                   }
                 ]} />
                 <View style={[
                   styles.nodeCore, 
                   { backgroundColor: node.occupancy > 0.8 ? theme.colors.error : theme.colors.primary }
                 ]} />
              </TouchableOpacity>
            ))}
         </View>
      </View>

      {/* Intelligence Data Sheet */}
      <View style={[styles.dataSheet, { paddingBottom: insets.bottom + 20 }]}>
         <TonalCard variant="highest" style={styles.infoCard}>
            <View style={styles.infoTop}>
               <View>
                  <Typography variant="titleLarge" color="white" weight="800">{activeNode.name}</Typography>
                  <Typography variant="labelSmall" color={theme.colors.outline}>ZONE SECTOR • RADAR SCAN ACTIVE</Typography>
               </View>
               <View style={styles.growthBadge}>
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="700">{activeNode.growth}</Typography>
               </View>
            </View>

            <View style={styles.metricsRow}>
               <View style={styles.metric}>
                  <Typography variant="labelSmall" color={theme.colors.outline}>OCCUPANCY</Typography>
                  <Typography variant="headlineSmall" color="white" weight="800">{(activeNode.occupancy * 100).toFixed(0)}%</Typography>
               </View>
               <View style={styles.metricDivider} />
               <View style={styles.metric}>
                  <Typography variant="labelSmall" color={theme.colors.outline}>TRAFFIC</Typography>
                  <Typography variant="headlineSmall" color="white" weight="800">CRITICAL</Typography>
               </View>
               <View style={styles.metricDivider} />
               <View style={styles.metric}>
                  <Typography variant="labelSmall" color={theme.colors.outline}>SENSORS</Typography>
                  <Typography variant="headlineSmall" color="white" weight="800">ACTIVE</Typography>
               </View>
            </View>

            <SignatureButton 
              label="DISPATCH UNITS" 
              onPress={() => {}} 
              style={{ marginTop: 24 }}
            />
         </TonalCard>

         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSelect}>
            {HOTSPOTS.map((node) => (
              <TouchableOpacity 
                key={node.id} 
                onPress={() => setActiveNode(node)}
                style={[styles.nodeSelect, activeNode.id === node.id && styles.nodeSelectActive]}
              >
                 <Typography 
                   variant="labelSmall" 
                   color={activeNode.id === node.id ? theme.colors.primary : theme.colors.outline}
                   weight="700"
                 >
                   {node.name.toUpperCase()}
                 </Typography>
              </TouchableOpacity>
            ))}
         </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hudHeader: { paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  syncBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWeight: 1, borderColor: '#222' },
  radarContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radarCircle: {
     width: SCREEN_WIDTH * 1.5,
     height: SCREEN_WIDTH * 1.5,
     borderRadius: SCREEN_WIDTH * 0.75,
     borderWidth: 1,
     borderColor: '#111',
     backgroundColor: '#080808',
     overflow: 'hidden',
  },
  gridV: { position: 'absolute', width: 2, height: '100%', left: '50%', backgroundColor: '#151515' },
  gridH: { position: 'absolute', height: 2, width: '100%', top: '50%', backgroundColor: '#151515' },
  node: { position: 'absolute', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  nodePulse: { position: 'absolute', width: 20, height: 20, borderRadius: 10 },
  nodeCore: { width: 8, height: 8, borderRadius: 4, zIndex: 2 },
  dataSheet: { paddingHorizontal: 20, gap: 16 },
  infoCard: { padding: 24, borderRadius: 32 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  growthBadge: { backgroundColor: `${theme.colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metric: { flex: 1, gap: 4 },
  metricDivider: { width: 1, height: 30, backgroundColor: '#333' },
  quickSelect: { marginTop: 12 },
  nodeSelect: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginRight: 8, backgroundColor: '#111' },
  nodeSelectActive: { backgroundColor: `${theme.colors.primary}20`, borderWidth: 1, borderColor: theme.colors.primary },
});
