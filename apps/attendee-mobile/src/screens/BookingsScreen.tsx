/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Booked Events
const MY_BOOKINGS = [
  {
    id: 'b1',
    title: 'The Great Stadium Clash',
    date: 'Apr 24, 2026 - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1540039155733-d730a53b4788?auto=format&fit=crop&w=600&q=80',
    gate: 'Gate B',
    seat: 'Section 114, Row F, Seat 12',
    status: 'Upcoming',
  }
];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Typography variant="headlineMedium" weight="700" color={theme.colors.onSurface}>
          My Bookings
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MY_BOOKINGS.length > 0 ? (
          MY_BOOKINGS.map(booking => (
            <TonalCard key={booking.id} variant="low" style={styles.ticketCard} padding={0}>
              <View style={styles.ticketHeader}>
                <Image source={{ uri: booking.image }} style={styles.ticketImage} />
                <LinearGradient
                   colors={['rgba(0,0,0,0.6)', 'transparent']}
                   style={styles.imageOverlay}
                />
                <View style={styles.statusBadge}>
                   <View style={styles.statusDot} />
                   <Typography variant="labelSmall" weight="900" color="white">
                     {booking.status.toUpperCase()}
                   </Typography>
                </View>
              </View>
              
              <View style={styles.ticketBody}>
                <Typography variant="headlineSmall" weight="900" color={theme.colors.onSurface} style={{ marginBottom: 4 }}>
                  {booking.title}
                </Typography>
                <Typography variant="bodyMedium" color={theme.colors.outline} style={{ marginBottom: 16 }}>
                   Main Stadium • {booking.date.split('-')[0]}
                </Typography>

                <View style={styles.ticketActionRow}>
                    <View style={styles.ticketInfo}>
                       <Typography variant="labelSmall" color={theme.colors.outline} weight="700">SEAT</Typography>
                       <Typography variant="titleLarge" weight="900" color={theme.colors.onSurface}>{booking.seat.split(',')[2].trim()}</Typography>
                    </View>
                    <View style={styles.ticketInfo}>
                       <Typography variant="labelSmall" color={theme.colors.outline} weight="700">GATE</Typography>
                       <Typography variant="titleLarge" weight="900" color={theme.colors.onSurface}>{booking.gate}</Typography>
                    </View>
                    <TouchableOpacity 
                       style={styles.manageBtnContainer}
                       onPress={() => navigation.navigate('EventDashboard', { booking })}
                    >
                        <LinearGradient
                          colors={[theme.colors.primary, theme.colors.secondary]}
                          style={styles.manageBtn}
                        >
                          <Typography variant="labelSmall" color="#FFF" weight="900" style={{ fontSize: 9 }}>MANAGE</Typography>
                        </LinearGradient>
                    </TouchableOpacity>
                 </View>

                 {/* Mini Map Preview */}
                 <View style={styles.miniMapContainer}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80' }} 
                      style={styles.miniMapImage} 
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.miniMapOverlay}>
                       <Ionicons name="navigate-circle" size={24} color="white" />
                       <Typography variant="labelSmall" color="white" weight="800" style={{ marginLeft: 6 }}>
                         GATE B IS 200m AWAY
                       </Typography>
                    </View>
                 </View>

                 <View style={styles.dividerContainer}>
                    <View style={styles.cutOutLeft} />
                    <View style={styles.dashDivider} />
                    <View style={styles.cutOutRight} />
                 </View>

                 <View style={styles.footerActions}>
                   <TouchableOpacity 
                     style={styles.viewDigitalPass}
                     onPress={() => navigation.navigate('Ticket', { booking })}
                   >
                      <Ionicons name="qr-code-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                      <Typography variant="labelLarge" weight="800" color={theme.colors.primary}>TICKET</Typography>
                   </TouchableOpacity>
                   <TouchableOpacity 
                     style={styles.navigateAction}
                     onPress={() => navigation.navigate('Map', { emergency: false })}
                   >
                      <Ionicons name="map-outline" size={20} color="white" style={{ marginRight: 8 }} />
                      <Typography variant="labelLarge" weight="800" color="white">NAVIGATE</Typography>
                   </TouchableOpacity>
                 </View>

              </View>
            </TonalCard>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color={theme.colors.surfaceContainerHighest} />
            <Typography variant="titleMedium" weight="700" color={theme.colors.outline} style={{ marginTop: 16 }}>
              No upcoming bookings
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 8 }}>
              Check out the home tab to find your next great experience.
            </Typography>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  ticketCard: {
    borderRadius: 28,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  ticketHeader: {
    height: 140,
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F98000',
  },
  ticketBody: {
    padding: 24,
  },
  ticketActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  ticketInfo: {
    flex: 1,
  },
  manageBtnContainer: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  manageBtn: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  miniMapContainer: {
    height: 100,
    borderRadius: 20,
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceVariant,
  },
  miniMapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  miniMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dividerContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: -24,
  },
  cutOutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.bgPrimary,
    marginLeft: -10,
  },
  cutOutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.bgPrimary,
    marginRight: -10,
  },
  dashDivider: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    borderStyle: 'dashed',
    marginHorizontal: 12,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  viewDigitalPass: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    backgroundColor: theme.colors.primary + '05',
  },
  navigateAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  }
});
