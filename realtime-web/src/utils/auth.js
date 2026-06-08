const COOKIE_NAME = 'auth_token'
const SESSION_DURATION_MS = 40 * 60 * 1000

const decodeJWT = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(payload)))
  } catch {
    return null
  }
}

export const getAuthToken = () => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export const getUserFromToken = () => {
  const token = getAuthToken()
  if (!token) return null
  const payload = decodeJWT(token)
  if (!payload) return null
  if (payload.exp && Date.now() / 1000 > payload.exp) return null
  return payload
}

export const getBranchFromToken = () => {
  return getUserFromToken()?.branchCode || ''
}

export const setAuthCookie = (token) => {
  const expires = new Date(Date.now() + SESSION_DURATION_MS)
  document.cookie = `${COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export const clearAuthCookie = () => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}
