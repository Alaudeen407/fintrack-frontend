import React from 'react';
import { 
  Bell, 
  CalendarClock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight,
  TrendingDown,
  CreditCard 
} from 'lucide-react';

export default function FinSetNotificationsPopover({ 
  isOpen, 
  onClose, 
  summary, 
  onNavigateToBills,
  onNavigateToTransactions 
}) {
  if (!isOpen) return null;

  const totalBillsPending = summary?.month_debit || 0;
  
  const notifications = [
    {
      id: 1,
      type: 'bill',
      icon: CalendarClock,
      iconColor: '#7B61FF',
      iconBg: 'rgba(123, 97, 255, 0.1)',
      title: 'Upcoming Bill Payments',
      message: 'Review recurring utility and subscription commitments due this month.',
      time: 'Due soon',
      actionText: 'View Bills',
      action: onNavigateToBills
    },
    {
      id: 2,
      type: 'budget',
      icon: TrendingDown,
      iconColor: '#F59E0B',
      iconBg: 'rgba(245, 158, 11, 0.1)',
      title: 'Monthly Cash Flow Active',
      message: 'Budget and expense comparisons are dynamically tracked against income.',
      time: 'Live',
      actionText: 'View Analytics',
      action: () => {}
    },
    {
      id: 3,
      type: 'security',
      icon: CheckCircle2,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      title: 'User Isolation Enforced',
      message: 'Your personal financial ledger and MongoDB Atlas cloud synchronization are active.',
      time: 'Secure',
      actionText: 'View Ledger',
      action: onNavigateToTransactions
    }
  ];

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ zIndex: 1200, backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
    >
      <div 
        className="modal-finset-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '390px',
          width: '100%',
          position: 'fixed',
          top: '70px',
          right: '80px',
          margin: 0,
          borderRadius: '18px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Header */}
        <div className="modal-finset-header" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              color: '#7B61FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Notifications
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                3 active updates for your account
              </span>
            </div>
          </div>
          <button className="collapse-btn" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', maxHeight: '360px', overflowY: 'auto' }}>
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div 
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: n.iconBg,
                  color: n.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Icon size={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-sub)', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                    {n.message}
                  </p>
                  {n.actionText && (
                    <button
                      onClick={() => {
                        n.action();
                        onClose();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7B61FF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      <span>{n.actionText}</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 18px', textAlign: 'center', backgroundColor: 'var(--bg-app)', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
