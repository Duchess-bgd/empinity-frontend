<template>
  <div class="card">
    <h2>Add New Product</h2>
    <form @submit.prevent="submit">
      <div class="form-grid">
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
      </div>

      <div class="submit-section">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Adding...' : 'Add Product' }}
        </button>
      </div>
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

<style scoped>
.card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  margin-bottom: 1.25rem;
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
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
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

.error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
}

.submit-section {
  margin-top: 2rem;
  text-align: center;
}

button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  min-height: 48px;
  min-width: 160px;
}

button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .card h2 {
    font-size: 1.25rem;
  }

  button {
    width: 100%;
    min-width: unset;
  }
}
</style>
