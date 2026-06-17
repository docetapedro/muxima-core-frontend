<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold">Aging de Inadimplência</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Seleccione um condomínio e gere o PDF com o aging da inadimplência.
      </p>
    </div>

    <div class="bg-card border border-border rounded-xl p-6 space-y-4 max-w-2xl">
      <div>
        <label class="block text-sm font-medium mb-1">Condomínio</label>
        <select v-model.number="selectedCondominioId"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option :value="null" disabled>Seleccione um condomínio...</option>
          <option v-for="c in condominios" :key="c.id" :value="c.id">
            {{ c.nome }}<span v-if="c.nome_abreviado"> · {{ c.nome_abreviado }}</span>
          </option>
        </select>
        <div v-if="loadingCondominios" class="text-xs text-muted-foreground mt-2">A carregar condomínios...</div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button @click="gerar('open')" :disabled="!selectedCondominioId || generating"
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Loader2 v-if="generating === 'open'" class="w-4 h-4 animate-spin" />
          <FileText v-else class="w-4 h-4" />
          Gerar e abrir PDF
        </button>

        <button @click="gerar('download')" :disabled="!selectedCondominioId || generating"
          class="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors disabled:opacity-50">
          <Loader2 v-if="generating === 'download'" class="w-4 h-4 animate-spin" />
          <Download v-else class="w-4 h-4" />
          Baixar PDF
        </button>
      </div>

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, FileText, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import condominioService from '@/services/condominioService'
import relatorioService from '@/services/relatorioService'
import { getCachedLookup } from '@/composables/useLookupCache'
import { openPdf, downloadPdf, extractBlobErrorMessage, slugify } from '@/utils/pdf'

const condominios = ref([])
const loadingCondominios = ref(false)
const selectedCondominioId = ref(null)
const generating = ref(null)
const error = ref('')

function parseItems(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && it.id != null)
}

async function loadCondominios() {
  loadingCondominios.value = true
  try {
    condominios.value = await getCachedLookup(
      'lookup:condominios',
      async () => parseItems(await condominioService.listar())
    )
  } catch (e) {
    console.error(e)
    toast.error('Falha ao carregar condomínios.')
  } finally {
    loadingCondominios.value = false
  }
}

async function gerar(mode) {
  if (!selectedCondominioId.value) return
  generating.value = mode
  error.value = ''
  try {
    const response = await relatorioService.agingInadimplenciaPdf(selectedCondominioId.value)
    if (mode === 'open') {
      openPdf(response.data)
    } else {
      const c = condominios.value.find((x) => x.id === selectedCondominioId.value)
      const slug = slugify(c?.nome_abreviado || c?.nome || `condominio-${selectedCondominioId.value}`)
      downloadPdf(response.data, `aging-inadimplencia-${slug}`)
    }
  } catch (e) {
    console.error(e)
    error.value = await extractBlobErrorMessage(e, 'Falha ao gerar o aging de inadimplência.')
  } finally {
    generating.value = null
  }
}

onMounted(loadCondominios)
</script>
