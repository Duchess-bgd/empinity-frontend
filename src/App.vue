<template>
  <div id="app">
    <div class="container">
      <h1>Product Management</h1>

      <div v-if="apiError" class="alert">{{ apiError }}</div>

      <ProductForm
        :categories="categories"
        v-model="newProduct"
        :loading="submitting"
        :errors="errors"
        @submit="submitProduct"
      />

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

      <ProductTable :products="products" :loading="loadingProducts" />
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
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.alert {
  background: #fef2f2;
  border: 1px solid #f5c2c7;
  color: #991b1b;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>