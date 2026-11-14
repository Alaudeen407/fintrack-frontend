import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinSetBalanceOverviewChart() {
  const dates = [
    '1 Jul', '3 Jul', '5 Jul', '7 Jul', '9 Jul', 
    '11 Jul', '13 Jul', '15 Jul', '17 Jul', '19 Jul'
  ];

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 150;

  // Exact coordinates matching the waves in the screenshot
  // "This month" curve (solid purple with soft gradient fill)
  const solidPath = `
    M 40,75 
    C 75,70 120,60 160,78 
    C 175,85 190,120 220,120 
    C 255,120 270,72 300,72 
    C 330,72 345,108 375,108 
    C 405,108 420,72 450,72 
    C 480,72 495,115 525,115 
    C 555,115 570,82 600,82
  `;

  // Gradient area path (closed down to bottom y=140)
  const areaPath = `
    M 40,75 
    C 75,70 120,60 160,78 
    C 175,85 190,120 220,120 
    C 255,120 270,72 300,72 
    C 330,72 345,108 375,108 
    C 405,108 420,72 450,72 
    C 480,72 495,115 525,115 
    C 555,115 570,82 600,82 
    L 600,140 L 40,140 Z
  `;

  // "Same period last month" curve (dashed lavender)
  const dashedPath = `
    M 40,92 
    C 80,95 110,65 145,62 
    C 175,60 210,105 240,102 
    C 270,98 310,85 340,90 
    C 370,95 400,118 430,115 
    C 460,110 500,90 535,92 
    C 565,95 585,110 600,108
  `;

  return (
    <div className="finset-card">
      <div className="card-inner-header">
        <span className="card-title-text">Total balance overview</span>
        <div className="card-header-legend">
          <div className="legend-item">
            <span className="legend-dot-purple" />
            <span>This month</span>
          </div>
          <div className="legend-item">
            <span className="legend-diamond-lavender" />
            <span>Same period last month</span>
          </div>
          <div className="dropdown-pill-sm">
            <span>Total balance</span>
            <ChevronDown size={11} />
          </div>
        </div>
      </div>

      <div className="svg-chart-wrapper" style={{ height: '170px' }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          <line x1="40" y1="20" x2="600" y2="20" stroke="#F0F2F7" strokeDasharray="3 3" />
          <line x1="40" y1="55" x2="600" y2="55" stroke="#F0F2F7" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="600" y2="90" stroke="#F0F2F7" strokeDasharray="3 3" />
          <line x1="40" y1="125" x2="600" y2="125" stroke="#F0F2F7" strokeDasharray="3 3" />

          {/* Y-axis labels */}
          <text x="5" y="24" fill="#B2B7C2" fontSize="9" fontFamily="Plus Jakarta Sans">$20,000</text>
          <text x="5" y="59" fill="#B2B7C2" fontSize="9" fontFamily="Plus Jakarta Sans">$15,000</text>
          <text x="5" y="94" fill="#B2B7C2" fontSize="9" fontFamily="Plus Jakarta Sans">$10,000</text>
          <text x="9" y="129" fill="#B2B7C2" fontSize="9" fontFamily="Plus Jakarta Sans">$5,000</text>

          {/* Area fill */}
          <path d={areaPath} fill="url(#purpleAreaGrad)" />

          {/* Dashed curve: Same period last month */}
          <path 
            d={dashedPath} 
            fill="none" 
            stroke="#C4B5FD" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
          />

          {/* Solid curve: This month */}
          <path 
            d={solidPath} 
            fill="none" 
            stroke="#7B61FF" 
            strokeWidth="2.5" 
          />

          {/* Tooltip on 5 Jul peak */}
          {/* Vertical guideline */}
          <line x1="160" y1="78" x2="160" y2="140" stroke="#C4B5FD" strokeDasharray="2 3" />
          
          {/* Point */}
          <circle cx="160" cy="78" r="4.5" fill="#7B61FF" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* Floating Tooltip Bubble on 5 Jul */}
        <div 
          className="svg-tooltip-bubble"
          style={{ left: '26%', top: '48px' }}
        >
          $15,000
        </div>

        {/* X-axis date labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '40px',
          paddingRight: '12px',
          marginTop: '2px',
          fontSize: '0.68rem',
          color: '#B2B7C2'
        }}>
          {dates.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
