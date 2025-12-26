import React, { useState } from 'react';
import './App.css';
import { encryptText, decryptText } from './api';

function App() {
  const [inputText, setInputText] = useState('');
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Show message with auto-dismiss
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle encryption
  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      showMessage('error', 'Please enter some text to encrypt');
      return;
    }

    setLoading(true);
    try {
      const response = await encryptText(inputText);
      setEncryptedData(response.data);
      setDecryptedText('');
      showMessage('success', 'Text encrypted successfully!');
    } catch (error) {
      showMessage('error', error.message || 'Encryption failed. Please try again.');
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle decryption
  const handleDecrypt = async () => {
    if (!encryptedData) {
      showMessage('error', 'Please encrypt some text first');
      return;
    }

    setLoading(true);
    try {
      const response = await decryptText(encryptedData);
      setDecryptedText(response.data.plaintext);
      showMessage('success', 'Text decrypted successfully!');
    } catch (error) {
      showMessage('error', error.message || 'Decryption failed. Please try again.');
      console.error('Decryption error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear all fields
  const handleClear = () => {
    setInputText('');
    setEncryptedData(null);
    setDecryptedText('');
    setMessage({ type: '', text: '' });
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showMessage('success', 'Copied to clipboard!');
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <div className="icon">🔐</div>
          <h1>Text Encryption App</h1>
          <p>Secure encryption and decryption using AES-256-GCM</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="inputText">Enter Text to Encrypt:</label>
          <textarea
            id="inputText"
            className="textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
          />
        </div>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={handleEncrypt}
            disabled={loading || !inputText.trim()}
          >
            {loading ? <span className="loading"></span> : '🔒'}
            Encrypt
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDecrypt}
            disabled={loading || !encryptedData}
          >
            {loading ? <span className="loading"></span> : '🔓'}
            Decrypt
          </button>
          <button
            className="btn btn-clear"
            onClick={handleClear}
            disabled={loading}
          >
            🗑️ Clear
          </button>
        </div>

        {encryptedData && (
          <div className="result-section">
            <h3>Encrypted Data:</h3>
            <div className="result-content">
              <strong>Ciphertext:</strong> {encryptedData.ciphertext}
              <br /><br />
              <strong>IV:</strong> {encryptedData.iv}
              <br /><br />
              <strong>Auth Tag:</strong> {encryptedData.authTag}
            </div>
            <button
              className="copy-btn"
              onClick={() =>
                copyToClipboard(JSON.stringify(encryptedData, null, 2))
              }
            >
              📋 Copy All
            </button>
          </div>
        )}

        {decryptedText && (
          <div className="result-section">
            <h3>Decrypted Text:</h3>
            <div className="result-content">{decryptedText}</div>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(decryptedText)}
            >
              📋 Copy
            </button>
          </div>
        )}

        <div className="info-box">
          <strong>ℹ️ How it works:</strong>
          <p>
            1. Enter your text in the input field<br />
            2. Click "Encrypt" to secure your message<br />
            3. Click "Decrypt" to reveal the original message<br />
            4. Your data is encrypted using AES-256-GCM algorithm
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
