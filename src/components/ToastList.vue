<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  toasts: { type: Array as PropType<Array<{ id: number; message: string; type: 'success' | 'error' }>>, default: () => [] },
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: grid;
  gap: 0.75rem;
  z-index: 60;
  max-width: calc(100vw - 2rem);
}

.toast {
  padding: 1rem 1.25rem;
  border-radius: 14px;
  color: white;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
  animation: toastEnter 0.2s ease-out;
}

.toast.success {
  background: #059669;
}

.toast.error {
  background: #dc2626;
}

@keyframes toastEnter {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
