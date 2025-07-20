import apiClient from "../httpRequest";

export const validateLogin = async (payload) => {
    try {
        const response = await apiClient.post(`/api/posuser/login`, payload)
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

export const sendToLogout = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    const { UserName } = payload
    try {
        const input = { username: UserName, dbConfig }
        const response = await apiClient.patch(`/api/posuser/logout`, input)
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

export const loadPosUserAll = async (payload) => {
    const dbConfig = localStorage.getItem('db') || ''
    try {
        const response = await apiClient.get(`/api/posuser?dbConfig=${dbConfig}`)
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

