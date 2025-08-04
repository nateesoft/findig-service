import apiClient from "../httpRequest";

export const loadDraftSaleInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/api/draftsale?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const loadDraftSaleDashboard = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/api/draftsale/dashboard?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const loadDraftSaleById = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { id } = payload
        const response = await apiClient.get(`/api/draftsale/${id}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const createDraftSaleInfo = async (payload) => {
    try {
        const response = await apiClient.post(`/api/draftsale`, {...payload})
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const updateDraftSaleInfo = async (payload) => {
    try {
        const response = await apiClient.put(`/api/draftsale/${payload.id}`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const processStockFromSale = async (payload) => {
    try {
        const response = await apiClient.post(`/api/draftsale/process-stock`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 504) {
                return { data: null, error: error.response.statusText }
            }
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}
