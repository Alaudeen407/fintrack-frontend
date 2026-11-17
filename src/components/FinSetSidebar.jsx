import React, { useState } from 'react';
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
  ChevronRight,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'bills', label: 'Monthly Bills', icon: CalendarClock },
    { id: 'excel-report', label: 'Excel Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`finset-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '78px' : '230px',
        transition: 'width 0.25s ease'
      }}
    >
      <div className="sidebar-top">
        {/* Brand row with working collapse toggle */}
        <div className="brand-row">
          <div 
            className="brand-badge" 
            onClick={() => onSelectTab('dashboard')} 
            style={{ cursor: 'pointer' }}
            title="FinSet Home"
          >
            <div className="logo-circle">
              <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-1px' }}>F</span>
            </div>
            {!isCollapsed && <span className="brand-text">FinSet</span>}
          </div>
          <button 
            className="collapse-btn" 
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsCollapsed(c => !c)}
            style={{ cursor: 'pointer' }}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
                title={isCollapsed ? item.label : undefined}
                style={{
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '10px 0' : '10px 14px'
                }}
              >
                <Icon className="nav-icon" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <button 
          className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => onSelectTab('help')}
          title="Help & Guide (Press H)"
          style={{
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: isCollapsed ? '10px 0' : '10px 14px'
          }}
        >
          <HelpCircle className="nav-icon" />
          {!isCollapsed && <span>Help & Guide</span>}
        </button>

        {currentUser ? (
          <button 
            className="nav-link" 
            onClick={onLogout}
            title="Log out"
            style={{
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: isCollapsed ? '10px 0' : '10px 14px'
            }}
          >
            <LogOut className="nav-icon" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        ) : (
          <button 
            className="nav-link" 
            onClick={onOpenAuth}
            title="Sign In"
            style={{
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: isCollapsed ? '10px 0' : '10px 14px'
            }}
          >
            <LogIn className="nav-icon" color="#7B61FF" />
            {!isCollapsed && <span style={{ color: '#7B61FF', fontWeight: 700 }}>Sign In</span>}
          </button>
        )}

        {/* Theme switch pill */}
        <div 
          className="theme-switch-pill" 
          style={{ 
            marginTop: '6px',
            flexDirection: isCollapsed ? 'column' : 'row',
            width: isCollapsed ? '42px' : 'auto',
            margin: isCollapsed ? '6px auto 0 auto' : '6px 0 0 0'
          }}
        >
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
