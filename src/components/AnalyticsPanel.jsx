import React, { useState } from 'react';
import { BarChart3, PieChart, CreditCard, ChevronRight } from 'lucide-react';

export default function AnalyticsPanel({ summary }) {
  const [activeCatTab, setActiveCatTab] = useState('debit');

  const {
    category_breakdown = [],
    income_breakdown = [],
    monthly_trend = [],
    payment_methods = []
  } = summary || {};

  const activeCategories = activeCatTab === 'debit' ? category_breakdown : income_breakdown;

  // Calculate maximum for chart bar scaling
  const maxTrendVal = Math.max(
    ...monthly_trend.map(m => Math.max(m.credit, m.debit)),
    100
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <aside className="analytics-sidebar">
      {/* Monthly Trend Card */}
      <div className="panel-card">
        <div className="panel-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={17} style={{ color: 'var(--primary)' }} />
            <span>Monthly Cash Flow</span>
          </span>
        </div>

        {monthly_trend.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
            Not enough data to graph trends.
          </p>
        ) : (
          <div>
            <div className="chart-container">
              {monthly_trend.map((item, idx) => {
                const creditHeight = Math.max(6, Math.round((item.credit / maxTrendVal) * 120));
                const debitHeight = Math.max(6, Math.round((item.debit / maxTrendVal) * 120));
                
                // Format month label: '2026-11' -> 'Nov'
                const [year, month] = item.month.split('-');
                const monthDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
                const shortLabel = isNaN(monthDate.getTime()) 
                  ? item.month 
                  : monthDate.toLocaleString('default', { month: 'short' });

                return (
                  <div key={idx} className="chart-bar-group">
                    <div className="bars-wrapper">
                      <div 
                        className="bar credit" 
                        style={{ height: `${creditHeight}px` }}
                        title={`${item.month} Credit: ${formatCurrency(item.credit)}`}
                      />
                      <div 
                        className="bar debit" 
                        style={{ height: `${debitHeight}px` }}
                        title={`${item.month} Debit: ${formatCurrency(item.debit)}`}
                      />
                    </div>
                    <span className="chart-month-label">{shortLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="chart-legend">
              <span>
                <span className="legend-dot credit" />
                Credit (+Income)
              </span>
              <span>
                <span className="legend-dot debit" />
                Debit (-Expense)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown Card */}
      <div className="panel-card">
        <div className="panel-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={17} style={{ color: 'var(--primary)' }} />
            <span>Category Breakdown</span>
          </span>
          <div className="filter-tabs" style={{ fontSize: '0.75rem', padding: '2px' }}>
            <button 
              className={`filter-tab ${activeCatTab === 'debit' ? 'active debit' : ''}`}
              onClick={() => setActiveCatTab('debit')}
              style={{ padding: '0.2rem 0.6rem' }}
            >
              Debit
            </button>
            <button 
              className={`filter-tab ${activeCatTab === 'credit' ? 'active credit' : ''}`}
              onClick={() => setActiveCatTab('credit')}
              style={{ padding: '0.2rem 0.6rem' }}
            >
              Credit
            </button>
          </div>
        </div>

        {activeCategories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
            No {activeCatTab} categories logged yet.
          </p>
        ) : (
          <div>
            {activeCategories.slice(0, 6).map((cat, idx) => (
              <div key={idx} className="cat-item">
                <div className="cat-info">
                  <span className="cat-name">{cat.category}</span>
                  <span className="cat-meta">
                    {formatCurrency(cat.total)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div 
                    className={`progress-fill ${activeCatTab}`}
                    style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Methods Card */}
      {payment_methods.length > 0 && (
        <div className="panel-card">
          <div className="panel-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={17} style={{ color: 'var(--primary)' }} />
              <span>Payment Methods</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {payment_methods.map((pm, idx) => (
              <div 
                key={idx}
                className="badge badge-neutral"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {pm.method}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {pm.count} txns • {formatCurrency(pm.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
