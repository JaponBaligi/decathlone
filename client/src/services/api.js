const GUEST_KEY = 'dct_guest_token'
const TOKEN_KEY = 'dct_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getGuestToken() {
  return localStorage.getItem(GUEST_KEY)
}

export function setGuestToken(token) {
  if (token) localStorage.setItem(GUEST_KEY, token)
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const guest = getGuestToken()
  if (guest) headers['X-Guest-Token'] = guest

  const res = await fetch(`/api${path}`, { ...options, headers })
  const guestHeader = res.headers.get('X-Guest-Token')
  if (guestHeader) setGuestToken(guestHeader)

  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || 'İstek başarısız')
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}
