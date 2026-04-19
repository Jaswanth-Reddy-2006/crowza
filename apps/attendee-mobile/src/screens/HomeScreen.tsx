/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data
const UPCOMING_EVENTS = [
  {
    id: 'e1',
    title: 'The Great Stadium Clash',
    date: 'Apr 24, 2026 - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1540039155733-d730a53b4788?auto=format&fit=crop&w=600&q=80',
    price: '$45.00',
    location: 'Crowza Main Stadium',
    category: 'Sports',
  },
  {
    id: 'e2',
    title: 'Summer Music Festival',
    date: 'May 10, 2026 - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    price: '$120.00',
    location: 'Open Air Grounds',
    category: 'Music',
  },
  {
    id: 'e3',
    title: 'Tech Innovators Summit',
    date: 'Jun 15, 2026 - 9:00 AM',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    price: 'Free',
    location: 'Expo Hall B',
    category: 'Tech',
  },
];

const CATEGORIES = ['All', 'Music', 'Sports', 'Tech', 'Food', 'Art'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filteredEvents = useMemo(() => {
    let result = UPCOMING_EVENTS;
    if (activeCategory !== 'All') {
      result = result.filter(e => e.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [activeCategory]);

  const handleManageEvent = () => {
    navigation.navigate('EventDashboard', { 
       booking: { 
         id: 'b-warriors',
         title: 'Warriors vs Suns', 
         gate: 'Gate A', 
         seat: 'Sec 102, Row B, 12',
         date: 'TONIGHT, 7:30 PM'
       } 
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Notifications */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarBox}>
               <Image 
                 source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                 style={styles.avatar}
               />
               <View style={[styles.onlineDot, { backgroundColor: theme.colors.primary }]} />
            </View>
            <View>
              <Typography variant="titleMedium" weight="900" style={{ letterSpacing: -0.5 }}>Jaswanth Reddy</Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} weight="800">CROWZA PLATINUM</Typography>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionCircle}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={theme.colors.onSurface} />
              <View style={styles.badgeCount} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Restore Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
             <Ionicons name="search" size={20} color={theme.colors.outline} />
             <TextInput 
               placeholder="Search events, venues..." 
               style={styles.searchInput}
               value={searchQuery}
               onChangeText={setSearchQuery}
               placeholderTextColor={theme.colors.outline}
             />
             <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color={theme.colors.primary} />
             </TouchableOpacity>
          </View>
        </View>

        {/* Live Spotlight Card */}
        <View style={styles.spotlightWrapper}>
           <TonalCard variant="high" style={styles.spotlightCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800' }}
                style={styles.spotlightImg}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.spotlightOverlay}
              >
                 <View style={styles.spotlightContent}>
                    <View style={styles.liveBadge}>
                       <Typography variant="labelSmall" color="white" weight="900">LIVE NOW</Typography>
                    </View>
                    <Typography variant="headlineSmall" color="white" weight="900" style={{ marginTop: 12 }}>
                       Warriors vs Suns: Finals
                    </Typography>
                    <Typography variant="bodySmall" color="rgba(255,255,255,0.7)" style={{ marginTop: 4 }}>
                       Your access is active. Scan at Gate A.
                    </Typography>
                    
                    <TouchableOpacity 
                      style={styles.dashboardBtn}
                      onPress={handleManageEvent}
                    >
                       <Typography variant="labelLarge" color={theme.colors.primary} weight="900">MANAGE EVENT</Typography>
                       <Ionicons name="apps" size={18} color={theme.colors.primary} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                 </View>
              </LinearGradient>
           </TonalCard>
        </View>

        {/* Categories Bar */}
        <View style={styles.categoryBar}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                >
                  <Typography 
                    variant="labelMedium" 
                    weight="900" 
                    color={activeCategory === cat ? 'white' : theme.colors.outline}
                  >
                    {cat.toUpperCase()}
                  </Typography>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Recommendations Section */}
        <Animated.View style={[styles.eventSection, { opacity: fadeAnim }]}>
           <View style={styles.sectionHeader}>
              <Typography variant="titleLarge" weight="900">Recommended for You</Typography>
              <TouchableOpacity><Typography variant="labelMedium" color={theme.colors.primary} weight="800">VIEW ALL</Typography></TouchableOpacity>
           </View>
           
           {filteredEvents.length > 0 ? (
             <View style={styles.grid}>
                {filteredEvents.map(event => (
                  <TouchableOpacity 
                    key={event.id}
                    onPress={() => navigation.navigate('EventDetail', { event })}
                    activeOpacity={0.9}
                  >
                    <TonalCard variant="low" style={styles.eventCard}>
                       <Image source={{ uri: event.image }} style={styles.eventImg} />
                       <View style={styles.eventData}>
                          <View style={styles.eventCat}>
                             <Typography variant="labelSmall" color={theme.colors.primary} weight="900">{event.category}</Typography>
                          </View>
                          <Typography variant="titleMedium" weight="900" numberOfLines={1} style={{ marginTop: 8 }}>{event.title}</Typography>
                          <View style={styles.eventRow}>
                             <Typography variant="bodySmall" color={theme.colors.outline}>{event.location}</Typography>
                             <Typography variant="titleSmall" color={theme.colors.primary} weight="900">{event.price}</Typography>
                          </View>
                       </View>
                    </TonalCard>
                  </TouchableOpacity>
                ))}
             </View>
           ) : (
             <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={theme.colors.outlineVariant} />
                <Typography variant="titleSmall" color={theme.colors.outline} style={{ marginTop: 12 }}>No events in this category yet.</Typography>
             </View>
           )}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarBox: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  badgeCount: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  filterBtn: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  spotlightWrapper: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  spotlightCard: {
    height: 300,
    borderRadius: 32,
    overflow: 'hidden',
    padding: 0,
    elevation: 4,
  },
  spotlightImg: {
    ...StyleSheet.absoluteFillObject,
  },
  spotlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 24,
  },
  spotlightContent: {
    gap: 4,
  },
  liveBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 20,
  },
  categoryBar: {
    marginTop: 24,
  },
  categoryScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  catChip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  catChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  eventSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  eventCard: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  eventImg: {
    width: 110,
    height: 110,
    borderRadius: 18,
  },
  eventData: {
    flex: 1,
    justifyContent: 'center',
  },
  eventCat: {
    backgroundColor: theme.colors.primaryContainer + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
