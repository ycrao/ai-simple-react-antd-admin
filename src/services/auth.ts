import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user_id: number
  name: string
  email: string
  role: string
  avatar: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const authService = {
  login: (data: LoginRequest) => 
    api.post<ApiResponse<LoginResponse>, ApiResponse<LoginResponse>>('/ms-user/auth/login', data),
  
  getCurrentUser: () => 
    api.get<ApiResponse<LoginResponse>, ApiResponse<LoginResponse>>('/ms-user/user/me'),
}