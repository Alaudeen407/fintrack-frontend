import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--credit-color)' }} />}
          {t.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--debit-color)' }} />}
          {(!t.type || t.type === 'info') && <Info size={18} style={{ color: 'var(--primary)' }} />}
          
          <span style={{ flex: 1 }}>{t.message}</span>
          
          <button 
            onClick={() => onDismiss(t.id)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              padding: 2
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
