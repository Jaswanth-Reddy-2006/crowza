/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@crowza/design-system';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import {
  selectCurrentVenue,
  selectAllZones,
  selectAllZoneOccupancies,
} from '../selectors';

// Modular Components
import { MapHeader } from './Map/components/MapHeader';
import { MapToggleBar } from './Map/components/MapToggleBar';
import { SmartAssistant } from './Map/components/SmartAssistant';
import { OutdoorMapView } from './Map/components/OutdoorMapView';
import { IndoorMapView } from './Map/components/IndoorMapView';
import { StatusOverlay } from './Map/components/StatusOverlay';
import { JourneyPanel } from './Map/components/JourneyPanel';
import { ZoneDetailsSheet } from './Map/components/ZoneDetailsSheet';

const OCCUPANCY_COLORS = {
  low: '#10B981',
  medium: '#FB923C',
  high: '#F97316',
  critical: '#EA580C',
};

export default function MapScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  // Selectors
  const venue = useAppSelector(selectCurrentVenue);
  const zones = useAppSelector(selectAllZones);
  const occupancies = useAppSelector(selectAllZoneOccupancies);

  // Constants
  const STADIUM_COORDS = { latitude: 19.0330, longitude: 72.8631 };
  const HOME_COORDS = { latitude: 19.0760, longitude: 72.8777 };
  const PARKING_COORDS = { latitude: 19.0345, longitude: 72.8650 };

  const ROUTE_COORDS = [
    HOME_COORDS,
    { latitude: 19.0600, longitude: 72.8700 },
    { latitude: 19.0450, longitude: 72.8650 },
    PARKING_COORDS
  ];

  const POIS = [
    { id: 'washroom', name: 'Washrooms', coords: [850, 150], icon: '🚻', type: 'amenity' },
    { id: 'food', name: 'Food Court', coords: [150, 150], icon: '🍴', type: 'food' },
    { id: 'exit', name: 'Exits', coords: [500, 50], icon: '🚪', type: 'navigation' },
    { id: 'info', name: 'Info Desk', coords: [500, 850], icon: 'ℹ️', type: 'service' },
  ];

  const MOCK_FRIENDS = [
    { id: 'f1', name: 'Sarah', coords: [400, 600], avatar: 'S' },
    { id: 'f2', name: 'John', coords: [600, 300], avatar: 'J' },
  ];

  // Navigation Logic
  const route = useRoute<any>();
  const initialEmergency = route.params?.emergency === true;
  const initialMapMode = initialEmergency ? 'venue' : 'journey';

  // UI State
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'journey' | 'venue'>(initialMapMode);
  const [emergencyMode, setEmergencyMode] = useState(initialEmergency);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationStepIndex, setNavigationStepIndex] = useState(0);
  const [routingPath, setRoutingPath] = useState<string | null>(null);
  const [navSteps, setNavSteps] = useState<any[]>([]);
  const [destination, setDestination] = useState<'gate' | 'parking'>('gate');
  const [carLocation, setCarLocation] = useState<any>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [activeFacility, setActiveFacility] = useState<string | null>(null);

  // Animation values
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Derived Data
  const selectedZone = useMemo(() => 
    zones.find(z => z.id === selectedZoneId),
    [zones, selectedZoneId]
  );

  const selectedOccupancy = useMemo(() => {
    const occupancyArray = Object.values(occupancies || {});
    return occupancyArray.find(o => o.zoneId === selectedZoneId || (o as any).id === selectedZoneId);
  }, [occupancies, selectedZoneId]);

  // Actions
  const openSheet = () => {
    Animated.spring(sheetAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }).start();
  };

  const closeSheet = () => {
    Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, tension: 50, friction: 8 }).start(() => setSelectedZoneId(null));
  };

  const handleZoneTap = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    openSheet();
  };

  const handleRouteMe = (targetCoords?: number[]) => {
    const end = targetCoords || (selectedZone?.polygon?.[0] || [500, 500]);
    const midY = 900;
    const path = `M 500 950 L 500 ${midY} L ${end[0]} ${midY} L ${end[0]} ${end[1]}`;
    
    setRoutingPath(path);
    setIsNavigating(true);
    setNavigationStepIndex(0);
    closeSheet();

    const steps = [
      { text: "Head straight towards the Info Desk", icon: "arrow-up" },
      { text: "Turn towards the Main Hall corridor", icon: "arrow-redo" },
      { text: `Walk 30m to reach ${selectedZone?.name || 'your destination'}`, icon: "walk" },
      { text: "You have arrived!", icon: "checkmark-circle", done: true },
    ];
    setNavSteps(steps);
  };

  const handlePOIPress = (poi: any) => {
    if (activeFacility === poi.id) {
      setActiveFacility(null);
      setRoutingPath(null);
      setIsNavigating(false);
    } else {
      setActiveFacility(poi.id);
      const end = poi.coords;
      const midY = 900;
      const path = `M 500 950 L 500 ${midY} L ${end[0]} ${midY} L ${end[0]} ${end[1]}`;
      setRoutingPath(path);
      setIsNavigating(true);
      setNavigationStepIndex(0);
      setNavSteps([
        { text: `Proceed to the central concourse`, icon: "arrow-up" },
        { text: end[0] > 500 ? "Turn right past the entry gates" : "Turn left towards the food area", icon: end[0] > 500 ? "arrow-forward" : "arrow-back" },
        { text: `Arriving at the ${poi.name}`, icon: "location-sharp" },
        { text: `You are at the ${poi.name}.`, icon: "checkmark-circle", done: true },
      ]);
      closeSheet();
    }
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const mapScale = scale.interpolate({
    inputRange: [0.5, 5],
    outputRange: [0.5, 5],
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        
        <MapHeader onBack={() => navigation.goBack()} />

        <MapToggleBar 
          mapMode={mapMode}
          setMapMode={setMapMode}
          emergencyMode={emergencyMode}
          setEmergencyMode={setEmergencyMode}
          showFriends={showFriends}
          setShowFriends={setShowFriends}
        />

        <View style={styles.mapContainer}>
          {mapMode === 'journey' ? (
            <OutdoorMapView 
              stadiumCoords={STADIUM_COORDS}
              homeCoords={HOME_COORDS}
              parkingCoords={PARKING_COORDS}
              routeCoords={ROUTE_COORDS}
              carLocation={carLocation}
              showFriends={showFriends}
              friends={MOCK_FRIENDS}
              pulseAnim={pulseAnim}
            />
          ) : (
            <IndoorMapView 
               mapScale={mapScale}
               translateX={translateX}
               translateY={translateY}
               zones={zones}
               occupancies={occupancies}
               onZonePress={handleZoneTap}
               selectedZoneId={selectedZoneId}
               emergencyMode={emergencyMode}
               routingPath={routingPath}
               showFriends={showFriends}
               friends={MOCK_FRIENDS}
            />
          )}

          {mapMode === 'venue' && (
            <StatusOverlay 
              pois={POIS}
              activeFacility={activeFacility}
              onPoiPress={handlePOIPress}
              occupancyColors={OCCUPANCY_COLORS}
            />
          )}

          {mapMode === 'journey' && (
            <JourneyPanel 
              destination={destination}
              setDestination={setDestination}
              carLocation={carLocation}
              setCarLocation={setCarLocation}
              onShareLocation={() => Alert.alert('Location Shared', 'Your location has been shared with friends.')}
              onStartNav={() => {
                const url = `https://www.google.com/maps/dir/?api=1&origin=Mumbai&destination=${STADIUM_COORDS.latitude},${STADIUM_COORDS.longitude}&travelmode=driving`;
                require('react-native').Linking.openURL(url);
              }}
              stadiumCoords={STADIUM_COORDS}
            />
          )}
        </View>

        <ZoneDetailsSheet 
          selectedZone={selectedZone}
          selectedOccupancy={selectedOccupancy}
          onClose={closeSheet}
          onRouteMe={handleRouteMe}
          translateY={sheetTranslateY}
        />

        <SmartAssistant 
          insets={insets}
          emergencyMode={emergencyMode}
          isNavigating={isNavigating}
          mapMode={mapMode}
          navSteps={navSteps}
          navigationStepIndex={navigationStepIndex}
          onNextStep={() => setNavigationStepIndex(v => v + 1)}
          onCloseNav={() => { setIsNavigating(false); setRoutingPath(null); }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  mapContainer: { flex: 1, overflow: 'hidden', backgroundColor: '#e6e4df' },
});
