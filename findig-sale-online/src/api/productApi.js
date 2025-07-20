import apiClient from "../httpRequest";

export const loadAllProduct = async () => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const response = await apiClient.get(`/api/product?dbConfig=${dbConfig}`)
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
