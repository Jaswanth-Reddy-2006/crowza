import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../utils/hooks';
import { logout } from '../store/slices/authSlice';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const MENUS = [
    { icon: 'person-outline', title: 'Personal Information' },
    { icon: 'card-outline', title: 'Payment Methods' },
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'shield-checkmark-outline', title: 'Security & Privacy' },
    { icon: 'help-circle-outline', title: 'Help & Support' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Typography variant="headlineMedium" weight="700" color={theme.colors.onSurface}>
          Profile
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface}>
              Alex Johnson
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.outline}>
              alex.johnson@example.com
            </Typography>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Typography variant="titleLarge" weight="700" color={theme.colors.primary}>1</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline}>UPCOMING</Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface}>14</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline}>ATTENDED</Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface}>2.4k</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline}>POINTS</Typography>
          </View>
        </View>

        <View style={styles.menuList}>
          {MENUS.map((menu, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.menuItem}
              onPress={() => Alert.alert(menu.title, 'This section is under maintenance.')}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={menu.icon as any} size={22} color={theme.colors.onSurface} />
              </View>
              <Typography variant="titleMedium" color={theme.colors.onSurface} style={styles.menuTitle}>
                {menu.title}
              </Typography>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
          <Typography variant="titleMedium" weight="700" color={theme.colors.error} style={{ marginLeft: 12 }}>
            Log Out
          </Typography>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceVariant,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    flex: 1,
    marginLeft: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFEBEB',
  }
});
