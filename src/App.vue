<template>
  <div id="app">
    <div class="container">
      <h1>Product Management</h1>

      <div v-if="apiError" class="alert">{{ apiError }}</div>

      <div class="filters">
        <div class="form-group">
          <label for="search">Search:</label>
          <input id="search" v-model="filters.search" placeholder="Search by name..." />
        </div>

        <div class="form-group">
          <label for="category-filter">Category:</label>
          <select id="category-filter" v-model="filters.category_id">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div class="main-content">
        <div class="form-section">
          <ProductForm
            :categories="categories"
            v-model="newProduct"
            :loading="submitting"
            :errors="errors"
            @submit="submitProduct"
          />
        </div>

        <div class="table-section">
          <ProductTable :products="products" :loading="loadingProducts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ProductForm from './components/ProductForm.vue'
import ProductTable from './components/ProductTable.vue'
import api from './services/api'
import type { Category, Product, ProductFormState, ValidationErrors } from './types'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loadingProducts = ref(false)
const submitting = ref(false)
const apiError = ref<string | null>(null)
const errors = ref<ValidationErrors>({})
const filterTimeout = ref<number | undefined>(undefined)

const newProduct = ref<ProductFormState>({
  name: '',
  category_id: '',
  price: '',
  stock: '',
})

const filters = ref({
  search: '',
  category_id: '' as number | '',
})

const defaultProductState = (): ProductFormState => ({
  name: '',
  category_id: '',
  price: '',
  stock: '',
})

const loadProducts = async () => {
  loadingProducts.value = true
  apiError.value = null

  try {
    const params: Record<string, string | number> = {}
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.category_id) params.category_id = filters.value.category_id

    const response = await api.getProducts(params)
    products.value = response.data.data
  } catch (error: any) {
    apiError.value = 'Unable to load products. Please try again.'
    console.error('Error loading products:', error)
  } finally {
    loadingProducts.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data.data
  } catch (error: any) {
    apiError.value = 'Unable to load categories. Please refresh the page.'
    console.error('Error loading categories:', error)
  }
}

const submitProduct = async () => {
  submitting.value = true
  errors.value = {}
  apiError.value = null

  try {
    await api.createProduct(newProduct.value)
    newProduct.value = defaultProductState()
    await loadProducts()
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      apiError.value = 'Unable to create product. Please check your input and try again.'
      console.error('Error creating product:', error)
    }
  } finally {
    submitting.value = false
  }
}

watch(
  filters,
  () => {
    if (filterTimeout.value) {
      window.clearTimeout(filterTimeout.value)
    }
    filterTimeout.value = window.setTimeout(loadProducts, 300)
  },
  { deep: true },
)

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #374151;
}

h1 {
  color: #1f2937;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.alert {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    text-align: left;
  }

  .filters {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.form-group input:hover,
.form-group select:hover {
  border-color: #9ca3af;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.form-section,
.table-section {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}
</style>