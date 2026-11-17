import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Search, 
  Bell, 
  LayoutGrid, 
  Plus,
  User,
  Check
} from 'lucide-react';

export default function FinSetTopbar({ 
  activeTab = 'analytics', 
  onOpenAddModal, 
  currentUser, 
  onOpenAuth,
  onOpenNotifications,
  onOpenManageWidgets,
  onSearchClick,
  datePeriod = 'this-month',
  onDatePeriodChange
}) {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const titles = {
    dashboard: { title: 'Dashboard', sub: 'High-level financial summary and account balances' },
    analytics: { title: 'Analytics', sub: 'Detailed overview of your financial situation' },
    transactions: { title: 'Transactions Ledger', sub: 'Credit (Income) and Debit (Expense) accounting' },
    bills: { title: 'Monthly Bills & Calendar', sub: 'Recurring commitments, payment status & upcoming due dates' },
    'excel-report': { title: 'Monthly Excel Sheet Report', sub: 'Multi-sheet Microsoft Excel (.xlsx) financial export' },
    settings: { title: 'Settings & Appearance', sub: 'Customize user profile, theme & database preferences' },
    help: { title: 'Help & User Guide', sub: 'Keyboard shortcuts, documentation, and financial workflows' }
  };

  const currentHeader = titles[activeTab] || titles.analytics;

  const dateOptions = [
    { id: 'this-month', label: 'This month' },
    { id: 'last-month', label: 'Last month' },
    { id: 'all-time', label: 'All time (Whole)' }
  ];

  const activeDateLabel = dateOptions.find(d => d.id === datePeriod)?.label || 'This month';

  return (
    <header className="finset-topbar">
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{currentHeader.title}</h1>
          <p className="page-subtitle">{currentHeader.sub}</p>
        </div>

        {/* Working Date Filter Pill with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="date-pill"
            onClick={() => setIsDateDropdownOpen(prev => !prev)}
            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
            title="Filter by period"
          >
            <Calendar size={15} color="var(--text-sub)" />
            <span>{activeDateLabel}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isDateDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 1000,
                minWidth: '160px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              {dateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onDatePeriodChange?.(opt.id);
                    setIsDateDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: datePeriod === opt.id ? 'var(--bg-app)' : 'none',
                    border: 'none',
                    color: datePeriod === opt.id ? 'var(--finset-purple)' : 'var(--text-main)',
                    fontWeight: datePeriod === opt.id ? 700 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{opt.label}</span>
                  {datePeriod === opt.id && <Check size={13} color="var(--finset-purple)" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Search round button */}
        <button 
          className="icon-btn-round" 
          title="Search transactions (Press T)"
          onClick={onSearchClick}
          style={{ cursor: 'pointer' }}
        >
          <Search size={16} />
        </button>

        {/* Bell notification round button with red badge '3' */}
        <button 
          className="icon-btn-round" 
          title="Notifications & Upcoming Bills"
          onClick={onOpenNotifications}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <Bell size={16} />
          <span className="notif-badge">3</span>
        </button>

        {/* User profile pill or Sign In button */}
        {currentUser ? (
          <div className="user-profile-pill" onClick={onOpenAuth} title="User Profile" style={{ cursor: 'pointer' }}>
            <img 
              src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"} 
              alt={currentUser.name} 
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-email">{currentUser.email}</span>
            </div>
          </div>
        ) : (
          <button className="pill-btn-white" onClick={onOpenAuth} style={{ cursor: 'pointer' }}>
            <User size={15} color="var(--finset-purple)" />
            <span>Sign In</span>
          </button>
        )}

        {/* Manage widgets button */}
        <button 
          className="pill-btn-white" 
          onClick={onOpenManageWidgets}
          title="Customize dashboard cards & layout"
          style={{ cursor: 'pointer' }}
        >
          <LayoutGrid size={15} />
          <span>Manage widgets</span>
        </button>

        {/* Add new widget button matching mockup */}
        <button 
          className="pill-btn-purple" 
          onClick={onOpenAddModal}
          title="Add transaction or widget (Press N)"
          style={{ cursor: 'pointer' }}
        >
          <Plus size={16} />
          <span>Add new widget</span>
        </button>
      </div>
    </header>
  );
}
