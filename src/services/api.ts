import { Expense, Category, Issuer } from '../types/models'

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

// --- Auth endpoints ---
export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) throw new Error('Login failed')
  const data = await response.json()
  setToken(data.token)
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
  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(expense),
    })
    if (!response.ok) throw new Error('Failed to create expense')
    return response.json()
  },

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(expense),
    })
    if (!response.ok) throw new Error('Failed to update expense')
    return response.json()
  },

  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete expense')
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete category')
  },

  async getIssuers(): Promise<Issuer[]> {
    const response = await fetch(`${API_BASE_URL}/issuers`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch issuers')
    return response.json()
  },

  async createIssuer(issuer: Partial<Issuer>): Promise<Issuer> {
    const response = await fetch(`${API_BASE_URL}/issuers`, {
      method: 'POST',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(issuer),
    })
    if (!response.ok) throw new Error('Failed to create issuer')
    return response.json()
  },

  async updateIssuer(id: number, issuer: Partial<Issuer>): Promise<Issuer> {
    const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
      method: 'PUT',
      headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(issuer),
    })
    if (!response.ok) throw new Error('Failed to update issuer')
    return response.json()
  },

  async deleteIssuer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete issuer')
  },

  async getMonthlyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
      headers: mergeHeaders({}, authHeaders())
    })
    if (!response.ok) throw new Error('Failed to fetch monthly stats')
    return response.json()
  },

  async getCategoryStats() {
    const response = await fetch(`${API_BASE_URL}/stats/categories`, {
      headers: mergeHeaders({}, authHeaders())
    })
    if (!response.ok) throw new Error('Failed to fetch category stats')
    return response.json()
  },

  async getOccupancyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/occupancy`, {
      headers: mergeHeaders({}, authHeaders())
    })
    if (!response.ok) throw new Error('Failed to fetch occupancy stats')
    return response.json()
  }
}
