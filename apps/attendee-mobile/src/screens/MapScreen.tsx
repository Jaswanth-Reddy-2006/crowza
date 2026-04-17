import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { calculateRoutingPath } from '../utils/indoorMapParser';
import { 
  GestureHandlerRootView, 
  PinchGestureHandler, 
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector, useVenueId } from '../utils/hooks';
import { fetchVenue, fetchZones } from '../store/slices/venueSlice';
import {
  selectCurrentVenue,
  selectAllZones,
  selectAllZoneOccupancies,
} from '../selectors';
import { setupOccupancyListener } from '../services/firebase/realtimeListeners';
import StadiumFloorPlan from '../components/Map/StadiumFloorPlan';

// Only attempt to load react-native-maps on native platforms to prevent web crashes
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
  } catch (e) {
    console.warn('react-native-maps not available', e);
  }
}

const OCCUPANCY_COLORS = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#FF9800',
  critical: '#F44336',
};

function getOccupancyColor(pct: number) {
  if (pct <= 30) return OCCUPANCY_COLORS.low;
  if (pct <= 60) return OCCUPANCY_COLORS.medium;
  if (pct <= 85) return OCCUPANCY_COLORS.high;
  return OCCUPANCY_COLORS.critical;
}


export default function MapScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  
  // ... existing selectors ...
  const [routingPath, setRoutingPath] = useState<string | null>(null);

  const handleRouteMe = () => {
    if (selectedZone) {
      const start = [500, 950]; // Entrance
      const end = selectedZone.polygon?.[0] || [500, 500];
      const path = calculateRoutingPath(start, end);
      setRoutingPath(path);
      closeSheet();
    }
  };

  const venue = useAppSelector(selectCurrentVenue);
  const zones = useAppSelector(selectAllZones);
  const occupancies = useAppSelector(selectAllZoneOccupancies);

  const route = useRoute<any>();
  const initialEmergency = route.params?.emergency === true;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'journey' | 'venue'>(initialEmergency ? 'venue' : 'journey');
  const [emergencyMode, setEmergencyMode] = useState(initialEmergency);

  // State and animation values
  const VENUE_ID = useVenueId();
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [journeyStep, setJourneyStep] = useState(0);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [destination, setDestination] = useState<'gate' | 'parking'>('gate');

  const handleShareLocation = () => {
    setSharingLocation(true);
    // Simulate link generation
    const shareUrl = `https://www.google.com/maps/search/?api=1&query=${STADIUM_COORDS.latitude},${STADIUM_COORDS.longitude}`;
    console.log("Sharing URL:", shareUrl);
    
    setTimeout(() => {
      setSharingLocation(false);
      // In web we can't easily open share sheet, but we can alert the user
      alert("Location link copied! You can now share this with friends.");
    }, 1500);
  };

  useEffect(() => {
    dispatch(fetchVenue(VENUE_ID));
    dispatch(fetchZones(VENUE_ID));

    // Setup real-time listener
    const unsubscribe = setupOccupancyListener(VENUE_ID, dispatch);
    return () => unsubscribe();
  }, [dispatch, VENUE_ID]);

  const handleZoneTap = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    Animated.spring(sheetAnim, { toValue: 1, useNativeDriver: false }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, { toValue: 0, duration: 220, useNativeDriver: false }).start(() => {
      setSelectedZoneId(null);
    });
  };

  const selectedZone = useMemo(() => zones.find((z) => z.id === selectedZoneId), [zones, selectedZoneId]);
  const selectedOccupancy = selectedZoneId ? occupancies[selectedZoneId] : null;

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  // SVG Mapping Logic
  // Assuming polygon coordinates are roughly within 0-1000 range for the SVG viewport
  const drawPath = (polygon: number[][]) => {
    if (!polygon || polygon.length === 0) return "";
    return `M ${polygon[0][0]} ${polygon[0][1]} ` + 
           polygon.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ") + " Z";
  };

  const mapScale = scale.interpolate({
    inputRange: [0.5, 5],
    outputRange: [0.5, 5],
  });

  // Example coordinates for India focus (e.g., routing in Mumbai)
  const HOME_COORDS = { latitude: 19.0760, longitude: 72.8777 }; // Mumbai origin
  const STADIUM_COORDS = { latitude: 19.0330, longitude: 72.8631 }; // Sion area stadium
  const PARKING_COORDS = { latitude: 19.0345, longitude: 72.8650 }; // Stadium parking

  const ROUTE_COORDS = [
    HOME_COORDS,
    { latitude: 19.0600, longitude: 72.8700 },
    { latitude: 19.0450, longitude: 72.8650 },
    PARKING_COORDS
  ];

  const renderSmartAssistant = () => {
    if (emergencyMode) {
      return (
        <Animated.View style={[styles.emergencyBanner, { top: insets.top + 130 }]}>
          <TonalCard variant="high" style={[styles.assistantCard, { backgroundColor: '#F44336', padding: 16 }]}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
               <Ionicons name="warning" size={24} color="white" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="titleSmall" color="white" weight="800">EMERGENCY ALERT</Typography>
              <Typography variant="bodyMedium" color="white">Follow the red evacuation paths to your nearest exit immediately.</Typography>
            </View>
          </TonalCard>
        </Animated.View>
      );
    }

    // Simulated smart insights based on occupancies
    const highDensityZones = zones.filter(z => (occupancies[z.id]?.occupancyPercent ?? 0) > 75);
    const tip = highDensityZones.length > 0 
      ? `Avoid ${highDensityZones[0].name}, try the East corridor for faster access.`
      : "Crowd flow is currently optimal. Enjoy your event!";

    return (
      <Animated.View style={[styles.smartAssistant, { top: insets.top + 130 }]}>
        <TonalCard variant="high" style={styles.assistantCard}>
          <View style={styles.assistantIcon}>
            <Ionicons name="flash-outline" size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Typography variant="labelSmall" color={theme.colors.primary} weight="700">CROWZA AI GUIDE</Typography>
            <Typography variant="bodySmall" color={theme.colors.onSurface} numberOfLines={2}>{tip}</Typography>
          </View>
        </TonalCard>
      </Animated.View>
    );
  };

  const renderOutdoorMap = () => {
    if (Platform.OS === 'web') {
      // For Web, we use a URL-based OpenStreetMap frame to allow "unlimited" free usage as requested
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=72.75,18.95,73.0,19.15&layer=mapnik&marker=${STADIUM_COORDS.latitude},${STADIUM_COORDS.longitude}`;
      
      return (
        <View style={styles.webMapContainer}>
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="City Map"
          />
          <View style={styles.webOverlay}>
            <Typography variant="labelSmall" color="white" style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 4, borderRadius: 4 }}>
              FREE OSM SERVICE ACTIVE
            </Typography>
          </View>
        </View>
      );
    }

    if (!MapView) {
      return (
        <View style={styles.webMapFallback}>
          <Ionicons name="map" size={64} color={theme.colors.outline} />
          <Typography variant="titleMedium" style={{ marginTop: 16 }}>Outdoor Navigation Active</Typography>
          <Typography variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
            (Live rendering requires a Native Device.)
          </Typography>
        </View>
      );
    }

    return (
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 19.0550,
          longitude: 72.8700,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        customMapStyle={[]} // Add a dark mode map style array here if needed
      >
        <Marker coordinate={HOME_COORDS} title="Your Home" description="Starting point" />
        <Marker coordinate={STADIUM_COORDS} title="Stadium" description={venue?.name} pinColor="gold" />
        <Marker coordinate={PARKING_COORDS} title="P1 VIP Parking" description="Reserved Spot" pinColor="blue" />
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeColor={theme.colors.primary}
          strokeWidth={4}
          lineDashPattern={[1]}
        />
      </MapView>
    );
  };

  const renderIndoorSVG = () => (
    <PanGestureHandler>
      <Animated.View style={{ flex: 1 }}>
        <PinchGestureHandler>
          <Animated.View 
            style={[
              styles.svgWrapper, 
              { transform: [{ scale: mapScale }, { translateX }, { translateY }] }
            ]}
          >
            <StadiumFloorPlan 
              zones={zones}
              occupancies={occupancies}
              onZonePress={handleZoneTap}
              selectedZoneId={selectedZoneId}
              emergencyMode={emergencyMode}
              routingPath={routingPath}
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        
        {/* Toggle Nav Overlay */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, mapMode === 'journey' && styles.toggleActive]}
            onPress={() => setMapMode('journey')}
          >
            <Ionicons name="car-outline" size={20} color={mapMode === 'journey' ? '#fff' : '#666'} />
            <Typography variant="labelSmall" color={mapMode === 'journey' ? '#fff' : '#666'}>YOUR CITY JOURNEY</Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, mapMode === 'venue' && styles.toggleActive]}
            onPress={() => setMapMode('venue')}
          >
            <Ionicons name="business-outline" size={20} color={mapMode === 'venue' ? '#fff' : '#666'} />
            <Typography variant="labelSmall" color={mapMode === 'venue' ? '#fff' : '#666'}>INDOOR VENUE</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.emergencyBtn, emergencyMode && styles.emergencyActive]}
            onPress={() => setEmergencyMode(!emergencyMode)}
          >
            <Ionicons name="warning-outline" size={20} color={emergencyMode ? '#fff' : '#F44336'} />
          </TouchableOpacity>
        </View>

        {/* Map View Area */}
        <View style={styles.mapContainer}>
          {mapMode === 'journey' ? renderOutdoorMap() : renderIndoorSVG()}

          {/* Indoor Legend (Overlay) */}
          {mapMode === 'venue' && (
            <View style={styles.legendOverlay}>
              <TonalCard variant="high" style={styles.legendCard} dark>
                {Object.entries(OCCUPANCY_COLORS).map(([lvl, color]) => (
                  <View key={lvl} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Typography variant="labelSmall" color={theme.colors.onSurface} style={{ fontSize: 9 }}>
                      {lvl.toUpperCase()}
                    </Typography>
                  </View>
                ))}
              </TonalCard>
            </View>
          )}

          {/* Outdoor Overlays (ETA, Routing info panel if journey) */}
          {mapMode === 'journey' && (
            <View style={styles.journeyPanel}>
              <TonalCard variant="high" style={styles.journeyCard}>
                <View style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
                   <SignatureButton 
                      label="Main Gate" 
                      variant={destination === 'gate' ? 'primary' : 'tonal'} 
                      size="small"
                      onPress={() => setDestination('gate')}
                   />
                   <SignatureButton 
                      label="Parking P1" 
                      variant={destination === 'parking' ? 'primary' : 'tonal'} 
                      size="small"
                      onPress={() => setDestination('parking')}
                   />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Typography variant="headlineSmall">{destination === 'gate' ? '35 min' : '45 min'}</Typography>
                    <Typography variant="labelSmall" color={theme.colors.outline}>
                       {destination === 'gate' ? 'JOURNEY TO MAIN GATE' : 'JOURNEY TO P1 PARKING'}
                    </Typography>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.shareBtn} onPress={handleShareLocation}>
                       <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <SignatureButton 
                      label={sharingLocation ? "..." : "Start Nav"} 
                      variant="primary" 
                      size="small" 
                      onPress={() => {
                        const dest = destination === 'gate' ? STADIUM_COORDS : PARKING_COORDS;
                        const url = `https://www.google.com/maps/dir/?api=1&origin=Mumbai&destination=${dest.latitude},${dest.longitude}&travelmode=driving`;
                        require('react-native').Linking.openURL(url);
                      }} 
                    />
                  </View>
                </View>
              </TonalCard>
            </View>
          )}
        </View>

        {/* Indoor Info Bottom Sheet */}
        {mapMode === 'venue' && selectedZone && (
          <>
            <TouchableOpacity style={styles.backdrop} onPress={closeSheet} activeOpacity={1} />
            <Animated.View
              style={[
                styles.bottomSheet,
                { transform: [{ translateY: sheetTranslateY }] },
              ]}
            >
              <View style={styles.sheetHandle} />
              <View style={styles.sheetContent}>
                <View style={styles.sheetInfo}>
                  <Typography variant="headlineSmall" color={theme.colors.onSurfaceVariant}>
                    {selectedZone.name}
                  </Typography>
                  <Typography variant="bodyMedium" color={theme.colors.outline}>
                    Current occupancy is {selectedOccupancy?.occupancyPercent ?? 0}%
                  </Typography>
                  <View style={styles.tags}>
                    <TonalCard variant="low" style={styles.tag}><Typography variant="labelSmall">🍴 FOOD</Typography></TonalCard>
                    <TonalCard variant="low" style={styles.tag}><Typography variant="labelSmall">🚻 RESTROOM</Typography></TonalCard>
                  </View>
                </View>
                
                <View style={styles.sheetActions}>
                  <SignatureButton
                    label="Route Me Inside"
                    onPress={handleRouteMe}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </Animated.View>
          </>
        )}

        {renderSmartAssistant()}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FAFAFA',
    gap: 12,
    zIndex: 20, // Sit above everything
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  emergencyBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  emergencyActive: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#e6e4df', // Standard google-maps-ish background or dark based on theme
  },
  svgWrapper: {
    width: 1000,
    height: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Light gray background for indoor map
  },
  webMapFallback: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#eceff1',
    padding: 40,
  },
  webMapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  smartAssistant: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  emergencyBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 110,
  },
  assistantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer,
  },
  assistantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  legendOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  legendCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  journeyPanel: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  journeyCard: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingBottom: 40,
    zIndex: 101,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.outlineVariant,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  sheetContent: {
    paddingHorizontal: 24,
  },
  sheetInfo: {
    marginBottom: 24,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
