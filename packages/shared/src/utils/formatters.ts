export const formatWaitTime = (mins: number): string => {
  if (mins < 1) return 'No wait';
  if (mins === 1) return '1 min';
  return `${mins} mins`;
};

export const getOccupancyColor = (percent: number): string => {
  if (percent < 50) return '#F98000'; // Brand Primary
  if (percent < 80) return '#FEF3C7'; // Amber Light
  if (percent < 95) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
};

export const formatTimestamp = (date: string): string => {
  return new Date(date).toLocaleString();
};
