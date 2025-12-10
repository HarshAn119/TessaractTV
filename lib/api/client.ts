import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL } from '@/lib/constants'
import { ApiError } from '@/types'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An error occurred',
      statusCode: error.response?.status,
    }

    if (error.response?.data) {
      const data = error.response.data as any
      apiError.message = data.message || apiError.message
      apiError.code = data.code
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(apiError)
  }
)

export default apiClient

