import apiClient from './client'
import { User } from '@/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  /**
   * Get current user
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * Refresh token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}

