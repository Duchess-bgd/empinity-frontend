<template>
  <div class="modal-backdrop" v-if="visible">
    <div class="modal-card">
      <h3>Confirm delete</h3>
      <p>Are you sure you want to delete <strong>{{ itemName }}</strong>?</p>
      <div class="modal-actions">
        <button class="button secondary" @click="cancel">Cancel</button>
        <button class="button danger" @click="confirm">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  itemName: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  width: min(420px, calc(100% - 2rem));
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 75px rgba(15, 23, 42, 0.2);
  padding: 1.75rem;
  text-align: center;
}

.modal-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #111827;
}

.modal-card p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.button {
  border: none;
  padding: 0.85rem 1.25rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
}

.button.secondary {
  background: #e5e7eb;
  color: #111827;
}

.button.danger {
  background: #ef4444;
  color: white;
}
</style>
