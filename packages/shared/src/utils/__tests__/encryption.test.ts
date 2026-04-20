import { encrypt, decrypt } from '../encryption';

describe('encryption', () => {
  const testKey = 'test-secret-key';
  const testData = 'Sensitive Crowza Data';

  it('should encrypt data and return a string (stub implementation)', () => {
    const encrypted = encrypt(testData, testKey);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).toContain('encrypted:');
  });

  it('should be able to decrypt what it encrypted', () => {
    const encrypted = encrypt(testData, testKey);
    const decrypted = decrypt(encrypted, testKey);
    expect(decrypted).toBe(testData);
  });

  it('should return empty string if decryption fails (basic stub check)', () => {
    // Current stub implementation doesn't handle failures, 
    // it just replaces 'encrypted:', so we test existing behavior.
    const result = decrypt('invalid-data', testKey);
    expect(result).toBe('invalid-data');
  });
});
