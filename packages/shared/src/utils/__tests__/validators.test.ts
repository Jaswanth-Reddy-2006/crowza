import { validateEmail, validateOccupancy, validateCoordinates } from '../validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.com')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateOccupancy', () => {
    it('should return true for values between 0 and 100', () => {
      expect(validateOccupancy(0)).toBe(true);
      expect(validateOccupancy(50)).toBe(true);
      expect(validateOccupancy(100)).toBe(true);
    });

    it('should return false for values out of range', () => {
      expect(validateOccupancy(-1)).toBe(false);
      expect(validateOccupancy(101)).toBe(false);
    });
  });

  describe('validateCoordinates', () => {
    it('should return true for valid coordinates', () => {
      expect(validateCoordinates(0, 0)).toBe(true);
      expect(validateCoordinates(90, 180)).toBe(true);
      expect(validateCoordinates(-90, -180)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(-91, 0)).toBe(false);
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(0, -181)).toBe(false);
    });
  });
});
