import apiClient, { handleApiError } from "../httpRequest";

export const loadDraftSaleInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/draftsale?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/draftsale/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadDraftSaleDashboard = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/draftsale/dashboard?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadDraftSaleById = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { id } = payload
        const response = await apiClient.get(`/draftsale/${id}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const createDraftSaleInfo = async (payload) => {
    try {
        const response = await apiClient.post(`/draftsale`, {...payload})
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const updateDraftSaleInfo = async (payload) => {
    try {
        const response = await apiClient.put(`/draftsale/${payload.id}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const processStockFromSale = async (payload) => {
    try {
        const response = await apiClient.post(`/draftsale/process-stock`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const deleteDraftSaleInfo = async (payload) => {
    try {
        const { id } = payload
        const response = await apiClient.delete(`/draftsale/${id}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadReportAllDraftSale = async () => {
    try {
        const response = await apiClient.get(`/draftsale/all`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
