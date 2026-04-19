import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography, theme } from '@crowza/design-system';

interface NavigationUIProps {
  destination: any;
  directions: string[];
  currentStep: number;
  onAdvance: () => void;
  onStop: () => void;
}

export const NavigationUI: React.FC<NavigationUIProps> = ({
  destination,
  directions,
  currentStep,
  onAdvance,
  onStop,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.navHeader}
      >
        <View style={styles.navHeaderContent}>
          <Typography variant="headlineSmall" color={theme.colors.onPrimary} weight="700">
            🗺️ Navigation Active
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.onPrimary}>
            {destination?.description}
          </Typography>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Direction */}
        <View style={styles.directionCard}>
          <View style={styles.stepNumber}>
            <Typography variant="headlineMedium" weight="700" color={theme.colors.onPrimary}>
              {currentStep + 1}
            </Typography>
          </View>
          <View style={styles.stepContent}>
            <Typography variant="titleMedium" weight="600" style={styles.marginBottom}>
              {directions[currentStep]}
            </Typography>
            <View style={styles.stepProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(currentStep / (directions.length - 1)) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Typography variant="labelSmall" color={theme.colors.outline}>
                Step {currentStep + 1} of {directions.length}
              </Typography>
            </View>
          </View>
        </View>

        {/* All Directions */}
        <View style={styles.allDirections}>
          {directions.map((direction, idx) => (
            <View key={idx} style={[styles.directionItem, idx === currentStep && styles.directionItemActive]}>
              <Ionicons
                name={idx === currentStep ? 'chevron-forward' : 'checkmark-circle'}
                size={20}
                color={idx === currentStep ? theme.colors.primary : theme.colors.primaryLight}
              />
              <Typography
                variant="bodyMedium"
                color={idx === currentStep ? theme.colors.primary : theme.colors.outline}
                style={{ flex: 1 }}
              >
                {direction}
              </Typography>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.navControls}>
        <TouchableOpacity
          onPress={onAdvance}
          disabled={currentStep >= directions.length - 1}
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.primary },
            currentStep >= directions.length - 1 && { opacity: 0.5 },
          ]}
        >
          <Ionicons name="arrow-forward" size={20} color={theme.colors.onPrimary} />
          <Typography color={theme.colors.onPrimary} weight="600">
            NEXT
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={onStop} style={[styles.navButton, { backgroundColor: '#FF5252' }]}>
          <Ionicons name="close" size={20} color="white" />
          <Typography color="white" weight="600">
            END
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flex: 1, padding: 12 },
  navHeader: { padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  navHeaderContent: { gap: 4 },
  directionCard: { flexDirection: 'row', backgroundColor: theme.colors.primary, borderRadius: 12, padding: 16, gap: 12, marginBottom: 16 },
  stepNumber: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.onPrimary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.primary },
  stepContent: { flex: 1 },
  stepProgress: { marginTop: 8, gap: 4 },
  progressBar: { height: 4, backgroundColor: theme.colors.onPrimary + '30', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: theme.colors.onPrimary },
  allDirections: { paddingHorizontal: 12, gap: 8, marginBottom: 12 },
  directionItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 8 },
  directionItemActive: { backgroundColor: theme.colors.primary + '10' },
  marginBottom: { marginBottom: 12 },
  navControls: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant },
  navButton: { flex: 1, flexDirection: 'row', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
