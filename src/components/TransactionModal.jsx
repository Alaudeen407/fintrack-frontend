import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction, // if editing, existing transaction object; otherwise null
  categories
}) {
  const isEditing = Boolean(transaction);

  const [type, setType] = useState('debit');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories for selected type
  const currentCategories = type === 'credit' 
    ? (categories.credit || []) 
    : (categories.debit || []);
  const paymentMethods = categories.payment_methods || [
    'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI / Online', 'Check'
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type || 'debit');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setDescription(transaction.description || '');
      setDate(transaction.date || '');
      setPaymentMethod(transaction.paymentMethod || transaction.payment_method || 'Cash');
      setNotes(transaction.notes || '');

      const isKnown = currentCategories.includes(transaction.category);
      if (isKnown) {
        setCategory(transaction.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('__custom__');
        setIsCustomCategory(true);
        setCustomCategory(transaction.category || '');
      }
    } else {
      // Default new transaction values
      setType('debit');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Cash');
      setNotes('');
      setIsCustomCategory(false);
      setCustomCategory('');
      setCategory(currentCategories[0] || 'Groceries');
    }
    setError('');
  }, [transaction, isOpen]);

  // When type changes and not editing, update default category
  const handleTypeChange = (newType) => {
    setType(newType);
    const available = newType === 'credit' ? categories.credit : categories.debit;
    if (available && available.length > 0) {
      setCategory(available[0]);
      setIsCustomCategory(false);
    }
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
      setCategory('__custom__');
    } else {
      setIsCustomCategory(false);
      setCategory(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setError('Description cannot be empty.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setError('Please select or specify a category.');
      return;
    }

    if (!date) {
      setError('Please choose a valid date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parsedAmount,
        category: finalCategory,
        description: description.trim(),
        date,
        payment_method: paymentMethod,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Record New Transaction'}
          </h2>
          <button className="btn-icon" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div 
                style={{ 
                  backgroundColor: 'var(--debit-bg)', 
                  border: '1px solid var(--debit-border)', 
                  color: 'var(--debit-color)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Type Toggle: Credit vs Debit */}
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-btn ${type === 'credit' ? 'active credit' : ''}`}
                onClick={() => handleTypeChange('credit')}
              >
                <ArrowDownLeft size={18} />
                <span>Credit (Income)</span>
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'debit' ? 'active debit' : ''}`}
                onClick={() => handleTypeChange('debit')}
              >
                <ArrowUpRight size={18} />
                <span>Debit (Expense)</span>
              </button>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input
                type="text"
                className="form-input"
                placeholder={type === 'credit' ? "e.g., Client Payment, Salary" : "e.g., Grocery shopping, Utilities"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category & Date in Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  className="form-select"
                  value={isCustomCategory ? '__custom__' : category}
                  onChange={handleCategorySelect}
                >
                  {currentCategories.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                  <option value="__custom__">+ Custom Category...</option>
                </select>

                {isCustomCategory && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    style={{ marginTop: '0.4rem' }}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((pm, idx) => (
                  <option key={idx} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Additional details, receipts or transaction reference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn ${type === 'credit' ? 'btn-credit' : 'btn-debit'}`}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : isEditing 
                  ? 'Update Transaction' 
                  : type === 'credit' ? '+ Record Credit' : '- Record Debit'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
