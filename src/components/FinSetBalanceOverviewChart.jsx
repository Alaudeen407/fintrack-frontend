import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinSetBalanceOverviewChart({ summary }) {
  const [activeHoverIdx, setActiveHoverIdx] = useState(null);

  const hasLiveTransactions = Boolean(summary?.total_count && summary.total_count > 0);

  // Default mockup sample dates matching the image: 1 Jul to 19 Jul
  const defaultDates = [
    { label: '1 Jul', balance: 14200, prevBal: 12000 },
    { label: '3 Jul', balance: 15000, prevBal: 13500 }, // Peak badge target ($15,000 in mockup)
    { label: '5 Jul', balance: 11000, prevBal: 14800 },
    { label: '7 Jul', balance: 13800, prevBal: 12400 },
    { label: '9 Jul', balance: 16200, prevBal: 13900 },
    { label: '11 Jul', balance: 14500, prevBal: 15200 },
    { label: '13 Jul', balance: 17800, prevBal: 14100 },
    { label: '15 Jul', balance: 15400, prevBal: 16500 },
    { label: '17 Jul', balance: 16900, prevBal: 15800 },
    { label: '19 Jul', balance: 15700, prevBal: 14900 }
  ];

  let dailyTrend = summary?.daily_balance_trend || [];
  let prevTrend = summary?.prev_balance_trend || [];

  if (!hasLiveTransactions || dailyTrend.length === 0) {
    dailyTrend = defaultDates.map((d, i) => ({ day: i + 1, label: d.label, balance: d.balance }));
    prevTrend = defaultDates.map((d, i) => ({ day: i + 1, label: d.label, balance: d.prevBal }));
  }

  // SVG canvas dimensions
  const svgWidth = 620;
  const svgHeight = 150;
  const paddingLeft = 48;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 125;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = paddingBottom - paddingTop;

  // Exact 4-tier Y-axis scale matching mockup: ₹20,000, ₹15,000, ₹10,000, ₹5,000
  const minVal = 5000;
  const maxVal = 20000;
  const valRange = maxVal - minVal;

  // Map data points to SVG coordinates
  const getCoordinates = (points) => {
    if (!points || points.length === 0) return [];
    return points.map((p, i) => {
      const x = paddingLeft + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
      const clampedVal = Math.min(maxVal, Math.max(minVal, p.balance));
      const y = paddingBottom - ((clampedVal - minVal) / valRange) * plotHeight;
      return { x, y, data: p, index: i };
    });
  };

  const currentCoords = getCoordinates(dailyTrend);
  const prevCoords = getCoordinates(prevTrend);

  // Smooth Cubic Bezier Curve Generator
  const generateSmoothPath = (coords) => {
    if (!coords || coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x},${coords[0].y}`;

    let path = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const solidCurve = generateSmoothPath(currentCoords);
  const dashedCurve = generateSmoothPath(prevCoords);

  // Gradient area closed to baseline (y = paddingBottom)
  const areaPath = currentCoords.length > 0 
    ? `${solidCurve} L ${currentCoords[currentCoords.length - 1].x.toFixed(1)},${paddingBottom} L ${currentCoords[0].x.toFixed(1)},${paddingBottom} Z`
    : '';

  // Determine active callout badge (default to 2nd point / index 1 matching the $15,000 callout in the image)
  let activePoint = null;
  if (currentCoords.length > 0) {
    if (activeHoverIdx !== null && currentCoords[activeHoverIdx]) {
      activePoint = currentCoords[activeHoverIdx];
    } else {
      activePoint = currentCoords.length > 1 ? currentCoords[1] : currentCoords[0];
    }
  }

  // 4 Y-ticks matching the mockup: ₹20,000, ₹15,000, ₹10,000, ₹5,000
  const yTicks = [
    { val: 20000, y: paddingTop },
    { val: 15000, y: paddingTop + plotHeight * 0.33 },
    { val: 10000, y: paddingTop + plotHeight * 0.67 },
    { val: 5000, y: paddingBottom }
  ];

  return (
    <div className="finset-card">
      {/* Header */}
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
          {/* Right position dropdown pill - exact text matching mockup */}
          <div className="dropdown-pill-sm" style={{ cursor: 'pointer' }}>
            <span>Total balance</span>
            <ChevronDown size={11} />
          </div>
        </div>
      </div>

      {/* SVG Canvas with clear dashed grid lines (Gridge effect) */}
      <div className="svg-chart-wrapper" style={{ height: '175px', position: 'relative' }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setActiveHoverIdx(null)}
        >
          <defs>
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Clear Horizontal Dashed Gridlines (The Gridge Effect) */}
          {yTicks.map((tick, i) => (
            <line 
              key={i}
              x1={paddingLeft} 
              y1={tick.y} 
              x2={svgWidth - paddingRight} 
              y2={tick.y} 
              stroke="var(--border-subtle)" 
              strokeDasharray="4 4" 
              strokeWidth="1.2"
            />
          ))}

          {/* Y-axis labels on the left */}
          {yTicks.map((tick, i) => (
            <text 
              key={i}
              x="5" 
              y={tick.y + 3} 
              fill="var(--text-light)" 
              fontSize="9" 
              fontFamily="Plus Jakarta Sans"
              fontWeight="500"
            >
              ₹{tick.val.toLocaleString('en-IN')}
            </text>
          ))}

          {/* Area under solid curve */}
          {areaPath && (
            <path d={areaPath} fill="url(#purpleAreaGrad)" />
          )}

          {/* Dashed curve: Same period last month */}
          {dashedCurve && (
            <path 
              d={dashedCurve} 
              fill="none" 
              stroke="#C4B5FD" 
              strokeWidth="2" 
              strokeDasharray="4 4" 
            />
          )}

          {/* Solid curve: This month */}
          {solidCurve && (
            <path 
              d={solidCurve} 
              fill="none" 
              stroke="#7B61FF" 
              strokeWidth="2.5" 
            />
          )}

          {/* Interactive invisible hit targets */}
          {currentCoords.map((pt, i) => (
            <g key={i} onMouseEnter={() => setActiveHoverIdx(i)} style={{ cursor: 'pointer' }}>
              <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />
            </g>
          ))}

          {/* Highlight active point with vertical guideline and circle dot */}
          {activePoint && (
            <g>
              <line 
                x1={activePoint.x} 
                y1={activePoint.y} 
                x2={activePoint.x} 
                y2={paddingBottom} 
                stroke="#C4B5FD" 
                strokeDasharray="3 3" 
                strokeWidth="1.5"
              />
              <circle 
                cx={activePoint.x} 
                cy={activePoint.y} 
                r="4.5" 
                fill="#7B61FF" 
                stroke="#FFFFFF" 
                strokeWidth="2" 
              />
            </g>
          )}
        </svg>

        {/* Floating Callout Pill Badge (e.g. ₹15,000) matching mockup */}
        {activePoint && (
          <div 
            className="svg-tooltip-bubble"
            style={{ 
              left: `${(activePoint.x / svgWidth) * 100}%`, 
              top: `${Math.max(12, activePoint.y - 18)}px`,
              transform: 'translate(-50%, -100%)',
              position: 'absolute',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              padding: '4px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              border: '1px solid var(--border-light)',
              fontWeight: 800,
              fontSize: '0.74rem',
              color: 'var(--text-main)',
              zIndex: 10
            }}
          >
            ₹{activePoint.data.balance.toLocaleString('en-IN')}
          </div>
        )}

        {/* X-axis date labels along bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: `${paddingLeft}px`,
          paddingRight: `${paddingRight}px`,
          marginTop: '6px',
          fontSize: '0.68rem',
          color: 'var(--text-light)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500
        }}>
          {dailyTrend.map((item, i) => (
            <span key={i}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
