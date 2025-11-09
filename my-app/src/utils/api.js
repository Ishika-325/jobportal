// API client configuration with Axios
import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api/v1"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // To handle cookies if needed
})



export default api
