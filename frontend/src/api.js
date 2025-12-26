import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Encrypt plaintext
 * @param {string} plaintext - Text to encrypt
 * @returns {Promise} Encrypted data
 */
export const encryptText = async (plaintext) => {
  try {
    const response = await api.post('/encrypt', { plaintext });
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
