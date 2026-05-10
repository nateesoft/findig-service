import apiClient, { handleApiError } from "../httpRequest";

export const loadStockOutInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stock-out?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-out/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStockOutDashboard = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stock-out/dashboard?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStockOutById = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { id } = payload
        const response = await apiClient.get(`/stock-out/${id}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const createStockOutInfo = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-out`, {...payload})
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const updateStockOutInfo = async (payload) => {
    try {
        const response = await apiClient.put(`/stock-out/${payload.id}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const processStockFromSale = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-out/process-stock`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadReportAllStockOut = async () => {
    try {
        const response = await apiClient.get(`/stock-out/all`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
