<template>
  <div class="stats-grid">
    <div class="stat-card">
      <p class="stat-label">Total products</p>
      <p class="stat-value">{{ totalProducts }}</p>
    </div>

    <div class="stat-card">
      <p class="stat-label">Low stock products</p>
      <p class="stat-value">{{ lowStockCount }}</p>
      <p class="stat-note">Stock &lt; 10</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  totalProducts: { type: Number, required: true },
  lowStockCount: { type: Number, required: true },
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.75rem 0.85rem;
  box-shadow: none;
}

.stat-label {
  margin: 0 0 0.35rem;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
}

.stat-note {
  margin-top: 0.75rem;
  color: #64748b;
  font-size: 0.85rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
