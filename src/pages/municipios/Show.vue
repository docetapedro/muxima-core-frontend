<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Detalhe do Município</h1>
        <p class="text-muted-foreground text-sm mt-1">Informações completas</p>
      </div>

      <RouterLink to="/municipios" class="px-4 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm">
        Voltar
      </RouterLink>
    </div>

    <MunicipioViewModal v-model="showViewModal" :municipio="selected" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import http from '@/api/http'
import MunicipioViewModal from '@/components/municipios/MunicipioViewModal.vue'

const route = useRoute()

const selected = ref(null)
const showViewModal = ref(true)

const loadMunicipio = async () => {
  const id = route.params.id
  if (!id) return
  try {
    const res = await http.get(`/api/municipios/${id}`)
    selected.value = res.data?.dados ?? res.data?.dados?.dados ?? res.data?.dados?.items?.[0] ?? res.data?.item ?? res.data
  } catch (e) {
    console.error(e)
    selected.value = null
  }
}

onMounted(loadMunicipio)
</script>
