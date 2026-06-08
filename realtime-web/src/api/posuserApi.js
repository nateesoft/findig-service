import apiClient, { handleApiError } from "../httpRequest"

export const loadPosUserAll = async () => {
  try {
    const response = await apiClient.get(`/posuser`)
    return { data: response.data, error: null }
  } catch (error) {
    return handleApiError(error)
  }
}

export const searchData = async (payload) => {
  try {
    const response = await apiClient.post(`/posuser/search`, payload)
    return { data: response.data, error: null }
  } catch (error) {
    return handleApiError(error)
  }
}
