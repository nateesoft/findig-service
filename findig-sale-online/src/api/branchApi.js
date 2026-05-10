import apiClient, { handleApiError } from "../httpRequest";

export const loadBranchInfo = async () => {
    const branchCode = localStorage.getItem('branchCode') || ''
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
