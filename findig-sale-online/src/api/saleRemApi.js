import apiClient, { handleApiError } from "../httpRequest";

export const loadAllSaleRem = async () => {
    try {
        const response = await apiClient.get(`/salerem/list`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
