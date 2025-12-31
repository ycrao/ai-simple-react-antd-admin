import api from './api'

export interface Category {
  id: number
  name: string
  description: string
  slug: string
  created_at: string
  updated_at: string
  articles_count: number
}

export interface CreateCategoryRequest {
  name: string
  description: string
  slug: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const categoriesService = {
  getAll: () =>
    api.get<ApiResponse<Category[]>, ApiResponse<Category[]>>('/ms-content/category/all'),
  
  getById: (id: number) =>
    api.get<ApiResponse<Category>, ApiResponse<Category>>(`/ms-content/category/${id}`),
  
  create: (data: CreateCategoryRequest) =>
    api.post<ApiResponse<Category>, ApiResponse<Category>>('/ms-content/category', data),
  
  update: (id: number, data: Partial<CreateCategoryRequest>) =>
    api.put<ApiResponse<Category>, ApiResponse<Category>>(`/ms-content/category/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/ms-content/category/${id}`),
}