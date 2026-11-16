const RAW_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrack-backend-itqd.onrender.com/api';
const BASE_URL = RAW_URL.replace(/\/+$/, '');

/**
 * Returns auth headers with the current logged-in user's ID
 * to ensure all requests are strictly scoped to the active user.
 */
function getAuthHeaders() {
  const headers = {};
  try {
    const saved = localStorage.getItem('finset_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user && user.id) {
        headers['X-User-Id'] = String(user.id);
        headers['Authorization'] = `Bearer session_${user.id}`;
      }
    }
  } catch {}
  return headers;
}

/**
 * Global fetch wrapper automatically injecting user credentials
 */
async function apiFetch(endpoint, options = {}) {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    ...(options.headers || {})
  };
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
}

function getActiveUserId() {
  try {
    const saved = localStorage.getItem('finset_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user?.id || '';
    }
  } catch {}
  return '';
}

// ==================== TRANSACTIONS ====================
export async function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  const userId = getActiveUserId();
  if (userId) params.append('user_id', userId);
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.sort) params.append('sort', filters.sort);

  const res = await apiFetch(`/transactions?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch transactions');
  }
  return res.json();
}

export async function fetchSummary(filters = {}) {
  const params = new URLSearchParams();
  const userId = getActiveUserId();
  if (userId) params.append('user_id', userId);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const res = await apiFetch(`/summary?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch summary');
  }
  return res.json();
}

export async function createTransaction(data) {
  const userId = getActiveUserId();
  const payload = { ...data };
  if (userId && !payload.user_id) {
    payload.user_id = userId;
  }

  const res = await apiFetch('/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create transaction');
  return json;
}

export async function updateTransaction(id, data) {
  const res = await apiFetch(`/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update transaction');
  return json;
}

export async function deleteTransaction(id) {
  const res = await apiFetch(`/transactions/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete transaction');
  return json;
}

export function getExportUrl() {
  const userId = getActiveUserId();
  return userId ? `${BASE_URL}/export?user_id=${userId}` : `${BASE_URL}/export`;
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
  const res = await apiFetch('/auth/me');
  if (!res.ok) return null;
  return res.json();
}

// ==================== MONTHLY EXCEL SHEET REPORT ====================
export function getExcelReportUrl(month) {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (userId) params.append('user_id', userId);
  const q = params.toString();
  return q ? `${BASE_URL}/report/excel?${q}` : `${BASE_URL}/report/excel`;
}

export async function fetchReportPreview(month) {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (userId) params.append('user_id', userId);
  const q = params.toString();

  const url = q ? `/report/preview?${q}` : '/report/preview';
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Failed to load report preview');
  return res.json();
}

// ==================== BILLS MANAGEMENT & CALENDAR ====================
export async function fetchBills(status = 'all') {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (userId) params.append('user_id', userId);
  const q = params.toString();

  const url = q ? `/bills?${q}` : '/bills';
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Failed to load bills');
  return res.json();
}

export async function fetchBillsSummary() {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (userId) params.append('user_id', userId);
  const q = params.toString();

  const url = q ? `/bills/summary?${q}` : '/bills/summary';
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Failed to load bills summary');
  return res.json();
}

export async function createBill(data) {
  const userId = getActiveUserId();
  const payload = { ...data };
  if (userId && !payload.user_id) {
    payload.user_id = userId;
  }

  const res = await apiFetch('/bills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create bill');
  return json;
}

export async function updateBill(id, data) {
  const res = await apiFetch(`/bills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update bill');
  return json;
}

export async function deleteBill(id) {
  const res = await apiFetch(`/bills/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete bill');
  return json;
}

export async function payBill(id, recordExpense = true) {
  const userId = getActiveUserId();
  const res = await apiFetch(`/bills/${id}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record_expense: recordExpense, user_id: userId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to process bill payment');
  return json;
}

// ==================== CATEGORIES & STATUS ====================
export async function fetchCategories() {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (userId) params.append('user_id', userId);
  const q = params.toString();

  const url = q ? `/categories?${q}` : '/categories';
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchMongoStatus() {
  try {
    const res = await apiFetch('/mongodb/status');
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function resetDatabase() {
  const userId = getActiveUserId();
  const params = new URLSearchParams();
  if (userId) params.append('user_id', userId);
  const q = params.toString();

  const url = q ? `/reset?${q}` : '/reset';
  const res = await apiFetch(url, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}
