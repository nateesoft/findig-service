import apiClient, { handleApiError } from "../httpRequest"
import { getBranchFromToken } from "../utils/auth"

export const loadStcardInfo = async () => {
    const branchCode = getBranchFromToken()
    try {
        const response = await apiClient.get(`/stcard/${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stcard/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStcardViewDetail = async (payload) => {
    const branchCode = getBranchFromToken()
    try {
        const { billNo } = payload
        const response = await apiClient.get(`/stcard/${billNo}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
