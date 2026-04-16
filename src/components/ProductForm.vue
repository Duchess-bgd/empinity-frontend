<template>
  <div class="card">
    <h2>Add New Product</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="product-name">Name *</label>
        <input id="product-name" v-model="formState.name" type="text" required />
        <span v-if="errors.name" class="error">{{ errors.name[0] }}</span>
      </div>

      <div class="form-group">
        <label for="product-category">Category *</label>
        <select id="product-category" v-model="formState.category_id" required>
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <span v-if="errors.category_id" class="error">{{ errors.category_id[0] }}</span>
      </div>

      <div class="form-group">
        <label for="product-price">Price *</label>
        <input id="product-price" v-model.number="formState.price" type="number" step="0.01" inputmode="decimal" required />
        <span v-if="errors.price" class="error">{{ errors.price[0] }}</span>
      </div>

      <div class="form-group">
        <label for="product-stock">Stock *</label>
        <input id="product-stock" v-model.number="formState.stock" type="number" min="0" required />
        <span v-if="errors.stock" class="error">{{ errors.stock[0] }}</span>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Product' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category, ProductFormState, ValidationErrors } from '@/types'
import type { PropType } from 'vue'

const props = defineProps({
  categories: { type: Array as PropType<Category[]>, default: () => [] },
  modelValue: { type: Object as PropType<ProductFormState>, required: true },
  loading: { type: Boolean, default: false },
  errors: { type: Object as PropType<ValidationErrors>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ProductFormState): void
  (event: 'submit'): void
}>()

const formState = ref<ProductFormState>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (value) => {
    formState.value = { ...value }
  },
  { deep: true },
)

watch(
  formState,
  (value) => {
    emit('update:modelValue', { ...value })
  },
  { deep: true },
)

const submit = () => {
  emit('submit')
}
</script>
