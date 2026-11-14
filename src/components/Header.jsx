import React from 'react';
import { Wallet, Plus, Download, RefreshCw, CircleCheck } from 'lucide-react';
import { getExportUrl } from '../api';

export default function Header({ onOpenAddModal, onRefresh, isRefreshing, backendStatus }) {
  const handleExport = () => {
    window.open(getExportUrl(), '_blank');
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Wallet size={24} />
        </div>
        <div>
          <h1 className="brand-title">FinTrack Pro</h1>
          <p className="brand-subtitle">Smart Credit & Debit Expense Management</p>
        </div>
      </div>

      <div className="header-actions">
        <div 
          className="badge" 
          style={{ 
            backgroundColor: backendStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: backendStatus ? '#10b981' : '#f43f5e',
            border: `1px solid ${backendStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            padding: '0.35rem 0.75rem'
          }}
          title={backendStatus ? 'Connected to Flask Backend' : 'Disconnected from Backend'}
        >
          <span style={{
            width: 7, 
            height: 7, 
            borderRadius: '50%', 
            backgroundColor: backendStatus ? '#10b981' : '#f43f5e',
            display: 'inline-block'
          }}></span>
          <span>{backendStatus ? 'Flask API Online' : 'Connecting...'}</span>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
          <span>Refresh</span>
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={handleExport}
          title="Download transactions CSV spreadsheet"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>

        <button 
          className="btn btn-primary" 
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
}
