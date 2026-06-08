import apiClient, { handleApiError } from "../httpRequest";

export const loadAllGroupfile = async () => {
    try {
        const response = await apiClient.get(`/groupfile/list`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
