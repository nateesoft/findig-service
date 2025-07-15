import apiClient from "../httpRequest";

export const loadDraftSaleInfo = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const { branchCode } = payload
        const response = await apiClient.get(`/api/draftsale?dbConfig=${dbConfig}&branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        console.log('error=>', error)
        if (error.response) {
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}

export const createDraftSaleInfo = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const response = await apiClient.post(`/api/draftsale`, {...payload, dbConfig})
        return { data: response.data, error: null }
    } catch (error) {
        console.log('error=>', error)
        if (error.response) {
            return { data: null, error: error.response.data.message };
        } else if (error.request) {
            return { data: null, error: "Network error. Please try again." };
        } else {
            return { data: null, error: error.message };
        }
    }
}
