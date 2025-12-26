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
  }

  /**
   * Encrypts plaintext using AES-256-GCM
   * @param {string} plaintext - Text to encrypt
   * @returns {object} Object containing ciphertext, iv, and authTag
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
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypts ciphertext using AES-256-GCM
   * @param {object} encryptedData - Object containing ciphertext, iv, and authTag
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData) {
    try {
      const { ciphertext, iv, authTag } = encryptedData;
      
      // Validate input
      if (!ciphertext || !iv || !authTag) {
        throw new Error('Missing required fields: ciphertext, iv, or authTag');
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
   * Generates a new random encryption key
   * @returns {string} Hex string of 256-bit key
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = EncryptionService;
