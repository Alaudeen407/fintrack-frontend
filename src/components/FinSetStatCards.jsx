import React from 'react';
import { 
  ChevronDown, 
  ArrowUp, 
  ArrowDown,
  ArrowRightLeft, 
  LayoutGrid 
} from 'lucide-react';

export default function FinSetStatCards({ summary }) {
  const totalBalance = summary?.total_balance ?? 0;
  const monthIncome = summary?.month_credit ?? 0;
  const monthExpense = summary?.month_debit ?? 0;

  const splitCurrency = (amount) => {
    const isNegative = (amount || 0) < 0;
    const formatted = Math.abs(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const parts = formatted.split('.');
    return {
      main: `${isNegative ? '-' : ''}₹${parts[0]}`,
      cents: `.${parts[1]}`
    };
  };

  const balanceSplit = splitCurrency(totalBalance);
  const incomeSplit = splitCurrency(monthIncome);
  const expenseSplit = splitCurrency(monthExpense);

  // Month-over-month trend calculations
  const trend = summary?.monthly_trend || [];
  const curMonthData = trend.length > 0 ? trend[trend.length - 1] : null;
  const prevMonthData = trend.length > 1 ? trend[trend.length - 2] : null;

  // 1. Balance net difference
  const curNet = curMonthData?.net ?? totalBalance;
  const prevNet = prevMonthData?.net ?? 0;
  const hasPrevMonth = Boolean(prevMonthData);
  const netDiff = curNet - prevNet;

  // 2. Income change
  const curCredit = curMonthData?.credit ?? monthIncome;
  const prevCredit = prevMonthData?.credit ?? 0;
  const creditDiff = curCredit - prevCredit;
  const creditPct = prevCredit > 0 ? Math.abs((creditDiff / prevCredit) * 100).toFixed(1) : (curCredit > 0 ? '100' : '0');

  // 3. Expense change
  const curDebit = curMonthData?.debit ?? monthExpense;
  const prevDebit = prevMonthData?.debit ?? 0;
  const debitDiff = curDebit - prevDebit;
  const debitPct = prevDebit > 0 ? Math.abs((debitDiff / prevDebit) * 100).toFixed(1) : (curDebit > 0 ? '100' : '0');

  // Counts
  const totalTxCount = summary?.total_count || 0;
  const incomeTxCount = summary?.credit_count || 0;
  const expenseTxCount = summary?.debit_count || 0;

  const incomeCatCount = summary?.income_breakdown?.length || 0;
  const expenseCatCount = summary?.category_breakdown?.length || 0;
  const totalCatCount = incomeCatCount + expenseCatCount;

  return (
    <div className="stat-cards-row">
      {/* 1. Total balance */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Total balance</span>
          <div className="currency-select-pill">
            <span>INR</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{balanceSplit.main}</span>
          <span className="stat-main-cents">{balanceSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            {hasPrevMonth ? (
              <>
                <div className={`pill-badge ${netDiff >= 0 ? 'green' : 'red'}`}>
                  {netDiff >= 0 ? <ArrowUp size={11} strokeWidth={3} /> : <ArrowDown size={11} strokeWidth={3} />}
                  <span>₹{Math.abs(netDiff).toLocaleString('en-IN')}</span>
                </div>
                <div className="stat-comparison-text">
                  You have {netDiff >= 0 ? 'extra' : 'less'} <strong>₹{Math.abs(netDiff).toLocaleString('en-IN')}</strong><br />compared to last month
                </div>
              </>
            ) : (
              <div className="stat-comparison-text" style={{ color: 'var(--text-muted)' }}>
                All-time net balance<br />across all recorded accounts
              </div>
            )}
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{totalTxCount} transaction{totalTxCount === 1 ? '' : 's'}</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{totalCatCount} categor{totalCatCount === 1 ? 'y' : 'ies'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Income */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Income</span>
          <div className="currency-select-pill">
            <span>INR</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{incomeSplit.main}</span>
          <span className="stat-main-cents">{incomeSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            {hasPrevMonth ? (
              <>
                <div className={`pill-badge ${creditDiff >= 0 ? 'green' : 'red'}`}>
                  {creditDiff >= 0 ? <ArrowUp size={11} strokeWidth={3} /> : <ArrowDown size={11} strokeWidth={3} />}
                  <span>{creditPct}%</span>
                </div>
                <div className="stat-comparison-text">
                  You earned {creditDiff >= 0 ? 'extra' : 'less'} <strong>₹{Math.abs(creditDiff).toLocaleString('en-IN')}</strong><br />compared to last month
                </div>
              </>
            ) : (
              <div className="stat-comparison-text" style={{ color: 'var(--text-muted)' }}>
                Total income credited<br />in the current period
              </div>
            )}
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{incomeTxCount} transaction{incomeTxCount === 1 ? '' : 's'}</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{incomeCatCount} categor{incomeCatCount === 1 ? 'y' : 'ies'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Expense */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Expense</span>
          <div className="currency-select-pill">
            <span>INR</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{expenseSplit.main}</span>
          <span className="stat-main-cents">{expenseSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            {hasPrevMonth ? (
              <>
                <div className={`pill-badge ${debitDiff <= 0 ? 'green' : 'red'}`}>
                  {debitDiff <= 0 ? <ArrowDown size={11} strokeWidth={3} /> : <ArrowUp size={11} strokeWidth={3} />}
                  <span>{debitPct}%</span>
                </div>
                <div className="stat-comparison-text">
                  {debitDiff <= 0 ? (
                    <>You saved <strong>₹{Math.abs(debitDiff).toLocaleString('en-IN')}</strong><br />compared to last month</>
                  ) : (
                    <>You spent extra <strong>₹{Math.abs(debitDiff).toLocaleString('en-IN')}</strong><br />compared to last month</>
                  )}
                </div>
              </>
            ) : (
              <div className="stat-comparison-text" style={{ color: 'var(--text-muted)' }}>
                Total expenses debited<br />in the current period
              </div>
            )}
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>{expenseTxCount} transaction{expenseTxCount === 1 ? '' : 's'}</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>{expenseCatCount} categor{expenseCatCount === 1 ? 'y' : 'ies'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
