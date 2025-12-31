import api from './api'

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

export interface UserListResponse {
  items: User[]
  total: number
  per_page: number
  current_page: number
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const usersService = {
  getList: (params?: { page?: number; per_page?: number }) =>
    api.get<ApiResponse<UserListResponse>, ApiResponse<UserListResponse>>('/ms-user/user', { params }),
  
  getById: (id: number) =>
    api.get<ApiResponse<User>, ApiResponse<User>>(`/ms-user/user/${id}`),
  
  create: (data: CreateUserRequest) =>
    api.post<ApiResponse<User>, ApiResponse<User>>('/ms-user/user', data),
  
  update: (id: number, data: Partial<CreateUserRequest>) =>
    api.put<ApiResponse<User>, ApiResponse<User>>(`/ms-user/user/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/ms-user/user/${id}`),
}