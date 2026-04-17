export const formatWaitTime = (mins: number): string => {
  if (mins < 1) return 'No wait';
  if (mins === 1) return '1 min';
  return `${mins} mins`;
};

export const getOccupancyColor = (percent: number): string => {
  if (percent < 50) return '#4CAF50'; // Green
  if (percent < 80) return '#FFC107'; // Yellow
  if (percent < 95) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export const formatTimestamp = (date: string): string => {
  return new Date(date).toLocaleString();
};
