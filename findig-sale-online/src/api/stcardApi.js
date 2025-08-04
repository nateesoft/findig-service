import apiClient from "../httpRequest";

export const loadStcardInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const response = await apiClient.get(`/api/stcard/${branchCode}`)
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
        const response = await apiClient.post(`/api/stcard/search`, payload)
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

export const loadStcardViewDetail = async (payload) => {
    const branchCode = localStorage.getItem('branchCode') || ''
    try {
        const { billNo } = payload
        const response = await apiClient.get(`/api/stcard/${billNo}?branchCode=${branchCode}`)
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
