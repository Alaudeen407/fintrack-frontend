import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PieChart } from 'lucide-react';

const DEFAULT_MOCK_CATEGORIES = [
  { category: 'Money transfer', total: 2500, percentage: 40.2, color: '#7B61FF' }, // 40% $2,500 callout in image
  { category: 'Cafe & Restaurants', total: 1400, percentage: 22.5, color: '#C4B5FD' },
  { category: 'Rent', total: 950, percentage: 15.3, color: '#4B5262' },
  { category: 'Education', total: 650, percentage: 10.4, color: '#7E8494' },
  { category: 'Food & Groceries', total: 472, percentage: 7.6, color: '#B2B7C2' },
  { category: 'Others', total: 250, percentage: 4.0, color: '#8B5CF6' }
];

export default function FinSetStatisticsDonut({ summary, onShowDetails }) {
  const [viewType, setViewType] = useState('debit'); // 'debit' = Expence, 'credit' = Income
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const isDebit = viewType === 'debit';
  const hasLiveTransactions = Boolean(summary?.total_count && summary.total_count > 0);

  // Live data extraction
  const liveCategories = isDebit 
    ? (summary?.category_breakdown?.length ? summary.category_breakdown : summary?.all_time_category_breakdown || [])
    : (summary?.income_breakdown?.length ? summary.income_breakdown : summary?.all_time_income_breakdown || []);

  const liveTotal = isDebit 
    ? (summary?.month_debit || summary?.total_debit || 0)
    : (summary?.month_credit || summary?.total_credit || 0);

  // Decide categories and total: use live data if present, otherwise use reference mockup data
  let categories = [];
  let totalAmount = 6222.00; // Default exact mockup value: $6,222.00

  if (hasLiveTransactions && liveCategories.length > 0) {
    totalAmount = liveTotal;
    const palette = ['#7B61FF', '#C4B5FD', '#4B5262', '#7E8494', '#B2B7C2', '#8B5CF6', '#10B981', '#F59E0B'];
    categories = liveCategories.map((c, i) => ({
      category: c.category,
      total: Number(c.total) || 0,
      percentage: Number(c.percentage) || (totalAmount > 0 ? Number(((c.total / totalAmount) * 100).toFixed(1)) : 0),
      color: palette[i % palette.length]
    }));
  } else {
    categories = DEFAULT_MOCK_CATEGORIES;
    totalAmount = 6222.00;
  }

  // Format total
  const formattedTotal = totalAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const parts = formattedTotal.split('.');
  const integerPart = parts[0];
  const centsPart = `.${parts[1]}`;

  // Top category or hovered category for callout pill
  const activeIdx = hoveredIdx !== null ? hoveredIdx : 0;
  const activeCategory = categories[activeIdx] || categories[0];

  // SVG Geometry for Segmented Rounded Pill Donut ("Gridge / Gauge Effect")
  const size = 210;
  const center = size / 2;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2 - 4; // ~85px
  const circumference = 2 * Math.PI * radius; // ~534.07px

  // Clean uniform gap between capsule segments
  const gapPx = categories.length > 1 ? 12 : 0;
  const effectiveCircumference = circumference;

  let currentOffset = 0;
  const segments = categories.map((cat, idx) => {
    const rawLen = (cat.percentage / 100) * effectiveCircumference;
    // With strokeLinecap="round", the caps add strokeWidth (22px) visually
    // So nominal dash length is reduced by (strokeWidth + gapPx) to prevent overlap
    const dashLen = categories.length > 1 
      ? Math.max(2, rawLen - strokeWidth - gapPx)
      : circumference;

    const strokeDasharray = `${dashLen} ${circumference}`;
    const strokeDashoffset = -currentOffset;

    currentOffset += rawLen;

    return {
      ...cat,
      dashLen,
      strokeDasharray,
      strokeDashoffset,
      idx
    };
  });

  return (
    <div className="finset-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header matching exact mockup */}
        <div className="card-inner-header" style={{ marginBottom: '6px' }}>
          <span className="card-title-text">Statistics</span>
          <div className="stats-header-links">
            {/* Right pill: Expence v (toggles view) */}
            <button 
              className="dropdown-pill-sm" 
              onClick={() => setViewType(prev => prev === 'debit' ? 'credit' : 'debit')}
              title="Click to toggle Expence / Income"
              style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-light)' }}
            >
              <span>{isDebit ? 'Expence' : 'Income'}</span>
              <ChevronDown size={11} />
            </button>
            <button className="details-link" onClick={onShowDetails} title="View details">
              <span>Details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Subtitle matching exact mockup text */}
        <p className="stats-card-subtitle" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: '14px' }}>
          You have an increase of expenses in several categories this month
        </p>

        {/* Donut Chart with Gridge / Gauge Effect */}
        <div className="donut-wrapper" style={{ position: 'relative', width: size, height: size, margin: '8px auto' }}>
          <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: 'rotate(-85deg)', overflow: 'visible' }}
          >
            {/* Background subtle circular track ring (The Gridge Track) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
            />

            {/* Segmented Capsule Slices with Clean Pill Ends */}
            {segments.map((s, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={s.strokeDasharray}
                  strokeDashoffset={s.strokeDashoffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    cursor: 'pointer',
                    transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                    opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.4
                  }}
                />
              );
            })}
          </svg>

          {/* Floating Callout Pill on Top-Right (e.g. 40% ₹2,500) matching mockup */}
          {activeCategory && (
            <div 
              className="donut-callout-pill"
              style={{
                position: 'absolute',
                top: '12px',
                right: '4px',
                backgroundColor: 'var(--bg-card)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '4px 10px',
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {Math.round(activeCategory.percentage)}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 800 }}>
                ₹{Math.round(activeCategory.total).toLocaleString('en-IN')}
              </div>
            </div>
          )}

          {/* Center Info matching mockup: This month expence / ₹6,222.00 */}
          <div className="donut-center-info" style={{ pointerEvents: 'none', textAlign: 'center' }}>
            <div className="donut-center-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>
              This month expence
            </div>
            <div className="donut-center-value" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              <span>₹</span>{integerPart}<span className="cents" style={{ fontSize: '1.05rem', color: 'var(--text-light)', fontWeight: 600 }}>{centsPart}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Legend list (2 columns of 3 categories matching the mockup) */}
      <div 
        className="stats-legend-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px 12px', 
          marginTop: '16px' 
        }}
      >
        {categories.slice(0, 6).map((cat, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div 
              key={idx} 
              className="stat-legend-cell"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.45,
                transition: 'opacity 0.15s ease'
              }}
            >
              <span 
                className="stat-legend-dot"
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: cat.color, 
                  flexShrink: 0 
                }} 
              />
              <span 
                style={{ 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  fontSize: '0.74rem',
                  fontWeight: isHovered ? 700 : 500,
                  color: isHovered ? 'var(--text-main)' : 'var(--text-sub)'
                }} 
                title={`${cat.category}: ₹${cat.total.toLocaleString('en-IN')}`}
              >
                {cat.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
