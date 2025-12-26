const EncryptionService = require('./encryptionService');

describe('EncryptionService', () => {
  let encryptionService;

  beforeAll(() => {
    // Set test encryption key
    process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    encryptionService = new EncryptionService();
  });

  describe('Constructor', () => {
    test('should throw error if ENCRYPTION_KEY is not set', () => {
      const originalKey = process.env.ENCRYPTION_KEY;
      delete process.env.ENCRYPTION_KEY;
      
      expect(() => new EncryptionService()).toThrow('ENCRYPTION_KEY environment variable is not set');
      
      process.env.ENCRYPTION_KEY = originalKey;
    });

    test('should throw error if ENCRYPTION_KEY has invalid length', () => {
      const originalKey = process.env.ENCRYPTION_KEY;
      process.env.ENCRYPTION_KEY = 'short';
      
      expect(() => new EncryptionService()).toThrow('ENCRYPTION_KEY must be 64 hexadecimal characters');
      
      process.env.ENCRYPTION_KEY = originalKey;
    });
  });

  describe('encrypt()', () => {
    test('should encrypt plaintext successfully', () => {
      const plaintext = 'Hello, World!';
      const result = encryptionService.encrypt(plaintext);

      expect(result).toHaveProperty('ciphertext');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('authTag');
      expect(typeof result.ciphertext).toBe('string');
      expect(typeof result.iv).toBe('string');
      expect(typeof result.authTag).toBe('string');
    });

    test('should produce different ciphertexts for same plaintext', () => {
      const plaintext = 'Test message';
      const result1 = encryptionService.encrypt(plaintext);
      const result2 = encryptionService.encrypt(plaintext);

      expect(result1.ciphertext).not.toBe(result2.ciphertext);
      expect(result1.iv).not.toBe(result2.iv);
    });

    test('should throw error for empty plaintext', () => {
      expect(() => encryptionService.encrypt('')).toThrow('Plaintext must be a non-empty string');
    });

    test('should throw error for non-string plaintext', () => {
      expect(() => encryptionService.encrypt(123)).toThrow('Plaintext must be a non-empty string');
      expect(() => encryptionService.encrypt(null)).toThrow('Plaintext must be a non-empty string');
    });
  });

  describe('decrypt()', () => {
    test('should decrypt ciphertext successfully', () => {
      const plaintext = 'Secret message';
      const encrypted = encryptionService.encrypt(plaintext);
      const decrypted = encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should handle special characters', () => {
      const plaintext = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const encrypted = encryptionService.encrypt(plaintext);
      const decrypted = encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should handle unicode characters', () => {
      const plaintext = '你好世界 🌍 Hello';
      const encrypted = encryptionService.encrypt(plaintext);
      const decrypted = encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test('should throw error for missing fields', () => {
      expect(() => encryptionService.decrypt({ ciphertext: 'test' }))
        .toThrow('Missing required fields');
    });

    test('should throw error for invalid ciphertext', () => {
      const invalidData = {
        ciphertext: 'invalid',
        iv: '1234567890abcdef1234567890abcdef',
        authTag: '1234567890abcdef1234567890abcdef'
      };
      
      expect(() => encryptionService.decrypt(invalidData)).toThrow('Decryption failed');
    });
  });

  describe('generateKey()', () => {
    test('should generate a valid 256-bit key', () => {
      const key = EncryptionService.generateKey();
      
      expect(typeof key).toBe('string');
      expect(key.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(key)).toBe(true);
    });

    test('should generate unique keys', () => {
      const key1 = EncryptionService.generateKey();
      const key2 = EncryptionService.generateKey();
      
      expect(key1).not.toBe(key2);
    });
  });
});
