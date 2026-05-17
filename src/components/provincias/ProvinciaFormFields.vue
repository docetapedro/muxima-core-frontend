<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="md:col-span-2 lg:col-span-3">
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input
        v-model="formData.nome"
        type="text"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.nome }"
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
</script>
