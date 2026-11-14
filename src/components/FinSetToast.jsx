import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function FinSetToast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="finset-toast-box">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="finset-toast"
          style={{
            borderLeftColor: t.type === 'error' ? '#F43F5E' : '#7B61FF'
          }}
        >
          {t.type === 'error' ? (
            <AlertCircle size={16} color="#F43F5E" />
          ) : (
            <CheckCircle2 size={16} color="#10B981" />
          )}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button 
            onClick={() => onDismiss(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C919D' }}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
