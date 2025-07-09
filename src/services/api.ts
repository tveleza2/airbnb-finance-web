import { Invoice, Category, Issuer } from '../types/models'
import { clearSession } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// --- Auth helpers ---
function getToken() {
  return localStorage.getItem('token')
}

function setToken(token: string) {
  localStorage.setItem('token', token)
}

function removeToken() {
  localStorage.removeItem('token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function mergeHeaders(base: Record<string, string>, extra?: Record<string, string>) {
  return extra ? { ...base, ...extra } : base
}

function handleAuthError(response: Response) {
  if (response.status === 401) {
    clearSession();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  return response;
}

// --- Auth endpoints ---
export async function login(username: string, password: string, returnResponse?: boolean): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) throw new Error('Login failed')
  const data = await response.json()
  setToken(data.token)
  if (returnResponse) return data
}

export async function register(user: { username: string, password: string, email: string, role?: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!response.ok) throw new Error('Registration failed')
}

export function logout() {
  removeToken()
}

// --- Protected CRUD endpoints ---
export const api = {
  async getInvoices(): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch invoices')
    return response.json()
  },

  async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(invoice),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to create invoice')
    return response.json()
  },

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(invoice),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to update invoice')
    return response.json()
  },

  async deleteInvoice(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to delete invoice')
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(category),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(category),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to delete category')
  },

  async getIssuers(): Promise<Issuer[]> {
    const response = await fetch(`${API_BASE_URL}/issuers`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch issuers')
    return response.json()
  },

  async createIssuer(issuer: Partial<Issuer>): Promise<Issuer> {
    const response = await fetch(`${API_BASE_URL}/issuers`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(issuer),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to create issuer')
    return response.json()
  },

  async updateIssuer(id: string, issuer: Partial<Issuer>): Promise<Issuer> {
    const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(issuer),
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to update issuer')
    return response.json()
  },

  async deleteIssuer(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to delete issuer')
  },

  async getMonthlyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
      headers: mergeHeaders({}, authHeaders())
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch monthly stats')
    return response.json()
  },

  async getCategoryStats() {
    const response = await fetch(`${API_BASE_URL}/stats/categories`, {
      headers: mergeHeaders({}, authHeaders())
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch category stats')
    return response.json()
  },

  async getOccupancyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/occupancy`, {
      headers: mergeHeaders({}, authHeaders())
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch occupancy stats')
    return response.json()
  },

  async getTotalIncome(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/stats/total-income`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch total income')
    const data = await response.json()
    return data.total_income
  },

  async getTotalExpenses(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/stats/total-expenses`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch total expenses')
    const data = await response.json()
    return data.total_expenses
  },

  async getNetProfit(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/stats/net-profit`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch net profit')
    const data = await response.json()
    return data.net_profit
  },

  async getMonthlyBalance(): Promise<Record<string, number>> {
    const response = await fetch(`${API_BASE_URL}/stats/monthly-balance`, {
      headers: authHeaders()
    })
    handleAuthError(response);
    if (!response.ok) throw new Error('Failed to fetch monthly balance')
    const data = await response.json()
    return data.monthly_balance
  },
}

export async function getDropboxAuthUrl(userId: string) {
  const res = await fetch(`/api/dropbox/auth-url?user_id=${userId}`);
  return res.json();
}
