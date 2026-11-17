import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Filter } from 'lucide-react';

export default function FinSetBalanceOverviewChart({ summary }) {
  const [activeHoverIdx, setActiveHoverIdx] = useState(null);
  const [chartMode, setChartMode] = useState('balance'); // 'balance', 'credit', 'debit'

  const dailyTrend = summary?.daily_balance_trend || [];
  const prevTrend = summary?.prev_balance_trend || [];

  // SVG canvas dimensions
  const svgWidth = 620;
  const svgHeight = 150;
  const paddingLeft = 48;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 125;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = paddingBottom - paddingTop;

  // Determine min and max balance for Y-axis scaling
  const allValues = [
    ...dailyTrend.map(d => d.balance),
    ...prevTrend.map(d => d.balance)
  ];

  let minVal = allValues.length > 0 ? Math.min(...allValues) : 0;
  let maxVal = allValues.length > 0 ? Math.max(...allValues) : 0;

  // Ensure positive range and headroom
  if (minVal > 0) minVal = 0; // always show 0 baseline if balance is positive
  if (maxVal === minVal) {
    maxVal = minVal + 5000;
  } else {
    // Add 12% breathing room on top
    const margin = (maxVal - minVal) * 0.12;
    maxVal += margin;
  }

  const valRange = maxVal - minVal;

  // Map data points to SVG coordinates
  const getCoordinates = (points) => {
    if (!points || points.length === 0) return [];
    return points.map((p, i) => {
      const x = paddingLeft + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
      const y = paddingBottom - ((p.balance - minVal) / valRange) * plotHeight;
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

  // Determine active tooltip point (hovered point or default peak / last point)
  let activePoint = null;
  if (currentCoords.length > 0) {
    if (activeHoverIdx !== null && currentCoords[activeHoverIdx]) {
      activePoint = currentCoords[activeHoverIdx];
    } else {
      // Find peak point for default prominent badge
      let peak = currentCoords[0];
      for (const pt of currentCoords) {
        if (pt.data.balance > peak.data.balance) peak = pt;
      }
      activePoint = peak;
    }
  }

  // Y-axis 4 step ticks
  const yTickStep = valRange / 3;
  const yTicks = [
    { val: maxVal, y: paddingTop },
    { val: maxVal - yTickStep, y: paddingTop + plotHeight * 0.33 },
    { val: maxVal - yTickStep * 2, y: paddingTop + plotHeight * 0.67 },
    { val: minVal, y: paddingBottom }
  ];

  // X-axis sample dates (pick up to 7 evenly spaced labels)
  const dateStep = Math.max(1, Math.floor(dailyTrend.length / 6));
  const xLabels = dailyTrend.filter((_, idx) => idx % dateStep === 0 || idx === dailyTrend.length - 1);

  const hasAnyTransactions = Boolean(summary?.total_count && summary.total_count > 0);

  return (
    <div className="finset-card">
      <div className="card-inner-header">
        <span className="card-title-text">Total balance overview</span>
        <div className="card-header-legend">
          <div className="legend-item">
            <span className="legend-dot-purple" />
            <span>This month</span>
          </div>
          {prevTrend.length > 0 && (
            <div className="legend-item">
              <span className="legend-diamond-lavender" />
              <span>Same period last month</span>
            </div>
          )}
          {/* Working Toggle Pill */}
          <button 
            className="dropdown-pill-sm"
            onClick={() => setChartMode(m => m === 'balance' ? 'net' : 'balance')}
            style={{ 
              background: 'none', 
              border: '1px solid var(--border-light)', 
              cursor: 'pointer',
              color: 'var(--text-sub)'
            }}
            title="Click to toggle perspective"
          >
            <span>{chartMode === 'balance' ? 'Running balance' : 'Net curve'}</span>
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      <div className="svg-chart-wrapper" style={{ height: '175px', position: 'relative' }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setActiveHoverIdx(null)}
        >
          <defs>
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {yTicks.map((tick, i) => (
            <line 
              key={i}
              x1={paddingLeft} 
              y1={tick.y} 
              x2={svgWidth - paddingRight} 
              y2={tick.y} 
              stroke="var(--border-light)" 
              strokeDasharray="3 3" 
            />
          ))}

          {/* Y-axis labels */}
          {yTicks.map((tick, i) => (
            <text 
              key={i}
              x="5" 
              y={tick.y + 3} 
              fill="var(--text-muted)" 
              fontSize="9" 
              fontFamily="Plus Jakarta Sans"
            >
              ₹{Math.round(tick.val).toLocaleString('en-IN')}
            </text>
          ))}

          {hasAnyTransactions && areaPath && (
            <path d={areaPath} fill="url(#purpleAreaGrad)" />
          )}

          {/* Dashed curve: Same period last month */}
          {hasAnyTransactions && dashedCurve && (
            <path 
              d={dashedCurve} 
              fill="none" 
              stroke="#C4B5FD" 
              strokeWidth="2" 
              strokeDasharray="4 4" 
            />
          )}

          {/* Solid curve: This month */}
          {hasAnyTransactions && solidCurve && (
            <path 
              d={solidCurve} 
              fill="none" 
              stroke="#7B61FF" 
              strokeWidth="2.5" 
            />
          )}

          {/* Flat line when no transactions yet */}
          {!hasAnyTransactions && (
            <line 
              x1={paddingLeft} 
              y1={paddingBottom} 
              x2={svgWidth - paddingRight} 
              y2={paddingBottom} 
              stroke="var(--border-light)" 
              strokeWidth="2" 
            />
          )}

          {/* Interactive Guidelines & Points */}
          {hasAnyTransactions && currentCoords.map((pt, i) => (
            <g key={i} onMouseEnter={() => setActiveHoverIdx(i)} style={{ cursor: 'pointer' }}>
              {/* Invisible wide hit area */}
              <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
            </g>
          ))}

          {/* Highlight active/hovered point */}
          {hasAnyTransactions && activePoint && (
            <g>
              <line 
                x1={activePoint.x} 
                y1={activePoint.y} 
                x2={activePoint.x} 
                y2={paddingBottom} 
                stroke="#C4B5FD" 
                strokeDasharray="2 3" 
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

        {/* Floating Tooltip Bubble */}
        {hasAnyTransactions && activePoint && (
          <div 
            className="svg-tooltip-bubble"
            style={{ 
              left: `${(activePoint.x / svgWidth) * 100}%`, 
              top: `${Math.max(10, activePoint.y - 32)}px`,
              transform: 'translate(-50%, -100%)',
              position: 'absolute',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontSize: '0.62rem', color: '#8C919D' }}>{activePoint.data.label}</div>
            <div style={{ fontWeight: 700 }}>₹{activePoint.data.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        )}

        {/* Empty state notice */}
        {!hasAnyTransactions && (
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.78rem'
          }}>
            <TrendingUp size={20} style={{ margin: '0 auto 6px', display: 'block', opacity: 0.4 }} />
            No transactions yet. Add an income or expense to see your balance trend.
          </div>
        )}

        {/* X-axis date labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: `${paddingLeft}px`,
          paddingRight: `${paddingRight}px`,
          marginTop: '2px',
          fontSize: '0.68rem',
          color: '#B2B7C2'
        }}>
          {xLabels.map((item, i) => (
            <span key={i}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
