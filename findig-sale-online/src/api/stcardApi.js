import apiClient, { handleApiError } from "../httpRequest";

export const loadStcardInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stcard/${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stcard/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStcardViewDetail = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { billNo } = payload
        const response = await apiClient.get(`/stcard/${billNo}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
