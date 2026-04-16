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
          <td colspan="4" class="text-center">Loading products…</td>
        </tr>
        <tr v-else-if="products.length === 0">
          <td colspan="4" class="text-center">No products found</td>
        </tr>
        <tr v-else v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.category?.name ?? '—' }}</td>
          <td>${{ formatPrice(product.price) }}</td>
          <td>{{ product.stock }}</td>
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
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: #555;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #555;
}

table tr:hover {
  background-color: #f5f5f5;
}

.text-center {
  text-align: center;
}
</style>
