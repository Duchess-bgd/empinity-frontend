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
