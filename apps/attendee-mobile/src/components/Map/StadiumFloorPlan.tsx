/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
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
  stand: '#FFF7ED',      // Peach/Orange variant
  premium: '#FFF8E1',    // Light amber/gold
  amenity: '#E1F5FE',    // Light blue
  corridor: '#F5F5F5',   // Light gray
  highlight: '#FFEB3B',  // Vivid yellow for search
  emergency: '#FFCDD2',  // Red for emergency
};

const STROKE_COLORS: Record<string, string> = {
  stand: '#F98000',
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
      <Rect x="200" y="300" width="600" height="400" fill="#FFF7ED" rx="50" />
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

      {/* Static Sample Elements for "Wowed" look - High Fidelity POIs */}
      <G>
        {/* Food Court */}
        <G opacity="0.9">
          <Circle cx="150" cy="150" r="30" fill="#E1F5FE" stroke="#4FC3F7" strokeWidth="1" />
          <SvgText x="135" y="155" fill="#0277BD" fontSize="14" fontWeight="bold">🍴</SvgText>
          <SvgText x="110" y="195" fill="#0277BD" fontSize="10" fontWeight="bold">FOOD COURT</SvgText>
        </G>
        
        {/* Restrooms */}
        <G opacity="0.9">
          <Circle cx="850" cy="150" r="30" fill="#F3E5F5" stroke="#BA68C8" strokeWidth="1" />
          <SvgText x="835" y="155" fill="#7B1FA2" fontSize="14" fontWeight="bold">🚻</SvgText>
          <SvgText x="815" y="195" fill="#7B1FA2" fontSize="10" fontWeight="bold">WASHROOMS</SvgText>
        </G>

        {/* Info Desk */}
        <G opacity="0.9">
          <Circle cx="500" cy="850" r="30" fill="#FFF3E0" stroke="#FFB74D" strokeWidth="1" />
          <SvgText x="488" y="855" fill="#E65100" fontSize="16" fontWeight="bold">ℹ️</SvgText>
          <SvgText x="470" y="895" fill="#E65100" fontSize="10" fontWeight="bold">INFO DESK</SvgText>
        </G>
      </G>

      {/* Emergency Exits indicator */}
      {emergencyMode && (
        <G>
          <Rect x="400" y="50" width="200" height="40" fill="#F44336" rx="8" />
          <Rect x="400" y="910" width="200" height="40" fill="#F44336" rx="8" />
          <SvgText x="435" y="75" fill="white" fontWeight="900" fontSize="12">EMERGENCY EXIT A</SvgText>
          <SvgText x="435" y="935" fill="white" fontWeight="900" fontSize="12">EMERGENCY EXIT B</SvgText>
        </G>
      )}

      {/* Routing Layer */}
      {routingPath && (
        <G>
          {/* Pulsing effect for path */}
          <Path
            d={routingPath}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="8"
            strokeOpacity="0.1"
            strokeLinecap="round"
          />
          <Path
            d={routingPath}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8, 8"
          />
          
          {/* Pulsing User Location Marker */}
          <G x="500" y="950">
             <Circle r="25" fill={theme.colors.primary} fillOpacity="0.1" />
             <Circle r="18" fill={theme.colors.primary} fillOpacity="0.2" />
             <Circle r="10" fill={theme.colors.primary} stroke="white" strokeWidth="2" />
             <Circle r="4" fill="white" />
          </G>
          
          <Rect x="440" y="970" width="120" height="20" fill="white" rx="10" stroke={theme.colors.primary} strokeWidth="1" />
          <SvgText x="455" y="984" fill={theme.colors.primary} fontSize="10" fontWeight="900">YOU ARE HERE</SvgText>
        </G>
      )}
    </Svg>
  );
}
