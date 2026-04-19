/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function TicketScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { booking } = route.params || {};

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography>No booking data</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="700">Digital Pass</Typography>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.ticketWrapper}>
        {/* Ticket Top Part */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81']}
          style={styles.ticketTop}
        >
          <View style={styles.eventInfo}>
            <Typography variant="labelMedium" color="rgba(255,255,255,0.6)" weight="700">EVENT PASS</Typography>
            <Typography variant="headlineSmall" color="#FFFFFF" weight="800" style={{ marginTop: 4 }}>
              {booking.title}
            </Typography>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.7)" />
              <Typography variant="bodySmall" color="rgba(255,255,255,0.7)" style={{ marginLeft: 6 }}>
                {booking.date}
              </Typography>
            </View>
          </View>
          
          <View style={styles.logoContainer}>
             <View style={styles.logoCircle}>
                <Ionicons name="flash" size={20} color={theme.colors.primary} />
             </View>
          </View>
        </LinearGradient>

        {/* Ticket Perforation */}
        <View style={styles.perforationRow}>
          <View style={[styles.cutout, { left: -15 }]} />
          <View style={styles.dashedLine} />
          <View style={[styles.cutout, { right: -15 }]} />
        </View>

        {/* Ticket Bottom Part */}
        <View style={styles.ticketBottom}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Typography variant="labelSmall" color={theme.colors.outline}>GATE</Typography>
              <Typography variant="titleLarge" weight="800">{booking.gate || 'GATE B'}</Typography>
            </View>
            <View style={styles.infoBox}>
              <Typography variant="labelSmall" color={theme.colors.outline}>SEAT / SECTION</Typography>
              <Typography variant="titleLarge" weight="800">{booking.seat?.split(',')[0] || 'GA'}</Typography>
            </View>
          </View>

          <View style={styles.qrContainer}>
             <Image 
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${booking.id || 'b1'}&bgcolor=ffffff&color=1E1B4B` }}
                style={styles.qrCode}
             />
             <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginTop: 16 }}>
                SCAN AT ENTRY POINT
             </Typography>
          </View>

          <View style={styles.bookingRef}>
            <Typography variant="labelSmall" color={theme.colors.outline}>BOOKING REF</Typography>
            <Typography variant="bodyMedium" weight="700" style={{ letterSpacing: 2 }}>
              {String(booking.id).toUpperCase() || 'CR-X7Y9'}
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <SignatureButton
          label="Add to Wallet"
          variant="secondary"
          onPress={() => alert('Simulated Wallet Integration')}
          style={{ marginBottom: 12, width: '100%' }}
        />
        <SignatureButton
          label="Download PDF"
          variant="secondary"
          onPress={() => alert('Simulated PDF Download')}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  ticketWrapper: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventInfo: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  logoContainer: {
    marginLeft: 16,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perforationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 30,
    position: 'relative',
  },
  cutout: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginHorizontal: 30,
  },
  ticketBottom: {
    padding: 24,
    alignItems: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 32,
  },
  infoBox: {
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  bookingRef: {
    alignItems: 'center',
  },
  actions: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
  },
});
