import apiClient from "../httpRequest"

export const validateLogin = async (payload) => {
  try {
    const response = await apiClient.post(`/api/posuser/login`, payload)
    return { data: response.data, error: null }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 504) {
        return { data: null, error: error.response.statusText }
      }
      return { data: null, error: error.response.data.message }
    } else if (error.request) {
      return { data: null, error: "Network error. Please try again." }
    } else {
      return { data: null, error: error.message }
    }
  }
}

export const sendToLogout = async (payload) => {
  const { UserName } = payload
  try {
    const payload = { username: UserName }
    const response = await apiClient.patch(`/api/posuser/logout`, payload)
    return { data: response.data, error: null }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 504) {
        return { data: null, error: error.response.statusText }
      }
      return { data: null, error: error.response.data.message }
    } else if (error.request) {
      return { data: null, error: "Network error. Please try again." }
    } else {
      return { data: null, error: error.message }
    }
  }
}

export const loadPosUserAll = async () => {
  try {
    const response = await apiClient.get(`/api/posuser`)
    return { data: response.data, error: null }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 504) {
        return { data: null, error: error.response.statusText }
      }
      return { data: null, error: error.response.data.message }
    } else if (error.request) {
      return { data: null, error: "Network error. Please try again." }
    } else {
      return { data: null, error: error.message }
    }
  }
}
