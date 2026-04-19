/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography, TonalCard, SignatureButton, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logoutStaff, leaveEvent } from '../store/slices/staffAuthSlice';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { staff, joinedEventId } = useAppSelector((s) => s.staffAuth);

  const handleLogout = () => {
    dispatch(logoutStaff());
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <EditorialHeader
              metadata="PROFILE"
              title="Team Member Detail"
              subtitle="Manage your professional identity and review your service record."
            />
        </View>

        <View style={styles.profileHero}>
           <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                 <Typography variant="displaySmall" color="white" weight="900">
                    {staff?.displayName?.charAt(0) || 'S'}
                 </Typography>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                 <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
           </View>
           <View style={styles.profileInfo}>
              <Typography variant="headlineSmall" weight="900">{staff?.displayName || 'Staff Member'}</Typography>
              <Typography variant="bodyMedium" color={theme.colors.outline}>{staff?.email || 'member@crowza.com'}</Typography>
              <View style={styles.roleBadge}>
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="900">VERIFIED OPERATOR</Typography>
              </View>
           </View>
        </View>

        <Typography variant="titleLarge" weight="900" style={styles.sectionTitle}>Expertise</Typography>
        <TonalCard variant="medium" style={styles.expertiseCard}>
           <View style={styles.chipRow}>
              {['Crowd Control', 'Incident Response', 'VIP Support', 'Logistics'].map(skill => (
                <View key={skill} style={styles.skillChip}>
                   <Typography variant="labelSmall" weight="700">{skill}</Typography>
                </View>
              ))}
           </View>
        </TonalCard>

        <Typography variant="titleLarge" weight="900" style={styles.sectionTitle}>Service Record</Typography>
        <View style={styles.recordGrid}>
           <TonalCard variant="low" style={styles.recordItem}>
              <Typography variant="headlineSmall" weight="900" color={theme.colors.primary}>142</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline}>Hours Worked</Typography>
           </TonalCard>
           <TonalCard variant="low" style={styles.recordItem}>
              <Typography variant="headlineSmall" weight="900" color={theme.colors.secondary}>4.9</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline}>Avg Rating</Typography>
           </TonalCard>
        </View>

        <View style={styles.actionsBox}>
           <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="shield-outline" size={20} color={theme.colors.onSurface} />
              <Typography variant="bodyLarge" weight="700" style={{ flex: 1, marginLeft: 16 }}>Security Settings</Typography>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.outlineVariant} />
           </TouchableOpacity>
           <View style={styles.actionDivider} />
           <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.onSurface} />
              <Typography variant="bodyLarge" weight="700" style={{ flex: 1, marginLeft: 16 }}>Notifications</Typography>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.outlineVariant} />
           </TouchableOpacity>
           <View style={styles.actionDivider} />
           {joinedEventId && (
              <>
                <TouchableOpacity 
                   style={[styles.actionItem, { marginTop: 4 }]} 
                   onPress={() => dispatch(leaveEvent())}
                >
                   <Ionicons name="exit-outline" size={20} color={theme.colors.primary} />
                   <Typography variant="bodyLarge" weight="900" color={theme.colors.primary} style={{ flex: 1, marginLeft: 16 }}>EXIT FROM EVENT</Typography>
                   <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <View style={styles.actionDivider} />
              </>
            )}
           <TouchableOpacity style={[styles.actionItem, { marginTop: 12 }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
              <Typography variant="bodyLarge" weight="700" color={theme.colors.error} style={{ flex: 1, marginLeft: 16 }}>Sign Out</Typography>
           </TouchableOpacity>
        </View>

        <Typography variant="bodySmall" color={theme.colors.outline} style={styles.version}>
           Crowza Staff v2.1.0 (PRO)
        </Typography>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  header: { marginBottom: 32, marginTop: 10 },
  profileHero: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  avatarContainer: { position: 'relative' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 32, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  editAvatarBtn: { position: 'absolute', right: -4, bottom: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#1C1B1B', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.background },
  profileInfo: { marginLeft: 20, flex: 1 },
  roleBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 8 },
  sectionTitle: { marginBottom: 16 },
  expertiseCard: { padding: 20, borderRadius: 24, marginBottom: 32, backgroundColor: theme.colors.surface },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { backgroundColor: theme.colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant },
  recordGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  recordItem: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center', backgroundColor: theme.colors.surface },
  actionsBox: { backgroundColor: theme.colors.surface, borderRadius: 28, padding: 16, marginBottom: 32 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  actionDivider: { height: 1, backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 8 },
  version: { textAlign: 'center', opacity: 0.5 },
});
