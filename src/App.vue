<template>
  <div id="app">
    <div class="container">
      <h1>Product Management</h1>

      <ToastList :toasts="toasts" />
      <ConfirmModal
        :visible="showDeleteModal"
        :itemName="deleteTarget?.name ?? ''"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />

      <StatsCards :totalProducts="products.length" :lowStockCount="lowStockCount" />

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
          <div class="table-header">
            <div>
              <p class="table-label">Products</p>
              <p class="table-subtitle">Search, sort, edit, delete and manage product stock in one place.</p>
            </div>
            <div class="page-size-control">
              <label for="page-size">Rows</label>
              <select id="page-size" v-model.number="pageSize">
                <option :value="5">5</option>
                <option :value="8">8</option>
                <option :value="12">12</option>
              </select>
            </div>
          </div>

          <div class="table-wrapper">
            <div class="spinner-overlay" v-if="loadingProducts">
              <div class="spinner"></div>
            </div>
            <ProductTable
              :products="pagedProducts"
              :loading="loadingProducts"
              :categories="categories"
              :page="currentPage"
              :totalPages="totalPages"
              :sortBy="sortBy"
              :sortAsc="sortAsc"
              @update-sort="setSort"
              @update-page="setPage"
              @save-product="handleSaveProduct"
              @delete-product="requestDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProductForm from './components/ProductForm.vue'
import ProductTable from './components/ProductTable.vue'
import StatsCards from './components/StatsCards.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import ToastList from './components/ToastList.vue'
import api from './services/api'
import type { Category, Product, ProductFormState, ValidationErrors } from './types'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loadingProducts = ref(false)
const submitting = ref(false)
const apiError = ref<string | null>(null)
const errors = ref<ValidationErrors>({})
const filterTimeout = ref<number | undefined>(undefined)
const currentPage = ref(1)
const pageSize = ref(8)
const sortBy = ref('name')
const sortAsc = ref(true)
const showDeleteModal = ref(false)
const deleteTarget = ref<Product | null>(null)
const toasts = ref<Array<{ id: number; message: string; type: 'success' | 'error' }>>([])
let nextToastId = 1

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
    currentPage.value = 1
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

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const id = nextToastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, 4000)
}

const handleSaveProduct = async (product: Product) => {
  try {
    await api.updateProduct(product.id, {
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
    })
    await loadProducts()
    showToast('Product updated successfully.', 'success')
  } catch (error: any) {
    showToast('Unable to update product.', 'error')
    console.error('Error updating product:', error)
  }
}

const requestDelete = (product: Product) => {
  deleteTarget.value = product
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  try {
    await api.deleteProduct(deleteTarget.value.id)
    showDeleteModal.value = false
    deleteTarget.value = null
    await loadProducts()
    showToast('Product deleted successfully.', 'success')
  } catch (error: any) {
    showToast('Unable to delete product.', 'error')
    console.error('Error deleting product:', error)
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  deleteTarget.value = null
}

const submitProduct = async () => {
  submitting.value = true
  errors.value = {}
  apiError.value = null

  try {
    await api.createProduct(newProduct.value)
    newProduct.value = defaultProductState()
    await loadProducts()
    showToast('Product added successfully.', 'success')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      apiError.value = 'Unable to create product. Please check your input and try again.'
      showToast('Unable to add product.', 'error')
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

const sortedProducts = computed(() => {
  const copy = [...products.value]
  return copy.sort((a, b) => {
    const direction = sortAsc.value ? 1 : -1
    if (sortBy.value === 'price' || sortBy.value === 'stock') {
      return (Number(a[sortBy.value as 'price' | 'stock']) - Number(b[sortBy.value as 'price' | 'stock'])) * direction
    }

    if (sortBy.value === 'category') {
      return (a.category?.name ?? '').localeCompare(b.category?.name ?? '') * direction
    }

    return String(a.name).localeCompare(String(b.name)) * direction
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedProducts.value.length / pageSize.value)))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedProducts.value.slice(start, start + pageSize.value)
})

const lowStockCount = computed(() => products.value.filter((product) => product.stock < 10).length)

const setSort = (field: string, asc: boolean) => {
  sortBy.value = field
  sortAsc.value = asc
}

const setPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch(pageSize, () => {
  currentPage.value = 1
})

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

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.table-label {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
}

.table-subtitle {
  margin: 0.25rem 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.page-size-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.page-size-control label {
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
}

.table-wrapper {
  position: relative;
}

.spinner-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 18px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(59, 130, 246, 0.25);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}
</style>