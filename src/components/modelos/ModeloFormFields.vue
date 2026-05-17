<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input
        v-model="formData.nome"
        type="text"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('nome')"
      />
      <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">
        {{ validationErrors.nome[0] }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) },
})

const formData = defineModel({ type: Object, required: true })

function fieldClass(name) {
  return props.validationErrors[name] ? 'border-red-500' : ''
}
</script>
