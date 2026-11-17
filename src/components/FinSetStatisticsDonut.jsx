import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PieChart, Calendar, RefreshCw } from 'lucide-react';

const PALETTE = [
  '#7B61FF', // Primary purple
  '#10B981', // Emerald green
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#C4B5FD', // Lavender
  '#4B5262', // Dark slate
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#7E8494'  // Slate
];

export default function FinSetStatisticsDonut({ summary, onShowDetails }) {
  const [viewType, setViewType] = useState('debit'); // 'debit' = Expense, 'credit' = Income
  const [period, setPeriod] = useState('month'); // 'month' or 'all'
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const isDebit = viewType === 'debit';
  const isMonth = period === 'month';

  // Determine categories raw data
  let categoriesRaw = [];
  let totalAmount = 0;

  if (isMonth) {
    categoriesRaw = isDebit
      ? (summary?.category_breakdown || [])
      : (summary?.income_breakdown || []);
    totalAmount = isDebit
      ? (summary?.month_debit ?? 0)
      : (summary?.month_credit ?? 0);

    // Auto-fallback to all-time if current month is empty but all-time data exists
    if (categoriesRaw.length === 0) {
      const allTimeFallback = isDebit
        ? (summary?.all_time_category_breakdown || [])
        : (summary?.all_time_income_breakdown || []);
      const allTimeTotal = isDebit
        ? (summary?.total_debit ?? 0)
        : (summary?.total_credit ?? 0);
      if (allTimeFallback.length > 0) {
        categoriesRaw = allTimeFallback;
        totalAmount = allTimeTotal;
      }
    }
  } else {
    categoriesRaw = isDebit
      ? (summary?.all_time_category_breakdown || [])
      : (summary?.all_time_income_breakdown || []);
    totalAmount = isDebit
      ? (summary?.total_debit ?? 0)
      : (summary?.total_credit ?? 0);
  }

  // Calculate percentages strictly against totalAmount with 1 decimal precision
  const safeTotal = totalAmount > 0 
    ? totalAmount 
    : categoriesRaw.reduce((acc, c) => acc + (c.total || 0), 0);

  const categories = categoriesRaw.map((cat, idx) => {
    const amount = Number(cat.total) || 0;
    const computedPct = safeTotal > 0 ? (amount / safeTotal) * 100 : 0;
    const percentage = Number(computedPct.toFixed(1));
    return {
      ...cat,
      total: amount,
      percentage,
      color: PALETTE[idx % PALETTE.length]
    };
  });

  // Split formatted total into integer and decimal cents
  const formattedTotal = safeTotal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const parts = formattedTotal.split('.');
  const integerPart = parts[0];
  const centsPart = `.${parts[1]}`;

  // Active highlighted category (hover takes precedence, then selected, else top category)
  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const activeCategory = activeIdx !== null && categories[activeIdx] 
    ? categories[activeIdx] 
    : (categories.length > 0 ? categories[0] : null);

  // Geometry for SVG Donut
  const size = 210;
  const center = size / 2;
  const outerR = 92;
  const innerR = 74;
  const gapAngleDeg = categories.length > 1 ? 2.5 : 0; // Small clean gap between slices

  // Calculate slice angles in radians
  let currentAngleDeg = -90; // Start at 12 o'clock
  const slices = categories.map((cat, idx) => {
    const sliceAngleDeg = Math.max(0.5, (cat.percentage / 100) * 360);
    const startAngleDeg = currentAngleDeg + (gapAngleDeg / 2);
    const endAngleDeg = currentAngleDeg + sliceAngleDeg - (gapAngleDeg / 2);
    currentAngleDeg += sliceAngleDeg;

    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;

    // Outer arc
    const x1 = center + outerR * Math.cos(startRad);
    const y1 = center + outerR * Math.sin(startRad);
    const x2 = center + outerR * Math.cos(endRad);
    const y2 = center + outerR * Math.sin(endRad);

    // Inner arc
    const x3 = center + innerR * Math.cos(endRad);
    const y3 = center + innerR * Math.sin(endRad);
    const x4 = center + innerR * Math.cos(startRad);
    const y4 = center + innerR * Math.sin(startRad);

    const largeArc = sliceAngleDeg > 180 ? 1 : 0;

    let pathData = '';
    if (categories.length === 1 && cat.percentage >= 99.5) {
      // Full single slice donut
      pathData = `
        M ${center} ${center - outerR}
        A ${outerR} ${outerR} 0 1 0 ${center} ${center + outerR}
        A ${outerR} ${outerR} 0 1 0 ${center} ${center - outerR}
        M ${center} ${center - innerR}
        A ${innerR} ${innerR} 0 1 1 ${center} ${center + innerR}
        A ${innerR} ${innerR} 0 1 1 ${center} ${center - innerR}
        Z
      `;
    } else {
      pathData = `
        M ${x1} ${y1}
        A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;
    }

    return {
      ...cat,
      pathData,
      idx
    };
  });

  return (
    <div className="finset-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header with interactive toggles */}
        <div className="card-inner-header" style={{ marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="card-title-text">Statistics</span>
            {/* Period pill: This Month / All-Time */}
            <button
              onClick={() => setPeriod(p => p === 'month' ? 'all' : 'month')}
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--text-sub)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Click to toggle between This Month and All Time"
            >
              <Calendar size={10} />
              <span>{isMonth ? 'This Month' : 'All-Time'}</span>
            </button>
          </div>

          <div className="stats-header-links">
            {/* Type toggle: Expense / Income */}
            <button 
              className="dropdown-pill-sm" 
              onClick={() => {
                setViewType(prev => prev === 'debit' ? 'credit' : 'debit');
                setHoveredIdx(null);
                setSelectedIdx(null);
              }}
              title="Click to toggle between Expense and Income breakdown"
              style={{ 
                cursor: 'pointer', 
                background: isDebit ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                color: isDebit ? '#F43F5E' : '#10B981',
                borderColor: isDebit ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)'
              }}
            >
              <span>{isDebit ? 'Expense' : 'Income'}</span>
              <RefreshCw size={10} />
            </button>

            <button className="details-link" onClick={onShowDetails} title="View full report table">
              <span>Details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="stats-card-subtitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {categories.length > 0 
              ? `${isMonth ? 'Current month' : 'All-time'} ${isDebit ? 'expenses' : 'income'} across ${categories.length} categories`
              : `No ${isDebit ? 'expenses' : 'income'} recorded yet`}
          </span>
          {activeCategory && (
            <span style={{ fontWeight: 700, color: activeCategory.color }}>
              {activeCategory.category}: {activeCategory.percentage}%
            </span>
          )}
        </p>

        {/* Donut Chart with Floating Callout */}
        <div className="donut-wrapper" style={{ position: 'relative', margin: '6px auto' }}>
          <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`}
            style={{ overflow: 'visible' }}
          >
            {/* Background empty ring */}
            <circle
              cx={center}
              cy={center}
              r={(outerR + innerR) / 2}
              fill="transparent"
              stroke="var(--bg-app)"
              strokeWidth={outerR - innerR}
            />

            {/* Render exact SVG Arc paths */}
            {slices.map((s, idx) => {
              const isHovered = activeIdx === idx;
              return (
                <path
                  key={idx}
                  d={s.pathData}
                  fill={s.color}
                  stroke="var(--bg-card)"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setSelectedIdx(prev => prev === idx ? null : idx)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    transformOrigin: `${center}px ${center}px`,
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    opacity: activeIdx === null || activeIdx === idx ? 1 : 0.45,
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'
                  }}
                />
              );
            })}
          </svg>

          {/* Floating Callout badge for the active / top category */}
          {activeCategory && (
            <div 
              className="donut-callout-pill" 
              style={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                pointerEvents: 'none',
                backgroundColor: 'var(--bg-card)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: `1.5px solid ${activeCategory.color}`,
                padding: '4px 8px',
                borderRadius: '10px'
              }}
            >
              <span style={{ fontSize: '0.62rem', color: activeCategory.color, fontWeight: 700 }}>
                {activeCategory.percentage}%
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 800 }}>
                ₹{Math.round(activeCategory.total).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Center Info - Dynamically switches when hovering over a slice */}
          <div className="donut-center-info" style={{ pointerEvents: 'none', textAlign: 'center' }}>
            {activeIdx !== null && activeCategory ? (
              <>
                <div className="donut-center-label" style={{ color: activeCategory.color, fontWeight: 700 }}>
                  {activeCategory.category}
                </div>
                <div className="donut-center-value" style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  <span>₹</span>{Math.round(activeCategory.total).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {activeCategory.percentage}% of total
                </div>
              </>
            ) : (
              <>
                <div className="donut-center-label">
                  {isMonth ? 'This month' : 'All-time'} {isDebit ? 'expense' : 'income'}
                </div>
                <div className="donut-center-value">
                  <span>₹</span>{integerPart}<span className="cents">{centsPart}</span>
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Legend list with exact percentages */}
      <div className="stats-legend-grid" style={{ marginTop: '10px' }}>
        {categories.length > 0 ? (
          categories.slice(0, 8).map((cat, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <div 
                key={idx} 
                className="stat-legend-cell"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(prev => prev === idx ? null : idx)}
                style={{ 
                  cursor: 'pointer', 
                  opacity: activeIdx === null || activeIdx === idx ? 1 : 0.4,
                  backgroundColor: isHovered ? 'var(--bg-app)' : 'transparent',
                  padding: '3px 6px',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span 
                  className="stat-legend-dot"
                  style={{ backgroundColor: cat.color, flexShrink: 0 }} 
                />
                <span 
                  style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    fontSize: '0.73rem',
                    fontWeight: isHovered ? 700 : 500,
                    color: isHovered ? 'var(--text-main)' : 'var(--text-sub)'
                  }} 
                  title={`${cat.category}: ₹${cat.total.toLocaleString('en-IN')} (${cat.percentage}%)`}
                >
                  {cat.category} <strong style={{ color: cat.color }}>{cat.percentage}%</strong>
                </span>
              </div>
            );
          })
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
