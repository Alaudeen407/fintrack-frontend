import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { 
  fetchBills, 
  fetchBillsSummary, 
  createBill, 
  updateBill, 
  deleteBill, 
  payBill 
} from '../api';

export default function FinSetBillsView({ onShowToast }) {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('15');
  const [category, setCategory] = useState('Utilities');
  const [autoPay, setAutoPay] = useState(false);
  const [notes, setNotes] = useState('');

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calendar setup for current month
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 = Sun

  useEffect(() => {
    loadBillsData();
  }, [filterStatus]);

  const loadBillsData = async () => {
    try {
      const [billsList, sum] = await Promise.all([
        fetchBills(filterStatus),
        fetchBillsSummary()
      ]);
      setBills(billsList);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load bills', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBill(null);
    setName('');
    setAmount('');
    setDueDay('15');
    setCategory('Utilities');
    setAutoPay(false);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setEditingBill(b);
    setName(b.name);
    setAmount(String(b.amount));
    setDueDay(String(b.due_day));
    setCategory(b.category);
    setAutoPay(Boolean(b.auto_pay));
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: name.trim(),
        amount: parseFloat(amount),
        due_day: parseInt(dueDay, 10),
        category,
        auto_pay: autoPay,
        notes: notes.trim()
      };

      if (editingBill) {
        await updateBill(editingBill.id, payload);
        onShowToast('Bill updated successfully', 'success');
      } else {
        await createBill(payload);
        onShowToast('New monthly bill added', 'success');
      }
      setIsModalOpen(false);
      await loadBillsData();
    } catch (err) {
      onShowToast(err.message || 'Operation failed', 'error');
    }
  };

  const handlePayBill = async (billId, billName) => {
    try {
      await payBill(billId, true);
      onShowToast(`Bill '${billName}' marked as paid & debited to expenses!`, 'success');
      await loadBillsData();
    } catch (err) {
      onShowToast(err.message || 'Payment update failed', 'error');
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Delete this bill from recurring schedule?')) return;
    try {
      await deleteBill(billId);
      onShowToast('Bill deleted', 'success');
      await loadBillsData();
    } catch (err) {
      onShowToast(err.message || 'Delete failed', 'error');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  // Bills map by due day for calendar highlighting
  const billsByDay = {};
  bills.forEach(b => {
    if (!billsByDay[b.due_day]) billsByDay[b.due_day] = [];
    billsByDay[b.due_day].push(b);
  });

  const displayedBills = selectedDay 
    ? bills.filter(b => b.due_day === selectedDay)
    : bills;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Controls */}
      <div className="tx-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon size={20} color="var(--finset-purple)" />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Monthly Bills & Upcoming Calendar
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Manage recurring commitments and track payment due dates
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="pill-btn-purple" onClick={handleOpenAddModal}>
            <Plus size={15} />
            <span>Add New Bill</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stat-cards-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Total Monthly Bills */}
        <div className="finset-card">
          <span className="stat-card-title">Total Monthly Bills</span>
          <div className="stat-main-number" style={{ marginTop: '8px' }}>
            {formatCurrency(summary?.total_bills || 0)}
          </div>
          <div className="stat-card-bottom">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {summary?.total_count || 0} scheduled recurring bills
            </span>
          </div>
        </div>

        {/* Total Paid */}
        <div className="finset-card">
          <span className="stat-card-title">Paid This Month</span>
          <div className="stat-main-number" style={{ marginTop: '8px', color: '#10B981' }}>
            {formatCurrency(summary?.total_paid || 0)}
          </div>
          <div className="stat-card-bottom">
            <div className="pill-badge green">
              <CheckCircle2 size={11} />
              <span>{summary?.paid_count || 0} Paid</span>
            </div>
          </div>
        </div>

        {/* Total Pending / Unpaid */}
        <div className="finset-card">
          <span className="stat-card-title">Pending Unpaid</span>
          <div className="stat-main-number" style={{ marginTop: '8px', color: '#F59E0B' }}>
            {formatCurrency(summary?.total_pending || 0)}
          </div>
          <div className="stat-card-bottom">
            <div className="pill-badge amber">
              <Clock size={11} />
              <span>{summary?.pending_count || 0} Pending</span>
            </div>
          </div>
        </div>

        {/* Next Bill Due */}
        <div className="finset-card">
          <span className="stat-card-title">Next Bill Due</span>
          <div className="stat-main-number" style={{ marginTop: '8px', fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary?.next_bill ? summary.next_bill.name : 'All Paid!'}
          </div>
          <div className="stat-card-bottom">
            {summary?.next_bill ? (
              <span style={{ fontSize: '0.74rem', color: '#F43F5E', fontWeight: 700 }}>
                {summary.days_remaining === 0 ? 'Due Today!' : summary.days_remaining > 0 ? `Due in ${summary.days_remaining} days` : 'Overdue'}
                {' '}({formatCurrency(summary.next_bill.amount)})
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#10B981' }}>No upcoming bills due</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Calendar on Left + Bills List on Right */}
      <div className="bills-grid">
        {/* Left Column: Interactive Monthly Calendar */}
        <div className="calendar-card">
          <div className="calendar-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={16} color="var(--finset-purple)" />
              <span className="card-title-text">{currentMonthName}</span>
            </div>
            {selectedDay && (
              <button
                className="pill-btn-white"
                style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                onClick={() => setSelectedDay(null)}
              >
                Clear Day Filter (Day {selectedDay})
              </button>
            )}
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="calendar-weekday-header">{d}</div>
            ))}

            {/* Empty offset days */}
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day-cell empty" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasBill = Boolean(billsByDay[day] && billsByDay[day].length > 0);
              const isToday = day === currentDay;
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  className={`calendar-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasBill ? 'has-bill' : ''}`}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  title={hasBill ? `${billsByDay[day].length} bill(s) due on day ${day}` : `Day ${day}`}
                >
                  <span>{day}</span>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F43F5E' }} />
              <span>Bill Due Date</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid var(--finset-purple)', display: 'inline-block' }} />
              <span>Current Today</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bills Management List */}
        <div className="finset-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-inner-header">
            <span className="card-title-text">
              {selectedDay ? `Bills Due Day ${selectedDay}` : 'Monthly Bills Schedule'}
            </span>

            {/* Status Filter */}
            <div className="tx-type-tabs" style={{ padding: '2px' }}>
              <button
                className={`tx-type-tab ${filterStatus === 'all' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                className={`tx-type-tab ${filterStatus === 'unpaid' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => setFilterStatus('unpaid')}
              >
                Unpaid
              </button>
              <button
                className={`tx-type-tab ${filterStatus === 'paid' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => setFilterStatus('paid')}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Bills List Items */}
          <div style={{ overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedBills.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                No bills found for this filter.
              </div>
            ) : (
              displayedBills.map((b) => {
                const isPaid = b.status === 'paid';
                return (
                  <div key={b.id} className="bill-card-item">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {b.name}
                        </span>
                        {b.auto_pay === 1 && (
                          <span title="Auto-Pay Enabled" style={{ color: 'var(--finset-purple)' }}>
                            <Zap size={13} fill="currentColor" />
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span>Due Day {b.due_day}</span>
                        <span>•</span>
                        <span>{b.category}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`bill-status-pill ${b.status}`}>
                        {b.status}
                      </span>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {formatCurrency(b.amount)}
                      </span>

                      {!isPaid && (
                        <button
                          className="pill-btn-purple"
                          style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                          onClick={() => handlePayBill(b.id, b.name)}
                          title="Mark Paid & Record Expense"
                        >
                          Pay
                        </button>
                      )}

                      <button
                        className="icon-btn-round"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleOpenEditModal(b)}
                        title="Edit Bill"
                      >
                        <Edit3 size={12} />
                      </button>

                      <button
                        className="icon-btn-round"
                        style={{ width: '28px', height: '28px', color: '#F43F5E' }}
                        onClick={() => handleDeleteBill(b.id)}
                        title="Delete Bill"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Bill Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-finset-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-finset-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {editingBill ? 'Edit Monthly Bill' : 'Add Recurring Monthly Bill'}
              </h3>
              <button className="collapse-btn" onClick={() => setIsModalOpen(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmitBill}>
              <div className="modal-finset-body">
                <div className="finset-field">
                  <label className="finset-label">Bill Name *</label>
                  <input
                    type="text"
                    className="finset-input"
                    placeholder="e.g. Electric & Utility, Gym Membership"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="finset-field">
                    <label className="finset-label">Amount (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="finset-input"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="finset-field">
                    <label className="finset-label">Due Day of Month (1-31) *</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      className="finset-input"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="finset-field">
                  <label className="finset-label">Category</label>
                  <select
                    className="finset-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Credit & Loans">Credit & Loans</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="autopay-check"
                    checked={autoPay}
                    onChange={(e) => setAutoPay(e.target.checked)}
                    style={{ accentColor: 'var(--finset-purple)', width: 16, height: 16 }}
                  />
                  <label htmlFor="autopay-check" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                    Auto-Debit / Auto-Pay Enabled
                  </label>
                </div>

                <div className="finset-field">
                  <label className="finset-label">Notes (Optional)</label>
                  <textarea
                    className="finset-textarea"
                    placeholder="Account number, billing cycle info..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-finset-footer">
                <button
                  type="button"
                  className="pill-btn-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill-btn-purple"
                >
                  {editingBill ? 'Save Changes' : 'Create Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
