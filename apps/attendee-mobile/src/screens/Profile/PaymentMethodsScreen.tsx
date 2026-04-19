/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, SignatureButton, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const CARDS = [
    { id: '1', type: 'VISA', last4: '8842', expiry: '09/27', brand: 'Visa', color: ['#1e3a8a', '#3b82f6'] },
    { id: '2', type: 'MASTERCARD', last4: '1105', expiry: '12/25', brand: 'Mastercard', color: ['#1f2937', '#4b5563'] },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="800">Payment Methods</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EditorialHeader
          metadata="WALLET"
          title="Crowza Pay"
          subtitle="Manage your connected accounts and payment methods for seamless venue experiences."
        />

        {/* Digital Wallet Card */}
        <TonalCard variant="highest" style={styles.walletCard} dark>
           <LinearGradient colors={[theme.colors.primaryDark, theme.colors.primary]} style={styles.walletGradient}>
              <View style={styles.walletHeader}>
                <Typography variant="labelSmall" color="rgba(255,255,255,0.7)" weight="900">WALLET BALANCE</Typography>
                <Ionicons name="wallet-outline" size={24} color="#FFF" />
              </View>
              <Typography variant="displayMedium" color="white" weight="900" style={styles.balance}>$342.50</Typography>
              <View style={styles.walletFooter}>
                 <Typography variant="labelLarge" color="white" weight="700">Digital Credits: 1,200</Typography>
                 <TouchableOpacity style={styles.topUpBtn}>
                    <Typography variant="labelSmall" color={theme.colors.primary} weight="900">TOP UP</Typography>
                 </TouchableOpacity>
              </View>
           </LinearGradient>
        </TonalCard>

        <Typography variant="titleLarge" weight="800" style={styles.sectionTitle}>Saved Cards</Typography>
        
        {CARDS.map(card => (
          <TonalCard key={card.id} variant="medium" style={styles.cardItem}>
            <View style={styles.cardInfo}>
               <View style={styles.cardBrandIcon}>
                  <Ionicons name={card.brand === 'Visa' ? 'card' : 'card-outline'} size={32} color={theme.colors.primary} />
               </View>
               <View style={{ flex: 1, marginLeft: 16 }}>
                  <Typography variant="titleMedium" weight="800">•••• •••• •••• {card.last4}</Typography>
                  <Typography variant="bodySmall" color={theme.colors.outline}>Expires {card.expiry}</Typography>
               </View>
               <TouchableOpacity onPress={() => Alert.alert('Edit Card', 'Update card details.')}>
                  <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.outline} />
               </TouchableOpacity>
            </View>
          </TonalCard>
        ))}

        <TouchableOpacity style={styles.addCardBtn} onPress={() => Alert.alert('Coming Soon', 'New payment method integration is rolling out.')}>
          <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.addCardGradient}>
            <Ionicons name="add" size={24} color={theme.colors.primary} />
            <Typography variant="labelLarge" weight="800" color={theme.colors.primary} style={{ marginLeft: 8 }}>
              ADD NEW METHOD
            </Typography>
          </LinearGradient>
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
  walletCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 40,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  walletGradient: {
    padding: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    marginTop: 12,
    marginBottom: 20,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topUpBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  cardItem: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrandIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardBtn: {
    marginTop: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  addCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  }
});
