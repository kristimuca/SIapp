const express = require('express');
const { body, validationResult } = require('express-validator');
const EncryptionService = require('./encryptionService');
const { authMiddleware, optionalAuthMiddleware } = require('./authMiddleware');
const databaseService = require('./databaseService');

const router = express.Router();
const encryptionService = new EncryptionService();

/**
 * @route   GET /api/test-firestore
 * @desc    Test Firestore connection
 * @access  Public
 */
router.get('/test-firestore', async (req, res) => {
  try {
    const { db } = require('./firebase');
    const testRef = db.collection('_test').doc('connection');
    await testRef.set({ timestamp: new Date().toISOString(), test: true });
    const doc = await testRef.get();
    
    res.json({
      success: true,
      message: 'Firestore connected successfully!',
      data: doc.data()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Firestore connection failed',
      error: error.message,
      hint: 'You need to set up Firebase service account credentials or enable Application Default Credentials'
    });
  }
});


/**
 * @route   POST /api/encrypt
 * @desc    Encrypt plaintext (saves to history if authenticated)
 * @access  Public (optional auth)
 */
router.post(
  '/encrypt',
  optionalAuthMiddleware,
  [
    body('plaintext')
      .isString()
      .notEmpty()
      .withMessage('Plaintext is required and must be a string')
      .isLength({ max: 10000 })
      .withMessage('Plaintext must not exceed 10,000 characters'),
    body('title').optional().isString().isLength({ max: 200 }),
    body('description').optional().isString().isLength({ max: 1000 }),
    body('saveToHistory').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { plaintext, title, description, saveToHistory } = req.body;

      // Encrypt the plaintext
      const encryptedData = encryptionService.encrypt(plaintext);

      // Save to history if user is authenticated and wants to save
      let historyId = null;
      if (req.user && saveToHistory !== false) {
        try {
          console.log(`Attempting to save encryption to history for user: ${req.user.uid}`);
          const result = await databaseService.saveEncryption(req.user.uid, {
            ...encryptedData,
            originalLength: plaintext.length,
            title,
            description,
          });
          historyId = result.id;
          console.log(`Successfully saved to history with ID: ${historyId}`);
        } catch (dbError) {
          console.error('Failed to save to history:', dbError.message);
          console.error('Full error:', dbError);
          // Continue even if save fails
        }
      } else {
        console.log(`Not saving to history - User authenticated: ${!!req.user}, saveToHistory: ${saveToHistory}`);
      }

      res.json({
        success: true,
        data: {
          ...encryptedData,
          historyId,
        }
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

/**
 * @route   GET /api/history
 * @desc    Get user's encryption history
 * @access  Private
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await databaseService.getEncryptionHistory(req.user.uid, limit);
    
    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/history/:id
 * @desc    Get specific encryption from history
 * @access  Private
 */
router.get('/history/:id', authMiddleware, async (req, res) => {
  try {
    const encryption = await databaseService.getEncryption(req.params.id, req.user.uid);
    
    if (!encryption) {
      return res.status(404).json({
        success: false,
        message: 'Encryption not found'
      });
    }

    res.json({
      success: true,
      data: encryption
    });
  } catch (error) {
    console.error('Encryption fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch encryption',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete encryption from history
 * @access  Private
 */
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const result = await databaseService.deleteEncryption(req.params.id, req.user.uid);
    
    res.json({
      success: true,
      message: 'Encryption deleted successfully'
    });
  } catch (error) {
    console.error('Deletion error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete encryption',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/share
 * @desc    Create a shareable link for encrypted message
 * @access  Private
 */
router.post(
  '/share',
  authMiddleware,
  [
    body('ciphertext').isString().notEmpty(),
    body('iv').isString().notEmpty(),
    body('authTag').isString().notEmpty(),
    body('title').optional().isString().isLength({ max: 200 }),
    body('expiresInHours').optional().isInt({ min: 1, max: 168 }),
    body('maxViews').optional().isInt({ min: 1, max: 1000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { ciphertext, iv, authTag, title, expiresInHours, maxViews } = req.body;

      const shareData = await databaseService.createSharedMessage(
        req.user.uid,
        { ciphertext, iv, authTag, title, maxViews },
        expiresInHours || 24
      );

      res.json({
        success: true,
        data: shareData
      });
    } catch (error) {
      console.error('Share creation error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create shareable link',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/shared/:shareId
 * @desc    Get shared encrypted message
 * @access  Public
 */
router.get('/shared/:shareId', async (req, res) => {
  try {
    const message = await databaseService.getSharedMessage(req.params.shareId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Shared message not found'
      });
    }

    if (message.expired) {
      return res.status(410).json({
        success: false,
        message: 'This shared message has expired'
      });
    }

    if (message.limitReached) {
      return res.status(410).json({
        success: false,
        message: 'This shared message has reached its view limit'
      });
    }

    res.json({
      success: true,
      data: {
        ciphertext: message.ciphertext,
        iv: message.iv,
        authTag: message.authTag,
        title: message.title,
        createdAt: message.createdAt,
      }
    });
  } catch (error) {
    console.error('Shared message fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shared message',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/user/profile
 * @desc    Create/update user profile
 * @access  Private
 */
router.post('/user/profile', authMiddleware, async (req, res) => {
  try {
    await databaseService.createUser(req.user.uid, {
      email: req.user.email,
      emailVerified: req.user.emailVerified,
      lastLogin: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await databaseService.getUser(req.user.uid);

    res.json({
      success: true,
      data: user || { uid: req.user.uid, email: req.user.email }
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;

