import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock Data
const UPCOMING_EVENTS = [
  {
    id: 'e1',
    title: 'The Great Stadium Clash',
    date: 'Apr 24, 2026 - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1540039155733-d730a53b4788?auto=format&fit=crop&w=600&q=80',
    price: '$45.00',
    location: 'Crowza Main Stadium',
  },
  {
    id: 'e2',
    title: 'Summer Music Festival',
    date: 'May 10, 2026 - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    price: '$120.00',
    location: 'Open Air Grounds',
  },
  {
    id: 'e3',
    title: 'Tech Innovators Summit',
    date: 'Jun 15, 2026 - 9:00 AM',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    price: 'Free',
    location: 'Expo Hall B',
  },
  {
    id: 'e4',
    title: 'Night Markets & Food',
    date: 'Jul 4, 2026 - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    price: '$10.00',
    location: 'Venue Park',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const navigateToDetail = (event: typeof UPCOMING_EVENTS[0]) => {
    navigation.navigate('EventDetail', { event });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="star" size={28} color={theme.colors.primary} />
            <Typography variant="headlineSmall" weight="700" style={styles.appName}>
              CROWZA
            </Typography>
          </View>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => Alert.alert('Notifications', 'You have no new notifications.')}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Typography variant="displaySmall" weight="700" color={theme.colors.onSurface}>
            Discover
          </Typography>
          <Typography variant="titleMedium" color={theme.colors.outline} style={{ marginTop: 4 }}>
            Find the best events happening right near you.
          </Typography>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for events, artists, venues..."
            placeholderTextColor={theme.colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => Alert.alert('Filters', 'Advanced search filters coming soon.')}>
            <Ionicons name="options" size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {/* Categories / Tags (Optional extra aesthetic) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll} contentContainerStyle={styles.tagsContainer}>
          {['All', 'Music', 'Sports', 'Tech', 'Food', 'Art'].map((tag, idx) => (
            <TouchableOpacity key={tag} style={[styles.tag, idx === 0 && styles.tagActive]}>
              <Typography variant="labelMedium" color={idx === 0 ? theme.colors.onPrimary : theme.colors.onSurface}>
                {tag}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Today's Event Banner */}
        <View style={styles.todayBannerContainer}>
          <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface} style={{ marginBottom: 12 }}>
            Today's Plan
          </Typography>
          <TouchableOpacity 
            style={styles.todayBannerCard}
            onPress={() => navigation.navigate('EventDashboard', { booking: UPCOMING_EVENTS[0] })}
            activeOpacity={0.9}
          >
            <View style={styles.todayBannerContent}>
              <View style={styles.pulseDot} />
              <Typography variant="labelSmall" weight="700" color="#FFFFFF">HAPPENING TODAY</Typography>
            </View>
            <Typography variant="titleMedium" weight="700" color="#FFFFFF" style={{ marginTop: 8, marginBottom: 4 }}>
              The Great Stadium Clash
            </Typography>
            <Typography variant="bodyMedium" color="#E5E5E5">
              Event starts at 5:00 PM
            </Typography>
            <View style={styles.todayBannerFooter}>
              <TouchableOpacity style={styles.viewPlanBtn} onPress={() => navigation.navigate('EventDashboard', { booking: UPCOMING_EVENTS[0] })}>
                <Typography variant="labelMedium" weight="700" color={theme.colors.primary}>
                  MANAGE EVENT
                </Typography>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: UPCOMING_EVENTS[0].image }} style={styles.todayBannerImage} blurRadius={4} />
          </TouchableOpacity>
        </View>

        {/* Trending Events Section */}
        <View style={styles.sectionHeader}>
          <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface}>
            Upcoming Events
          </Typography>
          <TouchableOpacity>
            <Typography variant="labelMedium" color={theme.colors.primary}>
              See All
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsList}>
          {UPCOMING_EVENTS.map(event => (
            <TouchableOpacity 
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.9}
              onPress={() => navigateToDetail(event)}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface} numberOfLines={1}>
                  {event.title}
                </Typography>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="calendar-outline" size={14} color={theme.colors.outline} />
                  <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginLeft: 4 }}>
                    {event.date}
                  </Typography>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.outline} />
                  <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginLeft: 4 }} numberOfLines={1}>
                    {event.location}
                  </Typography>
                </View>
                
                <View style={styles.eventFooter}>
                  <Typography variant="titleMedium" weight="700" color={theme.colors.primary}>
                    {event.price}
                  </Typography>
                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => navigateToDetail(event)}
                  >
                    <Typography variant="labelMedium" weight="700" color={theme.colors.onPrimary}>
                      BOOK
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Light Theme
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    color: theme.colors.primary,
    marginLeft: 8,
    letterSpacing: 1.5,
  },
  notificationBtn: {
    padding: 8,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 20,
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 54,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
  filterBtn: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 10,
  },
  tagsScroll: {
    marginTop: 20,
  },
  tagsContainer: {
    paddingHorizontal: 20,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainer,
    marginRight: 12,
  },
  tagActive: {
    backgroundColor: theme.colors.primary,
  },
  todayBannerContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  todayBannerCard: {
    backgroundColor: '#333333',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  todayBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  todayBannerFooter: {
    marginTop: 16,
    zIndex: 2,
  },
  viewPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  todayBannerImage: {
    position: 'absolute',
    width: '120%',
    height: '150%',
    opacity: 0.4,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  eventsList: {
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  eventImage: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.surfaceVariant,
  },
  eventContent: {
    padding: 16,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainer,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
