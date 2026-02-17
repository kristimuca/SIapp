const crypto = require('crypto');

/**
 * Encryption Service using AES-256-GCM
 * Provides secure encryption and decryption functionality
 */
class EncryptionService {
  constructor() {
    // Get encryption key from environment variable
    const keyHex = process.env.ENCRYPTION_KEY;
    
    if (!keyHex) {
      throw new Error('ENCRYPTION_KEY environment variable is not set');
    }
    
    if (keyHex.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be 64 hexadecimal characters (256 bits)');
    }
    
    // Convert hex string to Buffer
    this.key = Buffer.from(keyHex, 'hex');
    this.algorithm = 'aes-256-gcm';
    this.currentKeyVersion = 1; // Support for key rotation
  }

  /**
   * Encrypts plaintext using AES-256-GCM
   * @param {string} plaintext - Text to encrypt
   * @returns {object} Object containing ciphertext, iv, authTag, and keyVersion
   */
  encrypt(plaintext) {
    try {
      // Validate input
      if (!plaintext || typeof plaintext !== 'string') {
        throw new Error('Plaintext must be a non-empty string');
      }

      // Generate a random initialization vector (IV)
      const iv = crypto.randomBytes(16);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      
      // Encrypt the plaintext
      let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
      ciphertext += cipher.final('hex');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();
      
      return {
        ciphertext,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        keyVersion: this.currentKeyVersion
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypts ciphertext using AES-256-GCM
   * @param {object} encryptedData - Object containing ciphertext, iv, authTag, and optional keyVersion
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData) {
    try {
      const { ciphertext, iv, authTag, keyVersion } = encryptedData;
      
      // Validate input
      if (!ciphertext || !iv || !authTag) {
        throw new Error('Missing required fields: ciphertext, iv, or authTag');
      }

      // Validate hex strings and lengths
      this.validateHexString(iv, 32, 'IV');
      this.validateHexString(authTag, 32, 'Auth Tag');
      this.validateHexString(ciphertext, null, 'Ciphertext');

      // Check key version (for future key rotation support)
      if (keyVersion && keyVersion !== this.currentKeyVersion) {
        console.warn(`Warning: Decrypting with old key version ${keyVersion}`);
      }
      
      // Convert hex strings to Buffers
      const ivBuffer = Buffer.from(iv, 'hex');
      const authTagBuffer = Buffer.from(authTag, 'hex');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, ivBuffer);
      decipher.setAuthTag(authTagBuffer);
      
      // Decrypt the ciphertext
      let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
      plaintext += decipher.final('utf8');
      
      return plaintext;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Validates hex string format and length
   * @param {string} value - Hex string to validate
   * @param {number} expectedLength - Expected length in characters (null to skip)
   * @param {string} fieldName - Name for error messages
   */
  validateHexString(value, expectedLength, fieldName) {
    if (typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }

    if (!/^[0-9a-fA-F]+$/.test(value)) {
      throw new Error(`${fieldName} must be a valid hexadecimal string`);
    }

    if (expectedLength && value.length !== expectedLength) {
      throw new Error(`${fieldName} must be ${expectedLength} characters long, got ${value.length}`);
    }
  }

  /**
   * Encodes encrypted data into a single portable string
   * Format: base64(ciphertext.iv.authTag.keyVersion)
   * @param {object} encryptedData - Object containing ciphertext, iv, authTag, keyVersion
   * @returns {string} Base64 encoded portable string
   */
  encodeToPortableString(encryptedData) {
    const { ciphertext, iv, authTag, keyVersion } = encryptedData;
    const combined = `${ciphertext}.${iv}.${authTag}.${keyVersion || 1}`;
    return Buffer.from(combined).toString('base64');
  }

  /**
   * Decodes portable string back to encrypted data object
   * @param {string} portableString - Base64 encoded string
   * @returns {object} Object containing ciphertext, iv, authTag, keyVersion
   */
  decodeFromPortableString(portableString) {
    try {
      const decoded = Buffer.from(portableString, 'base64').toString('utf8');
      const parts = decoded.split('.');
      
      if (parts.length !== 4) {
        throw new Error('Invalid portable string format');
      }

      return {
        ciphertext: parts[0],
        iv: parts[1],
        authTag: parts[2],
        keyVersion: parseInt(parts[3], 10)
      };
    } catch (error) {
      throw new Error(`Failed to decode portable string: ${error.message}`);
    }
  }

  /**
   * Generates a new random encryption key
   * @returns {string} Hex string of 256-bit key
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = EncryptionService;
