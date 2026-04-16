import axios from 'axios';

const api = axios.create({
    baseURL: 'http://impinity.test/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    // Categories
    getCategories() {
        return api.get('/categories');
    },

    // Products
    getProducts(params = {}) {
        return api.get('/products', { params });
    },
    createProduct(product) {
        return api.post('/products', product);
    },
    updateProduct(id, product) {
        return api.put(`/products/${id}`, product);
    },
    deleteProduct(id) {
        return api.delete(`/products/${id}`);
    },
};