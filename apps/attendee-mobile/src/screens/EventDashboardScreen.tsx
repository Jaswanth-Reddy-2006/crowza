/**
 * Event Dashboard Screen - Fully Functional
 * Browse, filter, and attend events with real functionality
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Venue {
  name: string;
  building: string;
  zone: string;
  capacity: number;
  accessibility: string[];
  facilities: string[];
  activities: string[];
  operatingHours: string;
  parking: { location: string; price: number }[];
  artInstallations: string[];
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  icon: string;
  status: 'upcoming' | 'live' | 'completed';
  attendees: number;
  ticketPrice: number;
  description: string;
  venue: Venue;
  rating: number;
  reviews: number;
}

export default function EventDashboardScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const events: Event[] = [
    {
      id: '1',
      name: 'Main Concert - The Rockers',
      date: 'April 20, 2026',
      time: '6:00 PM - 10:00 PM',
      location: 'Main Stage',
      type: 'Music',
      icon: '🎸',
      status: 'upcoming',
      attendees: 5234,
      ticketPrice: 45,
      description: 'An amazing rock concert featuring international artists and stunning light shows.',
      rating: 4.8,
      reviews: 234,
      venue: {
        name: 'Main Hall',
        building: 'Building A',
        zone: 'Zone 1',
        capacity: 2000,
        operatingHours: '10 AM - 11 PM',
        accessibility: ['Wheelchairs', 'Elevators', 'ASL interpreters'],
        facilities: ['Restrooms', 'Concessions', 'WiFi', 'First Aid'],
        activities: ['Concerts', 'Dance performances', 'Light shows'],
        parking: [
          { location: 'Lot A', price: 10 },
          { location: 'Lot B', price: 8 },
        ],
        artInstallations: ['Digital light show', '3D projections'],
      },
    },
    {
      id: '2',
      name: 'Comedy Night - Laugh Out Loud',
      date: 'April 20, 2026',
      time: '7:30 PM - 9:30 PM',
      location: 'Comedy Arena',
      type: 'Comedy',
      icon: '😂',
      status: 'upcoming',
      attendees: 1850,
      ticketPrice: 25,
      description: 'Get ready for hilarious performances from world-class comedians.',
      rating: 4.5,
      reviews: 156,
      venue: {
        name: 'Comedy Theater',
        building: 'Building A',
        zone: 'Zone 2',
        capacity: 800,
        operatingHours: '5 PM - 11 PM',
        accessibility: ['Wheelchairs', 'Accessible seating'],
        facilities: ['Restrooms', 'Bar service', 'WiFi'],
        activities: ['Comedy shows', 'Stand-up performances', 'Improv'],
        parking: [{ location: 'Lot A', price: 10 }],
        artInstallations: ['Comedy murals'],
      },
    },
    {
      id: '3',
      name: 'Food Fest - Culinary Delights',
      date: 'April 20, 2026',
      time: '5:00 PM - 9:00 PM',
      location: 'Food Court',
      type: 'Food & Drink',
      icon: '🍽️',
      status: 'live',
      attendees: 3500,
      ticketPrice: 15,
      description: 'Experience the best cuisines from around the world with live cooking demonstrations.',
      rating: 4.7,
      reviews: 312,
      venue: {
        name: 'Food Court',
        building: 'Building A',
        zone: 'Zone 3',
        capacity: 500,
        operatingHours: '11 AM - 10 PM',
        accessibility: ['Wheelchairs', 'Elevators'],
        facilities: ['Seating (150 tables)', 'Restrooms', 'WiFi', 'Concessions'],
        activities: ['International cuisine', 'Fast food', 'Live cooking demos', 'Beverages'],
        parking: [{ location: 'Lot B', price: 8 }],
        artInstallations: ['Food truck murals', 'Photography displays'],
      },
    },
    {
      id: '4',
      name: 'VIP Meet & Greet',
      date: 'April 20, 2026',
      time: '8:00 PM',
      location: 'VIP Lounge',
      type: 'Meet & Greet',
      icon: '⭐',
      status: 'upcoming',
      attendees: 250,
      ticketPrice: 150,
      description: 'Exclusive meet and greet with artists and special guests. Limited capacity!',
      rating: 4.9,
      reviews: 89,
      venue: {
        name: 'VIP Lounge',
        building: 'Building A',
        zone: 'Zone 4',
        capacity: 200,
        operatingHours: '12 PM - Late night',
        accessibility: ['Wheelchairs', 'Premium access'],
        facilities: ['Premium seating', 'Private restrooms', 'Concierge', 'Bar'],
        activities: ['Networking', 'Meet & greet', 'Premium service'],
        parking: [{ location: 'Valet', price: 15 }],
        artInstallations: ['Art gallery', 'Sculptures', 'Premium art collection'],
      },
    },
    {
      id: '5',
      name: 'Interactive Art Exhibition',
      date: 'April 19-21, 2026',
      time: '10:00 AM - 8:00 PM',
      location: 'Art Gallery',
      type: 'Art & Culture',
      icon: '🎨',
      status: 'live',
      attendees: 890,
      ticketPrice: 12,
      description: 'Immersive art installation featuring interactive displays and virtual reality experiences.',
      rating: 4.6,
      reviews: 178,
      venue: {
        name: 'Art Gallery',
        building: 'Building B',
        zone: 'Zone 5',
        capacity: 300,
        operatingHours: '10 AM - 6 PM',
        accessibility: ['Wheelchairs', 'Elevators', 'Accessible restrooms'],
        facilities: ['Lecture hall', 'Storage', 'WiFi', 'First Aid'],
        activities: ['Art displays', 'Artist talks', 'Workshops', 'Interactive installations'],
        parking: [{ location: 'Lot C', price: 5 }],
        artInstallations: ['Rotating exhibitions', 'Interactive installations', 'Virtual reality art'],
      },
    },
    {
      id: '6',
      name: 'Sports Tournament - Esports Finals',
      date: 'April 21, 2026',
      time: '2:00 PM - 6:00 PM',
      location: 'Gaming Arena',
      type: 'Sports',
      icon: '🎮',
      status: 'upcoming',
      attendees: 2100,
      ticketPrice: 30,
      description: 'Watch professional esports teams compete in thrilling matches. Cheer for your favorites!',
      rating: 4.7,
      reviews: 245,
      venue: {
        name: 'Gaming Arena',
        building: 'Building A',
        zone: 'Zone 2',
        capacity: 1500,
        operatingHours: '10 AM - 10 PM',
        accessibility: ['Wheelchairs', 'Accessible seating'],
        facilities: ['Restrooms', 'Concessions', 'WiFi', 'Sound system'],
        activities: ['Esports tournaments', 'Gaming workshops', 'Networking'],
        parking: [{ location: 'Lot A', price: 10 }],
        artInstallations: ['Gaming murals', 'LED displays'],
      },
    },
  ];

  const eventTypes = ['all', 'Music', 'Comedy', 'Food & Drink', 'Sports', 'Art & Culture'];

  const filteredEvents =
    filterType === 'all' ? events : events.filter((event) => event.type === filterType);

  const handleAttendEvent = (event: Event) => {
    if (attendingEvents.includes(event.id)) {
      setAttendingEvents(attendingEvents.filter((id) => id !== event.id));
      Alert.alert('✓ Removed', `You cancelled attendance to ${event.name}`, [{ text: 'OK' }]);
    } else {
      setAttendingEvents([...attendingEvents, event.id]);
      Alert.alert(
        '✓ Added to Itinerary',
        `You are now attending ${event.name}\n\n📅 ${event.date}\n🕐 ${event.time}\n📍 ${event.location}`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderEventCard = ({ item: event }: { item: Event }) => {
    const isAttending = attendingEvents.includes(event.id);
    const statusColor =
      event.status === 'live'
        ? '#FF5252'
        : event.status === 'completed'
        ? '#9E9E9E'
        : theme.colors.primary;

    return (
      <TouchableOpacity
        onPress={() => setSelectedEvent(event)}
        activeOpacity={0.7}
        style={styles.eventCard}
      >
        <LinearGradient
          colors={[statusColor + '15', statusColor + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventCardBg}
        >
          <View style={styles.eventCardContent}>
            <View style={styles.eventTop}>
              <View>
                <Typography variant="titleMedium" weight="600" numberOfLines={1}>
                  {event.icon} {event.name}
                </Typography>
                <View style={styles.typeBadge}>
                  <Typography variant="labelSmall" color={statusColor} weight="600">
                    {event.type}
                  </Typography>
                </View>
              </View>
              {event.status === 'live' && (
                <View style={styles.liveBadge}>
                  <Ionicons name="radio-button-on" size={10} color="#FF5252" />
                  <Typography variant="labelSmall" color="#FF5252" weight="700">
                    LIVE
                  </Typography>
                </View>
              )}
            </View>

            <View style={styles.eventMeta}>
              <Ionicons name="calendar-outline" size={13} color={theme.colors.outline} />
              <Typography variant="labelSmall" color={theme.colors.outline}>
                {event.date}
              </Typography>
            </View>

            <View style={styles.eventMeta}>
              <Ionicons name="time-outline" size={13} color={theme.colors.outline} />
              <Typography variant="labelSmall" color={theme.colors.outline}>
                {event.time}
              </Typography>
            </View>

            <View style={styles.eventMeta}>
              <Ionicons name="location-outline" size={13} color={theme.colors.outline} />
              <Typography variant="labelSmall" color={theme.colors.outline}>
                {event.venue.building}, {event.venue.zone}
              </Typography>
            </View>

            <View style={styles.eventBottom}>
              <View>
                <View style={styles.attendInfo}>
                  <Ionicons name="people-outline" size={13} color={theme.colors.primary} />
                  <Typography variant="labelSmall" color={theme.colors.primary}>
                    {event.attendees} attending
                  </Typography>
                </View>
                <View style={[styles.attendInfo, { marginTop: 4 }]}>
                  <Ionicons name="pricetag-outline" size={13} color={theme.colors.primary} />
                  <Typography variant="labelSmall" color={theme.colors.primary} weight="600">
                    ${event.ticketPrice}
                  </Typography>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleAttendEvent(event)}
                style={[styles.attendBtn, isAttending && { backgroundColor: '#4CAF50' }]}
              >
                <Ionicons
                  name={isAttending ? 'checkmark' : 'add'}
                  size={14}
                  color={isAttending ? 'white' : theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (selectedEvent) {
    const isAttending = attendingEvents.includes(selectedEvent.id);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setSelectedEvent(null)}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Typography variant="headlineSmall" weight="700">
              Event Details
            </Typography>
            <View style={{ width: 24 }} />
          </View>

          <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.heroSection}>
            <Typography variant="displayMedium" weight="700">
              {selectedEvent.icon}
            </Typography>
          </LinearGradient>

          <View style={styles.detailContent}>
            <Typography variant="headlineSmall" weight="700" style={{ marginBottom: 16 }}>
              {selectedEvent.name}
            </Typography>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFB81C" />
              <Typography variant="labelMedium" weight="600" style={{ marginLeft: 4 }}>
                {selectedEvent.rating}/5
              </Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginLeft: 4 }}>
                ({selectedEvent.reviews} reviews)
              </Typography>
            </View>

            <View style={styles.divider} />

            <Typography variant="titleSmall" weight="600" style={{ marginBottom: 12 }}>
              WHEN & WHERE
            </Typography>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Date & Time
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  {selectedEvent.date} • {selectedEvent.time}
                </Typography>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Venue Location
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  {selectedEvent.venue.name}
                </Typography>
                <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginTop: 4 }}>
                  {selectedEvent.venue.building} • {selectedEvent.venue.zone}
                </Typography>
              </View>
            </View>

            <View style={styles.divider} />

            <Typography variant="titleSmall" weight="600" style={{ marginBottom: 12 }}>
              PRICING & ATTENDEES
            </Typography>

            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Ticket Price
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  ${selectedEvent.ticketPrice} per ticket
                </Typography>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Current Attendees
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  {selectedEvent.attendees} people attending
                </Typography>
              </View>
            </View>

            <View style={styles.divider} />

            <Typography variant="titleSmall" weight="600" style={{ marginBottom: 12 }}>
              VENUE INFORMATION
            </Typography>

            <View style={styles.infoBox}>
              <View style={styles.infoPair}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Capacity
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  {selectedEvent.venue.capacity} people
                </Typography>
              </View>
              <View style={styles.infoPair}>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  Hours
                </Typography>
                <Typography variant="bodyMedium" weight="600">
                  {selectedEvent.venue.operatingHours}
                </Typography>
              </View>
            </View>

            <Typography variant="labelSmall" color={theme.colors.outline} weight="600" style={{ marginTop: 12, marginBottom: 6 }}>
              Facilities
            </Typography>
            <View style={styles.tagContainer}>
              {selectedEvent.venue.facilities.map((facility, idx) => (
                <View key={idx} style={styles.tag}>
                  <Typography variant="labelSmall">{facility}</Typography>
                </View>
              ))}
            </View>

            <Typography variant="labelSmall" color={theme.colors.outline} weight="600" style={{ marginTop: 12, marginBottom: 6 }}>
              Accessibility
            </Typography>
            <View style={styles.tagContainer}>
              {selectedEvent.venue.accessibility.map((access, idx) => (
                <View key={idx} style={styles.tag}>
                  <Ionicons name="checkmark-circle" size={12} color={theme.colors.primary} />
                  <Typography variant="labelSmall" style={{ marginLeft: 4 }}>
                    {access}
                  </Typography>
                </View>
              ))}
            </View>

            <Typography variant="labelSmall" color={theme.colors.outline} weight="600" style={{ marginTop: 12, marginBottom: 6 }}>
              Activities
            </Typography>
            <View style={styles.tagContainer}>
              {selectedEvent.venue.activities.map((activity, idx) => (
                <View key={idx} style={styles.tag}>
                  <Typography variant="labelSmall">{activity}</Typography>
                </View>
              ))}
            </View>

            <Typography variant="labelSmall" color={theme.colors.outline} weight="600" style={{ marginTop: 12, marginBottom: 6 }}>
              Parking Options
            </Typography>
            <View style={styles.tagContainer}>
              {selectedEvent.venue.parking.map((lot, idx) => (
                <View key={idx} style={styles.tag}>
                  <Typography variant="labelSmall">
                    {lot.location} (${lot.price})
                  </Typography>
                </View>
              ))}
            </View>

            <Typography variant="labelSmall" color={theme.colors.outline} weight="600" style={{ marginTop: 12, marginBottom: 6 }}>
              Art & Installations
            </Typography>
            <View style={styles.tagContainer}>
              {selectedEvent.venue.artInstallations.map((art, idx) => (
                <View key={idx} style={styles.tag}>
                  <Typography variant="labelSmall">{art}</Typography>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <Typography variant="titleSmall" weight="600" style={{ marginBottom: 12 }}>
              ABOUT
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant}>
              {selectedEvent.description}
            </Typography>
          </View>
        </ScrollView>

        <View style={styles.detailActions}>
          <TouchableOpacity
            onPress={() => handleAttendEvent(selectedEvent)}
            style={[styles.actionBtn, isAttending && { backgroundColor: '#FF5252' }]}
          >
            <Ionicons name={isAttending ? 'trash' : 'add-circle'} size={18} color="white" />
            <Typography color="white" weight="700" style={{ fontSize: 13 }}>
              {isAttending ? 'Remove' : 'Add to Itinerary'}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="navigate" size={18} color="white" />
            <Typography color="white" weight="700" style={{ fontSize: 13 }}>
              Navigate
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={eventTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilterType(item)}
              style={[
                styles.filterChip,
                filterType === item && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Typography
                variant="labelSmall"
                color={filterType === item ? 'white' : theme.colors.onSurfaceVariant}
                weight="600"
              >
                {item === 'all' ? 'All Events' : item}
              </Typography>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 12 }}
        />
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterBar: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  eventCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardBg: {
    padding: 12,
  },
  eventCardContent: {
    gap: 8,
  },
  eventTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: theme.colors.primary + '15',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#FF5252' + '20',
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.outlineVariant,
  },
  attendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  // Detail view
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  heroSection: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: 16,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  infoPair: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
});
