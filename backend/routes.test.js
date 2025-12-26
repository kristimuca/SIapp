const request = require('supertest');
const express = require('express');
const routes = require('./routes');

// Setup test app
const app = express();
app.use(express.json());
app.use('/api', routes);

// Set test encryption key
process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('API Routes', () => {
  describe('POST /api/encrypt', () => {
    test('should encrypt plaintext successfully', async () => {
      const response = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: 'Hello, World!' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('ciphertext');
      expect(response.body.data).toHaveProperty('iv');
      expect(response.body.data).toHaveProperty('authTag');
    });

    test('should return 400 for missing plaintext', async () => {
      const response = await request(app)
        .post('/api/encrypt')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for empty plaintext', async () => {
      const response = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for plaintext exceeding max length', async () => {
      const longText = 'a'.repeat(10001);
      const response = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: longText })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should handle special characters', async () => {
      const response = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('ciphertext');
    });
  });

  describe('POST /api/decrypt', () => {
    test('should decrypt ciphertext successfully', async () => {
      // First encrypt
      const encryptResponse = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: 'Test message' });

      const { ciphertext, iv, authTag } = encryptResponse.body.data;

      // Then decrypt
      const decryptResponse = await request(app)
        .post('/api/decrypt')
        .send({ ciphertext, iv, authTag })
        .expect(200);

      expect(decryptResponse.body.success).toBe(true);
      expect(decryptResponse.body.data.plaintext).toBe('Test message');
    });

    test('should return 400 for missing ciphertext', async () => {
      const response = await request(app)
        .post('/api/decrypt')
        .send({ iv: 'test', authTag: 'test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for missing iv', async () => {
      const response = await request(app)
        .post('/api/decrypt')
        .send({ ciphertext: 'test', authTag: 'test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for missing authTag', async () => {
      const response = await request(app)
        .post('/api/decrypt')
        .send({ ciphertext: 'test', iv: 'test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 500 for invalid ciphertext', async () => {
      const response = await request(app)
        .post('/api/decrypt')
        .send({
          ciphertext: 'invalid',
          iv: '1234567890abcdef1234567890abcdef',
          authTag: '1234567890abcdef1234567890abcdef'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Decryption failed');
    });

    test('should handle round-trip encryption/decryption', async () => {
      const originalText = 'Round trip test 🚀';

      // Encrypt
      const encryptResponse = await request(app)
        .post('/api/encrypt')
        .send({ plaintext: originalText });

      const { ciphertext, iv, authTag } = encryptResponse.body.data;

      // Decrypt
      const decryptResponse = await request(app)
        .post('/api/decrypt')
        .send({ ciphertext, iv, authTag });

      expect(decryptResponse.body.data.plaintext).toBe(originalText);
    });
  });
});
