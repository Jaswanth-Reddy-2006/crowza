/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Image,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, Typography, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EventDashboardScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { booking } = route.params || {};

  // State & Animations
  const [showNotifications, setShowNotifications] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  const mockNotifications = [
    {
      id: 'n1',
      title: 'Queue Alert',
      message: 'North Gate is currently at 95% capacity. We recommend using the East Gate for faster entry.',
      type: 'warning',
      action: 'Route to East Gate',
      icon: 'warning',
      color: '#F59E0B'
    },
    {
      id: 'n2',
      title: 'Food Court Update',
      message: 'Refreshments at Section 4 are now 20% off for the next 15 minutes!',
      type: 'info',
      action: 'Show on Map',
      icon: 'fast-food',
      color: '#F98000'
    },
    {
      id: 'n3',
      title: 'Weather Update',
      message: 'Light showers expected in 20 minutes. Ponchos available at all Info Desks.',
      type: 'service',
      action: 'Find Nearest Desk',
      icon: 'umbrella',
      color: '#3B82F6'
    }
  ];

  const COLUMN_WIDTH = useMemo(() => {
    const horizontalPadding = 32;
    const gap = 16;
    return (width - (horizontalPadding * 2) - gap) / 2;
  }, [width]);

  const openNotifications = () => {
    setShowNotifications(true);
    Animated.spring(sheetAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeNotifications = () => {
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(() => setShowNotifications(false));
  };

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.outline} />
          <Typography variant="titleMedium" weight="700" color={theme.colors.onSurface} style={{ marginTop: 16 }}>
            No Event Selected
          </Typography>
          <Typography variant="bodyMedium" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
            Select an event from your bookings to manage it here.
          </Typography>
          <TouchableOpacity 
             style={styles.backButton}
             onPress={() => navigation.goBack()}
          >
            <Typography variant="labelLarge" color="white">Go Back</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const managementButtons = [
    { id: 'pass', title: 'Digital Pass', icon: 'qr-code-outline', screen: 'Ticket', color: theme.colors.primary },
    { id: 'map', title: 'Venue Map', icon: 'map-outline', screen: 'Map', color: '#F98000' },
    { id: 'queues', title: 'Wait Times', icon: 'timer-outline', screen: 'Wait', color: '#F59E0B' },
    { id: 'heatmap', title: 'Crowd Status', icon: 'flame-outline', screen: 'Heat', color: '#EF4444' },
    { id: 'prediction', title: 'Queue Prediction', icon: 'trending-up', screen: 'Wait', color: '#8B5CF6', isExtra: true },
    { id: 'info', title: 'Event Info', icon: 'information-circle-outline', screen: 'Info', color: '#3B82F6' },
    { id: 'parking', title: 'Parking', icon: 'car-outline', screen: 'Park', color: '#EC4899' },
    { id: 'emergency', title: 'Emergency', icon: 'alert-circle-outline', screen: 'Emergency', color: '#DC2626' },
  ];

  const handleAction = (btn: any) => {
    if (btn.id === 'prediction') {
       navigation.navigate('Wait', { booking, predictionMode: true });
       return;
    }
    navigation.navigate(btn.screen, { booking });
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="900">Dashboard</Typography>
        <TouchableOpacity style={styles.headerActionBtn} onPress={openNotifications}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.onSurface} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventCardContainer}>
          <LinearGradient
            colors={['#1E1B4B', '#312E81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.eventCard}
          >
            <View style={styles.cardInfo}>
              <View style={styles.badge}>
                <Typography variant="labelSmall" color="#FFFFFF" weight="800">PREMIUM ACCESS</Typography>
              </View>
              <Typography variant="headlineSmall" color="#FFFFFF" weight="800" style={{ marginTop: 12 }}>
                {booking.title}
              </Typography>
              <View style={styles.metaRow}>
                <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                <Typography variant="bodySmall" color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }}>
                   Main Stadium • Arena 4
                </Typography>
              </View>
              
              <View style={styles.ticketGrid}>
                <View style={styles.ticketItem}>
                  <Typography variant="labelSmall" color="rgba(255,255,255,0.5)">SEAT</Typography>
                  <Typography variant="titleMedium" color="#FFFFFF" weight="700">{booking.seat?.split(',')[2]?.trim() || 'GA'}</Typography>
                </View>
                <View style={[styles.ticketItem, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)', paddingLeft: 16 }]}>
                  <Typography variant="labelSmall" color="rgba(255,255,255,0.5)">GATE</Typography>
                  <Typography variant="titleMedium" color="#FFFFFF" weight="700">{booking.gate || 'A1'}</Typography>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.cardDecoration} />
        </View>

        <View style={styles.statusBanner}>
          <View style={styles.pulseDot} />
          <Typography variant="labelMedium" weight="700" color={theme.colors.primary}>
            LIVE: LOW WAIT TIMES AT NORTH GATE
          </Typography>
        </View>

        <Typography variant="titleMedium" weight="700" style={styles.sectionTitle}>
          Services & Tools
        </Typography>

        <View style={styles.grid}>
          {managementButtons.map((btn) => (
            <TouchableOpacity
              key={btn.id}
              style={[styles.gridItem, { width: COLUMN_WIDTH }]}
              onPress={() => handleAction(btn)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrapper, { backgroundColor: btn.color + '15' }]}>
                {btn.icon === 'trending-up' ? (
                  <MaterialCommunityIcons name="trending-up" size={28} color={btn.color} />
                ) : (
                  <Ionicons name={btn.icon as any} size={28} color={btn.color} />
                )}
              </View>
              <Typography variant="labelLarge" weight="700" color="#1F2937" style={{ marginTop: 12 }}>
                {btn.title}
              </Typography>
              {btn.isExtra && (
                <View style={styles.newBadge}>
                  <Typography variant="labelSmall" color="white" weight="900" style={{ fontSize: 8 }}>NEW</Typography>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.supportCard}>
          <LinearGradient
            colors={['#FFF7ED', '#FFEDD5']}
            style={styles.supportGradient}
          >
            <View style={styles.supportIcon}>
              <Ionicons name="headset" size={20} color="#F98000" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="titleSmall" color="#92400E" weight="700">Need Help?</Typography>
              <Typography variant="bodySmall" color="#92400E">Chat with venue support 24/7</Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F98000" />
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {/* Actionable Notification Sheet */}
      {showNotifications && (
        <>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={closeNotifications}
          >
            <View style={styles.backdrop} />
          </TouchableOpacity>
          <Animated.View style={[styles.notifSheet, { transform: [{ translateY: sheetTranslateY }] }]}>
             <View style={styles.sheetHandle} />
             <View style={styles.sheetHeader}>
                <Typography variant="headlineSmall" weight="800">Operational Alerts</Typography>
                <Typography variant="bodySmall" color={theme.colors.outline}>Live updates for your session</Typography>
             </View>

             <ScrollView style={styles.notifScroll} showsVerticalScrollIndicator={false}>
                {mockNotifications.map((notif) => (
                   <TonalCard key={notif.id} variant="high" style={styles.notifCard}>
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                         <View style={[styles.notifIcon, { backgroundColor: notif.color + '20' }]}>
                            <Ionicons name={notif.icon as any} size={20} color={notif.color} />
                         </View>
                         <View style={{ flex: 1 }}>
                            <Typography variant="titleMedium" weight="800" color={theme.colors.onSurface}>{notif.title}</Typography>
                            <Typography variant="bodyMedium" color={theme.colors.onSurfaceVariant} style={{ marginTop: 4 }}>
                               {notif.message}
                            </Typography>
                            
                            <TouchableOpacity 
                               style={[styles.notifActionButton, { borderColor: notif.color + '40' }]}
                               onPress={() => {
                                  Alert.alert(notif.title, `Executing action: ${notif.action}`);
                                  closeNotifications();
                                  if (notif.id === 'n1') navigation.navigate('Map', { target: 'East Gate' });
                               }}
                            >
                               <Typography variant="labelLarge" weight="800" color={notif.color}>{notif.action.toUpperCase()}</Typography>
                               <Ionicons name="chevron-forward" size={16} color={notif.color} />
                            </TouchableOpacity>
                         </View>
                      </View>
                   </TonalCard>
                ))}
                <View style={{ height: 40 }} />
             </ScrollView>
          </Animated.View>
        </>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  eventCardContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  eventCard: {
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    zIndex: 1,
  },
  cardDecoration: {
    position: 'absolute',
    bottom: -8,
    left: '10%',
    width: '80%',
    height: 40,
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    opacity: 0.1,
    zIndex: 0,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ticketGrid: {
    flexDirection: 'row',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  ticketItem: {
    flex: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    padding: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: 10,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  supportCard: {
    marginTop: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  supportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  notifSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: SCREEN_HEIGHT * 0.75,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  notifScroll: {
    paddingHorizontal: 20,
  },
  notifCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notifIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
