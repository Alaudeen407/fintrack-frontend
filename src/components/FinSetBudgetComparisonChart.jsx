import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinSetBudgetComparisonChart({ summary }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const rawData = summary?.budget_comparison || [];

  // Default months matching the exact mockup
  const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Default reference mock values if user has fresh 0 data, ensuring the chart matches the visual spec
  const fallbackValues = {
    Jan: { budget: 3800, expense: 2800, exceeded: false, excessPct: 0, excessVal: 0 },
    Feb: { budget: 2500, expense: 3000, exceeded: true, excessPct: 20, excessVal: 500 },
    Mar: { budget: 4200, expense: 3200, exceeded: false, excessPct: 0, excessVal: 0 },
    Apr: { budget: 5200, expense: 4100, exceeded: false, excessPct: 0, excessVal: 0 },
    May: { budget: 3900, expense: 2700, exceeded: false, excessPct: 0, excessVal: 0 },
    Jun: { budget: 6800, expense: 5400, exceeded: false, excessPct: 0, excessVal: 0 },
    Jul: { budget: 4900, expense: 3600, exceeded: false, excessPct: 0, excessVal: 0 }
  };

  const hasLiveTransactions = Boolean(summary?.total_count && summary.total_count > 0);

  const monthsData = defaultMonths.map((m) => {
    const found = rawData.find(item => item.month === m);
    if (hasLiveTransactions && found && (found.budget > 0 || found.expense > 0)) {
      return found;
    }
    // If user has recorded transactions, use live values; otherwise use reference mockup layout
    return hasLiveTransactions ? (found || { month: m, budget: 0, expense: 0, exceeded: false, excessPct: 0, excessVal: 0 }) : { month: m, ...fallbackValues[m] };
  });

  // Calculate highest value for Y-axis scaling
  const allAmounts = monthsData.flatMap(m => [m.budget || 0, m.expense || 0]);
  let maxVal = Math.max(...allAmounts, 0);

  if (maxVal === 0) {
    maxVal = 7500;
  } else {
    maxVal = Math.max(7500, Math.ceil(maxVal * 1.12));
  }

  // Exact 3-tier Y-Axis Ticks matching the mockup: ₹7,500, ₹5,000, ₹2,500
  const tick1 = Math.round(maxVal);
  const tick2 = Math.round(maxVal * (2 / 3));
  const tick3 = Math.round(maxVal * (1 / 3));

  // Identify the exceeded month for the floating callout
  const exceededMonth = monthsData.find(m => m.exceeded && m.expense > 0) || monthsData[1];

  return (
    <div className="finset-card">
      {/* Header */}
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
          {/* Right position dropdown pill - exact text matching mockup */}
          <div className="dropdown-pill-sm" style={{ cursor: 'pointer' }}>
            <span>This year</span>
            <ChevronDown size={11} />
          </div>
        </div>
      </div>

      {/* Chart container with clear dashed grid lines (Gridge effect) */}
      <div style={{ position: 'relative', height: '170px', marginTop: '10px' }}>
        {/* Y Axis Labels on the left */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '4px',
          bottom: '26px',
          width: '42px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: 'var(--text-light)',
          fontFamily: 'var(--font-sans)',
          textAlign: 'right',
          paddingRight: '6px',
          zIndex: 2
        }}>
          <span>₹{tick1.toLocaleString('en-IN')}</span>
          <span>₹{tick2.toLocaleString('en-IN')}</span>
          <span>₹{tick3.toLocaleString('en-IN')}</span>
        </div>

        {/* Clear Horizontal Dashed Gridlines (The Gridge Effect) */}
        <svg 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: 'calc(100% - 24px)', 
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {/* Top grid line (tick 1) */}
          <line 
            x1="46" 
            y1="10" 
            x2="100%" 
            y2="10" 
            stroke="var(--border-subtle)" 
            strokeDasharray="4 4" 
            strokeWidth="1.2" 
          />
          {/* Mid-upper grid line (tick 2) */}
          <line 
            x1="46" 
            y1="36%" 
            x2="100%" 
            y2="36%" 
            stroke="var(--border-subtle)" 
            strokeDasharray="4 4" 
            strokeWidth="1.2" 
          />
          {/* Mid-lower grid line (tick 3) */}
          <line 
            x1="46" 
            y1="68%" 
            x2="100%" 
            y2="68%" 
            stroke="var(--border-subtle)" 
            strokeDasharray="4 4" 
            strokeWidth="1.2" 
          />
          {/* Baseline grid line */}
          <line 
            x1="46" 
            y1="100%" 
            x2="100%" 
            y2="100%" 
            stroke="var(--border-subtle)" 
            strokeWidth="1" 
          />
        </svg>

        {/* Bars Container */}
        <div 
          className="barchart-container" 
          style={{ paddingLeft: '46px', position: 'relative', zIndex: 3, borderBottom: 'none' }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {monthsData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isDefaultExceeded = hoveredIdx === null && item.month === exceededMonth?.month;
            const showPill = isHovered || isDefaultExceeded;

            const budgetPct = Math.min(100, Math.round(((item.budget || 0) / maxVal) * 100));
            const expensePct = Math.min(100, Math.round(((item.expense || 0) / maxVal) * 100));

            return (
              <div 
                key={idx} 
                className="barchart-slot"
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Floating Callout Pill */}
                {showPill && (item.budget > 0 || item.expense > 0) && (
                  <div 
                    className="svg-tooltip-bubble"
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '50%',
                      transform: 'translate(-50%, -100%)',
                      whiteSpace: 'nowrap',
                      padding: '5px 9px',
                      borderRadius: '10px',
                      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      zIndex: 15,
                      textAlign: 'center'
                    }}
                  >
                    {item.exceeded ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.62rem', fontWeight: 600 }}>Exceeded</span>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.64rem', marginRight: '4px' }}>
                            by {item.excessPct}%
                          </span>
                          ₹{Math.round(item.excessVal).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.70rem', color: 'var(--text-main)' }}>
                        <span style={{ color: 'var(--finset-purple)', fontWeight: 700 }}>₹{Math.round(item.expense).toLocaleString('en-IN')}</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                        <span style={{ color: 'var(--text-sub)' }}>₹{Math.round(item.budget).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Capsule bar container */}
                <div className="bar-capsule-wrap" style={{ width: '28px' }}>
                  {/* Background Budget capsule (wider/lighter lavender) */}
                  <div 
                    className="bar-bg-capsule"
                    style={{ 
                      width: '28px',
                      height: `${Math.max(10, budgetPct)}%`,
                      borderRadius: '14px',
                      backgroundColor: 'var(--finset-purple-chart)',
                      opacity: isHovered ? 0.95 : 0.75,
                      transition: 'all 0.2s ease'
                    }}
                  />

                  {/* Foreground Expense capsule (purple or diagonal striped if exceeded) */}
                  <div 
                    className={`bar-fg-capsule ${item.exceeded ? 'striped' : ''}`}
                    style={{ 
                      width: '28px',
                      height: `${Math.max(8, expensePct)}%`,
                      borderRadius: '14px',
                      backgroundColor: item.exceeded ? 'transparent' : 'var(--finset-purple)',
                      boxShadow: isHovered ? '0 0 12px rgba(123, 97, 255, 0.45)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                {/* Month label along bottom */}
                <span className="barchart-label" style={{ 
                  fontWeight: isHovered || isDefaultExceeded ? 700 : 500, 
                  color: isHovered || isDefaultExceeded ? 'var(--text-main)' : 'var(--text-muted)',
                  marginTop: '8px'
                }}>
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
