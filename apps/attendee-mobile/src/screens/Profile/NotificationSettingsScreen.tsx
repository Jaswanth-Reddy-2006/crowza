/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    eventUpdates: true,
    queueAlerts: true,
    emergencyBroadcasts: true,
    marketing: false,
    smartAssistant: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NOTIF_GROUPS = [
    {
      title: 'Event Experience',
      items: [
        { id: 'eventUpdates', label: 'Event Updates', description: 'Schedule changes or new artist announcements.', icon: 'calendar' },
        { id: 'smartAssistant', label: 'AI Smart Assistant', description: 'Proactive tips based on your venue location.', icon: 'sparkles' },
      ]
    },
    {
      title: 'Wait Times & Queue',
      items: [
        { id: 'queueAlerts', label: 'Queue Predictions', description: 'Alerts when your favorite stalls have low wait times.', icon: 'timer' },
      ]
    },
    {
      title: 'Safety',
      items: [
        { id: 'emergencyBroadcasts', label: 'Safety Protocols', description: 'Critical emergency pathfinding and safety alerts.', icon: 'warning', required: true },
      ]
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="800">Notifications</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EditorialHeader
          metadata="COMMUNICATION"
          title="Stay Synced"
          subtitle="Configure how and when the Crowza platform connects with you during your journey."
        />

        {NOTIF_GROUPS.map((group, groupIdx) => (
          <View key={groupIdx} style={styles.group}>
            <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={styles.groupTitle}>
              {group.title.toUpperCase()}
            </Typography>
            <TonalCard variant="low" style={styles.groupCard}>
              {group.items.map((item, itemIdx) => (
                <View key={item.id} style={[
                  styles.notifItem,
                  itemIdx !== group.items.length - 1 && styles.border
                ]}>
                  <View style={styles.notifIcon}>
                    <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Typography variant="titleMedium" weight="700">{item.label}</Typography>
                    <Typography variant="bodySmall" color={theme.colors.outline}>{item.description}</Typography>
                  </View>
                  <Switch
                    value={settings[item.id as keyof typeof settings]}
                    onValueChange={() => toggleSetting(item.id as keyof typeof settings)}
                    trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                    thumbColor="#FFFFFF"
                    disabled={item.required}
                  />
                </View>
              ))}
            </TonalCard>
          </View>
        ))}

        <TonalCard variant="highest" style={styles.proCard} dark>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="notifications-circle" size={40} color="#FFF" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Typography variant="titleMedium" color="white" weight="800">SMS Alerts</Typography>
                <Typography variant="bodySmall" color="rgba(255,255,255,0.7)">Backup alerts for low-connectivity zones.</Typography>
              </View>
              <TouchableOpacity style={styles.setupBtn}>
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="900">SETUP</Typography>
              </TouchableOpacity>
           </View>
        </TonalCard>
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
  group: {
    marginTop: 24,
  },
  groupTitle: {
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  groupCard: {
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  proCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
  },
  setupBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  }
});
