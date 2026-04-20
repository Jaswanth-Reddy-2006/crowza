import { formatWaitTime, getOccupancyColor, formatTimestamp } from '../formatters';

describe('formatters', () => {
  describe('formatWaitTime', () => {
    it('should return "No wait" for values less than 1', () => {
      expect(formatWaitTime(0)).toBe('No wait');
      expect(formatWaitTime(-5)).toBe('No wait');
    });

    it('should return "1 min" for exactly 1 minute', () => {
      expect(formatWaitTime(1)).toBe('1 min');
    });

    it('should return "X mins" for values greater than 1', () => {
      expect(formatWaitTime(5)).toBe('5 mins');
      expect(formatWaitTime(60)).toBe('60 mins');
    });
  });

  describe('getOccupancyColor', () => {
    it('should return brand primary color for occupancy < 50%', () => {
      expect(getOccupancyColor(49)).toBe('#F98000');
    });

    it('should return amber light color for occupancy between 50% and 80%', () => {
      expect(getOccupancyColor(50)).toBe('#FEF3C7');
      expect(getOccupancyColor(79)).toBe('#FEF3C7');
    });

    it('should return amber color for occupancy between 80% and 95%', () => {
      expect(getOccupancyColor(80)).toBe('#F59E0B');
      expect(getOccupancyColor(94)).toBe('#F59E0B');
    });

    it('should return red color for occupancy >= 95%', () => {
      expect(getOccupancyColor(95)).toBe('#EF4444');
      expect(getOccupancyColor(100)).toBe('#EF4444');
    });
  });

  describe('formatTimestamp', () => {
    it('should format a valid ISO date string correctly', () => {
      const date = '2023-10-27T10:00:00Z';
      const result = formatTimestamp(date);
      expect(result).toContain('2023');
      // toLocaleString() output varies by locale, so we just check for basic content
    });
  });
});
