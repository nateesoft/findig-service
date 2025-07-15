import apiClient from "../httpRequest";

export const loadStcardInfo = async (payload) => {
    try {
        const { branchCode } = payload
        const response = await apiClient.get(`/api/stcard?branchCode=${branchCode}`)
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
