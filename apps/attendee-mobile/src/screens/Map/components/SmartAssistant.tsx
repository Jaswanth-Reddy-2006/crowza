import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography, theme, TonalCard } from '@crowza/design-system';

interface SmartAssistantProps {
  insets: { top: number };
  emergencyMode: boolean;
  isNavigating: boolean;
  mapMode: 'journey' | 'venue';
  navSteps: any[];
  navigationStepIndex: number;
  onNextStep: () => void;
  onCloseNav: () => void;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({
  insets,
  emergencyMode,
  isNavigating,
  mapMode,
  navSteps,
  navigationStepIndex,
  onNextStep,
  onCloseNav,
}) => {
  const currentStep = navSteps[navigationStepIndex];

  const renderAssistant = () => {
    if (emergencyMode) {
      return (
        <View style={[styles.emergencyBanner, { top: (isNavigating ? 140 : 20) }]}>
          <LinearGradient
            colors={['#DC2626', '#991B1B']}
            style={styles.assistantCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={[styles.assistantIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="warning" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="titleSmall" color="white" weight="900">EMERGENCY PROTOCOL ACTIVE</Typography>
              <Typography variant="labelSmall" color="rgba(255,255,255,0.8)">Following safest evacuation route</Typography>
            </View>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={[styles.assistantWrapper, { top: (isNavigating ? 140 : 20) }]}>
        <TonalCard variant="high" style={styles.assistantCard}>
          <View style={styles.assistantIcon}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Typography variant="labelSmall" color={theme.colors.primary} weight="900">AI ASSISTANT</Typography>
            <Typography variant="bodySmall" weight="700">
              {isNavigating ? "Safe travels! I'll guide you." : "Where would you like to go?"}
            </Typography>
          </View>
          <TouchableOpacity onPress={() => {}}>
             <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
          </TouchableOpacity>
        </TonalCard>
      </View>
    );
  };

  const renderInstructionBar = () => {
    if (!isNavigating) return null;

    return (
      <View style={[styles.instructionBar, { top: (mapMode === 'journey' ? 80 : 20) }]}>
        <LinearGradient
          colors={['#1E1B4B', '#312E81']}
          style={styles.instructionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.instructionIcon}>
            <Ionicons name={currentStep?.icon as any || 'walk'} size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Typography variant="titleSmall" color="white" weight="700">{currentStep?.text}</Typography>
            <Typography variant="labelSmall" color="rgba(255,255,255,0.6)">CROWZA LIVE GUIDANCE</Typography>
          </View>
          <TouchableOpacity 
            style={styles.nextStepBtn}
            onPress={navigationStepIndex < navSteps.length - 1 ? onNextStep : onCloseNav}
          >
            <Ionicons name={currentStep?.done ? "close" : "arrow-forward"} size={20} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={[styles.overlay, { top: insets.top }]}>
      {renderAssistant()}
      {renderInstructionBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  assistantWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  emergencyBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  assistantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer,
  },
  assistantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 120,
  },
  instructionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  instructionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
