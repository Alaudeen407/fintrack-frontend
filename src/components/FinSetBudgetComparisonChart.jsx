import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

export default function FinSetBudgetComparisonChart({ summary }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [viewRange, setViewRange] = useState('year'); // 'year' or 'half'

  const rawData = summary?.budget_comparison || [];

  // Month names for mapping
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const curMonthIndex = new Date().getMonth();
  
  // Decide how many months to display based on viewRange
  const monthsToDisplay = viewRange === 'half'
    ? allMonths.slice(Math.max(0, curMonthIndex - 5), curMonthIndex + 1)
    : allMonths.slice(0, Math.max(7, curMonthIndex + 1));

  const monthsData = monthsToDisplay.map((m) => {
    const found = rawData.find(item => item.month === m);
    if (found) return found;
    return {
      month: m,
      budget: 0,
      expense: 0,
      exceeded: false,
      excessPct: 0,
      excessVal: 0
    };
  });

  // Calculate highest value for Y-axis scaling
  const allAmounts = monthsData.flatMap(m => [m.budget || 0, m.expense || 0]);
  let maxVal = Math.max(...allAmounts, 0);

  if (maxVal === 0) {
    maxVal = 5000; // default baseline scale when empty
  } else {
    maxVal = Math.ceil(maxVal * 1.15); // 15% headroom
  }

  // Y-Axis Ticks
  const tick1 = Math.round(maxVal);
  const tick2 = Math.round(maxVal * 0.66);
  const tick3 = Math.round(maxVal * 0.33);

  // Find the single highest exceeded month to highlight only when no item is hovered
  const exceededMonths = monthsData.map((m, i) => ({ ...m, idx: i })).filter(m => m.exceeded && m.expense > 0);
  const topExceededMonth = exceededMonths.length > 0 
    ? exceededMonths.reduce((prev, curr) => curr.excessVal > prev.excessVal ? curr : prev, exceededMonths[0])
    : null;

  return (
    <div className="finset-card">
      <div className="card-inner-header">
        <span className="card-title-text">Comparing of budget and expence</span>
        <div className="card-header-legend">
          <div className="legend-item">
            <span className="legend-dot-purple" />
            <span>Expense</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot-lavender" />
            <span>Budget</span>
          </div>
          {/* Interactive Range toggle */}
          <button 
            className="dropdown-pill-sm"
            onClick={() => setViewRange(r => r === 'year' ? 'half' : 'year')}
            style={{ 
              background: 'none', 
              border: '1px solid var(--border-light)', 
              cursor: 'pointer',
              color: 'var(--text-sub)'
            }}
            title="Click to toggle between This Year and Last 6 Months"
          >
            <span>{viewRange === 'year' ? 'This year' : 'Last 6 Months'}</span>
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: '44px', height: '170px' }}>
        {/* Y Axis Gridlines & Labels */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: '26px',
          width: '42px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#B2B7C2'
        }}>
          <span>₹{tick1.toLocaleString('en-IN')}</span>
          <span>₹{tick2.toLocaleString('en-IN')}</span>
          <span>₹{tick3.toLocaleString('en-IN')}</span>
        </div>

        {/* Bars Container */}
        <div className="barchart-container" onMouseLeave={() => setHoveredIdx(null)}>
          {monthsData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            // Only show one tooltip at a time: if hovered, show hovered; otherwise show topExceeded only
            const showTooltip = isHovered || (hoveredIdx === null && topExceededMonth && topExceededMonth.idx === idx);

            const budgetPct = Math.min(100, Math.round(((item.budget || 0) / maxVal) * 100));
            const expensePct = Math.min(100, Math.round(((item.expense || 0) / maxVal) * 100));

            return (
              <div 
                key={idx} 
                className="barchart-slot"
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Clean, Non-overlapping Tooltip */}
                {showTooltip && (item.budget > 0 || item.expense > 0) && (
                  <div 
                    className="svg-tooltip-bubble"
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translate(-50%, -100%)',
                      whiteSpace: 'nowrap',
                      fontSize: '0.70rem',
                      padding: '4px 8px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
                      zIndex: 10,
                      border: item.exceeded ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-light)'
                    }}
                  >
                    {item.exceeded ? (
                      <>
                        <span style={{ color: '#F43F5E', fontWeight: 700 }}>Exceeded</span>{' '}
                        <span style={{ color: '#8C919D', fontSize: '0.65rem' }}>+{item.excessPct}%</span>{' '}
                        <strong>₹{Math.round(item.excessVal).toLocaleString('en-IN')}</strong>
                      </>
                    ) : (
                      <>
                        <span style={{ color: '#7B61FF', fontWeight: 600 }}>Exp: ₹{Math.round(item.expense).toLocaleString('en-IN')}</span>{' '}
                        <span style={{ color: '#8C919D' }}>| Bud: ₹{Math.round(item.budget).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Capsule bar */}
                <div className="bar-capsule-wrap">
                  {/* Background Budget capsule (lavender) */}
                  <div 
                    className="bar-bg-capsule"
                    style={{ 
                      height: `${Math.max(item.budget > 0 ? 8 : 0, budgetPct)}%`,
                      opacity: isHovered ? 1 : 0.85
                    }}
                  />

                  {/* Foreground Expense capsule (purple or striped) */}
                  <div 
                    className={`bar-fg-capsule ${item.exceeded ? 'striped' : ''}`}
                    style={{ 
                      height: `${Math.max(item.expense > 0 ? 8 : 0, expensePct)}%`,
                      boxShadow: isHovered ? '0 0 10px rgba(123, 97, 255, 0.5)' : 'none'
                    }}
                  />
                </div>

                {/* Month label */}
                <span className="barchart-label" style={{ fontWeight: isHovered ? 700 : 500, color: isHovered ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
