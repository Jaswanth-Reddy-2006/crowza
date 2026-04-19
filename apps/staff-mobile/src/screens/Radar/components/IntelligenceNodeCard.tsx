import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';

interface IntelligenceNodeCardProps {
  activeNode: {
    name: string;
    type: string;
  };
  navigationActive: boolean;
  setNavigationActive: (val: boolean) => void;
}

export const IntelligenceNodeCard: React.FC<IntelligenceNodeCardProps> = ({
  activeNode,
  navigationActive,
  setNavigationActive,
}) => {
  return (
    <TonalCard variant="highest" style={styles.nodeCard}>
      <View style={styles.nodeTop}>
        <View style={{ flex: 1 }}>
          <Typography variant="titleLarge" weight="900">{activeNode.name}</Typography>
          <Typography variant="labelSmall" color={theme.colors.outline} weight="900">ZONE INTEL • SECURE</Typography>
        </View>
        <View style={[styles.statusTag, { backgroundColor: activeNode.type === 'premium' ? theme.colors.primaryContainer : '#F3F4F6' }]}>
          <Typography variant="labelSmall" color={activeNode.type === 'premium' ? theme.colors.primary : '#666'} weight="900">{activeNode.type.toUpperCase()}</Typography>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity 
          style={[styles.mainAction, navigationActive && { backgroundColor: '#F3F4F6' }]}
          onPress={() => setNavigationActive(!navigationActive)}
        >
          <Ionicons name={navigationActive ? "close-circle" : "walk"} size={24} color={navigationActive ? theme.colors.outline : theme.colors.primary} />
          <Typography variant="labelSmall" weight="900" style={{ marginTop: 8 }}>{navigationActive ? 'STOP NAV' : 'GUIDE ME'}</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainAction}>
          <Ionicons name="people" size={24} color={theme.colors.primary} />
          <Typography variant="labelSmall" weight="900" style={{ marginTop: 8 }}>HEATMAP</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainAction}>
          <Ionicons name="camera" size={24} color={theme.colors.primary} />
          <Typography variant="labelSmall" weight="900" style={{ marginTop: 8 }}>GATE CAM</Typography>
        </TouchableOpacity>
      </View>

      <SignatureButton 
        label={navigationActive ? "REPORT OBSTRUCTION" : ("DISPATCH TO " + activeNode.name.toUpperCase())} 
        onPress={() => {}} 
        variant={navigationActive ? "tertiary" : "primary"}
      />
    </TonalCard>
  );
};

const styles = StyleSheet.create({
  nodeCard: { padding: 24, borderRadius: 32, backgroundColor: '#FFF', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  nodeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  statusTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  actionGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  mainAction: { flex: 1, backgroundColor: '#FAFAFA', paddingVertical: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
});
