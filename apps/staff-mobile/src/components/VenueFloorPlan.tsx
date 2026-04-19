import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Text as SvgText, Rect, Circle, Polyline, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { theme } from '@crowza/design-system';

interface Zone {
  id: string;
  name: string;
  type: string;
  polygon: number[][];
}

interface Incident {
  id: string;
  x?: number;
  y?: number;
}

interface VenueFloorPlanProps {
  zones: Zone[];
  occupancies?: Record<string, number>;
  onZonePress?: (zoneId: string) => void;
  selectedZoneId?: string | null;
  incidents?: Incident[];
  heatMapMode?: boolean;
  routePoints?: string;
}

const SECTION_COLORS: Record<string, string> = {
  stand: '#F3F4F6',
  premium: '#FFF7ED',
  amenity: '#F5F5F7',
  corridor: '#FFFFFF',
  field: '#ECFDF5',
};

const STROKE_COLORS: Record<string, string> = {
  stand: '#E5E7EB',
  premium: theme.colors.primary,
  amenity: '#D1D5DB',
  corridor: '#F3F4F6',
  field: '#10B981',
};

const getHeatColor = (occupancy: number) => {
  if (occupancy > 0.85) return '#EF4444';
  if (occupancy > 0.6) return '#F97316';
  if (occupancy > 0.3) return '#FB923C';
  return '#E5E7EB';
};

const drawPath = (polygon: number[][]) => {
  if (!polygon || polygon.length === 0) return "";
  return `M ${polygon[0][0]} ${polygon[0][1]} ` + 
         polygon.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ") + " Z";
};

const getZoneColors = (zone: Zone, heatMapMode: boolean, occupancy: number) => {
  const typeKey = zone.type?.toLowerCase();
  const baseColor = heatMapMode ? getHeatColor(occupancy) : SECTION_COLORS[typeKey] || SECTION_COLORS.stand;
  const strokeColor = STROKE_COLORS[typeKey] || STROKE_COLORS.stand;
  return { baseColor, strokeColor };
};

const ZoneRenderer: React.FC<{
  zone: Zone;
  isSelected: boolean;
  heatMapMode: boolean;
  occupancy: number;
  onPress?: (id: string) => void;
}> = ({ zone, isSelected, heatMapMode, occupancy, onPress }) => {
  const { baseColor, strokeColor } = getZoneColors(zone, heatMapMode, occupancy);
  
  return (
    <G onPress={() => onPress?.(zone.id)}>
      <Path
        d={drawPath(zone.polygon || [])}
        fill={baseColor}
        fillOpacity={heatMapMode ? 0.7 : 1}
        stroke={isSelected ? theme.colors.primary : strokeColor}
        strokeWidth={isSelected ? 6 : 1.5}
      />
      {!heatMapMode && zone.polygon && zone.polygon[0] && (
        <SvgText
          x={zone.polygon[0][0] + 10}
          y={zone.polygon[0][1] + 20}
          fill="#6B7280"
          fontSize="10"
          fontWeight="900"
          letterSpacing="0.5"
        >
          {zone.name.toUpperCase()}
        </SvgText>
      )}
    </G>
  );
};

const ZonesLayer: React.FC<{
  zones: Zone[];
  selectedZoneId?: string | null;
  heatMapMode: boolean;
  occupancies: Record<string, number>;
  onZonePress?: (id: string) => void;
}> = ({ zones, selectedZoneId, heatMapMode, occupancies, onZonePress }) => (
  <G>
    {zones.map((zone) => (
      <ZoneRenderer
        key={zone.id}
        zone={zone}
        isSelected={selectedZoneId === zone.id}
        heatMapMode={heatMapMode}
        occupancy={occupancies[zone.id] || 0.4}
        onPress={onZonePress}
      />
    ))}
  </G>
);

const PitchLayer = () => (
  <G>
    <Circle cx="500" cy="500" r="300" fill={SECTION_COLORS.field} stroke={STROKE_COLORS.field} strokeWidth="2" />
    <Rect x="480" y="420" width="40" height="160" fill="#FEF3C7" rx="4" />
    <Circle cx="500" cy="500" r="10" stroke={STROKE_COLORS.field} strokeWidth="1" fill="transparent" />
  </G>
);

const RoutingLayer: React.FC<{ points: string }> = ({ points }) => (
  <G>
    <Polyline points={points} fill="none" stroke={theme.colors.primary} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12, 12" />
    <Polyline points={points} fill="none" stroke={theme.colors.primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
  </G>
);

const MarkerLayer: React.FC<{ incidents: Incident[] }> = ({ incidents }) => (
  <G>
    <Circle cx="150" cy="500" r="12" fill={theme.colors.primary} stroke="#FFF" strokeWidth="3" />
    <SvgText x="135" y="530" fill={theme.colors.primary} fontSize="10" fontWeight="900">YOU</SvgText>
    <Circle cx="850" cy="500" r="12" fill="#7C3AED" stroke="#FFF" strokeWidth="3" />
    <SvgText x="800" y="530" fill="#7C3AED" fontSize="10" fontWeight="900">RESTAURANT</SvgText>
    {incidents.map((inc) => (
       <Circle key={inc.id} cx={inc.x || 500} cy={inc.y || 500} r="15" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
    ))}
  </G>
);

export const VenueFloorPlan: React.FC<VenueFloorPlanProps> = ({ 
  zones, 
  occupancies = {}, 
  onZonePress, 
  selectedZoneId,
  incidents = [],
  heatMapMode = false,
  routePoints,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 32, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" viewBox="0 0 1000 1000">
        <Defs>
           <SvgGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="1" />
              <Stop offset="1" stopColor="#7C3AED" stopOpacity="1" />
           </SvgGradient>
        </Defs>
        <Circle cx="500" cy="500" r="480" fill="#F9FAFB" stroke="#F1F5F9" strokeWidth="2" />
        <PitchLayer />
        <ZonesLayer zones={zones} selectedZoneId={selectedZoneId} heatMapMode={heatMapMode} occupancies={occupancies} onZonePress={onZonePress} />
        {routePoints && <RoutingLayer points={routePoints} />}
        <MarkerLayer incidents={incidents} />
      </Svg>
    </View>
  );
};
