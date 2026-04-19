import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';

// Conditional imports for native maps
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

interface OutdoorMapViewProps {
  stadiumCoords: any;
  homeCoords: any;
  parkingCoords: any;
  routeCoords: any[];
  carLocation: any;
  showFriends: boolean;
  friends: any[];
  pulseAnim: Animated.Value;
}

export const OutdoorMapView: React.FC<OutdoorMapViewProps> = ({
  stadiumCoords,
  homeCoords,
  parkingCoords,
  routeCoords,
  carLocation,
  showFriends,
  friends,
  pulseAnim,
}) => {
  if (Platform.OS === 'web') {
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=72.75,18.95,73.0,19.15&layer=mapnik&marker=${stadiumCoords.latitude},${stadiumCoords.longitude}`;
    return (
      <View style={styles.webMapContainer}>
        <iframe
          // @ts-ignore
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
    >
      <Marker coordinate={homeCoords} title="Your Home" />
      <Marker coordinate={stadiumCoords} title="Stadium" pinColor="gold" />
      {carLocation && (
        <Marker coordinate={carLocation} title="My Car">
          <View style={styles.carMarker}>
            <Ionicons name="car" size={24} color="#FFF" />
          </View>
        </Marker>
      )}
      <Marker coordinate={parkingCoords} title="P1 VIP Parking" pinColor="blue" />
      <Polyline
        coordinates={routeCoords}
        strokeColor={theme.colors.primary}
        strokeWidth={4}
        lineDashPattern={[1]}
      />
      
      {showFriends && friends.map(friend => (
        <Marker 
          key={friend.id} 
          coordinate={{ 
            latitude: stadiumCoords.latitude + (friend.id === 'f1' ? 0.002 : -0.001), 
            longitude: stadiumCoords.longitude + (friend.id === 'f1' ? -0.002 : 0.004)
          }} 
          title={friend.name}
        >
          <View style={styles.friendMarkerContainer}>
            <View style={[styles.friendAvatar, { backgroundColor: friend.id === 'f1' ? theme.colors.primary : theme.colors.primaryDark }]}>
              <Typography variant="labelSmall" color="white" weight="900" style={{ fontSize: 10 }}>{friend.avatar}</Typography>
            </View>
            <View style={styles.friendLabel}>
              <Typography variant="labelSmall" weight="700" style={{ fontSize: 8 }}>{friend.name}</Typography>
            </View>
          </View>
        </Marker>
      ))}

      <Marker coordinate={{ latitude: 19.0550, longitude: 72.8700 }}>
        <View style={styles.userDotContainer}>
          <Animated.View 
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }],
                opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] })
              }
            ]} 
          />
          <View style={styles.userDot} />
        </View>
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  webMapContainer: { flex: 1, width: '100%', height: '100%' },
  webOverlay: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  webMapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eceff1', padding: 40 },
  carMarker: { backgroundColor: theme.colors.primary, padding: 4, borderRadius: 12 },
  friendMarkerContainer: { alignItems: 'center' },
  friendAvatar: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFF' },
  friendLabel: { backgroundColor: 'white', paddingHorizontal: 4, borderRadius: 4, marginTop: 2, shadowOpacity: 0.1 },
  userDotContainer: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  userDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: '#FFF' },
  pulseCircle: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.primary },
});
