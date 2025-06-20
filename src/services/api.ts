import { Expense, Category, Issuer } from '../types/models'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const api = {
  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(`${API_BASE_URL}/expenses`)
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    })
    if (!response.ok) throw new Error('Failed to create expense')
    return response.json()
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  async getIssuers(): Promise<Issuer[]> {
    const response = await fetch(`${API_BASE_URL}/issuers`)
    if (!response.ok) throw new Error('Failed to fetch issuers')
    return response.json()
  },

  async createIssuer(issuer: Partial<Issuer>): Promise<Issuer> {
    const response = await fetch(`${API_BASE_URL}/issuers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issuer),
    })
    if (!response.ok) throw new Error('Failed to create issuer')
    return response.json()
  },

  async getMonthlyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/monthly`)
    if (!response.ok) throw new Error('Failed to fetch monthly stats')
    return response.json()
  },

  async getCategoryStats() {
    const response = await fetch(`${API_BASE_URL}/stats/categories`)
    if (!response.ok) throw new Error('Failed to fetch category stats')
    return response.json()
  },

  async getOccupancyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/occupancy`)
    if (!response.ok) throw new Error('Failed to fetch occupancy stats')
    return response.json()
  }
}
