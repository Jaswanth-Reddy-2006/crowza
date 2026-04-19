/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const FAQS = [
    'How do I view my digital ticket?',
    'Where is the nearest bag drop?',
    'What food vendors are open now?',
    'How to report a medical emergency?',
  ];

  const SUPPORT_ACTIONS = [
    { title: 'Chat with Support', icon: 'chatbubbles-outline', color: theme.colors.primary },
    { title: 'Email us', icon: 'mail-outline', color: theme.colors.tertiary },
    { title: 'Call Venue Security', icon: 'call-outline', color: theme.colors.error },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="800">Help & Support</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EditorialHeader
          metadata="ASSISTANCE"
          title="We're here to help"
          subtitle="Access quick answers, contact our venue team, or learn more about the Crowza platform."
        />

        <View style={styles.supportGrid}>
          {SUPPORT_ACTIONS.map((action, idx) => (
            <TouchableOpacity key={idx} style={styles.supportBox} onPress={() => Alert.alert(action.title, 'Connecting you to support...')}>
              <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Typography variant="labelLarge" weight="800" style={{ marginTop: 12 }}>{action.title}</Typography>
            </TouchableOpacity>
          ))}
        </View>

        <Typography variant="titleLarge" weight="800" style={styles.sectionTitle}>Frequently Asked</Typography>
        {FAQS.map((faq, idx) => (
          <TouchableOpacity key={idx} style={styles.faqItem} onPress={() => Alert.alert('FAQ', 'Detailed answer coming soon.')}>
            <Typography variant="titleMedium" style={{ flex: 1 }}>{faq}</Typography>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
           <Typography variant="bodySmall" color={theme.colors.outline}>App Version 2.4.1 (Stable)</Typography>
           <Typography variant="bodySmall" color={theme.colors.outline}>© 2026 Crowza Technologies</Typography>
        </View>
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
  supportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  supportBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 4,
  }
});
