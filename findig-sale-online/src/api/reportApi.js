import apiClient from "../httpRequest";

export const loadSummaryReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/api/report/summary?branchCode=${branchCode}`, payload)
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
export const loadSaleReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/api/report/sale?branchCode=${branchCode}`, payload)
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
export const loadStcardReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/api/report/stcard?branchCode=${branchCode}`, payload)
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
export const loadStkfileReport = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.post(`/api/report/stkfile?branchCode=${branchCode}`, payload)
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
