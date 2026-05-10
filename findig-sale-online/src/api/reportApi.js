import apiClient, { handleApiError } from "../httpRequest";

export const loadSummaryReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/report/summary?branchCode=${branchCode}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadSaleReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/report/sale?branchCode=${branchCode}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStcardReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/report/stcard?branchCode=${branchCode}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStkfileReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/report/stkfile?branchCode=${branchCode}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
