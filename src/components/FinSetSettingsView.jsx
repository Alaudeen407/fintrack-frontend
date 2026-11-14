import React, { useState, useEffect } from 'react';
import { Database, Shield, Moon, Sun, RotateCcw, Cloud, CheckCircle2 } from 'lucide-react';
import { fetchMongoStatus, resetDatabase } from '../api';

export default function FinSetSettingsView({ theme, onToggleTheme, currentUser, onShowToast }) {
  const [mongoStatus, setMongoStatus] = useState(null);

  useEffect(() => {
    fetchMongoStatus().then(data => setMongoStatus(data));
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Clear all transactions and bills to start fresh with a clean database?')) {
      return;
    }
    try {
      await resetDatabase();
      onShowToast('All transaction and bill records cleared successfully in MongoDB Atlas & SQLite!', 'success');
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      onShowToast('Failed to reset data', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Theme Preference Card */}
      <div className="finset-card">
        <div className="card-inner-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? <Moon size={18} color="var(--finset-purple)" /> : <Sun size={18} color="var(--finset-purple)" />}
            <span className="card-title-text">Appearance & Theme Mode</span>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Select between the crisp light aesthetic and the night dark theme.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            className="pill-btn-white"
            style={{
              borderColor: theme === 'light' ? 'var(--finset-purple)' : 'var(--border-light)',
              backgroundColor: theme === 'light' ? 'var(--finset-purple-light)' : 'transparent',
              color: theme === 'light' ? 'var(--finset-purple)' : 'var(--text-main)',
              fontWeight: 700
            }}
            onClick={() => onToggleTheme('light')}
          >
            <Sun size={16} />
            <span>FinSet Light Theme (Day)</span>
          </button>

          <button
            className="pill-btn-white"
            style={{
              borderColor: theme === 'dark' ? 'var(--finset-purple)' : 'var(--border-light)',
              backgroundColor: theme === 'dark' ? 'var(--finset-purple-light)' : 'transparent',
              color: theme === 'dark' ? 'var(--finset-purple)' : 'var(--text-main)',
              fontWeight: 700
            }}
            onClick={() => onToggleTheme('dark')}
          >
            <Moon size={16} />
            <span>FinSet Dark Theme (Night)</span>
          </button>
        </div>
      </div>

      {/* Data Storage & SQLite Architecture */}
      <div className="finset-card">
        <div className="card-inner-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud size={18} color="var(--finset-purple)" />
            <span className="card-title-text">MongoDB Atlas Cloud Database</span>
          </div>
          <span className={`bill-status-pill ${mongoStatus?.connected ? 'paid' : 'unpaid'}`}>
            {mongoStatus?.connected ? '● MongoDB Atlas Connected' : '● Local Offline SQLite'}
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          FinSet Pro is connected to <strong>MongoDB Atlas Cloud</strong>. All transactions, recurring bills, and user sessions are securely stored in MongoDB Atlas with dual-persistence synchronization.
        </p>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-app)',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          fontSize: '0.78rem',
          color: 'var(--text-sub)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div><strong>Cloud Engine:</strong> MongoDB Atlas (Database: <code>{mongoStatus?.database || 'finset_db'}</code>)</div>
          <div><strong>Cluster URI:</strong> <code>{mongoStatus?.cluster || 'cluster0.kh3a2oo.mongodb.net'}</code></div>
          <div><strong>Collections:</strong> Transactions ({mongoStatus?.collections?.transactions || 0}), Bills ({mongoStatus?.collections?.bills || 0}), Users ({mongoStatus?.collections?.users || 0})</div>
          <div><strong>Sync Architecture:</strong> MongoDB Atlas Cloud primary with local SQLite 3 cache</div>
          <div><strong>Excel Engine:</strong> Formatted OpenPyXL Multi-Sheet .xlsx generator</div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            className="pill-btn-white"
            onClick={handleResetData}
            style={{ color: '#F59E0B', borderColor: 'var(--border-light)' }}
          >
            <RotateCcw size={14} />
            <span>Clear All Data (Start Fresh)</span>
          </button>
        </div>
      </div>

      {/* User Account Card */}
      {currentUser && (
        <div className="finset-card">
          <div className="card-inner-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--finset-purple)" />
              <span className="card-title-text">Active Profile & Security</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
              alt={currentUser.name}
              style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
