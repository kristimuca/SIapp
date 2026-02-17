const { db } = require('./firebase');

/**
 * Database service for Firestore operations
 */
class DatabaseService {
  constructor() {
    this.collections = {
      users: 'users',
      encryptions: 'encryptions',
      sharedMessages: 'sharedMessages',
    };
  }

  /**
   * Create or update user profile
   */
  async createUser(uid, userData) {
    try {
      const userRef = db.collection(this.collections.users).doc(uid);
      await userRef.set({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Get user profile
   */
  async getUser(uid) {
    try {
      const userDoc = await db.collection(this.collections.users).doc(uid).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Save encrypted message to history
   */
  async saveEncryption(uid, encryptionData) {
    try {
      const encryptionRef = db.collection(this.collections.encryptions).doc();
      await encryptionRef.set({
        userId: uid,
        ciphertext: encryptionData.ciphertext,
        iv: encryptionData.iv,
        authTag: encryptionData.authTag,
        originalLength: encryptionData.originalLength || 0,
        title: encryptionData.title || 'Untitled',
        description: encryptionData.description || '',
        createdAt: new Date().toISOString(),
      });
      return { id: encryptionRef.id, success: true };
    } catch (error) {
      throw new Error(`Failed to save encryption: ${error.message}`);
    }
  }

  /**
   * Get user's encryption history
   */
  async getEncryptionHistory(uid, limit = 50) {
    try {
      const snapshot = await db.collection(this.collections.encryptions)
        .where('userId', '==', uid)
        .limit(limit)
        .get();

      const history = [];
      snapshot.forEach(doc => {
        history.push({ id: doc.id, ...doc.data() });
      });

      // Sort by createdAt in memory instead of in the query
      history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return history;
    } catch (error) {
      throw new Error(`Failed to get encryption history: ${error.message}`);
    }
  }

  /**
   * Get specific encryption by ID
   */
  async getEncryption(encryptionId, uid) {
    try {
      const doc = await db.collection(this.collections.encryptions).doc(encryptionId).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      
      // Verify ownership
      if (data.userId !== uid) {
        throw new Error('Unauthorized access to encryption');
      }

      return { id: doc.id, ...data };
    } catch (error) {
      throw new Error(`Failed to get encryption: ${error.message}`);
    }
  }

  /**
   * Delete encryption from history
   */
  async deleteEncryption(encryptionId, uid) {
    try {
      const doc = await db.collection(this.collections.encryptions).doc(encryptionId).get();
      
      if (!doc.exists) {
        return { success: false, message: 'Encryption not found' };
      }

      const data = doc.data();
      if (data.userId !== uid) {
        throw new Error('Unauthorized: Cannot delete another user\'s encryption');
      }

      await db.collection(this.collections.encryptions).doc(encryptionId).delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete encryption: ${error.message}`);
    }
  }

  /**
   * Create a shareable link for encrypted message
   */
  async createSharedMessage(uid, encryptionData, expiresInHours = 24) {
    try {
      const shareRef = db.collection(this.collections.sharedMessages).doc();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      await shareRef.set({
        userId: uid,
        ciphertext: encryptionData.ciphertext,
        iv: encryptionData.iv,
        authTag: encryptionData.authTag,
        title: encryptionData.title || 'Shared Message',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        viewCount: 0,
        maxViews: encryptionData.maxViews || null, // null = unlimited
      });

      return {
        shareId: shareRef.id,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${shareRef.id}`,
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to create shared message: ${error.message}`);
    }
  }

  /**
   * Get shared message (with view tracking)
   */
  async getSharedMessage(shareId) {
    try {
      const doc = await db.collection(this.collections.sharedMessages).doc(shareId).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);

      // Check if expired
      if (now > expiresAt) {
        return { expired: true };
      }

      // Check view limit
      if (data.maxViews && data.viewCount >= data.maxViews) {
        return { limitReached: true };
      }

      // Increment view count
      await db.collection(this.collections.sharedMessages).doc(shareId).update({
        viewCount: (data.viewCount || 0) + 1,
      });

      return { id: doc.id, ...data };
    } catch (error) {
      throw new Error(`Failed to get shared message: ${error.message}`);
    }
  }
}

module.exports = new DatabaseService();
