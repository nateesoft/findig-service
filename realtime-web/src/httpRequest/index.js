import axios from "axios"

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_HOST,
  headers: {
    "Content-Type": "application/json"
  },
  auth: {
    username: process.env.REACT_APP_API_USER,
    password: process.env.REACT_APP_API_KEY
  }
})

export const handleApiError = (error) => {
  if (error.response) {
    if (error.response.status === 504) return { data: null, error: error.response.statusText }
    return { data: null, error: error.response.data.message }
  } else if (error.request) {
    return { data: null, error: "Network error. Please try again." }
  }
  return { data: null, error: error.message }
}

export default apiClient
