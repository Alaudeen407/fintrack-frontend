import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  FileSpreadsheet, 
  Database,
  Sun,
  Moon
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function FinSetLoginPage({ onAuthSuccess, onShowToast, theme, onToggleTheme }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await loginUser(email.trim(), password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        result = await registerUser(name.trim(), email.trim(), password);
      }
      if (onShowToast) {
        onShowToast(`Welcome back, ${result.user.name}!`, 'success');
      }
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Top right theme toggle */}
      <div style={{ position: 'absolute', top: 24, right: 28, zIndex: 10 }}>
        <button
          onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '9999px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)'
          }}
          title="Toggle appearance theme"
        >
          {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#7B61FF" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
        border: '1px solid var(--border-light)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--finset-purple)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
            boxShadow: '0 8px 24px rgba(123, 97, 255, 0.35)',
            marginBottom: '12px'
          }}>
            F
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            {mode === 'login' ? 'Welcome to FinSet Pro' : 'Create Your Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            {mode === 'login' 
              ? 'Sign in to access your finances and monthly reports' 
              : 'Join to track expenses, manage bills, and export reports'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="tx-type-tabs" style={{ display: 'flex', width: '100%', marginBottom: '22px' }}>
          <button
            type="button"
            className={`tx-type-tab ${mode === 'login' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tx-type-tab ${mode === 'register' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'var(--red-badge-bg)',
            color: 'var(--red-badge-text)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>•</span>
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div className="finset-field">
              <label className="finset-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="finset-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Alaudeen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="finset-field">
            <label className="finset-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="finset-input"
                style={{ paddingLeft: '40px' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="finset-field">
            <label className="finset-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="finset-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 10,
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="pill-btn-purple"
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '12px',
              fontSize: '0.92rem',
              fontWeight: 700,
              marginTop: '6px'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Feature Badges */}
        <div style={{
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-sub)',
            backgroundColor: 'var(--bg-app)',
            padding: '8px 10px',
            borderRadius: '10px'
          }}>
            <TrendingUp size={13} color="var(--finset-purple)" />
            <span>₹ Rupee Analytics</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-sub)',
            backgroundColor: 'var(--bg-app)',
            padding: '8px 10px',
            borderRadius: '10px'
          }}>
            <Database size={13} color="#10B981" />
            <span>MongoDB Atlas Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
