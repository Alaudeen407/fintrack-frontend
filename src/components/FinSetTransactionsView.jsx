import React from 'react';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Download, 
  Edit3, 
  Trash2, 
  Inbox,
  X,
  Tag
} from 'lucide-react';
import { getExportUrl } from '../api';

export default function FinSetTransactionsView({
  transactions,
  isLoading,
  filters,
  onFilterChange,
  categories,
  onOpenAddModal,
  onEdit,
  onDelete
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const handleExport = () => {
    window.open(getExportUrl(), '_blank');
  };

  const creditCount = transactions.filter(t => t.type === 'credit').length;
  const debitCount = transactions.filter(t => t.type === 'debit').length;

  const allCategories = Array.from(new Set([
    ...(categories.credit || []),
    ...(categories.debit || [])
  ])).sort();

  return (
    <div className="tx-view-container">
      {/* Top Filter Bar */}
      <div className="tx-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div className="tx-type-tabs">
            <button
              className={`tx-type-tab ${filters.type === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, type: 'all' })}
            >
              <span>All ({transactions.length})</span>
            </button>
            <button
              className={`tx-type-tab ${filters.type === 'credit' ? 'active credit' : ''}`}
              onClick={() => onFilterChange({ ...filters, type: 'credit' })}
            >
              <ArrowDownLeft size={13} />
              <span>Credit ({creditCount})</span>
            </button>
            <button
              className={`tx-type-tab ${filters.type === 'debit' ? 'active debit' : ''}`}
              onClick={() => onFilterChange({ ...filters, type: 'debit' })}
            >
              <ArrowUpRight size={13} />
              <span>Debit ({debitCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="tx-search-input-wrap">
            <Search size={14} className="tx-search-icon" />
            <input
              type="text"
              className="tx-search-input"
              placeholder="Search description, category..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8C919D',
                  cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            className="dropdown-pill-sm"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {allCategories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="pill-btn-white" onClick={handleExport} title="Download CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="pill-btn-purple" onClick={onOpenAddModal}>
            <Plus size={15} />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="tx-table-card">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8C919D' }}>
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: '#8C919D' }}>
            <Inbox size={32} style={{ margin: '0 auto 8px auto', opacity: 0.6 }} />
            <h4 style={{ color: '#14171A', fontSize: '1rem', marginBottom: '4px' }}>No transactions found</h4>
            <p style={{ fontSize: '0.82rem' }}>Try clearing filters or click "+ Record Transaction" to add one.</p>
          </div>
        ) : (
          <table className="finset-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <tr key={tx.id}>
                    {/* Badge */}
                    <td>
                      <span className={`badge-finset ${isCredit ? 'credit' : 'debit'}`}>
                        {isCredit ? (
                          <>
                            <ArrowDownLeft size={11} strokeWidth={2.5} />
                            <span>Credit</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight size={11} strokeWidth={2.5} />
                            <span>Debit</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Description */}
                    <td>
                      <div style={{ fontWeight: 600, color: '#14171A' }}>{tx.description}</div>
                      {tx.notes && (
                        <div style={{ fontSize: '0.72rem', color: '#8C919D' }}>{tx.notes}</div>
                      )}
                    </td>

                    {/* Category */}
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        color: '#5E6470',
                        backgroundColor: '#F8F9FD',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #EAEDF3'
                      }}>
                        <Tag size={10} color="#7B61FF" />
                        <span>{tx.category}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#8C919D', fontFamily: 'var(--font-mono)' }}>
                        {tx.date}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#5E6470' }}>
                        {tx.payment_method || 'Cash'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td style={{ textAlign: 'right' }}>
                      <span className={`amount-text ${isCredit ? 'credit' : 'debit'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        <button 
                          className="icon-btn-round" 
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onEdit(tx)}
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button 
                          className="icon-btn-round" 
                          style={{ width: '28px', height: '28px', color: '#F43F5E' }}
                          onClick={() => onDelete(tx)}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
