import apiClient from "../httpRequest";

export const loadAllProduct = async (searchText) => {
    try {
        const response = await apiClient.post(`/api/product`, { searchText })
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
