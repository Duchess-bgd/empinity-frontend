<template>
  <div class="card">
    <h2>Products List</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4" class="text-center loading-row">Loading products…</td>
        </tr>
        <tr v-else-if="products.length === 0">
          <td colspan="4" class="text-center">No products found</td>
        </tr>
        <tr v-else v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.category?.name ?? '—' }}</td>
          <td class="price-cell">${{ formatPrice(product.price) }}</td>
          <td class="stock-cell">{{ product.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import type { PropType } from 'vue'

const props = defineProps({
  products: { type: Array as PropType<Product[]>, default: () => [] },
  loading: { type: Boolean, default: false },
})

const formatPrice = (price: number | string) => {
  const amount = typeof price === 'number' ? price : Number(price)
  return Number.isNaN(amount) ? '0.00' : amount.toFixed(2)
}
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
}

table tbody tr {
  background: white;
  transition: background-color 0.2s ease;
}

table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%);
}

table tbody tr:last-child td {
  border-bottom: none;
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

  table {
    font-size: 0.875rem;
  }

  table th,
  table td {
    padding: 0.75rem 0.5rem;
  }

  table th {
    padding: 1rem 0.5rem;
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

  table th {
    padding: 0.75rem 0.25rem;
    font-size: 0.625rem;
  }
}
</style>
