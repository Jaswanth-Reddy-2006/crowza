/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { theme, Typography, TonalCard } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();

  const mockNotifications = [
    {
      id: 'n1',
      title: 'Queue Alert',
      message: 'North Gate is currently at 95% capacity. We recommend using the East Gate for faster entry.',
      type: 'warning',
      action: 'Route to East Gate',
      icon: 'warning',
      color: '#F59E0B'
    },
    {
      id: 'n2',
      title: 'Food Court Update',
      message: 'Refreshments at Section 4 are now 20% off for the next 15 minutes!',
      type: 'info',
      action: 'Show on Map',
      icon: 'fast-food',
      color: theme.colors.primary
    },
    {
      id: 'n3',
      title: 'Weather Update',
      message: 'Light showers expected in 20 minutes. Ponchos available at all Info Desks.',
      type: 'service',
      action: 'Find Nearest Desk',
      icon: 'umbrella',
      color: '#3B82F6'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="900">Notifications</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {mockNotifications.map((notif) => (
          <TonalCard key={notif.id} variant="low" style={styles.notifCard}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={[styles.notifIcon, { backgroundColor: notif.color + '20' }]}>
                <Ionicons name={notif.icon as any} size={20} color={notif.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" weight="800" color={theme.colors.onSurface}>{notif.title}</Typography>
                <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={{ marginTop: 4 }}>
                  {notif.message}
                </Typography>
                
                <TouchableOpacity 
                  style={[styles.notifActionButton, { borderColor: notif.color + '40' }]}
                  onPress={() => {
                    Alert.alert(notif.title, `Executing action: ${notif.action}`);
                    if (notif.id === 'n1') navigation.navigate('Map', { target: 'East Gate' });
                  }}
                >
                  <Typography variant="labelLarge" weight="800" color={notif.color}>{notif.action.toUpperCase()}</Typography>
                  <Ionicons name="chevron-forward" size={16} color={notif.color} />
                </TouchableOpacity>
              </View>
            </View>
          </TonalCard>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notifCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notifIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
