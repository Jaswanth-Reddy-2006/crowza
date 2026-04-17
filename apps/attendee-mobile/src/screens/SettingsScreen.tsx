import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logout, clearError } from '../store/slices/authSlice';
import { selectCurrentUser } from '../selectors';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectCurrentUser);

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Your session data will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: () => {
          dispatch(logout());
          dispatch(clearError());
          navigation.replace('Login');
        }
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <EditorialHeader
        metadata="USER CONFIGURATION"
        title="Settings"
        subtitle="Manage your profile, preferences, and billing."
        style={styles.header}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <View style={styles.section}>
          <TonalCard variant="highest" style={styles.profileCard}>
             <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?u=crowza_user' }} 
                  style={styles.avatar} 
                />
                <View style={styles.badge}>
                  <Typography variant="labelSmall" color="white">VIP</Typography>
                </View>
             </View>
             <View style={styles.profileMeta}>
                <Typography variant="headlineSmall" color={theme.colors.onSurface} weight="600">{user?.displayName || 'Alex Crowza'}</Typography>
                <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>{user?.email || 'alex@example.com'}</Typography>
             </View>
             <SignatureButton label="Edit" variant="tertiary" size="small" onPress={() => {}} />
          </TonalCard>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>
              PREFERENCES
           </Typography>
           <TonalCard variant="low" style={styles.settingsGroup}>
              <ToggleRow 
                label="Push Notifications" 
                value={notifications} 
                onToggle={setNotifications} 
                desc="Receive updates on occupancy and wait times."
              />
              <ToggleRow 
                label="FaceID / Biometrics" 
                value={biometrics} 
                onToggle={setBiometrics} 
                desc="Secure your digital pass and payments."
              />
              <ToggleRow 
                label="High Contrast Mode" 
                value={highContrast} 
                onToggle={setHighContrast} 
                desc="Optimize UI for better accessibility."
                last
              />
           </TonalCard>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.sectionLabel}>
              PAYMENT & BILLING
           </Typography>
           <TonalCard variant="low" style={styles.settingsGroup}>
              <LinkRow label="Apple Pay" value="Connected" onPress={() => {}} />
              <LinkRow label="Credit Card" value="•••• 4242" onPress={() => {}} last />
           </TonalCard>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
           <SignatureButton 
             label="Sign Out" 
             onPress={handleLogout} 
             variant="tertiary" 
             style={styles.logoutBtn}
           />
           <Typography variant="labelSmall" color={theme.colors.outline} style={styles.version}>
              APP VERSION: 2.1.0-PRODUCTION
           </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const ToggleRow = ({ label, value, onToggle, desc, last }: any) => (
  <View style={[styles.row, last && styles.rowLast]}>
    <View style={{ flex: 1 }}>
       <Typography variant="titleSmall" color={theme.colors.onSurface}>{label}</Typography>
       <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>{desc}</Typography>
    </View>
    <Switch 
      value={value} 
      onValueChange={onToggle}
      thumbColor={value ? theme.colors.primary : '#444'}
      trackColor={{ false: '#222', true: 'rgba(255,152,0,0.3)' }}
    />
  </View>
);

const LinkRow = ({ label, value, onPress, last }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.row, last && styles.rowLast]}>
    <Typography variant="titleSmall" color={theme.colors.onSurface}>{label}</Typography>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
       <Typography variant="bodySmall" color={theme.colors.primary}>{value}</Typography>
       <Typography variant="titleSmall" color={theme.colors.outline}>→</Typography>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  scroll: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    gap: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#222',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#050505',
  },
  profileMeta: {
    flex: 1,
  },
  settingsGroup: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  logoutBtn: {
    marginBottom: 24,
  },
  version: {
    textAlign: 'center',
    opacity: 0.5,
  },
});

