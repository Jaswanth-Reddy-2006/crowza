import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const event = route.params?.event;

  if (!event) {
    return (
      <View style={styles.center}>
        <Typography>Event not found.</Typography>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Typography color={theme.colors.primary}>Go Back</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBook = () => {
    navigation.navigate("Payment", { 
      eventTitle: event.title,
      amount: event.price,
      date: event.date.split(' - ')[0]
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          
          {/* Back Button Overlay */}
          <TouchableOpacity 
            style={[styles.backBtn, { top: insets.top + 10 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.badge}>
            <Typography variant="labelSmall" weight="700" color={theme.colors.primary}>
              MUSIC & ENTERTAINMENT
            </Typography>
          </View>
          
          <Typography variant="headlineMedium" weight="700" color={theme.colors.onSurface} style={styles.title}>
            {event.title}
          </Typography>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface}>
                {event.date.split(' - ')[0]}
              </Typography>
              <Typography variant="bodyMedium" color={theme.colors.outline}>
                {event.date.split(' - ')[1]}
              </Typography>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface}>
                {event.location}
              </Typography>
              <Typography variant="bodyMedium" color={theme.colors.outline}>
                Crowza Venue Experience Park
              </Typography>
            </View>
          </View>

          <View style={styles.divider} />

          <Typography variant="titleLarge" weight="700" color={theme.colors.onSurface} style={styles.sectionTitle}>
            About This Event
          </Typography>
          <Typography variant="bodyLarge" color={theme.colors.onSurfaceVariant} style={styles.description}>
            Experience the thrill of {event.title}! Join thousands of fans for an unforgettable session full of excitement, great food, and amazing memories. Don't forget to grab your tickets before they sell out completely. Arrive early to experience the pre-show activities in the fan zone.
          </Typography>

        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Typography variant="labelMedium" color={theme.colors.outline}>Total Price</Typography>
          <Typography variant="headlineSmall" weight="700" color={theme.colors.primary}>{event.price}</Typography>
        </View>
        <TouchableOpacity style={styles.purchaseBtn} onPress={handleBook}>
          <Typography variant="titleMedium" weight="700" color="#FFFFFF">
            Book Ticket
          </Typography>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  badge: {
    backgroundColor: theme.colors.surfaceContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  purchaseBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
});
