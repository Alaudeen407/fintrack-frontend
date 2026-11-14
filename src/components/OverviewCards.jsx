import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  Percent, 
  TrendingUp,
  Receipt
} from 'lucide-react';

export default function OverviewCards({ summary }) {
  const {
    total_credit = 0,
    total_debit = 0,
    balance = 0,
    credit_count = 0,
    debit_count = 0,
    total_count = 0
  } = summary || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const savingsRate = total_credit > 0 
    ? Math.max(0, Math.min(100, Math.round(((total_credit - total_debit) / total_credit) * 100)))
    : 0;

  return (
    <div className="overview-grid">
      {/* Total Balance Card */}
      <div className="stat-card">
        <div>
          <div className="stat-card-header">
            <span className="stat-label">Net Total Balance</span>
            <div className="stat-icon balance">
              <Wallet size={18} />
            </div>
          </div>
          <div className={`stat-value ${balance >= 0 ? 'credit' : 'debit'}`}>
            {formatCurrency(balance)}
          </div>
        </div>
        <div className="stat-footer">
          <span>{balance >= 0 ? 'Surplus cash flow' : 'Deficit / Overdrawn'}</span>
        </div>
      </div>

      {/* Total Credit (Income) Card */}
      <div className="stat-card">
        <div>
          <div className="stat-card-header">
            <span className="stat-label">Total Credit (Income)</span>
            <div className="stat-icon credit">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="stat-value credit">
            +{formatCurrency(total_credit)}
          </div>
        </div>
        <div className="stat-footer">
          <Receipt size={13} />
          <span>{credit_count} income credit {credit_count === 1 ? 'entry' : 'entries'}</span>
        </div>
      </div>

      {/* Total Debit (Expense) Card */}
      <div className="stat-card">
        <div>
          <div className="stat-card-header">
            <span className="stat-label">Total Debit (Expense)</span>
            <div className="stat-icon debit">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="stat-value debit">
            -{formatCurrency(total_debit)}
          </div>
        </div>
        <div className="stat-footer">
          <Receipt size={13} />
          <span>{debit_count} expense debit {debit_count === 1 ? 'entry' : 'entries'}</span>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="stat-card">
        <div>
          <div className="stat-card-header">
            <span className="stat-label">Savings Retention</span>
            <div className="stat-icon savings">
              <Percent size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {savingsRate}%
          </div>
        </div>
        <div className="stat-footer">
          <TrendingUp size={13} />
          <span>{total_credit > 0 ? `${savingsRate}% of income retained` : 'No income recorded yet'}</span>
        </div>
      </div>
    </div>
  );
}
