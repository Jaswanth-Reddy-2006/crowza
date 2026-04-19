import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { 
  GestureHandlerRootView, 
  PinchGestureHandler, 
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Svg, { G, Text as SvgText, Path } from 'react-native-svg';
import StadiumFloorPlan from '../components/Map/StadiumFloorPlan';
import { theme } from '@crowza/design-system';

interface IndoorMapViewProps {
  mapScale: Animated.AnimatedInterpolation<number>;
  translateX: Animated.Value;
  translateY: Animated.Value;
  zones: any[];
  occupancies: any;
  onZonePress: (zoneId: string) => void;
  selectedZoneId: string | null;
  emergencyMode: boolean;
  routingPath: string | null;
  showFriends: boolean;
  friends: any[];
}

export const IndoorMapView: React.FC<IndoorMapViewProps> = ({
  mapScale,
  translateX,
  translateY,
  zones,
  occupancies,
  onZonePress,
  selectedZoneId,
  emergencyMode,
  routingPath,
  showFriends,
  friends,
}) => {
  return (
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
              onZonePress={onZonePress}
              selectedZoneId={selectedZoneId}
              emergencyMode={emergencyMode}
              routingPath={routingPath}
            />
            {showFriends && friends.map(friend => (
               <G key={friend.id} transform={`translate(${friend.coords[0] - 15}, ${friend.coords[1] - 15})`}>
                  <Path d="M15 0a15 15 0 100 30 15 15 0 100-30z" fill={theme.colors.tertiary} />
                  <SvgText
                    x="15"
                    y="20"
                    fill="white"
                    fontSize="12"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {friend.avatar}
                  </SvgText>
               </G>
            ))}
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  svgWrapper: {
    width: 1000,
    height: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
