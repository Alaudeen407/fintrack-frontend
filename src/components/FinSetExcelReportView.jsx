import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers, 
  Table, 
  TrendingUp,
  Receipt,
  X,
  Clock
} from 'lucide-react';
import { fetchReportPreview, getExcelReportUrl } from '../api';

const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const YEAR_OPTIONS = ['2024', '2025', '2026', '2027', '2028'];

export default function FinSetExcelReportView({ onShowToast }) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSheetTab, setActiveSheetTab] = useState('ledger'); // default to 'ledger' so transactions are shown first!
  
  // Clean Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState('month'); // 'month' or 'all'
  const [selectedMonthNum, setSelectedMonthNum] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
  const [selectedYearNum, setSelectedYearNum] = useState(String(currentDate.getFullYear()));

  useEffect(() => {
    loadPreview(selectedMonth);
  }, [selectedMonth]);

  const loadPreview = async (month) => {
    setIsLoading(true);
    try {
      const data = await fetchReportPreview(month);
      setPreview(data);
      if (!selectedMonth && data.month) {
        setSelectedMonth(data.month);
        if (data.month.includes('-')) {
          const [y, m] = data.month.split('-');
          setSelectedYearNum(y);
          setSelectedMonthNum(m);
        }
      }
    } catch (err) {
      console.error('Failed to load report preview', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (selectedMonth && selectedMonth.includes('-')) {
      const [y, m] = selectedMonth.split('-');
      setSelectedYearNum(y);
      setSelectedMonthNum(m);
      setDownloadMode('month');
    } else if (selectedMonth === 'all') {
      setDownloadMode('all');
    } else {
      setDownloadMode('month');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDownload = () => {
    const targetPeriod = downloadMode === 'all' ? 'all' : `${selectedYearNum}-${selectedMonthNum}`;
    const url = getExcelReportUrl(targetPeriod);
    window.open(url, '_blank');
    setIsModalOpen(false);
    
    // Sync active preview to the exported month
    setSelectedMonth(targetPeriod);

    if (onShowToast) {
      const monthLabel = MONTH_OPTIONS.find(m => m.value === selectedMonthNum)?.label || '';
      const label = downloadMode === 'all' ? 'Whole Data (All-Time)' : `${monthLabel} ${selectedYearNum}`;
      onShowToast(`Downloading Excel report for ${label}...`, 'success');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const formatMonthName = (monthStr) => {
    if (!monthStr || monthStr === 'all') return 'All-Time (Whole Data)';
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return '12:00:00 PM';
    const parts = String(createdAt).split(' ');
    if (parts.length > 1) {
      const timePart = parts[1];
      const timeSub = timePart.split('.')[0];
      const tPieces = timeSub.split(':');
      if (tPieces.length >= 2) {
        const h = parseInt(tPieces[0], 10);
        const m = tPieces[1];
        const s = tPieces[2] || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 || 12;
        return `${String(hour12).padStart(2, '0')}:${m}:${s} ${ampm}`;
      }
    }
    return '12:00:00 PM';
  };

  const {
    total_income = 0,
    total_expense = 0,
    net_savings = 0,
    income_count = 0,
    expense_count = 0,
    total_count = 0,
    category_summary = [],
    transactions = []
  } = preview || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Bar */}
      <div className="tx-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#E8F5E9',
            color: '#107C41',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Monthly Excel Sheet Report
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Export financial records to formatted Microsoft Excel (.xlsx) workbooks
            </span>
          </div>
        </div>

        {/* Download Button (opens clean month popup modal) */}
        <div>
          <button
            onClick={handleOpenModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#107C41',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '10px 22px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 124, 65, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Download size={16} />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 3 Summary KPI Cards */}
      <div className="stat-cards-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {/* Total Income */}
        <div className="finset-card">
          <div className="stat-card-top">
            <span className="stat-card-title">Report Income (Credit)</span>
            <div className="pill-badge green">
              <ArrowDownLeft size={11} strokeWidth={2.5} />
              <span>{income_count} credits</span>
            </div>
          </div>
          <div className="stat-main-number" style={{ color: '#10B981', marginTop: '4px' }}>
            +{formatCurrency(total_income)}
          </div>
          <div className="stat-card-bottom">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Total money in for {formatMonthName(selectedMonth)}
            </span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="finset-card">
          <div className="stat-card-top">
            <span className="stat-card-title">Report Expenses (Debit)</span>
            <div className="pill-badge red">
              <ArrowUpRight size={11} strokeWidth={2.5} />
              <span>{expense_count} debits</span>
            </div>
          </div>
          <div className="stat-main-number" style={{ color: '#F43F5E', marginTop: '4px' }}>
            -{formatCurrency(total_expense)}
          </div>
          <div className="stat-card-bottom">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Total money out for {formatMonthName(selectedMonth)}
            </span>
          </div>
        </div>

        {/* Net Flow */}
        <div className="finset-card">
          <div className="stat-card-top">
            <span className="stat-card-title">Net Cash Flow</span>
            <div className={`pill-badge ${net_savings >= 0 ? 'green' : 'red'}`}>
              <TrendingUp size={11} />
              <span>{net_savings >= 0 ? 'Surplus' : 'Deficit'}</span>
            </div>
          </div>
          <div className="stat-main-number" style={{ color: net_savings >= 0 ? 'var(--text-main)' : '#F43F5E', marginTop: '4px' }}>
            {formatCurrency(net_savings)}
          </div>
          <div className="stat-card-bottom">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Net earnings retained
            </span>
          </div>
        </div>
      </div>

      {/* Excel Structure Info Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-card)',
        padding: '16px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--finset-purple-light)', color: 'var(--finset-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Table size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Sheet 1: Transactions Ledger</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Complete itemized rows with Transaction Date & Time</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--finset-purple-light)', color: 'var(--finset-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Layers size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Sheet 2: Financial Summary</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High-level KPI metrics & category breakdown table</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--finset-purple-light)', color: 'var(--finset-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Receipt size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Sheet 3: Monthly Bills</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recurring bills schedule, due days & payment status</div>
          </div>
        </div>
      </div>

      {/* Live Workbook Preview Card */}
      <div className="finset-card">
        <div className="card-inner-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={16} color="#107C41" />
            <span className="card-title-text">
              Live Excel Preview: <strong style={{ color: 'var(--finset-purple)' }}>{formatMonthName(selectedMonth)}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Sheet Selector Tabs */}
            <div className="tx-type-tabs" style={{ padding: '2px' }}>
              <button
                className={`tx-type-tab ${activeSheetTab === 'ledger' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => setActiveSheetTab('ledger')}
              >
                Transactions Ledger ({transactions.length})
              </button>
              <button
                className={`tx-type-tab ${activeSheetTab === 'summary' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => setActiveSheetTab('summary')}
              >
                Category Summary ({category_summary.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Transactions Ledger Preview (with Transaction Date & Time) */}
        {activeSheetTab === 'ledger' && (
          <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
            <table className="finset-table">
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No transactions recorded for this period.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {tx.date}
                      </td>
                      <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} color="var(--text-light)" />
                          {formatTime(tx.created_at)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-finset ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                          {tx.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--text-sub)' }}>{tx.category}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tx.description}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <span className={`amount-text ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tx.payment_method}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Category Summary Preview */}
        {activeSheetTab === 'summary' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="finset-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Total Amount</th>
                  <th style={{ textAlign: 'center' }}>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {category_summary.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No data found for this period.
                    </td>
                  </tr>
                ) : (
                  category_summary.map((cat, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.category}</td>
                      <td>
                        <span className={`badge-finset ${cat.type === 'credit' ? 'credit' : 'debit'}`}>
                          {cat.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(cat.total)}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-sub)' }}>
                        {cat.count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== CLEAN MONTH & YEAR POPUP MODAL ==================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div 
            className="modal-finset-content" 
            style={{ maxWidth: '440px', width: '100%' }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-finset-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#E8F5E9',
                  color: '#107C41',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Download Excel Report
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Select month and year or download whole datas
                  </span>
                </div>
              </div>
              <button className="collapse-btn" onClick={handleCloseModal}>
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-finset-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Option 1: Dropdown to Select Month and Year */}
              <div
                onClick={() => setDownloadMode('month')}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: downloadMode === 'month' ? '2px solid #107C41' : '1px solid var(--border-light)',
                  backgroundColor: downloadMode === 'month' ? 'rgba(16, 124, 65, 0.05)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="radio"
                    name="downloadMode"
                    checked={downloadMode === 'month'}
                    onChange={() => setDownloadMode('month')}
                    style={{ accentColor: '#107C41', width: 17, height: 17, cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Select Month and Year
                    </span>
                    <span style={{ display: 'block', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      Download statement for a specific month
                    </span>
                  </div>
                </div>

                {/* Dropdowns */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr',
                  gap: '12px',
                  paddingLeft: '27px'
                }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Month
                    </label>
                    <select
                      className="finset-input"
                      value={selectedMonthNum}
                      onChange={(e) => {
                        setSelectedMonthNum(e.target.value);
                        setDownloadMode('month');
                      }}
                      disabled={downloadMode !== 'month'}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label} ({m.value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Year
                    </label>
                    <select
                      className="finset-input"
                      value={selectedYearNum}
                      onChange={(e) => {
                        setSelectedYearNum(e.target.value);
                        setDownloadMode('month');
                      }}
                      disabled={downloadMode !== 'month'}
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Option 2: Option to Download Whole Datas */}
              <div
                onClick={() => setDownloadMode('all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: downloadMode === 'all' ? '2px solid #107C41' : '1px solid var(--border-light)',
                  backgroundColor: downloadMode === 'all' ? 'rgba(16, 124, 65, 0.05)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="radio"
                  name="downloadMode"
                  checked={downloadMode === 'all'}
                  onChange={() => setDownloadMode('all')}
                  style={{ accentColor: '#107C41', width: 17, height: 17, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Download Whole Data
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Export all transactions across all dates and months
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-finset-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="pill-btn-white" 
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleConfirmDownload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#107C41',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '10px 22px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 124, 65, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <Download size={15} />
                <span>
                  {downloadMode === 'all' 
                    ? 'Download Whole Data (.xlsx)' 
                    : `Download Excel (${MONTH_OPTIONS.find(m => m.value === selectedMonthNum)?.label || ''} ${selectedYearNum})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}