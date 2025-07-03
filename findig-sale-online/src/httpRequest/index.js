import axios from "axios"

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json"
  },
  auth: {
    username: process.env.REACT_APP_API_USER,
    password: process.env.REACT_APP_API_KEY
  }
})

export default apiClient
