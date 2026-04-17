import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchEvents, fetchVenue } from '../store/slices/venueSlice';
import { selectAllEvents, selectCurrentVenue } from '../selectors';

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
  const insets = useSafeAreaInsets();
  const venueId = useVenueId();

  const events = useAppSelector(selectAllEvents);
  const venue = useAppSelector(selectCurrentVenue);

  const [activeTab, setActiveTab] = useState<TabKey>('DETAILS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentEvent = events[0] ?? null;

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchVenue(venueId));
  }, [dispatch, venueId]);

  const toggleFaq = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const renderDetailsTab = () => (
    <View style={styles.tabContainer}>
      <TonalCard variant="low" style={styles.sectionCard}>
        <Typography variant="labelSmall" color={theme.colors.primary} style={styles.sectionLabel}>
          EXECUTIVE SUMMARY
        </Typography>
        <Typography variant="bodyLarge" color={theme.colors.onSurface} style={styles.summaryText}>
          {currentEvent?.name} features a curated lineup of tech visionaries and artistic pioneers. Experience the future of immersive performance at {venue?.name}.
        </Typography>
      </TonalCard>

      <View style={styles.grid}>
        <TonalCard variant="medium" style={styles.gridItem}>
           <Typography variant="labelSmall" color={theme.colors.outline}>CAPACITY</Typography>
           <Typography variant="headlineSmall" color={theme.colors.onSurface}>{venue?.capacity?.toLocaleString()}</Typography>
        </TonalCard>
        <TonalCard variant="medium" style={styles.gridItem}>
           <Typography variant="labelSmall" color={theme.colors.outline}>DOORS OPEN</Typography>
           <Typography variant="headlineSmall" color={theme.colors.onSurface}>17:30</Typography>
        </TonalCard>
      </View>

      <TonalCard variant="low" style={styles.sectionCard}>
         <Typography variant="labelSmall" color={theme.colors.primary} style={styles.sectionLabel}>
            VENUE PROTOCOLS
         </Typography>
         <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={{ lineHeight: 22 }}>
            • Digital passes must be presented for all entries.\n
            • Cashless payments only at all concession stands.\n
            • Mobile data signals may be unstable; use "Venue_Public" Wi-Fi.
         </Typography>
      </TonalCard>
    </View>
  );

  const renderLineupTab = () => (
    <View style={styles.tabContainer}>
      {[
        { time: '18:00', artist: 'Neon Synthesis', role: 'Opening Set', bio: 'Ambient architecture and soundscapes.' },
        { time: '19:45', artist: 'The Algorithm', role: 'Support', bio: 'Heavy metal with electronic fusion.' },
        { time: '21:30', artist: 'Quantum Field', role: 'Main Event', bio: 'Immersive 360 audio-visual experience.' },
      ].map((item, idx) => (
        <TonalCard key={idx} variant="low" style={styles.lineupCard}>
          <View style={styles.lineupTime}>
            <Typography variant="titleMedium" color={theme.colors.primary}>{item.time}</Typography>
            <View style={styles.timeline} />
          </View>
          <View style={styles.lineupInfo}>
            <Typography variant="headlineSmall" color={theme.colors.onSurface}>{item.artist}</Typography>
            <Typography variant="labelSmall" color={theme.colors.secondary} style={{ marginBottom: 8 }}>{item.role.toUpperCase()}</Typography>
            <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>{item.bio}</Typography>
          </View>
        </TonalCard>
      ))}
    </View>
  );

  const renderFaqTab = () => (
    <View style={styles.tabContainer}>
      {FAQ_DATA.map((item, idx) => (
        <TouchableOpacity 
          key={idx} 
          activeOpacity={0.7} 
          onPress={() => toggleFaq(idx)}
        >
          <TonalCard variant="medium" style={styles.faqItem}>
            <View style={styles.faqHeader}>
              <Typography variant="titleSmall" color={theme.colors.onSurface} style={{ flex: 1 }}>{item.q}</Typography>
              <Typography variant="titleSmall" color={theme.colors.primary}>{expandedFaq === idx ? '−' : '+'}</Typography>
            </View>
            {expandedFaq === idx && (
              <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant} style={styles.faqBody}>
                {item.a}
              </Typography>
            )}
          </TonalCard>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000' }}
            style={styles.heroImg}
          />
          <LinearGradient 
            colors={['transparent', theme.colors.surfaceContainerLowest]}
            style={styles.heroOverlay}
          />
          <View style={[styles.heroContent]}>
             <TonalCard variant="highest" style={styles.dateChip} dark>
                <Typography variant="labelSmall" color="white">{currentEvent?.date || 'APRIL 25, 2026'}</Typography>
             </TonalCard>
             <Typography variant="displayMedium" color="white" weight="800" style={styles.heroTitle}>{currentEvent?.name}</Typography>
             <Typography variant="titleMedium" color="white" opacity={0.7}>{venue?.name} · Main Stage</Typography>
          </View>
        </View>

        {/* Global CTAs */}
        <View style={styles.ctaRow}>
           <SignatureButton 
             label="Digital Pass" 
             onPress={() => {}} 
             variant="primary" 
             style={{ flex: 1.5 }}
           />
           <SignatureButton 
             label="Upgrade" 
             onPress={() => {}} 
             variant="tertiary" 
             style={{ flex: 1 }}
           />
        </View>

        {/* Sticky Tabs */}
        <View style={[styles.tabs, { backgroundColor: theme.colors.surface }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map((t) => (
              <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tab}>
                <Typography 
                  variant="labelLarge" 
                  color={activeTab === t ? theme.colors.primary : theme.colors.outline}
                  weight={activeTab === t ? '700' : undefined}
                >
                  {t}
                </Typography>
                {activeTab === t && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Content */}
        <View style={styles.content}>
           {activeTab === 'DETAILS' && renderDetailsTab()}
           {activeTab === 'LINEUP' && renderLineupTab()}
           {activeTab === 'FAQ' && renderFaqTab()}
           {activeTab === 'LOGISTICS' && (
             <View style={styles.tabContainer}>
                <TonalCard variant="low" style={styles.sectionCard}>
                   <Typography variant="titleMedium" color={theme.colors.onSurface}>Transportation</Typography>
                   <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant} style={{ marginTop: 8 }}>
                      Shuttle buses run every 15 minutes from Union Station to Gate A. Ride-share drop-off is located strictly at Parking Lot B.
                   </Typography>
                </TonalCard>
                <SignatureButton label="View Parking Map" variant="tertiary" onPress={() => {}} />
             </View>
           )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 10,
  },
  hero: {
    height: 380,
    width: '100%',
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  dateChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  heroTitle: {
    marginBottom: 4,
    fontWeight: '800',
  },
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: -28,
    zIndex: 10,
  },
  tabs: {
    paddingTop: 32,
    paddingBottom: 16,
    zIndex: 100,
  },
  tabsScroll: {
    paddingHorizontal: 24,
    gap: 32,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  activeTabText: {
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  content: {
    paddingBottom: 120,
  },
  tabContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  sectionCard: {
    padding: 24,
  },
  sectionLabel: {
    marginBottom: 12,
    letterSpacing: 2,
  },
  summaryText: {
    lineHeight: 28,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  lineupCard: {
    flexDirection: 'row',
    padding: 24,
    gap: 20,
  },
  lineupTime: {
    width: 60,
    alignItems: 'center',
  },
  timeline: {
    flex: 1,
    width: 2,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginTop: 12,
  },
  lineupInfo: {
    flex: 1,
  },
  faqItem: {
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqBody: {
    marginTop: 16,
    lineHeight: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
});
