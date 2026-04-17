import React from 'react';
import { Platform } from 'react-native';
import Svg, { Path, G, Text as SvgText, Rect, Circle } from 'react-native-svg';
import { theme } from '@crowza/design-system';

interface StadiumFloorPlanProps {
  zones: any[];
  occupancies: Record<string, any>;
  onZonePress: (zoneId: string) => void;
  selectedZoneId: string | null;
  emergencyMode?: boolean;
  routingPath?: string | null; // New: SVG path string for navigation
}

const SECTION_COLORS: Record<string, string> = {
  stand: '#E8F5E9',      // Lighter green
  premium: '#FFF8E1',    // Light amber/gold
  amenity: '#E1F5FE',    // Light blue
  corridor: '#F5F5F5',   // Light gray
  highlight: '#FFEB3B',  // Vivid yellow for search
  emergency: '#FFCDD2',  // Red for emergency
};

const STROKE_COLORS: Record<string, string> = {
  stand: '#81C784',
  premium: '#FFD54F',
  amenity: '#4FC3F7',
  corridor: '#BDBDBD',
  emergency: '#E57373',
};

export default function StadiumFloorPlan({ 
  zones, 
  occupancies, 
  onZonePress, 
  selectedZoneId,
  emergencyMode,
  routingPath
}: StadiumFloorPlanProps) {
  
  const drawPath = (polygon: number[][]) => {
    if (!polygon || polygon.length === 0) return "";
    return `M ${polygon[0][0]} ${polygon[0][1]} ` + 
           polygon.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ") + " Z";
  };

  return (
    <Svg width="1000" height="1000" viewBox="0 0 1000 1000">
      {/* Background / Pitch */}
      <Rect x="200" y="300" width="600" height="400" fill="#C8E6C9" rx="50" />
      <Rect x="250" y="350" width="500" height="300" fill="transparent" stroke="white" strokeWidth="2" rx="40" />
      <Circle cx="500" cy="500" r="50" stroke="white" strokeWidth="2" fill="transparent" />

      {/* Structural Elements (Sample Data) */}
      {/* Lower Tiers */}
      <Path d="M 200 300 L 800 300 L 900 200 L 100 200 Z" fill={SECTION_COLORS.stand} fillOpacity="0.8" />
      <Path d="M 200 700 L 800 700 L 900 800 L 100 800 Z" fill={SECTION_COLORS.stand} fillOpacity="0.8" />
      
      {/* Dynamic Zones from API */}
      {zones.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        const isEmergency = emergencyMode && zone.id === 'zone_4';
        const baseColor = isEmergency ? SECTION_COLORS.emergency : SECTION_COLORS[zone.type?.toLowerCase()] || SECTION_COLORS.stand;
        const strokeColor = isEmergency ? STROKE_COLORS.emergency : STROKE_COLORS[zone.type?.toLowerCase()] || STROKE_COLORS.corridor;
        
        // Handle interactive props safely for web/native
        const interactionProps = Platform.OS === 'web' 
          ? { onClick: () => onZonePress(zone.id) }
          : { onPress: () => onZonePress(zone.id) };

        return (
          <G 
            key={zone.id} 
            {...interactionProps}
          >
            <Path
              d={drawPath(zone.polygon || [])}
              fill={isSelected ? SECTION_COLORS.highlight : baseColor}
              fillOpacity={isSelected ? 0.6 : 0.4}
              stroke={isSelected ? theme.colors.primary : strokeColor}
              strokeWidth={isSelected ? 3 : 1.5}
            />
            {zone.polygon && zone.polygon[0] && (
              <SvgText
                x={zone.polygon[0][0] + 10}
                y={zone.polygon[0][1] + 20}
                fill={theme.colors.onSurface}
                fontSize="12"
                fontWeight="bold"
              >
                {zone.name}
              </SvgText>
            )}
          </G>
        );
      })}

      {/* Static Sample Elements for "Wowed" look */}
      <G opacity="0.4">
        <Circle cx="150" cy="150" r="40" fill={SECTION_COLORS.amenity} />
        <SvgText x="135" y="155" fill="black" fontSize="12">Food</SvgText>
        
        <Circle cx="850" cy="150" r="40" fill={SECTION_COLORS.amenity} />
        <SvgText x="835" y="155" fill="black" fontSize="12">Rest</SvgText>
      </G>

      {/* Emergency Exits indicator */}
      {emergencyMode && (
        <G>
          <Circle cx="500" cy="100" r="20" fill={SECTION_COLORS.EXIT} />
          <Circle cx="500" cy="900" r="20" fill={SECTION_COLORS.EXIT} />
          <SvgText x="480" y="70" fill={SECTION_COLORS.EXIT} fontWeight="bold">EMERGENCY EXIT A</SvgText>
          <SvgText x="480" y="940" fill={SECTION_COLORS.EXIT} fontWeight="bold">EMERGENCY EXIT B</SvgText>
        </G>
      )}
      {/* Routing Layer */}
      {routingPath && (
        <G>
          <Path
            d={routingPath}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 10"
          />
          <Circle cx={500} cy={950} r="10" fill={theme.colors.primary} />
          <SvgText x="520" y="955" fill={theme.colors.primary} fontSize="12" fontWeight="bold">YOU ARE HERE</SvgText>
        </G>
      )}
    </Svg>
  );
}
