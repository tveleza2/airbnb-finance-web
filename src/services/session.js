// src/services/session.ts
// Simple session manager for JWT-based authentication
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
export function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}
export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
export function isAuthenticated() {
    return !!getToken();
}
// Optionally, decode JWT to get claims (e.g., user_id, role, exp)
export function getJwtClaims() {
    const token = getToken();
    if (!token)
        return null;
    const parts = token.split('.');
    if (parts.length !== 3)
        return null;
    try {
        return JSON.parse(atob(parts[1]));
    }
    catch {
        return null;
    }
}
