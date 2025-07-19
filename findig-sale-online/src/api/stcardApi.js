import apiClient from "../httpRequest";

export const loadStcardInfo = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const { branchCode } = payload
        const response = await apiClient.get(`/api/stcard?branchCode=${branchCode}&dbConfig=${dbConfig}`)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const loadStcardViewDetail = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const { billNo } = payload
        const response = await apiClient.get(`/api/stcard/${billNo}?dbConfig=${dbConfig}`)
        return { data: response.data, error: null }
    } catch (error) {
        if (error.response) {
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}
