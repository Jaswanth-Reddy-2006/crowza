/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, EditorialHeader, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch } from '../utils/hooks';
import { logout } from '../store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    dispatch(logout());
  };

  const MENUS = [
    { icon: 'account-circle-outline', title: 'Personal Info', detail: 'Contact & ID details', screen: 'PersonalInfo' },
    { icon: 'credit-card-outline', title: 'Payment Methods', detail: 'Manage wallet & cards', screen: 'PaymentMethods' },
    { icon: 'bell-ring-outline', title: 'Notifications', detail: 'Alert preferences', screen: 'NotificationSettings' },
    { icon: 'shield-lock-outline', title: 'Security', detail: 'FaceID & Biometrics', screen: 'SecurityPrivacy' },
    { icon: 'help-circle-outline', title: 'Support', detail: '24/7 Concierge', screen: 'HelpSupport' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Editorial Header */}
        <View style={styles.header}>
           <EditorialHeader
             metadata="MEMBER STATUS"
             title="Alex Johnson"
             subtitle="Crowza Elite Member since 2024"
           />
        </View>

        {/* Hero Membership Card */}
        <View style={styles.heroContainer}>
           <TonalCard variant="high" style={styles.membershipCard} dark>
              <LinearGradient
                colors={[theme.colors.primaryDark, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.cardTop}>
                 <Typography variant="labelSmall" color="rgba(255,255,255,0.6)" weight="900">ELITE TIER</Typography>
                 <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="rgba(255,255,255,0.4)" />
              </View>
              <View style={styles.cardBottom}>
                 <View>
                    <Typography variant="titleLarge" color="white" weight="900">2,480 Pts</Typography>
                    <Typography variant="bodySmall" color="rgba(255,255,255,0.6)">STADIUM REWARDS</Typography>
                 </View>
                 <View style={styles.avatarGlow}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }} 
                      style={styles.avatar} 
                    />
                 </View>
              </View>
           </TonalCard>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
           <TonalCard variant="low" style={styles.statBox}>
              <Typography variant="headlineSmall" weight="900" color={theme.colors.primary}>12</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} weight="800">EVENTS</Typography>
           </TonalCard>
           <TonalCard variant="low" style={styles.statBox}>
              <Typography variant="headlineSmall" weight="900" color={theme.colors.onSurface}>0</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} weight="800">UNPAID</Typography>
           </TonalCard>
           <TonalCard variant="low" style={styles.statBox}>
              <Typography variant="headlineSmall" weight="900" color={theme.colors.tertiary}>04</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} weight="800">OFFERS</Typography>
           </TonalCard>
        </View>

        {/* Actionable Menu */}
        <View style={styles.menuSection}>
           <Typography variant="labelSmall" color={theme.colors.outline} weight="900" style={styles.sectionTitle}>
              ACCOUNT PREFERENCES
           </Typography>
           {MENUS.map((menu, idx) => (
             <TouchableOpacity 
               key={idx} 
               style={styles.menuItem}
               activeOpacity={0.7}
               onPress={() => navigation.navigate(menu.screen)}
             >
                <View style={styles.menuIconBox}>
                   <MaterialCommunityIcons name={menu.icon as any} size={24} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                   <Typography variant="titleMedium" weight="700">{menu.title}</Typography>
                   <Typography variant="bodySmall" color={theme.colors.outline}>{menu.detail}</Typography>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.outlineVariant} />
             </TouchableOpacity>
           ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
           <Ionicons name="log-out" size={20} color={theme.colors.error} />
           <Typography variant="labelLarge" color={theme.colors.error} weight="900" style={{ marginLeft: 12 }}>
              SECURE LOGOUT
           </Typography>
        </TouchableOpacity>

        <View style={styles.footer}>
           <Typography variant="labelSmall" color={theme.colors.outlineVariant}>APP v2.4.0 (2026.04.18)</Typography>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  membershipCard: {
    height: 180,
    borderRadius: 32,
    overflow: 'hidden',
    padding: 24,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  avatarGlow: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  menuSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  sectionTitle: {
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 40,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: theme.colors.error + '08',
    borderWidth: 1,
    borderColor: theme.colors.error + '20',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  }
});
