import React, { useState, useEffect } from 'react';
import './App.css';
import { encryptText, decryptText } from './api';
import { useAuth } from './AuthContext';
import { Login, Signup } from './Auth';
import History from './History';
import { FaLock, FaLockOpen, FaTrash, FaCopy, FaUser, FaHistory, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const HOW_IT_WORKS_STEPS = [
  'Enter your text in the input field',
  'Click "Encrypt" to secure your message',
  'Copy the portable encrypted string',
  'Clear everything and paste it in Decrypt Mode',
  'Click "Decrypt" to reveal the original message'
];

function App() {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [authMode, setAuthMode] = useState('login');
  const [showHistory, setShowHistory] = useState(false);
  const [loopingText, setLoopingText] = useState(HOW_IT_WORKS_STEPS[0]);
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [manualCiphertext, setManualCiphertext] = useState('');
  const [manualIv, setManualIv] = useState('');
  const [manualAuthTag, setManualAuthTag] = useState('');
  const [portableString, setPortableString] = useState('');
  
  const { currentUser, logout } = useAuth();

  // Clear sentence-by-sentence loop for "How it works"
  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % HOW_IT_WORKS_STEPS.length;
      setLoopingText(HOW_IT_WORKS_STEPS[stepIndex]);
    }, 2600);

    return () => clearInterval(interval);
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
      const savedToHistory = !!response.data?.historyId;
      showMessage('success', savedToHistory ? 'Text encrypted and saved!' : 'Text encrypted successfully!');
    } catch (error) {
      showMessage('error', error.message || 'Encryption failed. Please try again.');
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    // Check if we're in manual mode and have manual data
    let dataToDecrypt;
    
    if (mode === 'decrypt') {
      if (portableString) {
        dataToDecrypt = { portableString };
      } else if (manualCiphertext && manualIv && manualAuthTag) {
        dataToDecrypt = { ciphertext: manualCiphertext, iv: manualIv, authTag: manualAuthTag };
      } else {
        showMessage('error', 'Please enter encrypted data or paste a portable string');
        return;
      }
    } else {
      dataToDecrypt = encryptedData;
    }

    if (!dataToDecrypt) {
      showMessage('error', 'Please encrypt some text first');
      return;
    }

    setLoading(true);
    try {
      const response = await decryptText(dataToDecrypt);
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
    setManualCiphertext('');
    setManualIv('');
    setManualAuthTag('');
    setPortableString('');
    setMessage({ type: '', text: '' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showMessage('success', 'Copied to clipboard!');
  };

  const handleLoadEncryption = (data) => {
    setEncryptedData(data);
    setMode('encrypt');
    setShowHistory(false);
    showMessage('success', 'Encryption loaded from history');
  };

  const handlePasteEncryptedData = () => {
    navigator.clipboard.readText().then(text => {
      try {
        const data = JSON.parse(text);
        if (data.ciphertext && data.iv && data.authTag) {
          setManualCiphertext(data.ciphertext);
          setManualIv(data.iv);
          setManualAuthTag(data.authTag);
          setPortableString('');
          showMessage('success', 'Encrypted data pasted successfully!');
        } else if (data.portableString) {
          setPortableString(data.portableString);
          setManualCiphertext('');
          setManualIv('');
          setManualAuthTag('');
          showMessage('success', 'Portable string pasted successfully!');
        } else {
          showMessage('error', 'Invalid encrypted data format');
        }
      } catch (e) {
        // Try as portable string directly
        if (text && text.length > 20) {
          setPortableString(text);
          setManualCiphertext('');
          setManualIv('');
          setManualAuthTag('');
          showMessage('success', 'Portable string pasted successfully!');
        } else {
          showMessage('error', 'Could not parse clipboard data');
        }
      }
    }).catch(() => {
      showMessage('error', 'Failed to access clipboard');
    });
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

              <div className="mode-toggle">
                <button
                  className={`mode-btn ${mode === 'encrypt' ? 'active' : ''}`}
                  onClick={() => setMode('encrypt')}
                >
                  <FaLock /> Encrypt Mode
                </button>
                <button
                  className={`mode-btn ${mode === 'decrypt' ? 'active' : ''}`}
                  onClick={() => setMode('decrypt')}
                >
                  <FaLockOpen /> Decrypt Mode
                </button>
              </div>

              {mode === 'encrypt' ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="decrypt-mode-hint">
                    <p><strong>Option 1:</strong> Paste the portable string (easiest)</p>
                    <p><strong>Option 2:</strong> Enter ciphertext, IV, and auth tag separately</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="portableString">Portable String (Recommended):</label>
                    <textarea
                      id="portableString"
                      className="textarea"
                      value={portableString}
                      onChange={(e) => {
                        setPortableString(e.target.value);
                        if (e.target.value) {
                          setManualCiphertext('');
                          setManualIv('');
                          setManualAuthTag('');
                        }
                      }}
                      placeholder="Paste your portable encrypted string here..."
                      disabled={loading}
                      rows="3"
                    />
                  </div>

                  <div className="separator">
                    <span>OR</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="manualCiphertext">Ciphertext:</label>
                    <textarea
                      id="manualCiphertext"
                      className="textarea"
                      value={manualCiphertext}
                      onChange={(e) => {
                        setManualCiphertext(e.target.value);
                        if (e.target.value) setPortableString('');
                      }}
                      placeholder="Paste your ciphertext here..."
                      disabled={loading || !!portableString}
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="manualIv">IV (Initialization Vector):</label>
                    <input
                      id="manualIv"
                      type="text"
                      className="input"
                      value={manualIv}
                      onChange={(e) => {
                        setManualIv(e.target.value);
                        if (e.target.value) setPortableString('');
                      }}
                      placeholder="Paste your IV here..."
                      disabled={loading || !!portableString}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="manualAuthTag">Auth Tag:</label>
                    <input
                      id="manualAuthTag"
                      type="text"
                      className="input"
                      value={manualAuthTag}
                      onChange={(e) => {
                        setManualAuthTag(e.target.value);
                        if (e.target.value) setPortableString('');
                      }}
                      placeholder="Paste your auth tag here..."
                      disabled={loading}
                    />
                  </div>

                  <div className="button-group">
                    <button
                      className="btn btn-info"
                      onClick={handlePasteEncryptedData}
                      disabled={loading}
                    >
                      <FaCopy /> Paste from Clipboard
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleDecrypt}
                      disabled={loading || (!portableString && (!manualCiphertext || !manualIv || !manualAuthTag))}
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
                </>
              )}

              {encryptedData && (
                <div className="result-section">
                  <h3>Encrypted Data:</h3>
                  
                  {encryptedData.portableString && (
                    <>
                      <div className="result-subsection">
                        <strong>Portable String (Copy This!):</strong>
                        <div className="result-content portable-string">
                          {encryptedData.portableString}
                        </div>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(encryptedData.portableString)}
                        >
                          <FaCopy /> Copy Portable String
                        </button>
                      </div>
                      <div className="separator">
                        <span>OR USE INDIVIDUAL FIELDS</span>
                      </div>
                    </>
                  )}
                  
                  <div className="result-content">
                    <strong>Ciphertext:</strong> {encryptedData.ciphertext}
                    <br /><br />
                    <strong>IV:</strong> {encryptedData.iv}
                    <br /><br />
                    <strong>Auth Tag:</strong> {encryptedData.authTag}
                    {encryptedData.keyVersion && (
                      <>
                        <br /><br />
                        <strong>Key Version:</strong> {encryptedData.keyVersion}
                      </>
                    )}
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
                <div className="looping-container">
                  <span key={loopingText} className="looping-text">{loopingText}</span>
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
