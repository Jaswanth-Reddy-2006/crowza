/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const { eventTitle, amount, date } = route.params || { 
    eventTitle: 'Premium Event Access', 
    amount: '$149.00',
    date: 'Oct 24, 2026'
  };

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to My Bookings (simulated by going to a specific tab or screen)
      navigation.navigate('Bookings', { paymentSuccess: true });
    }, 1500);
  };

  const PaymentMethod = ({ id, label, icon }: { id: string, label: string, icon: any }) => (
    <TouchableOpacity 
      onPress={() => setSelectedMethod(id)}
      style={[
        styles.methodItem,
        selectedMethod === id && styles.methodItemActive
      ]}
    >
      <Ionicons name={icon} size={24} color={selectedMethod === id ? theme.colors.primary : theme.colors.outline} />
      <Typography 
        variant="bodyMedium" 
        style={{ marginLeft: 16 }}
        color={selectedMethod === id ? theme.colors.onSurface : theme.colors.outline}
      >
        {label}
      </Typography>
      <View style={{ flex: 1 }} />
      {selectedMethod === id && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge">Checkout</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TonalCard variant="medium" style={styles.summaryCard}>
          <Typography variant="labelSmall" color={theme.colors.primary}>ORDER SUMMARY</Typography>
          <Typography variant="headlineSmall" style={{ marginTop: 8 }}>{eventTitle}</Typography>
          <Typography variant="bodyMedium" color={theme.colors.outline}>{date} • Venue Arena</Typography>
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Typography variant="bodyLarge">Total Amount</Typography>
            <Typography variant="headlineMedium" color={theme.colors.primary}>{amount}</Typography>
          </View>
        </TonalCard>

        <Typography variant="titleMedium" style={styles.sectionTitle}>Payment Method</Typography>
        
        <View style={styles.methodsList}>
          <PaymentMethod id="card" label="Credit / Debit Card" icon="card-outline" />
          <PaymentMethod id="upi" label="UPI / Google Pay" icon="flash-outline" />
          <PaymentMethod id="apple" label="Apple Pay" icon="logo-apple" />
        </View>

        <TonalCard variant="low" style={styles.secureCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.outline} />
          <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginLeft: 12 }}>
            Secure SSL encrypted payment processing.
          </Typography>
        </TonalCard>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <SignatureButton
          label={isProcessing ? "PROCESSING..." : `PAY ${amount}`}
          onPress={handlePayment}
          variant="primary"
          disabled={isProcessing}
        />
      </View>
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
    height: 60,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 24,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  methodItemActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer + '20', // ultra light primary
  },
  secureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 32,
    borderRadius: 12,
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
});
