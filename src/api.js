const RAW_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrack-backend-itqd.onrender.com/api';
const BASE_URL = RAW_URL.replace(/\/+$/, '');

// ==================== TRANSACTIONS ====================
export async function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.sort) params.append('sort', filters.sort);

  const res = await fetch(`${BASE_URL}/transactions?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch transactions');
  }
  return res.json();
}

export async function fetchSummary(filters = {}) {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const res = await fetch(`${BASE_URL}/summary?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch summary');
  }
  return res.json();
}

export async function createTransaction(data) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create transaction');
  return json;
}

export async function updateTransaction(id, data) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update transaction');
  return json;
}

export async function deleteTransaction(id) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete transaction');
  return json;
}

export function getExportUrl() {
  return `${BASE_URL}/export`;
}

// ==================== AUTHENTICATION ====================
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to login');
  return json;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to register');
  return json;
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/auth/me`);
  if (!res.ok) return null;
  return res.json();
}

// ==================== MONTHLY EXCEL SHEET REPORT ====================
export function getExcelReportUrl(month) {
  return month ? `${BASE_URL}/report/excel?month=${month}` : `${BASE_URL}/report/excel`;
}

export async function fetchReportPreview(month) {
  const url = month ? `${BASE_URL}/report/preview?month=${month}` : `${BASE_URL}/report/preview`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load report preview');
  return res.json();
}

// ==================== BILLS MANAGEMENT & CALENDAR ====================
export async function fetchBills(status = 'all') {
  const url = status && status !== 'all' ? `${BASE_URL}/bills?status=${status}` : `${BASE_URL}/bills`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load bills');
  return res.json();
}

export async function fetchBillsSummary() {
  const res = await fetch(`${BASE_URL}/bills/summary`);
  if (!res.ok) throw new Error('Failed to load bills summary');
  return res.json();
}

export async function createBill(data) {
  const res = await fetch(`${BASE_URL}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create bill');
  return json;
}

export async function updateBill(id, data) {
  const res = await fetch(`${BASE_URL}/bills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update bill');
  return json;
}

export async function deleteBill(id) {
  const res = await fetch(`${BASE_URL}/bills/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete bill');
  return json;
}

export async function payBill(id, recordExpense = true) {
  const res = await fetch(`${BASE_URL}/bills/${id}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record_expense: recordExpense }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to process bill payment');
  return json;
}

// ==================== CATEGORIES & STATUS ====================
export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchMongoStatus() {
  try {
    const res = await fetch(`${BASE_URL}/mongodb/status`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function resetDatabase() {
  const res = await fetch(`${BASE_URL}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}
