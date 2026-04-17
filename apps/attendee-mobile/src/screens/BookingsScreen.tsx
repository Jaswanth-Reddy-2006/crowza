import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

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
            <View key={booking.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Image source={{ uri: booking.image }} style={styles.ticketImage} />
                <View style={styles.statusBadge}>
                  <Typography variant="labelSmall" weight="700" color="#FFFFFF">
                    {booking.status.toUpperCase()}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.ticketBody}>
                <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface} style={{ marginBottom: 8 }}>
                  {booking.title}
                </Typography>
                
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.outline} />
                  <Typography variant="bodyMedium" color={theme.colors.outline} style={{ marginLeft: 8 }}>
                    {booking.date}
                  </Typography>
                </View>

                <View style={styles.divider} />

                <View style={styles.ticketDetails}>
                  <View style={styles.detailItem}>
                    <Typography variant="labelSmall" color={theme.colors.outline}>EST. ENTRY</Typography>
                    <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface}>{booking.gate}</Typography>
                  </View>
                  <View style={styles.detailItem}>
                    <Typography variant="labelSmall" color={theme.colors.outline}>SEAT / TICKET</Typography>
                    <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface}>{booking.seat}</Typography>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.viewTicketBtn}
                  onPress={() => navigation.navigate('EventDashboard', { booking })}
                >
                  <Ionicons name="apps-outline" size={20} color={theme.colors.onPrimary} style={{ marginRight: 8 }} />
                  <Typography variant="labelMedium" weight="700" color={theme.colors.onPrimary}>
                    MANAGE EVENT
                  </Typography>
                </TouchableOpacity>

              </View>
            </View>
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
    backgroundColor: '#F7F8FA', // Slight off-white to make tickets pop
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  ticketHeader: {
    height: 160,
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ticketBody: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  ticketDetails: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  viewTicketBtn: {
    backgroundColor: theme.colors.onSurface,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  }
});
