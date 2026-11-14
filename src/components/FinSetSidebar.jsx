import React from 'react';
import { 
  LayoutGrid, 
  ArrowLeftRight, 
  TrendingUp, 
  FileSpreadsheet, 
  CalendarClock, 
  Settings, 
  HelpCircle, 
  LogOut, 
  LogIn,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';

export default function FinSetSidebar({ 
  activeTab, 
  onSelectTab, 
  theme, 
  onToggleTheme, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'bills', label: 'Monthly Bills', icon: CalendarClock },
    { id: 'excel-report', label: 'Excel Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="finset-sidebar">
      <div className="sidebar-top">
        {/* Brand row */}
        <div className="brand-row">
          <div className="brand-badge">
            <div className="logo-circle">
              <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-1px' }}>F</span>
            </div>
            <span className="brand-text">FinSet</span>
          </div>
          <button className="collapse-btn" title="FinSet Pro">
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <button className="nav-link" onClick={() => onSelectTab('help')}>
          <HelpCircle className="nav-icon" />
          <span>Help & Guide</span>
        </button>

        {currentUser ? (
          <button className="nav-link" onClick={onLogout}>
            <LogOut className="nav-icon" />
            <span>Log out</span>
          </button>
        ) : (
          <button className="nav-link" onClick={onOpenAuth}>
            <LogIn className="nav-icon" color="#7B61FF" />
            <span style={{ color: '#7B61FF', fontWeight: 700 }}>Sign In</span>
          </button>
        )}

        {/* Theme switch pill */}
        <div className="theme-switch-pill" style={{ marginTop: '6px' }}>
          <button 
            className={`theme-opt-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => onToggleTheme('light')}
            title="Light Theme"
          >
            <Sun size={15} />
          </button>
          <button 
            className={`theme-opt-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => onToggleTheme('dark')}
            title="Dark Theme"
          >
            <Moon size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
