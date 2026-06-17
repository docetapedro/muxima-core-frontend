<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center z-[100] px-4 py-6"
  >
    <div
      class="modal-surface border border-zinc-300 rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
      :class="widthClass"
      style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button
          type="button"
          @click="close"
          class="hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <slot />

      <div v-if="$slots.actions" class="flex justify-end gap-2 mt-6 pt-4 border-t border-zinc-300">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, required: true },
  width: { type: String, default: 'medium' }
})

const emit = defineEmits(['update:modelValue'])

const widthClass = computed(() => {
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl'
  }
  return sizes[props.width] || sizes.medium
})

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-surface {
  color-scheme: light;
  color: #000;
}

.modal-surface :deep(*) {
  color: #000 !important;
}

.modal-surface :deep(.text-red-500),
.modal-surface :deep(.text-red-600),
.modal-surface :deep(.text-red-700),
.modal-surface :deep(.text-destructive) {
  color: #dc2626 !important;
}

.modal-surface :deep(.text-muted-foreground) {
  color: #000 !important;
}

.modal-surface :deep(label) {
  color: #000 !important;
}

.modal-surface :deep(.bg-card),
.modal-surface :deep(.bg-background),
.modal-surface :deep(.border),
.modal-surface :deep(.border-border) {
  background-color: #fff !important;
  border-color: #d1d5db !important;
}

.modal-surface :deep(input),
.modal-surface :deep(select),
.modal-surface :deep(textarea) {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #d1d5db !important;
}

.modal-surface :deep(input::placeholder),
.modal-surface :deep(textarea::placeholder) {
  color: #6b7280 !important;
}
</style>
