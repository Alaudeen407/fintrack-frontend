import React from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Search, 
  Bell, 
  LayoutGrid, 
  Plus,
  User
} from 'lucide-react';

export default function FinSetTopbar({ 
  activeTab = 'analytics', 
  onOpenAddModal, 
  currentUser, 
  onOpenAuth 
}) {
  const titles = {
    dashboard: { title: 'Dashboard', sub: 'High-level financial summary and account balances' },
    analytics: { title: 'Analytics', sub: 'Detailed overview of your financial situation' },
    transactions: { title: 'Transactions Ledger', sub: 'Credit (Income) and Debit (Expense) accounting' },
    bills: { title: 'Monthly Bills & Calendar', sub: 'Recurring commitments, payment status & upcoming due dates' },
    'excel-report': { title: 'Monthly Excel Sheet Report', sub: 'Multi-sheet Microsoft Excel (.xlsx) financial export' },
    settings: { title: 'Settings & Appearance', sub: 'Customize user profile, theme & preferences' }
  };

  const currentHeader = titles[activeTab] || titles.analytics;

  return (
    <header className="finset-topbar">
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{currentHeader.title}</h1>
          <p className="page-subtitle">{currentHeader.sub}</p>
        </div>

        {/* Date Filter Pill */}
        <div className="date-pill">
          <Calendar size={15} color="var(--text-sub)" />
          <span>This month</span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>

      <div className="topbar-right">
        {/* Search round button */}
        <button className="icon-btn-round" title="Search">
          <Search size={16} />
        </button>

        {/* Bell notification round button with red badge '3' */}
        <button className="icon-btn-round" title="Notifications">
          <Bell size={16} />
          <span className="notif-badge">3</span>
        </button>

        {/* User profile pill or Sign In button */}
        {currentUser ? (
          <div className="user-profile-pill" onClick={onOpenAuth} title="User Profile">
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
          <button className="pill-btn-white" onClick={onOpenAuth}>
            <User size={15} color="var(--finset-purple)" />
            <span>Sign In</span>
          </button>
        )}

        {/* Manage widgets button */}
        <button className="pill-btn-white" onClick={() => alert('Customizing dashboard widgets layout...')}>
          <LayoutGrid size={15} />
          <span>Manage widgets</span>
        </button>

        {/* Add new widget / Add transaction button */}
        <button className="pill-btn-purple" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add new widget</span>
        </button>
      </div>
    </header>
  );
}
