import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinSetBudgetComparisonChart() {
  const monthsData = [
    { month: 'Jan', budget: 50, expense: 38 },
    { month: 'Feb', budget: 42, expense: 56, exceeded: true, excessPct: 20, excessVal: 500 },
    { month: 'Mar', budget: 55, expense: 42 },
    { month: 'Apr', budget: 70, expense: 58 },
    { month: 'May', budget: 48, expense: 36 },
    { month: 'Jun', budget: 95, expense: 80 },
    { month: 'Jul', budget: 60, expense: 48 },
  ];

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

      <div style={{ position: 'relative', paddingLeft: '40px', height: '170px' }}>
        {/* Y Axis Gridlines & Labels */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: '26px',
          width: '38px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#B2B7C2'
        }}>
          <span>$7,500</span>
          <span>$5,000</span>
          <span>$2,500</span>
        </div>

        {/* Bars Container */}
        <div className="barchart-container">
          {monthsData.map((item, idx) => (
            <div key={idx} className="barchart-slot">
              {/* Tooltip on Feb */}
              {item.exceeded && (
                <div 
                  className="svg-tooltip-bubble"
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translate(-50%, -100%)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.72rem',
                    padding: '4px 8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                  }}
                >
                  <span style={{ color: '#8C919D' }}>Exceeded</span>{' '}
                  <span style={{ color: '#8C919D', fontSize: '0.68rem' }}>by {item.excessPct}%</span>{' '}
                  <strong>${item.excessVal}</strong>
                </div>
              )}

              {/* Capsule bar */}
              <div className="bar-capsule-wrap">
                {/* Background Budget capsule (lavender) */}
                <div 
                  className="bar-bg-capsule"
                  style={{ height: `${item.budget}%` }}
                />

                {/* Foreground Expense capsule (purple or striped) */}
                <div 
                  className={`bar-fg-capsule ${item.exceeded ? 'striped' : ''}`}
                  style={{ height: `${item.expense}%` }}
                />
              </div>

              {/* Month label */}
              <span className="barchart-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
