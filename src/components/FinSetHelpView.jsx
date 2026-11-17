import React, { useState } from 'react';
import { 
  HelpCircle, 
  Keyboard, 
  ShieldCheck, 
  FileSpreadsheet, 
  TrendingUp, 
  CalendarClock, 
  PieChart, 
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Zap
} from 'lucide-react';

export default function FinSetHelpView({ onSelectTab, onOpenAddModal }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const shortcuts = [
    { key: 'N', description: 'Quickly open the Record Transaction modal' },
    { key: 'T', description: 'Jump to Transactions Ledger view' },
    { key: 'B', description: 'Jump to Monthly Bills & Calendar view' },
    { key: 'A', description: 'Jump to Analytics & Charts view' },
    { key: 'D', description: 'Jump to Dashboard view' },
    { key: 'E', description: 'Jump to Excel Reports view' },
    { key: 'S', description: 'Jump to Settings & Appearance view' },
    { key: 'H', description: 'Open this Help & Guide view' },
    { key: 'Esc', description: 'Close any active popup or modal' }
  ];

  const faqs = [
    {
      q: 'How does multi-user data isolation work in FinSet?',
      a: 'Every user account is assigned an individual user ID in SQLite and MongoDB Atlas. When you log in, all transaction records, recurring bills, summary statistics, charts, and Excel exports are strictly filtered by your user ID. No other user can access, see, or modify your personal financial data.'
    },
    {
      q: 'How are percentages in the Statistics Donut chart calculated?',
      a: 'Each category percentage is computed dynamically as (Category Amount / Total Debit or Credit) * 100 with 1 decimal precision. You can toggle between Expense and Income, as well as switch between Current Month and All-Time perspectives.'
    },
    {
      q: 'What is the "Comparing of budget and expence" chart?',
      a: 'This chart compares your monthly expenses against budgeted income for each month. If your expenses exceed your budget in any month, FinSet displays a striped pill and calculates the exact excess variance in ₹ and %.'
    },
    {
      q: 'How does Monthly Bill payment work?',
      a: 'When you click "Mark as Paid" on any monthly bill, FinSet automatically updates the bill status to paid in both SQLite and MongoDB Atlas, records an automatic debit expense transaction in your ledger, and adjusts your cash flow.'
    },
    {
      q: 'What formats can I export my reports in?',
      a: 'You can export your complete financial data in formatted Microsoft Excel (.xlsx) workbooks containing multiple sheets (Transactions Ledger, Category Breakdown, and Monthly Bills Schedule) or download clean CSV files.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero Banner */}
      <div className="finset-card" style={{
        background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(123, 97, 255, 0.25)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#7B61FF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={20} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                FinSet Pro Help & Guide Center
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', margin: 0, maxWidth: '620px', lineHeight: 1.5 }}>
              Everything you need to master your expense tracking, budget comparisons, statistics donut charts, monthly recurring bills, and multi-sheet Excel exports.
            </p>
          </div>

          <button 
            className="pill-btn-purple"
            onClick={onOpenAddModal}
            style={{ padding: '10px 20px', fontSize: '0.86rem' }}
          >
            <Zap size={15} />
            <span>Record New Transaction</span>
          </button>
        </div>
      </div>

      {/* Grid: Keyboard Shortcuts + Quick Feature Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Keyboard Shortcuts Card */}
        <div className="finset-card">
          <div className="card-inner-header" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Keyboard size={18} color="var(--finset-purple)" />
              <span className="card-title-text">Keyboard Shortcuts & Function Keys</span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Press these keys anytime while using FinSet to trigger quick actions:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {shortcuts.map((s, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>{s.description}</span>
                <kbd style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--finset-purple)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                }}>
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Map */}
        <div className="finset-card">
          <div className="card-inner-header" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#10B981" />
              <span className="card-title-text">Core Application Capabilities</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div 
              onClick={() => onSelectTab('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={16} color="#7B61FF" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Analytics & Spline Curves</div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Daily balance progression vs last month</div>
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onSelectTab('transactions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Transactions Ledger</div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Credit and Debit search, filter & CSV export</div>
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onSelectTab('bills')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarClock size={16} color="#F59E0B" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Monthly Bills Calendar</div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Calendar day highlighting & 1-click pay</div>
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onSelectTab('excel-report')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={16} color="#107C41" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Multi-Sheet Excel Reports</div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Formatted .xlsx workbooks with formulas</div>
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="finset-card">
        <div className="card-inner-header" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} color="var(--finset-purple)" />
            <span className="card-title-text">Frequently Asked Questions</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((f, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-app)'
                }}
              >
                <div 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>{f.q}</span>
                  <ChevronRight 
                    size={15} 
                    style={{ 
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      color: 'var(--text-muted)'
                    }} 
                  />
                </div>
                {isOpen && (
                  <div style={{
                    padding: '0 16px 14px 16px',
                    fontSize: '0.80rem',
                    color: 'var(--text-sub)',
                    lineHeight: 1.5,
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '10px',
                    backgroundColor: 'var(--bg-card)'
                  }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
