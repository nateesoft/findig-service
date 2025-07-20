import apiClient from "../httpRequest";

export const loadBranchInfo = async () => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const response = await apiClient.get(`/api/branch/${dbConfig}?dbConfig=${dbConfig}`)
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
