import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function FinSetAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (tab === 'login') {
        result = await loginUser(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        result = await registerUser(name, email, password);
      }
      onAuthSuccess(result.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUser('adalinect@gmail.com', 'password123');
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError('Could not log in with demo account: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-finset-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-finset-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-circle" style={{ width: '32px', height: '32px' }}>
              <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>F</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {tab === 'login' ? 'Welcome to FinSet' : 'Join FinSet Pro'}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                {tab === 'login' ? 'Sign in to access your finances' : 'Create an account to start tracking'}
              </p>
            </div>
          </div>
          <button className="collapse-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div className="tx-type-tabs" style={{ width: '100%', display: 'flex' }}>
            <button
              className={`tx-type-tab ${tab === 'login' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`tx-type-tab ${tab === 'register' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-finset-body" style={{ paddingTop: '16px' }}>
            {error && (
              <div style={{
                backgroundColor: 'var(--red-badge-bg)',
                color: 'var(--red-badge-text)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}>
                {error}
              </div>
            )}

            {tab === 'register' && (
              <div className="finset-field">
                <label className="finset-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="finset-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. Adaline Lively"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="finset-field">
              <label className="finset-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="finset-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="adalinect@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="finset-field">
              <label className="finset-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="finset-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="pill-btn-purple"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (tab === 'login' ? 'Sign In' : 'Create Free Account')}
            </button>

            {/* Quick Demo Login Option */}
            <div style={{
              marginTop: '6px',
              borderTop: '1px dashed var(--border-light)',
              paddingTop: '12px',
              textAlign: 'center'
            }}>
              <button
                type="button"
                className="pill-btn-white"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                onClick={handleQuickDemoLogin}
                disabled={isLoading}
              >
                <Sparkles size={14} color="#7B61FF" />
                <span>One-Click Demo Login (Adaline Lively)</span>
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Demo credentials: adalinect@gmail.com / password123
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
