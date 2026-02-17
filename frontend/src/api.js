import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Firebase auth token to every API request made via this client
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Encrypt plaintext
 * @param {string} plaintext - Text to encrypt
 * @param {object} options - Optional settings (title, description, saveToHistory)
 * @returns {Promise} Encrypted data
 */
export const encryptText = async (plaintext, options = {}) => {
  try {
    const response = await api.post('/encrypt', { plaintext, ...options });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Decrypt ciphertext
 * @param {object} encryptedData - Object containing ciphertext, iv, and authTag
 * @returns {Promise} Decrypted plaintext
 */
export const decryptText = async (encryptedData) => {
  try {
    const response = await api.post('/decrypt', encryptedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
