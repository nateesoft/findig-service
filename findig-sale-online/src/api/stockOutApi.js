import apiClient from "../httpRequest";

export const loadStockOutInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/api/stock-out?branchCode=${branchCode}`)
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

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/api/stock-out/search`, payload)
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

export const loadStockOutDashboard = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/api/stock-out/dashboard?branchCode=${branchCode}`)
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

export const loadStockOutById = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { id } = payload
        const response = await apiClient.get(`/api/stock-out/${id}?branchCode=${branchCode}`)
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

export const createStockOutInfo = async (payload) => {
    try {
        console.log(payload)
        const response = await apiClient.post(`/api/stock-out`, {...payload})
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

export const updateStockOutInfo = async (payload) => {
    try {
        const response = await apiClient.put(`/api/stock-out/${payload.id}`, payload)
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
        const response = await apiClient.post(`/api/stock-out/process-stock`, payload)
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

export const loadReportAllStockOut = async () => {
    try {
        const response = await apiClient.get(`/api/stock-out/all`)
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