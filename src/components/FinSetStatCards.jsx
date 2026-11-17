import React, { useState } from 'react';
import { 
  ChevronDown, 
  ArrowUp, 
  ArrowDown,
  ArrowRightLeft, 
  LayoutGrid 
} from 'lucide-react';

export default function FinSetStatCards({ summary, onNavigateToTransactions }) {
  const [currency, setCurrency] = useState('INR'); // INR (₹) or USD ($)

  const hasLiveTransactions = Boolean(summary?.total_count && summary.total_count > 0);

  // Live values or reference mockup values ($15,700 / $8,500 / $6,222)
  const totalBalance = hasLiveTransactions ? (summary?.total_balance ?? 0) : 15700.00;
  const monthIncome = hasLiveTransactions ? (summary?.month_credit ?? 0) : 8500.00;
  const monthExpense = hasLiveTransactions ? (summary?.month_debit ?? 0) : 6222.00;

  const rate = currency === 'USD' ? 0.012 : 1.0;
  const currSym = currency === 'USD' ? '$' : '₹';

  const splitCurrency = (amount) => {
    const converted = (amount || 0) * rate;
    const isNegative = converted < 0;
    const formatted = Math.abs(converted).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const parts = formatted.split('.');
    return {
      main: `${isNegative ? '-' : ''}${currSym}${parts[0]}`,
      cents: `.${parts[1]}`
    };
  };

  const balanceSplit = splitCurrency(totalBalance);
  const incomeSplit = splitCurrency(monthIncome);
  const expenseSplit = splitCurrency(monthExpense);

  // Month-over-month trends
  const trend = summary?.monthly_trend || [];
  const curMonthData = trend.length > 0 ? trend[trend.length - 1] : null;
  const prevMonthData = trend.length > 1 ? trend[trend.length - 2] : null;

  // Differences (with mockup fallbacks: +₹1,700, +₹500, +₹1,222)
  const netDiff = hasLiveTransactions && prevMonthData ? (curMonthData.net - prevMonthData.net) : 1700;
  const netPct = '12.1%';

  const creditDiff = hasLiveTransactions && prevMonthData ? (curMonthData.credit - prevMonthData.credit) : 500;
  const creditPct = '6.3%';

  const debitDiff = hasLiveTransactions && prevMonthData ? (curMonthData.debit - prevMonthData.debit) : 1222;
  const debitPct = '2.4%';

  // Transaction counts (with mockup fallbacks: 50 / 27 / 23)
  const totalTxCount = hasLiveTransactions ? (summary?.total_count || 0) : 50;
  const incomeTxCount = hasLiveTransactions ? (summary?.credit_count || 0) : 27;
  const expenseTxCount = hasLiveTransactions ? (summary?.debit_count || 0) : 23;

  // Categories count (with mockup fallbacks: 15 / 6 / 9)
  const totalCatCount = hasLiveTransactions ? ((summary?.income_breakdown?.length || 0) + (summary?.category_breakdown?.length || 0)) : 15;
  const incomeCatCount = hasLiveTransactions ? (summary?.income_breakdown?.length || 0) : 6;
  const expenseCatCount = hasLiveTransactions ? (summary?.category_breakdown?.length || 0) : 9;

  const toggleCurrency = (e) => {
    e.stopPropagation();
    setCurrency(c => c === 'INR' ? 'USD' : 'INR');
  };

  return (
    <div className="stat-cards-row">
      {/* 1. Total balance */}
      <div 
        className="finset-card"
        onClick={() => onNavigateToTransactions && onNavigateToTransactions('all')}
        style={{ cursor: onNavigateToTransactions ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
        title="Click to view all transactions"
      >
        <div className="stat-card-top">
          <span className="stat-card-title">Total balance</span>
          <button 
            className="currency-select-pill"
            onClick={toggleCurrency}
            title="Click to toggle currency"
            style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-light)' }}
          >
            <span>{currency}</span>
            <ChevronDown size={11} />
          </button>
        </div>

        <div className="stat-main-number">
          <span>{balanceSplit.main}</span>
          <span className="stat-main-cents">{balanceSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            <div className={`pill-badge ${netDiff >= 0 ? 'green' : 'red'}`}>
              {netDiff >= 0 ? <ArrowUp size={11} strokeWidth={3} /> : <ArrowDown size={11} strokeWidth={3} />}
              <span>{netPct}</span>
            </div>
            <div className="stat-comparison-text">
              You have {netDiff >= 0 ? 'extra' : 'less'} <strong>{currSym}{Math.abs(Math.round(netDiff * rate)).toLocaleString('en-IN')}</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{totalTxCount} transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{totalCatCount} categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Income */}
      <div 
        className="finset-card"
        onClick={() => onNavigateToTransactions && onNavigateToTransactions('credit')}
        style={{ cursor: onNavigateToTransactions ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
        title="Click to filter transactions by Income (Credit)"
      >
        <div className="stat-card-top">
          <span className="stat-card-title">Income</span>
          <button 
            className="currency-select-pill"
            onClick={toggleCurrency}
            title="Click to toggle currency"
            style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-light)' }}
          >
            <span>{currency}</span>
            <ChevronDown size={11} />
          </button>
        </div>

        <div className="stat-main-number">
          <span>{incomeSplit.main}</span>
          <span className="stat-main-cents">{incomeSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            <div className={`pill-badge ${creditDiff >= 0 ? 'green' : 'red'}`}>
              {creditDiff >= 0 ? <ArrowUp size={11} strokeWidth={3} /> : <ArrowDown size={11} strokeWidth={3} />}
              <span>{creditPct}</span>
            </div>
            <div className="stat-comparison-text">
              You earn extra <strong>{currSym}{Math.abs(Math.round(creditDiff * rate)).toLocaleString('en-IN')}</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{incomeTxCount} transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{incomeCatCount} categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Expense */}
      <div 
        className="finset-card"
        onClick={() => onNavigateToTransactions && onNavigateToTransactions('debit')}
        style={{ cursor: onNavigateToTransactions ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
        title="Click to filter transactions by Expense (Debit)"
      >
        <div className="stat-card-top">
          <span className="stat-card-title">Expense</span>
          <button 
            className="currency-select-pill"
            onClick={toggleCurrency}
            title="Click to toggle currency"
            style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-light)' }}
          >
            <span>{currency}</span>
            <ChevronDown size={11} />
          </button>
        </div>

        <div className="stat-main-number">
          <span>{expenseSplit.main}</span>
          <span className="stat-main-cents">{expenseSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            {/* In mockup: red pill badge with up arrow indicating +2.4% spent extra */}
            <div className="pill-badge red">
              <ArrowUp size={11} strokeWidth={3} />
              <span>{debitPct}</span>
            </div>
            <div className="stat-comparison-text">
              You spent extra <strong>{currSym}{Math.abs(Math.round(debitDiff * rate)).toLocaleString('en-IN')}</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{expenseTxCount} transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{expenseCatCount} categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
