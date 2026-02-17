import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';
import { FaHistory, FaLockOpen, FaTrash, FaInbox, FaSearch, FaDownload } from 'react-icons/fa';

const History = ({ onLoadEncryption }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history`);
      setHistory(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      fetchHistory();
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history/search`, {
        params: { searchTitle: searchTitle.trim() }
      });
      setHistory(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `encryption-history-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.response?.data?.message || 'Export failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this encryption?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleLoad = (item) => {
    onLoadEncryption({
      ciphertext: item.ciphertext,
      iv: item.iv,
      authTag: item.authTag,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="history-loading">Loading history...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <FaInbox className="empty-icon" />
        <p>No encryption history yet</p>
        <p className="history-hint">Encrypted messages will appear here</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header-section">
        <h2><FaHistory /> Encryption History</h2>
        <button className="btn-export" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>

      <div className="history-search">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button 
          className="btn-search" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? '...' : <><FaSearch /> Search</>}
        </button>
        {searchTitle && (
          <button 
            className="btn-clear-search" 
            onClick={() => {
              setSearchTitle('');
              fetchHistory();
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-header">
              <h3>{item.title || 'Untitled'}</h3>
              <span className="history-date">{formatDate(item.createdAt)}</span>
            </div>
            
            {item.description && (
              <p className="history-description">{item.description}</p>
            )}
            
            <div className="history-meta">
              <span>Length: {item.originalLength} chars</span>
            </div>
            
            <div className="history-actions">
              <button 
                className="btn-small btn-load" 
                onClick={() => handleLoad(item)}
              >
                <FaLockOpen /> Load
              </button>
              <button 
                className="btn-small btn-delete" 
                onClick={() => handleDelete(item.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
