import apiClient, { handleApiError } from "../httpRequest"
import { getBranchFromToken } from "../utils/auth"

export const loadBranchInfo = async () => {
    const branchCode = getBranchFromToken()
    try {
        const response = await apiClient.get(`/branch/${branchCode}`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export const loadAllBranch = async () => {
    try {
        const response = await apiClient.get(`/branch/list`)
        return { data: response.data, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}
