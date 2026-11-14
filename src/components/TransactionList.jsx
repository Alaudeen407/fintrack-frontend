import React from 'react';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  Inbox, 
  Tag, 
  Calendar,
  X
} from 'lucide-react';

export default function TransactionList({
  transactions,
  isLoading,
  filters,
  onFilterChange,
  categories,
  onEdit,
  onDelete
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // Compute counts for tabs
  const creditCount = transactions.filter(t => t.type === 'credit').length;
  const debitCount = transactions.filter(t => t.type === 'debit').length;

  // Flattened categories for the filter dropdown
  const allCategories = Array.from(new Set([
    ...(categories.credit || []),
    ...(categories.debit || [])
  ])).sort();

  return (
    <div className="transactions-section">
      {/* Controls & Filter Toolbar */}
      <div className="controls-bar">
        {/* Type Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filters.type === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, type: 'all' })}
          >
            <span>All</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({transactions.length})</span>
          </button>
          <button
            className={`filter-tab ${filters.type === 'credit' ? 'active credit' : ''}`}
            onClick={() => onFilterChange({ ...filters, type: 'credit' })}
          >
            <ArrowDownLeft size={13} />
            <span>Credit</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({creditCount})</span>
          </button>
          <button
            className={`filter-tab ${filters.type === 'debit' ? 'active debit' : ''}`}
            onClick={() => onFilterChange({ ...filters, type: 'debit' })}
          >
            <ArrowUpRight size={13} />
            <span>Debit</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({debitCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search description, category, notes..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              style={{
                position: 'absolute',
                right: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <select
          className="select-filter"
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {allCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          className="select-filter"
          value={filters.sort}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        >
          <option value="date_desc">Date: Newest First</option>
          <option value="date_asc">Date: Oldest First</option>
          <option value="amount_desc">Amount: Highest First</option>
          <option value="amount_asc">Amount: Lowest First</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-wrap">
        {isLoading ? (
          <div className="empty-state">
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={26} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              No transactions found
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filters.search || filters.category !== 'all' || filters.type !== 'all'
                ? 'Try adjusting your search filters or date range.'
                : 'Click "Add Transaction" to record your first credit or debit.'}
            </p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <tr key={tx.id}>
                    {/* Type Badge */}
                    <td>
                      <span className={`badge ${isCredit ? 'badge-credit' : 'badge-debit'}`}>
                        {isCredit ? (
                          <>
                            <ArrowDownLeft size={12} />
                            <span>Credit</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight size={12} />
                            <span>Debit</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Description & Note */}
                    <td>
                      <span className="tx-desc">{tx.description}</span>
                      {tx.notes && <span className="tx-subnote">{tx.notes}</span>}
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge badge-neutral">
                        <Tag size={11} style={{ marginRight: '2px', opacity: 0.7 }} />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="tx-date">
                        {formatDate(tx.date)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {tx.payment_method || 'Cash'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tx-amount ${isCredit ? 'credit' : 'debit'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="tx-actions" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onEdit(tx)}
                          title="Edit transaction"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => onDelete(tx)}
                          title="Delete transaction"
                        >
                          <Trash2 size={15} />
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
