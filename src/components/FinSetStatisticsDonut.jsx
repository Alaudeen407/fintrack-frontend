import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PieChart } from 'lucide-react';

const PALETTE = [
  '#7B61FF', // Primary purple
  '#C4B5FD', // Lavender
  '#4B5262', // Dark slate
  '#F59E0B', // Amber
  '#10B981', // Emerald green
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#7E8494', // Muted slate
  '#B2B7C2'  // Light grey
];

export default function FinSetStatisticsDonut({ summary, onShowDetails }) {
  const [viewType, setViewType] = useState('debit'); // 'debit' = Expense, 'credit' = Income
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const isDebit = viewType === 'debit';
  const categoriesRaw = isDebit 
    ? (summary?.category_breakdown || []) 
    : (summary?.income_breakdown || []);

  const totalAmount = isDebit 
    ? (summary?.month_debit ?? 0) 
    : (summary?.month_credit ?? 0);

  // Split formatted total into integer and decimal cents
  const formattedTotal = totalAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const parts = formattedTotal.split('.');
  const integerPart = parts[0];
  const centsPart = `.${parts[1]}`;

  // Assign colors to categories
  const categories = categoriesRaw.map((cat, idx) => ({
    ...cat,
    color: PALETTE[idx % PALETTE.length]
  }));

  // SVG Donut geometry
  const size = 210;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius; // ~603.18

  // Calculate cumulative offsets
  let runningOffset = 0;
  const segments = categories.map((cat) => {
    const pct = Math.max(0, cat.percentage || 0);
    const seg = {
      ...cat,
      pct,
      offset: runningOffset,
      color: cat.color
    };
    runningOffset += pct;
    return seg;
  });

  // Top category for callout pill
  const topCategory = categories.length > 0 ? categories[0] : null;

  return (
    <div className="finset-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div className="card-inner-header" style={{ marginBottom: '8px' }}>
          <span className="card-title-text">Statistics</span>
          <div className="stats-header-links">
            <button 
              className="dropdown-pill-sm" 
              onClick={() => setViewType(prev => prev === 'debit' ? 'credit' : 'debit')}
              title="Click to toggle between Expense and Income breakdown"
              style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-light)' }}
            >
              <span>{isDebit ? 'Expense' : 'Income'}</span>
              <ChevronDown size={11} />
            </button>
            <button className="details-link" onClick={onShowDetails} title="View full report">
              <span>Details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="stats-card-subtitle">
          {categories.length > 0 
            ? `Breakdown of current month ${isDebit ? 'expenses' : 'income'} across ${categories.length} categories`
            : `No ${isDebit ? 'expenses' : 'income'} recorded for the current month yet`}
        </p>

        {/* Donut Chart with Floating Callout */}
        <div className="donut-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-70 ${size / 2} ${size / 2})`}>
              {/* Baseline background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#F0F2F7"
                strokeWidth={strokeWidth}
              />

              {/* Data segments */}
              {segments.map((s, idx) => {
                const isHovered = hoveredIdx === idx;
                const dashLen = Math.max(1, (s.pct / 100) * circumference - (segments.length > 1 ? 4 : 0));
                const strokeDasharray = `${dashLen} ${circumference}`;
                const strokeDashoffset = -((s.offset / 100) * circumference);

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Callout badge on top right for top category */}
          {topCategory && (
            <div className="donut-callout-pill" style={{ pointerEvents: 'none' }}>
              <span style={{ fontSize: '0.62rem', color: '#8C919D', fontWeight: 600 }}>{topCategory.percentage}%</span>
              <span style={{ fontSize: '0.78rem', color: '#14171A', fontWeight: 800 }}>₹{Math.round(topCategory.total).toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Center Info */}
          <div className="donut-center-info">
            <div className="donut-center-label">This month {isDebit ? 'expense' : 'income'}</div>
            <div className="donut-center-value">
              <span>₹</span>{integerPart}<span className="cents">{centsPart}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Legend list */}
      <div className="stats-legend-grid">
        {categories.length > 0 ? (
          categories.slice(0, 6).map((cat, idx) => (
            <div 
              key={idx} 
              className="stat-legend-cell"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer', opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.45 }}
            >
              <span 
                className="stat-legend-dot"
                style={{ backgroundColor: cat.color }} 
              />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.72rem' }} title={`${cat.category}: ₹${cat.total.toLocaleString('en-IN')}`}>
                {cat.category} ({cat.percentage}%)
              </span>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '12px 0' }}>
            <PieChart size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom', opacity: 0.5 }} />
            No categories recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
