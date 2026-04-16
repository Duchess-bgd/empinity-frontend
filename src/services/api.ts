import axios from 'axios'
import type { ApiResponse, Category, Product, ProductFormState } from '@/types'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://impinity.test/api'

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Network error:', error)
    }
    return Promise.reject(error)
  },
)

export default {
  getCategories() {
    return apiClient.get<ApiResponse<Category[]>>('/categories')
  },

  getProducts(params = {}) {
    return apiClient.get<ApiResponse<Product[]>>('/products', { params })
  },

  createProduct(product: ProductFormState) {
    return apiClient.post('/products', product)
  },

  updateProduct(id: number, product: ProductFormState) {
    return apiClient.put(`/products/${id}`, product)
  },

  deleteProduct(id: number) {
    return apiClient.delete(`/products/${id}`)
  },
}
