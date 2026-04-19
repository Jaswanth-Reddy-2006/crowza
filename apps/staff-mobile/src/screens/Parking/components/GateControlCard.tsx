import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme, TonalCard, Typography } from '@crowza/design-system';

interface GateControlCardProps {
  isGateOpen: boolean;
  toggleGate: () => void;
  gateAnim: Animated.Value;
}

export const GateControlCard: React.FC<GateControlCardProps> = ({ 
  isGateOpen, 
  toggleGate, 
  gateAnim 
}) => {
  return (
    <View style={styles.section}>
      <Typography variant="labelSmall" color={theme.colors.outline} weight="900" style={styles.label}>GATE OPERATION</Typography>
      <TonalCard variant="medium" style={styles.gateCard}>
        <View style={styles.gateVisual}>
          <Animated.View style={[styles.gateArm, { 
            transform: [{ 
              rotate: gateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-90deg']
              }) 
            }] 
          }]} />
          <View style={[styles.gateJoint, { backgroundColor: isGateOpen ? '#F98000' : '#EF4444' }]} />
        </View>
        <View style={styles.gateInfo}>
          <Typography variant="titleMedium" weight="900">North Entry (Gate 4)</Typography>
          <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginTop: 2 }}>
            {isGateOpen ? 'ALLOWING ACCESS' : 'SHUTDOWN ACTIVE'}
          </Typography>
          <TouchableOpacity 
            style={[styles.gateToggle, { backgroundColor: isGateOpen ? theme.colors.surfaceVariant : theme.colors.primary }]}
            onPress={toggleGate}
          >
            <Typography variant="labelSmall" color={isGateOpen ? theme.colors.onSurface : 'white'} weight="900">
              {isGateOpen ? "CLOSE ACCESS" : "OPEN ACCESS"}
            </Typography>
          </TouchableOpacity>
        </View>
      </TonalCard>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginBottom: 40 },
  label: { marginBottom: 16, letterSpacing: 1 },
  gateCard: { padding: 24, borderRadius: 28, flexDirection: 'row', gap: 24, alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  gateVisual: { width: 92, height: 92, backgroundColor: theme.colors.background, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.outlineVariant },
  gateArm: { width: 44, height: 4, backgroundColor: theme.colors.primary, borderRadius: 2, position: 'absolute', left: 46, transformOrigin: 'left' },
  gateJoint: { width: 12, height: 12, borderRadius: 6, position: 'absolute', top: 12, right: 12 },
  gateInfo: { flex: 1 },
  gateToggle: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});
