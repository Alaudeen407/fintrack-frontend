import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function FinSetTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction,
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
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategories = type === 'credit' 
    ? (categories.credit || ['Salary', 'Freelance', 'Investments', 'Consulting', 'Bonus', 'Refunds']) 
    : (categories.debit || ['Money transfer', 'Cafe & Restaurants', 'Rent', 'Education', 'Food & Groceries', 'Others']);

  const paymentMethods = categories.payment_methods || [
    'Bank Transfer', 'Credit Card', 'Debit Card', 'Cash', 'UPI / Online'
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type || 'debit');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setDescription(transaction.description || '');
      setDate(transaction.date || '');
      setPaymentMethod(transaction.payment_method || 'Bank Transfer');
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
      setType('debit');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Bank Transfer');
      setNotes('');
      setIsCustomCategory(false);
      setCustomCategory('');
      setCategory(currentCategories[0] || 'Money transfer');
    }
    setError('');
  }, [transaction, isOpen]);

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

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parsedAmount,
        category: finalCategory,
        description: description.trim(),
        date: date || new Date().toISOString().split('T')[0],
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
      <div className="modal-finset-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-finset-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14171A' }}>
            {isEditing ? 'Edit Transaction' : 'Record Transaction'}
          </h2>
          <button className="collapse-btn" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-finset-body">
            {error && (
              <div style={{
                backgroundColor: 'var(--red-badge-bg)',
                color: 'var(--red-badge-text)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}>
                {error}
              </div>
            )}

            {/* Credit vs Debit choice */}
            <div className="type-select-row">
              <button
                type="button"
                className={`type-choice-btn ${type === 'credit' ? 'active credit' : ''}`}
                onClick={() => handleTypeChange('credit')}
              >
                <ArrowDownLeft size={16} />
                <span>Credit (Income)</span>
              </button>
              <button
                type="button"
                className={`type-choice-btn ${type === 'debit' ? 'active debit' : ''}`}
                onClick={() => handleTypeChange('debit')}
              >
                <ArrowUpRight size={16} />
                <span>Debit (Expense)</span>
              </button>
            </div>

            {/* Amount */}
            <div className="finset-field">
              <label className="finset-label">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="finset-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="finset-field">
              <label className="finset-label">Description *</label>
              <input
                type="text"
                className="finset-input"
                placeholder={type === 'credit' ? "e.g., Monthly Tech Salary" : "e.g., Apartment Rent, Cafe Lunch"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="finset-field">
                <label className="finset-label">Category *</label>
                <select
                  className="finset-select"
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
                    className="finset-input"
                    placeholder="Enter category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    style={{ marginTop: '4px' }}
                    required
                  />
                )}
              </div>

              <div className="finset-field">
                <label className="finset-label">Date *</label>
                <input
                  type="date"
                  className="finset-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="finset-field">
              <label className="finset-label">Payment Method</label>
              <select
                className="finset-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((pm, idx) => (
                  <option key={idx} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="finset-field">
              <label className="finset-label">Notes (Optional)</label>
              <textarea
                className="finset-textarea"
                rows={2}
                placeholder="Transaction memo or invoice reference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-finset-footer">
            <button 
              type="button" 
              className="pill-btn-white" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="pill-btn-purple"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : isEditing 
                  ? 'Update' 
                  : type === 'credit' ? '+ Record Credit' : '- Record Debit'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
