export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  category_id: number
  price: string | number
  stock: number
  category?: Category
}

export interface ProductFormState {
  name: string
  category_id: number | ''
  price: number | ''
  stock: number | ''
}

export interface ValidationErrors {
  [key: string]: string[]
}

export interface ApiResponse<T> {
  data: T
}
