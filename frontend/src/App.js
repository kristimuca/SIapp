import React, { useState, useEffect } from 'react';
import './App.css';
import { encryptText, decryptText } from './api';
import { useAuth } from './AuthContext';
import { Login, Signup } from './Auth';
import History from './History';
import { FaLock, FaLockOpen, FaTrash, FaCopy, FaUser, FaHistory, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

function App() {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [authMode, setAuthMode] = useState('login');
  const [showHistory, setShowHistory] = useState(false);
  const [loopingText, setLoopingText] = useState('');
  
  const { currentUser, logout } = useAuth();

  // Looping text animation for "How it works" section
  useEffect(() => {
    const howItWorksSteps = [
      'Enter your text in the input field',
      'Click "Encrypt" to secure your message',
      'Click "Decrypt" to reveal the original message',
      'Your data is encrypted using AES-256-GCM algorithm',
      'Save your encryption history by signing up'
    ];

    let stepIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let text = '';

    const typeWriter = () => {
      const currentStep = howItWorksSteps[stepIndex];
      
      if (isDeleting) {
        text = currentStep.substring(0, charIndex - 1);
        charIndex--;
      } else {
        text = currentStep.substring(0, charIndex + 1);
        charIndex++;
      }

      setLoopingText(text);

      if (!isDeleting && charIndex === currentStep.length) {
        setTimeout(() => { isDeleting = true; }, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stepIndex = (stepIndex + 1) % howItWorksSteps.length;
      }

      const speed = isDeleting ? 30 : 60;
      setTimeout(typeWriter, speed);
    };

    typeWriter();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      showMessage('error', 'Please enter some text to encrypt');
      return;
    }

    setLoading(true);
    try {
      const response = await encryptText(inputText, { 
        title: title || 'Untitled',
        saveToHistory: !!currentUser 
      });
      setEncryptedData(response.data);
      setDecryptedText('');
      showMessage('success', currentUser ? 'Text encrypted and saved!' : 'Text encrypted successfully!');
    } catch (error) {
      showMessage('error', error.message || 'Encryption failed. Please try again.');
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleClear = () => {
    setInputText('');
    setTitle('');
    setEncryptedData(null);
    setDecryptedText('');
    setMessage({ type: '', text: '' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showMessage('success', 'Copied to clipboard!');
  };

  const handleLoadEncryption = (data) => {
    setEncryptedData(data);
    setShowHistory(false);
    showMessage('success', 'Encryption loaded from history');
  };

  const handleLogout = async () => {
    try {
      await logout();
      showMessage('success', 'Logged out successfully');
      setShowHistory(false);
    } catch (error) {
      showMessage('error', 'Failed to logout');
    }
  };

  return (
    <div className="App">
      {!currentUser ? (
        <div className="auth-gate">
          <div className="auth-container">
            <div className="auth-header">
              <FaShieldAlt className="auth-icon" />
              <h1 className="auth-title">Text Encryption App</h1>
              <p className="auth-subtitle">Secure encryption and decryption using AES-256-GCM</p>
            </div>
            
            {authMode === 'login' ? (
              <Login
                onToggleMode={() => setAuthMode('signup')}
                onClose={() => {}}
              />
            ) : (
              <Signup
                onToggleMode={() => setAuthMode('login')}
                onClose={() => {}}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="header">
            <FaShieldAlt className="header-icon" />
            <h1>Text Encryption App</h1>
            <p>Secure encryption and decryption using AES-256-GCM</p>
            
            <div className="user-section">
              <span className="user-email"><FaUser /> {currentUser.email}</span>
              <button className="btn-link" onClick={() => setShowHistory(!showHistory)}>
                <FaHistory /> History
              </button>
              <button className="btn-link" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {showHistory ? (
            <History onLoadEncryption={handleLoadEncryption} />
          ) : (
            <>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              {currentUser && (
                <div className="form-group">
                  <label htmlFor="title">Title (optional):</label>
                  <input
                    id="title"
                    type="text"
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your encryption a title..."
                    disabled={loading}
                  />
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
                  {loading ? <span className="loading"></span> : <FaLock />}
                  Encrypt
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleDecrypt}
                  disabled={loading || !encryptedData}
                >
                  {loading ? <span className="loading"></span> : <FaLockOpen />}
                  Decrypt
                </button>
                <button
                  className="btn btn-clear"
                  onClick={handleClear}
                  disabled={loading}
                >
                  <FaTrash /> Clear
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
                    onClick={() => copyToClipboard(JSON.stringify(encryptedData, null, 2))}
                  >
                    <FaCopy /> Copy All
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
                    <FaCopy /> Copy
                  </button>
                </div>
              )}

              <div className="info-box">
                <div className="info-header">
                  <FaShieldAlt className="info-icon" />
                  <strong>How it works:</strong>
                </div>
                <div className="typing-container">
                  <span className="typing-text">{loopingText}</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
