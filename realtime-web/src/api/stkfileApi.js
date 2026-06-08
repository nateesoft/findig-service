import apiClient, { handleApiError } from "../httpRequest"
import { getBranchFromToken } from "../utils/auth"

export const loadStfileInfo = async (payload) => {
    const branchCode = getBranchFromToken()
    try {
        const response = await apiClient.get(`/stkfile/${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const searchData = async (payload) => {
    try {
        const response = await apiClient.post(`/stkfile/search`, payload)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadStfileViewDetail = async (payload) => {
    const branchCode = getBranchFromToken()
    try {
        const { productCode } = payload
        const response = await apiClient.get(`/stkfile/${productCode}?branchCode=${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
