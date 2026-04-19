/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchEvents, fetchVenue } from '../store/slices/venueSlice';
import { selectAllEvents, selectCurrentVenue } from '../selectors';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabKey = 'DETAILS' | 'LINEUP' | 'LOGISTICS' | 'FAQ';
const TABS: TabKey[] = ['DETAILS', 'LINEUP', 'LOGISTICS', 'FAQ'];

const FAQ_DATA = [
  { q: 'Can I re-enter the venue?', a: 'Yes, re-entry is allowed with your digital pass and wristband until 9:00 PM.' },
  { q: 'Is there a bag policy?', a: 'Strictly clear bags only, maximum size 12" x 12" x 6".' },
  { q: 'Where are the hydration stations?', a: 'Free water stations are located near all major restroom blocks.' },
  { q: 'What items are prohibited?', a: 'Professional cameras, outside food/drink, and large banners are not permitted.' },
];

export default function EventInfoScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();

  const events = useAppSelector(selectAllEvents);
  const venue = useAppSelector(selectCurrentVenue);

  const [activeTab, setActiveTab] = useState<TabKey>('DETAILS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const currentEvent = events[0] ?? { name: 'Vibrant World Tour', date: 'April 25, 2026' };

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchVenue(venueId));
  }, [dispatch, venueId]);

  const toggleFaq = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const heroImageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  const renderDetailsTab = () => (
    <View style={styles.tabContainer}>
      <TonalCard variant="highest" style={styles.visionCard} dark>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.visionBadge}
        >
          <Typography variant="labelSmall" color="white" weight="900">THE VISION</Typography>
        </LinearGradient>
        <Typography variant="headlineMedium" color="white" weight="800" style={styles.summaryTitle}>
           Merging Realities
        </Typography>
        <Typography variant="bodyLarge" color="rgba(255,255,255,0.7)" style={styles.summaryText}>
          {currentEvent?.name} is an exploration of human expression in the age of neural synthesis. Join us for a 4-hour immersive journey through sound and light.
        </Typography>
      </TonalCard>

      <View style={styles.statsGrid}>
        <TonalCard variant="low" style={styles.statBox}>
           <View style={styles.statIconWrapper}>
              <Ionicons name="people" size={20} color={theme.colors.primary} />
           </View>
           <Typography variant="labelSmall" color={theme.colors.outline} weight="700">CAPACITY</Typography>
           <Typography variant="titleLarge" color={theme.colors.onSurface} weight="900">45k+</Typography>
        </TonalCard>
        <TonalCard variant="low" style={styles.statBox}>
           <View style={styles.statIconWrapper}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
           </View>
           <Typography variant="labelSmall" color={theme.colors.outline} weight="700">CURFEW</Typography>
           <Typography variant="titleLarge" color={theme.colors.onSurface} weight="900">23:30</Typography>
        </TonalCard>
      </View>

      <TonalCard variant="low" style={styles.securityCard}>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography variant="titleMedium" weight="900">Prohibited Items</Typography>
            <Typography variant="labelSmall" color={theme.colors.error} weight="800">STRICT ENFORCEMENT</Typography>
         </View>
         <View style={styles.prohibitedList}>
            {['No Large Bags', 'No SLR Cameras', 'No Outside Liquids', 'No Noisemakers'].map((item, idx) => (
               <View key={idx} style={styles.prohibitedItem}>
                  <Ionicons name="close-circle" size={16} color={theme.colors.error} />
                  <Typography variant="bodyMedium" weight="600" color={theme.colors.onSurfaceVariant}>{item}</Typography>
               </View>
            ))}
         </View>
      </TonalCard>
    </View>
  );

  const renderLineupTab = () => (
    <View style={styles.tabContainer}>
      {[
        { time: '18:00', artist: 'NEON SYNTHESIS', role: 'Support', stage: 'Main Deck', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
        { time: '19:45', artist: 'THE ALGORITHM', role: 'Main Support', stage: 'Main Deck', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200' },
        { time: '21:30', artist: 'QUANTUM FIELD', role: 'Headliner', stage: 'Main Deck', img: 'https://images.unsplash.com/photo-1514525253361-bee8a187499b?w=200' },
      ].map((item, idx) => (
        <TonalCard key={idx} variant="low" style={styles.lineupCard}>
           <Image source={{ uri: item.img }} style={styles.artistThumb} />
           <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                 <Typography variant="labelSmall" color={theme.colors.primary} weight="900">{item.time}</Typography>
                 <Typography variant="labelSmall" color={theme.colors.outline} weight="700">{item.stage}</Typography>
              </View>
              <Typography variant="titleLarge" weight="900" style={{ marginTop: 4 }}>{item.artist}</Typography>
              <Typography variant="bodySmall" color={theme.colors.outline}>{item.role}</Typography>
           </View>
           <TouchableOpacity style={styles.artistAction}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.outline} />
           </TouchableOpacity>
        </TonalCard>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Animated Hero */}
        <View style={styles.heroContainer}>
          <Animated.Image 
            source={{ uri: 'https://images.unsplash.com/photo-1540039155733-d730a53b4788?auto=format&fit=crop&w=1000' }}
            style={[styles.heroImage, { transform: [{ scale: heroImageScale }] }]}
          />
          <LinearGradient 
            colors={['transparent', 'rgba(0,0,0,0.6)', '#FFFFFF']}
            locations={[0, 0.4, 1]}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
             <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                   <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn}>
                   <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
             </View>
             
             <View style={styles.heroInfo}>
                <View style={styles.glassBadge}>
                   <Typography variant="labelSmall" color="white" weight="900">MUSIC EVENT</Typography>
                </View>
                <Typography variant="displaySmall" color="white" weight="900" style={styles.heroTitle}>
                   {currentEvent?.name}
                </Typography>
                <View style={styles.heroMeta}>
                   <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                   <Typography variant="bodyMedium" color="rgba(255,255,255,0.8)" style={{ marginLeft: 8 }}>
                      {currentEvent?.date || 'APRIL 25, 2026'}
                   </Typography>
                   <View style={styles.metaDivider} />
                   <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
                   <Typography variant="bodyMedium" color="rgba(255,255,255,0.8)" style={{ marginLeft: 8 }}>
                      Main Stadium
                   </Typography>
                </View>
             </View>
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
           <SignatureButton 
             label="GET TICKETS" 
             onPress={() => {}} 
             variant="primary" 
             style={{ flex: 1.5 }}
           />
           <TouchableOpacity style={styles.notifyCta}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
           </TouchableOpacity>
        </View>

        {/* Refined Tabs */}
        <View style={styles.tabBar}>
           {TABS.map(t => (
             <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tabItem}>
                <Typography 
                   variant="labelLarge" 
                   weight="900" 
                   color={activeTab === t ? theme.colors.primary : theme.colors.outline}
                >
                   {t}
                </Typography>
                {activeTab === t && <View style={styles.tabIndicator} />}
             </TouchableOpacity>
           ))}
        </View>

        {/* Tab Content */}
        <View style={styles.contentArea}>
           {activeTab === 'DETAILS' && renderDetailsTab()}
           {activeTab === 'LINEUP' && renderLineupTab()}
           {/* FAQ and Logistics omitted for brevity, similar styling pattern used */}
           {(activeTab === 'FAQ' || activeTab === 'LOGISTICS') && (
             <View style={styles.placeholderContainer}>
                <Ionicons name="construct-outline" size={48} color={theme.colors.outlineVariant} />
                <Typography variant="titleMedium" color={theme.colors.outline} style={{ marginTop: 16 }}>Updating {activeTab} content...</Typography>
             </View>
           )}
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroContainer: {
    height: 480,
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {
    paddingBottom: 60,
  },
  glassBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    marginHorizontal: 12,
    opacity: 0.5,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginTop: -32,
    zIndex: 10,
  },
  notifyCta: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 40,
    gap: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 4,
  },
  tabItem: {
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentArea: {
    paddingTop: 32,
    paddingBottom: 120,
  },
  tabContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  visionCard: {
    padding: 28,
    borderRadius: 32,
    backgroundColor: '#1E1B4B',
  },
  visionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  summaryTitle: {
    marginBottom: 8,
  },
  summaryText: {
    lineHeight: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  securityCard: {
    padding: 24,
    borderRadius: 24,
  },
  prohibitedList: {
    gap: 12,
  },
  prohibitedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.error + '05',
    padding: 12,
    borderRadius: 12,
  },
  lineupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
  },
  artistThumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  artistAction: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
