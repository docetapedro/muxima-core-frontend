
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Data </label>
        <input v-model="formData.data_cambio" type="date" required
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.data_cambio }" />
        <p v-if="validationErrors.data_cambio" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_cambio[0] }}
        </p>
      </div>

    <!-- Num entidade -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Câmbio USD</label>
      <input v-model="formData.cambio_usd" type="number" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.cambio_usd }" />
      <p v-if="validationErrors.cambio_usd" class="text-xs text-red-600 mt-1">
        {{ validationErrors.cambio_usd[0] }}
      </p>
    </div>

    <!-- Nome -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Câmbio EUR</label>
      <input v-model="formData.cambio_eur" type="number" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.cambio_eur }" />
      <p v-if="validationErrors.cambio_eur" class="text-xs text-red-600 mt-1">{{ validationErrors.cambio_eur[0] }}</p>
    </div>

  </div>
</template>

<script setup>
defineProps({
  validationErrors: { type: Object, default: () => ({}) }
})
const formData = defineModel({ type: Object, required: true })
</script>
