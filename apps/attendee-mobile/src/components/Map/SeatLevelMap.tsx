/**
 * Seat-Level Indoor Map Component
 * Displays individual seats with real-time occupancy, accessibility info, and navigation
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle, G, Rect, Text as SvgText } from 'react-native-svg';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export interface Seat {
  id: string;
  section: string;
  row: string;
  number: string;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'restricted' | 'accessible';
  accessible: boolean;
  sightLines?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeatId?: string;
  onSeatSelect: (seatId: string) => void;
  onNavigateToSeat: (seatId: string) => void;
  userLocation?: { x: number; y: number };
  showAccessibleOnly?: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const SEAT_RADIUS = 8;
const SEAT_COLORS = {
  available: '#4CAF50',
  occupied: '#999999',
  restricted: '#F44336',
  accessible: '#2196F3',
};

const SeatLevelMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatId,
  onSeatSelect,
  onNavigateToSeat,
  userLocation,
  showAccessibleOnly = false,
  zoom = 1,
  onZoomChange,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [seatInfo, setSeatInfo] = useState<Seat | null>(null);

  // Filter seats based on accessibility preference
  const filteredSeats = useMemo(() => {
    return showAccessibleOnly ? seats.filter((s) => s.accessible) : seats;
  }, [seats, showAccessibleOnly]);

  // Calculate bounds for SVG viewBox
  const bounds = useMemo(() => {
    if (filteredSeats.length === 0) {
      return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
    }

    const xs = filteredSeats.map((s) => s.x);
    const ys = filteredSeats.map((s) => s.y);
    const minX = Math.min(...xs) - 50;
    const minY = Math.min(...ys) - 50;
    const maxX = Math.max(...xs) + 50;
    const maxY = Math.max(...ys) + 50;

    return { minX, minY, maxX, maxY };
  }, [filteredSeats]);

  const handleSeatPress = useCallback(
    (seat: Seat) => {
      onSeatSelect(seat.id);
      setSeatInfo(seat);
    },
    [onSeatSelect]
  );

  const getSeatColor = (seat: Seat): string => {
    if (selectedSeatId === seat.id) {
      return theme.colors.primary;
    }
    if (seat.accessible && showAccessibleOnly) {
      return SEAT_COLORS.accessible;
    }
    return SEAT_COLORS[seat.status] || SEAT_COLORS.available;
  };

  const getSeatStrokeWidth = (seat: Seat): number => {
    if (selectedSeatId === seat.id) return 2.5;
    if (hoveredSeat === seat.id) return 2;
    return 1;
  };

  const renderSeatTooltip = (seat: Seat) => {
    return (
      <SvgText
        x={seat.x + SEAT_RADIUS + 5}
        y={seat.y - SEAT_RADIUS}
        fill={theme.colors.onSurface}
        fontSize="10"
        fontWeight="bold"
      >
        {seat.section}-{seat.row}{seat.number}
      </SvgText>
    );
  };

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${bounds.maxY - bounds.minY}`;
  const svgWidth = 400 * zoom;
  const svgHeight = 400 * zoom;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Svg width={svgWidth} height={svgHeight} viewBox={viewBox}>
          {/* User location indicator */}
          {userLocation && (
            <Circle
              cx={userLocation.x}
              cy={userLocation.y}
              r={15}
              fill={theme.colors.primary}
              opacity={0.3}
            />
          )}

          {/* Draw section boundaries */}
          <Rect
            x={bounds.minX}
            y={bounds.minY}
            width={bounds.maxX - bounds.minX}
            height={bounds.maxY - bounds.minY}
            fill="white"
            stroke={theme.colors.outline}
            strokeWidth={1}
          />

          {/* Draw seats */}
          <G>
            {filteredSeats.map((seat) => (
              <Circle
                key={seat.id}
                cx={seat.x}
                cy={seat.y}
                r={SEAT_RADIUS}
                fill={getSeatColor(seat)}
                stroke={
                  selectedSeatId === seat.id
                    ? theme.colors.primary
                    : theme.colors.outline
                }
                strokeWidth={getSeatStrokeWidth(seat)}
                onPress={() => handleSeatPress(seat)}
              />
            ))}
          </G>

          {/* Show tooltip for hovered/selected seat */}
          {hoveredSeat &&
            filteredSeats.find((s) => s.id === hoveredSeat) &&
            renderSeatTooltip(filteredSeats.find((s) => s.id === hoveredSeat)!)}
        </Svg>
      </View>

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
        >
          <Ionicons name="remove" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => onZoomChange(Math.min(3, zoom + 0.25))}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Seat information panel */}
      {seatInfo && (
        <TonalCard style={styles.seatInfoPanel}>
          <View style={styles.seatInfoHeader}>
            <Text style={styles.seatInfoTitle}>
              {seatInfo.section}-{seatInfo.row}
              {seatInfo.number}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: SEAT_COLORS[seatInfo.status] },
              ]}
            >
              <Text style={styles.statusText}>{seatInfo.status}</Text>
            </View>
          </View>

          <View style={styles.seatDetails}>
            <DetailRow
              icon="location"
              label="Location"
              value={`Section ${seatInfo.section}, Row ${seatInfo.row}`}
            />
            {seatInfo.sightLines && (
              <DetailRow
                icon="eye"
                label="Sight Lines"
                value={seatInfo.sightLines}
              />
            )}
            {seatInfo.accessible && (
              <DetailRow
                icon="accessibility"
                label="Wheelchair Accessible"
                value="Yes"
              />
            )}
          </View>

          {seatInfo.status === 'available' && (
            <SignatureButton
              label="Navigate to Seat"
              onPress={() => onNavigateToSeat(seatInfo.id)}
              style={styles.navigateButton}
            />
          )}
        </TonalCard>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color={SEAT_COLORS.available} label="Available" />
        <LegendItem color={SEAT_COLORS.occupied} label="Occupied" />
        <LegendItem color={SEAT_COLORS.restricted} label="Restricted" />
        <LegendItem color={SEAT_COLORS.accessible} label="Accessible" />
      </View>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon as any} size={16} color={theme.colors.primary} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View
      style={[
        styles.legendColor,
        {
          backgroundColor: color,
        },
      ]}
    />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 8,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    minWidth: 50,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  seatInfoPanel: {
    padding: 16,
    marginTop: 12,
  },
  seatInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  seatDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 12,
    color: theme.colors.onSurface,
    flex: 1,
  },
  navigateButton: {
    marginTop: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
});

export default SeatLevelMap;
