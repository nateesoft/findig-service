import apiClient, { handleApiError } from "../httpRequest";

export const loadAllProduct = async (searchText) => {
    try {
        const response = await apiClient.post(`/product`, { searchText })
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
