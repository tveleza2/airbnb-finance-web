import { clearSession } from './session';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// --- Auth helpers ---
function getToken() {
    return localStorage.getItem('token');
}
function setToken(token) {
    localStorage.setItem('token', token);
}
function removeToken() {
    localStorage.removeItem('token');
}
function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
function mergeHeaders(base, extra) {
    return extra ? { ...base, ...extra } : base;
}
function handleAuthError(response) {
    if (response.status === 401) {
        clearSession();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
    }
    return response;
}
// --- Auth endpoints ---
export async function login(username, password, returnResponse) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok)
        throw new Error('Login failed');
    const data = await response.json();
    setToken(data.token);
    if (returnResponse)
        return data;
}
export async function register(user) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!response.ok)
        throw new Error('Registration failed');
}
export function logout() {
    removeToken();
}
// --- Protected CRUD endpoints ---
export const api = {
    async getInvoices() {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch invoices');
        return response.json();
    },
    async createInvoice(invoice) {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
            method: 'POST',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(invoice),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to create invoice');
        return response.json();
    },
    async updateInvoice(id, invoice) {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
            method: 'PUT',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(invoice),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to update invoice');
        return response.json();
    },
    async deleteInvoice(id) {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to delete invoice');
    },
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch categories');
        return response.json();
    },
    async createCategory(category) {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(category),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to create category');
        return response.json();
    },
    async updateCategory(id, category) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(category),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to update category');
        return response.json();
    },
    async deleteCategory(id) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to delete category');
    },
    async getIssuers() {
        const response = await fetch(`${API_BASE_URL}/issuers`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch issuers');
        return response.json();
    },
    async createIssuer(issuer) {
        const response = await fetch(`${API_BASE_URL}/issuers`, {
            method: 'POST',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(issuer),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to create issuer');
        return response.json();
    },
    async updateIssuer(id, issuer) {
        const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
            method: 'PUT',
            headers: mergeHeaders({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(issuer),
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to update issuer');
        return response.json();
    },
    async deleteIssuer(id) {
        const response = await fetch(`${API_BASE_URL}/issuers/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to delete issuer');
    },
    async getMonthlyStats() {
        const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
            headers: mergeHeaders({}, authHeaders())
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch monthly stats');
        return response.json();
    },
    async getCategoryStats() {
        const response = await fetch(`${API_BASE_URL}/stats/categories`, {
            headers: mergeHeaders({}, authHeaders())
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch category stats');
        return response.json();
    },
    async getOccupancyStats() {
        const response = await fetch(`${API_BASE_URL}/stats/occupancy`, {
            headers: mergeHeaders({}, authHeaders())
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch occupancy stats');
        return response.json();
    },
    async getTotalIncome() {
        const response = await fetch(`${API_BASE_URL}/stats/total-income`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch total income');
        const data = await response.json();
        return data.total_income;
    },
    async getTotalExpenses() {
        const response = await fetch(`${API_BASE_URL}/stats/total-expenses`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch total expenses');
        const data = await response.json();
        return data.total_expenses;
    },
    async getNetProfit() {
        const response = await fetch(`${API_BASE_URL}/stats/net-profit`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch net profit');
        const data = await response.json();
        return data.net_profit;
    },
    async getMonthlyBalance() {
        const response = await fetch(`${API_BASE_URL}/stats/monthly-balance`, {
            headers: authHeaders()
        });
        handleAuthError(response);
        if (!response.ok)
            throw new Error('Failed to fetch monthly balance');
        const data = await response.json();
        return data.monthly_balance;
    },
};
export async function getDropboxAuthUrl(userId) {
    const res = await fetch(`/api/dropbox/auth-url?user_id=${userId}`);
    return res.json();
}
