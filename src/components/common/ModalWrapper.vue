<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div
      class="bg-card border border-border rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto"
      :class="widthClass"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button
          type="button"
          @click="close"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <slot />

      <div v-if="$slots.actions" class="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
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
