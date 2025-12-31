import api from './api'

export interface Article {
  id: number
  title: string
  content: string
  excerpt: string
  category_id: number
  category: {
    id: number
    name: string
  }
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  published_at?: string
}

export interface ArticleListParams {
  page?: number
  per_page?: number
  keyword?: string
  category_id?: number
  status?: string
}

export interface ArticleListResponse {
  items: Article[]
  total: number
  per_page: number
  current_page: number
}

export interface CreateArticleRequest {
  title: string
  content: string
  excerpt: string
  category_id: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const articlesService = {
  getList: (params: ArticleListParams) =>
    api.get<ApiResponse<ArticleListResponse>, ApiResponse<ArticleListResponse>>('/ms-content/article', { params }),
  
  getById: (id: number) =>
    api.get<ApiResponse<Article>, ApiResponse<Article>>(`/ms-content/article/${id}`),
  
  create: (data: CreateArticleRequest) =>
    api.post<ApiResponse<Article>, ApiResponse<Article>>('/ms-content/article', data),
  
  update: (id: number, data: Partial<CreateArticleRequest>) =>
    api.put<ApiResponse<Article>, ApiResponse<Article>>(`/ms-content/article/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/ms-content/article/${id}`),
}