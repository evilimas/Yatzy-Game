<script setup lang="ts">
interface Props {
  isVisible: boolean;
  winnerText: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  newGame: [];
}>();

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Game Over!</h2>
          </div>
          <div class="modal-body">
            <p class="winner-text">🎉 {{ winnerText }} 🎉</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="emit('newGame')">Start et nytt spill</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.849);
  color: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  border-radius: 8px;
  color: white;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 2rem 1.5rem;
  text-align: center;
}

.winner-text {
  font-size: 1.25rem;
  color: whitesmoke;
  margin: 0;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #239ba7;
  color: white;
}

.btn-primary:hover {
  background-color: #1f7a8c;
  transform: scale(1.05);
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
