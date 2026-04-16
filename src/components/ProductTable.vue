<template>
  <div class="card">
    <h2>Products List</h2>
    <table>
      <thead>
        <tr>
          <th @click="updateSort('name')" class="sortable">
            Name
            <span v-if="sortBy === 'name'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th @click="updateSort('category')" class="sortable">
            Category
            <span v-if="sortBy === 'category'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th @click="updateSort('price')" class="sortable">
            Price
            <span v-if="sortBy === 'price'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th @click="updateSort('stock')" class="sortable">
            Stock
            <span v-if="sortBy === 'stock'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th class="actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center loading-row">Loading products…</td>
        </tr>
        <tr v-else-if="products.length === 0">
          <td colspan="5" class="text-center">No products found</td>
        </tr>
        <tr
          v-else
          v-for="product in products"
          :key="product.id"
          :class="{ 'low-stock': product.stock < 10 }"
        >
          <template v-if="editedId === product.id">
            <td>
              <input v-model="editingProduct.name" />
            </td>
            <td>
              <select v-model="editingProduct.category_id">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </td>
            <td>
              <input v-model.number="editingProduct.price" type="number" step="0.01" />
            </td>
            <td>
              <input v-model.number="editingProduct.stock" type="number" min="0" />
            </td>
            <td class="row-actions">
              <button class="button save" @click="saveEdit(product.id)">Save</button>
              <button class="button secondary" @click="cancelEdit">Cancel</button>
            </td>
          </template>
          <template v-else>
            <td>{{ product.name }}</td>
            <td>{{ product.category?.name ?? '—' }}</td>
            <td class="price-cell">${{ formatPrice(product.price) }}</td>
            <td class="stock-cell">{{ product.stock }}</td>
            <td class="row-actions">
              <button class="button edit" @click="startEdit(product)">Edit</button>
              <button class="button danger" @click="requestDelete(product)">Delete</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-button" :disabled="page === 1" @click="$emit('update-page', page - 1)">Previous</button>
      <button
        v-for="pageNumber in pageButtons"
        :key="pageNumber"
        :class="['page-button', { active: pageNumber === page }]"
        @click="$emit('update-page', pageNumber)"
      >
        {{ pageNumber }}
      </button>
      <button class="page-button" :disabled="page === totalPages" @click="$emit('update-page', page + 1)">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Product, Category } from '@/types'
import type { PropType } from 'vue'

const props = defineProps({
  products: { type: Array as PropType<Product[]>, default: () => [] },
  categories: { type: Array as PropType<Category[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  sortBy: { type: String, default: 'name' },
  sortAsc: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (event: 'update-sort', sortBy: string, sortAsc: boolean): void
  (event: 'update-page', page: number): void
  (event: 'save-product', product: Product): void
  (event: 'delete-product', product: Product): void
}>()

const editedId = ref<number | null>(null)
const editingProduct = ref<Product | null>(null)

watch(
  () => props.products,
  (list) => {
    if (editedId.value !== null) {
      const matching = list.find((item) => item.id === editedId.value)
      if (!matching) cancelEdit()
    }
  },
)

const formatPrice = (price: number | string) => {
  const amount = typeof price === 'number' ? price : Number(price)
  return Number.isNaN(amount) ? '0.00' : amount.toFixed(2)
}

const updateSort = (field: string) => {
  const nextAsc = props.sortBy === field ? !props.sortAsc : true
  emit('update-sort', field, nextAsc)
}

const startEdit = (product: Product) => {
  editedId.value = product.id
  editingProduct.value = { ...product, price: Number(product.price) }
}

const cancelEdit = () => {
  editedId.value = null
  editingProduct.value = null
}

const saveEdit = (id: number) => {
  if (!editingProduct.value) return
  emit('save-product', { ...editingProduct.value, id })
  cancelEdit()
}

const requestDelete = (product: Product) => {
  emit('delete-product', product)
}

const pageButtons = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= props.totalPages; i += 1) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

table th,
table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  padding: 1.25rem 1rem;
  cursor: pointer;
  user-select: none;
}

table th.sortable:hover {
  color: #1d4ed8;
}

.actions-header {
  cursor: default;
}

table tbody tr {
  background: white;
  transition: background-color 0.2s ease;
}

table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%);
}

.low-stock {
  background: rgba(254, 226, 226, 0.6);
}

.text-center {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.price-cell {
  font-weight: 600;
  color: #059669;
}

.stock-cell {
  font-weight: 500;
}

.loading-row {
  background: linear-gradient(90deg, #f8fafc 25%, #e5e7eb 50%, #f8fafc 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

..row-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.row-actions .button {
  padding: 0.4rem 0.75rem;
  min-width: 78px;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  margin: 1px;
}

.button {
  border: none;
  border-radius: 0.85rem;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button.edit {
  background: #3b82f6;
  color: white;
}

.button.save {
  background: #10b981;
  color: white;
}

.button.secondary {
  background: #e5e7eb;
  color: #111827;
}

.button.danger {
  background: #ef4444;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.page-button {
  border: 1px solid #cbd5e1;
  background: white;
  padding: 0.65rem 0.95rem;
  border-radius: 9999px;
  cursor: pointer;
  color: #334155;
  transition: background 0.2s ease, transform 0.15s ease;
}

.page-button:hover:not(:disabled) {
  background: #eff6ff;
  transform: translateY(-1px);
}

.page-button.active {
  background: #3b82f6;
  color: white;
  border-color: transparent;
}

.page-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .card h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  table th,
  table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 640px) {
  .card {
    border-radius: 12px;
    padding: 0.75rem;
  }

  .card h2 {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  table th,
  table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }

  .row-actions {
    gap: 0.25rem;
  }
}
</style>
