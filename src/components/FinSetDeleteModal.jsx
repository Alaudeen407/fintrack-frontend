import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function FinSetDeleteModal({ isOpen, onClose, onConfirm, transaction }) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-finset-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-finset-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#F43F5E" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#14171A' }}>Delete Transaction</h3>
          </div>
          <button className="collapse-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-finset-body" style={{ fontSize: '0.86rem', color: '#5E6470' }}>
          <p>
            Are you sure you want to remove this <strong>{transaction.type.toUpperCase()}</strong> of <strong>${Number(transaction.amount).toFixed(2)}</strong>?
          </p>
          <div style={{
            backgroundColor: '#F8F9FD',
            border: '1px solid #EAEDF3',
            borderRadius: '12px',
            padding: '10px 14px',
            marginTop: '4px'
          }}>
            <div style={{ fontWeight: 700, color: '#14171A' }}>{transaction.description}</div>
            <div style={{ fontSize: '0.75rem', color: '#8C919D', marginTop: '2px' }}>
              {transaction.category} • {transaction.date}
            </div>
          </div>
        </div>

        <div className="modal-finset-footer">
          <button className="pill-btn-white" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="pill-btn-purple" 
            style={{ backgroundColor: '#F43F5E' }}
            onClick={() => onConfirm(transaction.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
