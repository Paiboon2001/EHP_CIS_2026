// Lightweight client-side auth state.
// Backed by localStorage so a refresh keeps the user signed in.
// TODO: replace with real token handling once the auth API exists.

const STORAGE_KEY = 'ehp-auth'

export function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function login() {
  localStorage.setItem(STORAGE_KEY, '1')
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}
