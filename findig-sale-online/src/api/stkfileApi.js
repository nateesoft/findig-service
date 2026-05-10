import apiClient, { handleApiError } from "../httpRequest";

export const loadStfileInfo = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stkfile/${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stkfile/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStfileViewDetail = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { productCode } = payload
        const response = await apiClient.get(`/stkfile/${productCode}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
