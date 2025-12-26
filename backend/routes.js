const express = require('express');
const { body, validationResult } = require('express-validator');
const EncryptionService = require('./encryptionService');

const router = express.Router();
const encryptionService = new EncryptionService();

/**
 * @route   POST /api/encrypt
 * @desc    Encrypt plaintext
 * @access  Public
 */
router.post(
  '/encrypt',
  [
    body('plaintext')
      .isString()
      .notEmpty()
      .withMessage('Plaintext is required and must be a string')
      .isLength({ max: 10000 })
      .withMessage('Plaintext must not exceed 10,000 characters')
  ],
  (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { plaintext } = req.body;

      // Encrypt the plaintext
      const encryptedData = encryptionService.encrypt(plaintext);

      res.json({
        success: true,
        data: encryptedData
      });
    } catch (error) {
      console.error('Encryption error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Encryption failed',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/decrypt
 * @desc    Decrypt ciphertext
 * @access  Public
 */
router.post(
  '/decrypt',
  [
    body('ciphertext')
      .isString()
      .notEmpty()
      .withMessage('Ciphertext is required and must be a string'),
    body('iv')
      .isString()
      .notEmpty()
      .withMessage('IV is required and must be a string'),
    body('authTag')
      .isString()
      .notEmpty()
      .withMessage('Authentication tag is required and must be a string')
  ],
  (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { ciphertext, iv, authTag } = req.body;

      // Decrypt the ciphertext
      const plaintext = encryptionService.decrypt({ ciphertext, iv, authTag });

      res.json({
        success: true,
        data: {
          plaintext
        }
      });
    } catch (error) {
      console.error('Decryption error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Decryption failed',
        error: error.message
      });
    }
  }
);

module.exports = router;
