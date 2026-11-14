import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function FinSetStatisticsDonut({ onShowDetails }) {
  // Categories from FinSet mockup:
  // 1. Money transfer (40% - $2,500.00)
  // 2. Cafe & Restaurants (~12%)
  // 3. Rent (~22%)
  // 4. Education (~10%)
  // 5. Food & Groceries (~9%)
  // 6. Others (~7%)

  const categories = [
    { name: 'Money transfer', color: '#7B61FF' },
    { name: 'Cafe & Restaurants', color: '#C4B5FD' },
    { name: 'Rent', color: '#4B5262' },
    { name: 'Education', color: '#7E8494' },
    { name: 'Food & Groceries', color: '#B2B7C2' },
    { name: 'Others', color: '#E2E6EE' },
  ];

  // SVG Donut geometry
  const size = 210;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius; // ~603.18

  // Slices: [percentage, color, dashoffset]
  // Total 100%
  // 1: 40% (241.2)
  // 2: 12% (72.4)
  // 3: 22% (132.7)
  // 4: 10% (60.3)
  // 5: 9% (54.3)
  // 6: 7% (42.2)
  const segments = [
    { pct: 40, color: '#7B61FF', offset: 0 },
    { pct: 12, color: '#C4B5FD', offset: 40 },
    { pct: 22, color: '#4B5262', offset: 52 },
    { pct: 10, color: '#7E8494', offset: 74 },
    { pct: 9, color: '#B2B7C2', offset: 84 },
    { pct: 7, color: '#E2E6EE', offset: 93 },
  ];

  return (
    <div className="finset-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div className="card-inner-header" style={{ marginBottom: '8px' }}>
          <span className="card-title-text">Statistics</span>
          <div className="stats-header-links">
            <div className="dropdown-pill-sm">
              <span>Expence</span>
              <ChevronDown size={11} />
            </div>
            <button className="details-link" onClick={onShowDetails}>
              <span>Details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="stats-card-subtitle">
          You have an increase of expenses in several categories this month
        </p>

        {/* Donut Chart with Floating Callout */}
        <div className="donut-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-70 ${size / 2} ${size / 2})`}>
              {segments.map((s, idx) => {
                const strokeDasharray = `${(s.pct / 100) * circumference - 5} ${circumference}`;
                const strokeDashoffset = -((s.offset / 100) * circumference);

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Callout badge on top right: 40% $2,500 */}
          <div className="donut-callout-pill">
            <span style={{ fontSize: '0.62rem', color: '#8C919D', fontWeight: 600 }}>40%</span>
            <span style={{ fontSize: '0.78rem', color: '#14171A', fontWeight: 800 }}>$2,500</span>
          </div>

          {/* Center Info */}
          <div className="donut-center-info">
            <div className="donut-center-label">This month expence</div>
            <div className="donut-center-value">
              <span>$</span>6,222<span className="cents">.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Legend list */}
      <div className="stats-legend-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="stat-legend-cell">
            <span 
              className="stat-legend-dot"
              style={{ backgroundColor: cat.color }} 
            />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
