import apiClient, { handleApiError } from "../httpRequest"

export const validateLogin = async (payload) => {
  try {
    const response = await apiClient.post(`/posuser/login`, payload)
    return { data: response.data, error: null }
  } catch (error) {
    return handleApiError(error)
  }
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
