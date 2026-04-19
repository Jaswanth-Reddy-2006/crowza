/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityPrivacyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [biometrics, setBiometrics] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const OPTIONS = [
    { title: 'Change Password', icon: 'key-outline', action: () => Alert.alert('Change Password', 'Check your email for the reset link.') },
    { title: 'Two-Factor Authentication', icon: 'shield-outline', action: () => Alert.alert('2FA', 'Coming soon to enhance your account security.') },
    { title: 'Login Activity', icon: 'list-outline', action: () => {} },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="800">Security & Privacy</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EditorialHeader
          metadata="PROTECTION"
          title="Safe & Secure"
          subtitle="Manage your credentials and granular privacy settings to protect your data."
        />

        <View style={styles.section}>
          <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={styles.sectionLabel}>
            SECURITY
          </Typography>
          <TonalCard variant="low" style={styles.optionsCard}>
            {OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.optionRow, idx !== OPTIONS.length - 1 && styles.border]}
                onPress={opt.action}
              >
                <Ionicons name={opt.icon as any} size={22} color={theme.colors.onSurfaceVariant} />
                <Typography variant="titleMedium" style={styles.optionTitle}>{opt.title}</Typography>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
              </TouchableOpacity>
            ))}
          </TonalCard>
        </View>

        <View style={styles.section}>
          <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={styles.sectionLabel}>
            PREFERENCES
          </Typography>
          <TonalCard variant="low" style={styles.optionsCard}>
            <View style={[styles.optionRow, styles.border]}>
              <Ionicons name="finger-print-outline" size={22} color={theme.colors.onSurfaceVariant} />
              <Typography variant="titleMedium" style={styles.optionTitle}>FaceID / Biometrics</Typography>
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              />
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="share-social-outline" size={22} color={theme.colors.onSurfaceVariant} />
              <Typography variant="titleMedium" style={styles.optionTitle}>Anonymous Data Sharing</Typography>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              />
            </View>
          </TonalCard>
        </View>

        <TouchableOpacity style={styles.deleteAccount} onPress={() => Alert.alert('Confirm Delete', 'Are you sure you want to delete your account? This action is permanent.')}>
           <Typography variant="titleMedium" weight="700" color={theme.colors.error}>Delete Account</Typography>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  optionsCard: {
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionTitle: {
    flex: 1,
    marginLeft: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  deleteAccount: {
    marginTop: 40,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
  }
});
