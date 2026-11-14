import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinSetBudgetComparisonChart({ summary }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const rawData = summary?.budget_comparison || [];

  // Default months fallback if empty
  const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const monthsData = defaultMonths.map((m, i) => {
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

  // Ticks
  const tick1 = Math.round(maxVal);
  const tick2 = Math.round(maxVal * 0.66);
  const tick3 = Math.round(maxVal * 0.33);

  // Check if any month actually has data
  const hasData = monthsData.some(m => (m.budget > 0 || m.expense > 0));

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
          <div className="dropdown-pill-sm">
            <span>This year</span>
            <ChevronDown size={11} />
          </div>
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
            const budgetPct = Math.min(100, Math.round(((item.budget || 0) / maxVal) * 100));
            const expensePct = Math.min(100, Math.round(((item.expense || 0) / maxVal) * 100));

            return (
              <div 
                key={idx} 
                className="barchart-slot"
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Tooltip on Exceeded or Hover */}
                {((item.exceeded && isHovered === false) || isHovered) && (item.budget > 0 || item.expense > 0) && (
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
                      boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                      zIndex: 10
                    }}
                  >
                    {item.exceeded ? (
                      <>
                        <span style={{ color: '#8C919D' }}>Exceeded</span>{' '}
                        <span style={{ color: '#8C919D', fontSize: '0.65rem' }}>by {item.excessPct}%</span>{' '}
                        <strong>₹{Math.round(item.excessVal).toLocaleString('en-IN')}</strong>
                      </>
                    ) : (
                      <>
                        <span style={{ color: '#7B61FF' }}>Exp: ₹{Math.round(item.expense).toLocaleString('en-IN')}</span>{' '}
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
                      boxShadow: isHovered ? '0 0 8px rgba(123, 97, 255, 0.4)' : 'none'
                    }}
                  />
                </div>

                {/* Month label */}
                <span className="barchart-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
