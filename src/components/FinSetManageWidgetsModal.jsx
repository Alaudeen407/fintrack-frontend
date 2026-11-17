import React from 'react';
import { 
  LayoutGrid, 
  Check, 
  X, 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  CreditCard,
  Layers 
} from 'lucide-react';

export default function FinSetManageWidgetsModal({ 
  isOpen, 
  onClose, 
  widgetsConfig, 
  onToggleWidget 
}) {
  if (!isOpen) return null;

  const widgetsList = [
    {
      id: 'statCards',
      name: 'Key Metrics & Stat Cards',
      description: 'Total balance, monthly income & expense summary cards',
      icon: CreditCard,
      color: '#7B61FF'
    },
    {
      id: 'balanceOverview',
      name: 'Total Balance Overview Chart',
      description: 'Interactive cubic bezier spline area progression vs previous month',
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      id: 'budgetComparison',
      name: 'Comparing Budget & Expense Chart',
      description: 'Monthly capsule bar comparison with variance and excess alerts',
      icon: BarChart2,
      color: '#F59E0B'
    },
    {
      id: 'statisticsDonut',
      name: 'Category Breakdown Donut Chart',
      description: 'Interactive circular slice breakdown with hover percentages and details',
      icon: PieChart,
      color: '#EC4899'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1250 }}>
      <div 
        className="modal-finset-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '100%' }}
      >
        {/* Header */}
        <div className="modal-finset-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(123, 97, 255, 0.12)',
              color: '#7B61FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LayoutGrid size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Manage Dashboard Widgets
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Customize your layout cards and analytical charts
              </span>
            </div>
          </div>
          <button className="collapse-btn" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Body list of widgets */}
        <div className="modal-finset-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {widgetsList.map((w) => {
            const Icon = w.icon;
            const isEnabled = widgetsConfig[w.id] ?? true;

            return (
              <div
                key={w.id}
                onClick={() => onToggleWidget(w.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: isEnabled ? '1.5px solid var(--finset-purple)' : '1px solid var(--border-light)',
                  backgroundColor: isEnabled ? 'rgba(123, 97, 255, 0.04)' : 'var(--bg-app)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: isEnabled ? `${w.color}20` : 'rgba(140, 145, 157, 0.1)',
                    color: isEnabled ? w.color : '#8C919D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {w.description}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  backgroundColor: isEnabled ? '#7B61FF' : 'transparent',
                  border: isEnabled ? 'none' : '2px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  {isEnabled && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="modal-finset-footer">
          <button 
            type="button" 
            className="pill-btn-white" 
            onClick={onClose}
          >
            Close
          </button>
          <button 
            type="button" 
            className="pill-btn-purple" 
            onClick={onClose}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
