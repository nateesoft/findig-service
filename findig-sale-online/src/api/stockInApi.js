import apiClient, { handleApiError } from "../httpRequest";

export const loadStockInInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stock-in?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-in/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStockInDashboard = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/stock-in/dashboard?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStockInById = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { id } = payload
        const response = await apiClient.get(`/stock-in/${id}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const createStockInInfo = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-in`, {...payload})
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const updateStockInInfo = async (payload) => {
    try {
        const response = await apiClient.put(`/stock-in/${payload.id}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const processStockFromSale = async (payload) => {
    try {
        const response = await apiClient.post(`/stock-in/process-stock`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadReportAllStockIn = async () => {
    try {
        const response = await apiClient.get(`/stock-in/all`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
