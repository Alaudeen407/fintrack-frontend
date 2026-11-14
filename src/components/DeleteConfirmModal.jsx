import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, transaction }) {
  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'credit';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--debit-bg)',
              color: 'var(--debit-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={18} />
            </div>
            <h2 className="modal-title" style={{ fontSize: '1.05rem' }}>Delete Transaction</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>
            Are you sure you want to delete this <strong style={{ color: isCredit ? 'var(--credit-color)' : 'var(--debit-color)' }}>{transaction.type.toUpperCase()}</strong> transaction?
          </p>
          <div 
            style={{ 
              backgroundColor: 'var(--bg-main)', 
              padding: '0.85rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              margin: '0.5rem 0'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{transaction.description}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Amount: ${Number(transaction.amount).toFixed(2)} • {transaction.date} • {transaction.category}
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This action cannot be undone. Your net balance and metrics will be updated immediately.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => onConfirm(transaction.id)}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
