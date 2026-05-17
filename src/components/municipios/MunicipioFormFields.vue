<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    

    <div class="sm:col-span-2">
      <label class="text-sm font-medium mb-1 block">Província *</label>
      <select
        v-model="formData.provincia"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null" disabled>Selecione uma província...</option>
        <option
          v-for="prov in provincias"
          :key="prov.id ?? prov.value ?? prov.nome"
          :value="prov.id ?? prov.value ?? prov"
        >
          {{ prov.nome ?? prov.label ?? prov.value }}
        </option>
      </select>
      <p v-if="validationErrors.provincia" class="text-xs text-red-600 mt-1">
        {{ validationErrors.provincia[0] }}
      </p>

      <div v-if="loadingProvincias" class="text-xs text-muted-foreground mt-2">
        A carregar províncias...
      </div>
    </div>

    <div class="sm:col-span-2">
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input
        v-model="formData.nome"
        type="text"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">
        {{ validationErrors.nome[0] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import provinciaService from '@/services/provinciaService'

const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) }
})

const formData = defineModel({ type: Object, required: true })

const provincias = ref([])
const loadingProvincias = ref(false)

async function loadProvincias() {
  loadingProvincias.value = true
  try {
    const res = await provinciaService.listar()
    // expected: { dados: { items: [...] } } or { dados: { data: [...] } } or { data: [...] }
    const items = res.data?.dados?.items ?? res.data?.dados ?? res.data?.items ?? []
    provincias.value = items
  } catch (e) {
    console.error(e)
    provincias.value = []
  } finally {
    loadingProvincias.value = false
  }
}

onMounted(() => {
  loadProvincias()
})
</script>
