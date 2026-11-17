import React, { useState, useEffect, useCallback } from 'react';
import FinSetSidebar from './components/FinSetSidebar';
import FinSetTopbar from './components/FinSetTopbar';
import FinSetStatCards from './components/FinSetStatCards';
import FinSetBalanceOverviewChart from './components/FinSetBalanceOverviewChart';
import FinSetBudgetComparisonChart from './components/FinSetBudgetComparisonChart';
import FinSetStatisticsDonut from './components/FinSetStatisticsDonut';
import FinSetTransactionsView from './components/FinSetTransactionsView';
import FinSetBillsView from './components/FinSetBillsView';
import FinSetExcelReportView from './components/FinSetExcelReportView';
import FinSetSettingsView from './components/FinSetSettingsView';
import FinSetHelpView from './components/FinSetHelpView';
import FinSetTransactionModal from './components/FinSetTransactionModal';
import FinSetDeleteModal from './components/FinSetDeleteModal';
import FinSetAuthModal from './components/FinSetAuthModal';
import FinSetLoginPage from './components/FinSetLoginPage';
import FinSetNotificationsPopover from './components/FinSetNotificationsPopover';
import FinSetManageWidgetsModal from './components/FinSetManageWidgetsModal';
import FinSetToast from './components/FinSetToast';
import { 
  fetchTransactions, 
  fetchSummary, 
  fetchCategories, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');

  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finset_theme') || 'light';
  });

  // Auth state - starts null so app opens to login page first
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('finset_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Financial data
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState({ credit: [], debit: [], payment_methods: [] });

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
    sort: 'date_desc'
  });

  // Date Period Filter
  const [datePeriod, setDatePeriod] = useState('this-month');

  // Dashboard Widgets Customizer Configuration
  const [widgetsConfig, setWidgetsConfig] = useState({
    statCards: true,
    balanceOverview: true,
    budgetComparison: true,
    statisticsDonut: true
  });
  const [isManageWidgetsOpen, setIsManageWidgetsOpen] = useState(false);

  // Notifications Popover
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toasts, setToasts] = useState([]);

  // Apply Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finset_theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadData = useCallback(async () => {
    try {
      const activeFilters = { ...filters };
      const now = new Date();
      const curYear = now.getFullYear();
      const curMonth = String(now.getMonth() + 1).padStart(2, '0');

      if (datePeriod === 'this-month') {
        activeFilters.startDate = `${curYear}-${curMonth}-01`;
      } else if (datePeriod === 'last-month') {
        const lastM = now.getMonth() === 0 ? 12 : now.getMonth();
        const lastY = now.getMonth() === 0 ? curYear - 1 : curYear;
        const lastMStr = String(lastM).padStart(2, '0');
        activeFilters.startDate = `${lastY}-${lastMStr}-01`;
        activeFilters.endDate = `${lastY}-${lastMStr}-31`;
      }

      const [txList, sumData, cats] = await Promise.all([
        fetchTransactions(activeFilters),
        fetchSummary(),
        fetchCategories()
      ]);
      setTransactions(txList);
      setSummary(sumData);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, datePeriod]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  // ==================== GLOBAL FUNCTION KEYS / SHORTCUTS ====================
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input, textarea, or select
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
          setIsAuthModalOpen(false);
          setIsNotificationsOpen(false);
          setIsManageWidgetsOpen(false);
          setDeleteTarget(null);
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsAuthModalOpen(false);
        setIsNotificationsOpen(false);
        setIsManageWidgetsOpen(false);
        setDeleteTarget(null);
      } else if (key === 'N' || e.key === '+') {
        e.preventDefault();
        setEditingTransaction(null);
        setIsModalOpen(true);
      } else if (key === 'T') {
        e.preventDefault();
        setActiveTab('transactions');
      } else if (key === 'B') {
        e.preventDefault();
        setActiveTab('bills');
      } else if (key === 'D' || key === 'A') {
        e.preventDefault();
        setActiveTab('analytics');
      } else if (key === 'E') {
        e.preventDefault();
        setActiveTab('excel-report');
      } else if (key === 'S') {
        e.preventDefault();
        setActiveTab('settings');
      } else if (key === 'H' || e.key === '?') {
        e.preventDefault();
        setActiveTab('help');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('finset_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('finset_user');
    showToast('Signed out successfully', 'info');
  };

  // Transaction CRUD handlers
  const handleSubmitTransaction = async (formData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, formData);
        showToast('Transaction updated successfully!', 'success');
      } else {
        await createTransaction(formData);
        showToast(
          `${formData.type === 'credit' ? 'Credit income' : 'Debit expense'} recorded!`, 
          'success'
        );
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
      throw err;
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteTransaction(id);
      showToast('Transaction deleted', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  // Quick navigation from Stat Cards to filtered Transactions
  const handleNavigateFromCard = (filterType) => {
    setFilters(prev => ({
      ...prev,
      type: filterType,
      search: ''
    }));
    setActiveTab('transactions');
  };

  // Search button click handler in Topbar
  const handleTopbarSearch = () => {
    setActiveTab('transactions');
    setTimeout(() => {
      const searchInput = document.querySelector('.tx-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
  };

  const handleToggleWidget = (widgetId) => {
    setWidgetsConfig(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  // If not logged in, open directly to Login page first
  if (!currentUser) {
    return (
      <div className="finset-outer-frame">
        <FinSetLoginPage
          onAuthSuccess={handleAuthSuccess}
          onShowToast={showToast}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <FinSetToast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className="finset-outer-frame">
      <div className="finset-canvas">
        {/* Left Sidebar with collapsible support & help link */}
        <FinSetSidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab} 
          theme={theme}
          onToggleTheme={toggleTheme}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="finset-main">
          {/* Top Bar with working actions */}
          <FinSetTopbar 
            activeTab={activeTab} 
            onOpenAddModal={handleOpenAddModal} 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenManageWidgets={() => setIsManageWidgetsOpen(true)}
            onSearchClick={handleTopbarSearch}
            datePeriod={datePeriod}
            onDatePeriodChange={setDatePeriod}
          />

          {/* Top 3 Stat Cards (enabled by widgetsConfig and visible on analytics, dashboard, transactions) */}
          {widgetsConfig.statCards && (activeTab === 'analytics' || activeTab === 'dashboard' || activeTab === 'transactions') && (
            <FinSetStatCards 
              summary={summary} 
              onNavigateToTransactions={handleNavigateFromCard}
            />
          )}

          {/* ==================== TAB CONTENT ROUTING ==================== */}

          {/* 1. Transactions Ledger View */}
          {activeTab === 'transactions' && (
            <FinSetTransactionsView
              transactions={transactions}
              isLoading={isLoading}
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
              onOpenAddModal={handleOpenAddModal}
              onEdit={handleOpenEditModal}
              onDelete={setDeleteTarget}
            />
          )}

          {/* 2. Monthly Bills Management & Upcoming Calendar */}
          {activeTab === 'bills' && (
            <FinSetBillsView onShowToast={showToast} />
          )}

          {/* 3. Monthly Excel Sheet Report Generator */}
          {activeTab === 'excel-report' && (
            <FinSetExcelReportView onShowToast={showToast} />
          )}

          {/* 4. Settings & Theme Preferences */}
          {activeTab === 'settings' && (
            <FinSetSettingsView
              theme={theme}
              onToggleTheme={toggleTheme}
              currentUser={currentUser}
              onShowToast={showToast}
            />
          )}

          {/* 5. Help & Guide Center */}
          {activeTab === 'help' && (
            <FinSetHelpView 
              onSelectTab={setActiveTab}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {/* 6. Analytics & Dashboard Charts View */}
          {(activeTab === 'analytics' || activeTab === 'dashboard') && (
            <div className="dashboard-split-grid">
              {/* Left Column: Line Area Chart + Bar Comparison Chart */}
              <div className="charts-column">
                {widgetsConfig.balanceOverview && (
                  <FinSetBalanceOverviewChart summary={summary} />
                )}
                {widgetsConfig.budgetComparison && (
                  <FinSetBudgetComparisonChart summary={summary} />
                )}
              </div>

              {/* Right Column: Statistics Donut Chart Card */}
              {widgetsConfig.statisticsDonut && (
                <div style={{ height: '100%' }}>
                  <FinSetStatisticsDonut 
                    summary={summary}
                    onShowDetails={() => setActiveTab('excel-report')} 
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Transaction Add / Edit Modal */}
      <FinSetTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        transaction={editingTransaction}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <FinSetDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        transaction={deleteTarget}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <FinSetAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Notifications Popover */}
      <FinSetNotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        summary={summary}
        onNavigateToBills={() => {
          setActiveTab('bills');
          setIsNotificationsOpen(false);
        }}
        onNavigateToTransactions={() => {
          setActiveTab('transactions');
          setIsNotificationsOpen(false);
        }}
      />

      {/* Manage Dashboard Widgets Modal */}
      <FinSetManageWidgetsModal
        isOpen={isManageWidgetsOpen}
        onClose={() => setIsManageWidgetsOpen(false)}
        widgetsConfig={widgetsConfig}
        onToggleWidget={handleToggleWidget}
      />

      {/* Toast Alerts */}
      <FinSetToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
