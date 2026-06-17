<template>
  <div class="space-y-3">
    <div v-if="isLocked"
      class="text-xs px-3 py-2 rounded-md border border-amber-300 bg-amber-50 text-amber-800">
      Item protegido — só é permitido alterar <strong>Dias após vencimento</strong>.
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="text-sm font-medium mb-1 block">Código</label>
        <input v-model="formData.codigo" type="text" required :readonly="isLocked"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{
            'border-red-500': validationErrors.codigo,
            'bg-muted cursor-not-allowed': isLocked
          }" />
        <p v-if="validationErrors.codigo" class="text-xs text-red-600 mt-1">
          {{ validationErrors.codigo[0] }}
        </p>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Nome</label>
        <input v-model="formData.nome" type="text" required :readonly="isLocked"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{
            'border-red-500': validationErrors.nome,
            'bg-muted cursor-not-allowed': isLocked
          }" />
        <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">
          {{ validationErrors.nome[0] }}
        </p>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Dias após vencimento</label>
        <input v-model.number="formData.dias_apos_vencimento" type="number" min="0" step="1"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.dias_apos_vencimento }" />
        <p v-if="validationErrors.dias_apos_vencimento" class="text-xs text-red-600 mt-1">
          {{ validationErrors.dias_apos_vencimento[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isItemProtegido } from '@/utils/itemForm'

defineProps({
  validationErrors: { type: Object, default: () => ({}) }
})
const formData = defineModel({ type: Object, required: true })

const isLocked = computed(() => isItemProtegido(formData.value))
</script>
