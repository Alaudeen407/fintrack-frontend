import React from 'react';
import { 
  ChevronDown, 
  ArrowUp, 
  ArrowRightLeft, 
  LayoutGrid 
} from 'lucide-react';

export default function FinSetStatCards({ summary }) {
  // Use summary from database or default to exact mockup numbers
  const totalBalance = summary?.total_balance !== undefined ? summary.total_balance : 15700;
  const monthIncome = summary?.month_credit !== undefined ? summary.month_credit : 8500;
  const monthExpense = summary?.month_debit !== undefined ? summary.month_debit : 6222;

  const splitCurrency = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const parts = formatted.split('.');
    return {
      main: `$${parts[0]}`,
      cents: `.${parts[1]}`
    };
  };

  const balanceSplit = splitCurrency(totalBalance);
  const incomeSplit = splitCurrency(monthIncome);
  const expenseSplit = splitCurrency(monthExpense);

  return (
    <div className="stat-cards-row">
      {/* 1. Total balance */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Total balance</span>
          <div className="currency-select-pill">
            <span>USD</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{balanceSplit.main}</span>
          <span className="stat-main-cents">{balanceSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            <div className="pill-badge green">
              <ArrowUp size={11} strokeWidth={3} />
              <span>12.1%</span>
            </div>
            <div className="stat-comparison-text">
              You have extra <strong>$1,700</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>50 transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>15 categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Income */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Income</span>
          <div className="currency-select-pill">
            <span>USD</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{incomeSplit.main}</span>
          <span className="stat-main-cents">{incomeSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            <div className="pill-badge green">
              <ArrowUp size={11} strokeWidth={3} />
              <span>6.3%</span>
            </div>
            <div className="stat-comparison-text">
              You earn extra <strong>$500</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>27 transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>6 categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Expense */}
      <div className="finset-card">
        <div className="stat-card-top">
          <span className="stat-card-title">Expense</span>
          <div className="currency-select-pill">
            <span>USD</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="stat-main-number">
          <span>{expenseSplit.main}</span>
          <span className="stat-main-cents">{expenseSplit.cents}</span>
        </div>

        <div className="stat-card-bottom">
          <div className="stat-change-wrap">
            <div className="pill-badge red">
              <ArrowUp size={11} strokeWidth={3} />
              <span>2.4%</span>
            </div>
            <div className="stat-comparison-text">
              You spent extra <strong>$1,222</strong><br />compared to last month
            </div>
          </div>

          <div className="stat-meta-list">
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <ArrowRightLeft size={10} />
              </div>
              <span>23 transactions</span>
            </div>
            <div className="stat-meta-item">
              <div className="meta-icon-bubble">
                <LayoutGrid size={10} />
              </div>
              <span>9 categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
