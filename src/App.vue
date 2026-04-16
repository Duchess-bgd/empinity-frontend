<template>
  <div id="app">
    <div class="container">
      <h1>Product Management</h1>

      <!-- Add Product Form -->
      <div class="card">
        <h2>Add New Product</h2>
        <form @submit.prevent="submitProduct">
          <div class="form-group">
            <label>Name *</label>
            <input v-model="newProduct.name" type="text" required />
            <span v-if="errors.name" class="error">{{ errors.name[0] }}</span>
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="newProduct.category_id" required>
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <span v-if="errors.category_id" class="error">{{ errors.category_id[0] }}</span>
          </div>

          <div class="form-group">
            <label>Price *</label>
            <input v-model="newProduct.price" type="number" step="0.01" required />
            <span v-if="errors.price" class="error">{{ errors.price[0] }}</span>
          </div>

          <div class="form-group">
            <label>Stock *</label>
            <input v-model="newProduct.stock" type="number" required />
            <span v-if="errors.stock" class="error">{{ errors.stock[0] }}</span>
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Adding...' : 'Add Product' }}
          </button>
        </form>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="form-group">
          <label>Search:</label>
          <input v-model="filters.search" placeholder="Search by name..." />
        </div>

        <div class="form-group">
          <label>Category:</label>
          <select v-model="filters.category_id">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
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
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.category?.name }}</td>
            <td>${{ parseFloat(product.price).toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="4" class="text-center">No products found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from './services/api';

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const errors = ref({});

const newProduct = ref({
  name: '',
  category_id: '',
  price: '',
  stock: '',
});

const filters = ref({
  search: '',
  category_id: '',
});

// Load products
const loadProducts = async () => {
  try {
    const params = {};
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.category_id) params.category_id = filters.value.category_id;

    const response = await api.getProducts(params);
    products.value = response.data.data;
  } catch (error) {
    console.error('Error loading products:', error);
  }
};

// Load categories
const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data.data;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

// Submit new product
const submitProduct = async () => {
  loading.value = true;
  errors.value = {};

  try {
    await api.createProduct(newProduct.value);
    newProduct.value = { name: '', category_id: '', price: '', stock: '' };
    await loadProducts();
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      alert('Error creating product');
    }
  } finally {
    loading.value = false;
  }
};

// Watch for filter changes
watch(filters, () => {
  loadProducts();
}, { deep: true });

// Load data on mount
onMounted(() => {
  loadCategories();
  loadProducts();
});
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

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h2 {
  margin-top: 0;
  color: #555;
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

.error {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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