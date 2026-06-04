import apiClient, { handleApiError } from "../httpRequest"

export const validateLogin = async (payload) => {
  try {
    const response = await apiClient.post(`/posuser/login`, payload)
    return { data: response.data, error: null }
  } catch (error) {
    return handleApiError(error)
  }
}

export const setAuthCookie = (token) => {
  const expires = new Date(Date.now() + 40 * 60 * 1000)
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export const clearAuthCookie = () => {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'
}

export const sendToLogout = async (payload) => {
  const { UserName } = payload
  try {
    const response = await apiClient.patch(`/posuser/logout`, { username: UserName })
    return { data: response.data, error: null }
  } catch (error) {
    return handleApiError(error)
  }
}
