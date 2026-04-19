/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Animated, 
  useWindowDimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme, Typography, EditorialHeader, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_HEIGHT = 400;

export default function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const event = route.params?.event;

  if (!event) return null;

  const handleBook = () => {
    navigation.navigate("Payment", { 
      eventTitle: event.title,
      amount: event.price,
      date: event.date.split(' - ')[0]
    });
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Sticky Header Overlay */}
      <Animated.View style={[styles.stickyHeader, { height: insets.top + 60, opacity: headerOpacity }]}>
         <View style={[styles.headerBlur, { paddingTop: insets.top }]}>
            <Typography variant="titleMedium" weight="900" numberOfLines={1}>{event.title}</Typography>
         </View>
      </Animated.View>

      <TouchableOpacity 
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Parallax Image */}
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={{ uri: event.image }} 
            style={[styles.image, { transform: [{ scale: imageScale }] }]} 
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(255,255,255,1)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <EditorialHeader
            metadata="FEATURED EXPERIENCE"
            title={event.title}
            subtitle={event.category + " • Live in Crowza Stadium"}
          />
          
          <View style={styles.statsRow}>
             <TonalCard variant="low" style={styles.statChip}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                <Typography variant="labelLarge" weight="900" style={{ marginLeft: 8 }}>{event.date.split(',')[0]}</Typography>
             </TonalCard>
             <TonalCard variant="low" style={styles.statChip}>
                <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
                <Typography variant="labelLarge" weight="900" style={{ marginLeft: 8 }}>{event.date.split('-')[1]?.trim() || '7:30 PM'}</Typography>
             </TonalCard>
          </View>

          <View style={styles.section}>
             <Typography variant="titleLarge" weight="900" style={styles.sectionTitle}>The Experience</Typography>
             <Typography variant="bodyLarge" color={theme.colors.onSurfaceVariant} style={styles.description}>
                Dive into an unparalleled atmosphere at {event.title}. This premier event brings together top-tier talent and a passionate community for a night of pure energy. 
             </Typography>
             <Typography variant="bodyLarge" color={theme.colors.onSurfaceVariant} style={[styles.description, { marginTop: 12 }]}>
                Experience high-definition acoustics, curated gourmet concessions, and our signature VIP hospitality zones.
             </Typography>
          </View>

          <View style={styles.section}>
             <Typography variant="titleLarge" weight="900" style={styles.sectionTitle}>Venue Amenities</Typography>
             <View style={styles.amenityGrid}>
                <AmenityItem icon="wifi" label="Free Wi-Fi" />
                <AmenityItem icon="car" label="Smart Park" />
                <AmenityItem icon="fast-food" label="Gourmet Food" />
                <AmenityItem icon="medical" label="First Aid" />
             </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
         <View>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="900">STARTING FROM</Typography>
            <Typography variant="headlineMedium" weight="900" color={theme.colors.onSurface}>{event.price}</Typography>
         </View>
         <SignatureButton
           label="Book Access"
           variant="primary"
           onPress={handleBook}
           style={{ width: 160, height: 56 }}
         />
      </View>
    </View>
  );
}

const AmenityItem = ({ icon, label }: { icon: any, label: string }) => (
  <View style={styles.amenityItem}>
     <View style={styles.amenityIcon}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
     </View>
     <Typography variant="labelMedium" weight="800" color={theme.colors.onSurface}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  imageContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    lineHeight: 26,
    opacity: 0.8,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
  },
  amenityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  }
});
