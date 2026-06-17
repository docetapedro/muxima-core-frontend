<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold">Cash Flow Projectado</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Seleccione um condomínio e indique o horizonte (em meses) para gerar o PDF da projecção de cash flow.
      </p>
    </div>

    <div class="bg-card border border-border rounded-xl p-6 space-y-4 max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Horizonte (meses) *</label>
          <input v-model.number="meses" type="number" min="1" max="120" step="1"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <p class="text-xs text-muted-foreground mt-1">Entre 1 e 120 meses.</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Condomínio *</label>
          <select v-model.number="selectedCondominioId" required
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option :value="null" disabled>Seleccione um condomínio...</option>
            <option v-for="c in condominios" :key="c.id" :value="c.id">
              {{ c.nome }}<span v-if="c.nome_abreviado"> · {{ c.nome_abreviado }}</span>
            </option>
          </select>
          <div v-if="loadingCondominios" class="text-xs text-muted-foreground mt-2">A carregar condomínios...</div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button @click="gerar('open')" :disabled="!canGenerate || generating"
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Loader2 v-if="generating === 'open'" class="w-4 h-4 animate-spin" />
          <FileText v-else class="w-4 h-4" />
          Gerar e abrir PDF
        </button>

        <button @click="gerar('download')" :disabled="!canGenerate || generating"
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
import { ref, computed, onMounted } from 'vue'
import { Loader2, FileText, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import condominioService from '@/services/condominioService'
import relatorioService from '@/services/relatorioService'
import { getCachedLookup } from '@/composables/useLookupCache'
import { openPdf, downloadPdf, extractBlobErrorMessage, slugify } from '@/utils/pdf'

const meses = ref(24)
const selectedCondominioId = ref(null)
const condominios = ref([])
const loadingCondominios = ref(false)
const generating = ref(null)
const error = ref('')

const validMeses = computed(() => Number.isInteger(meses.value) && meses.value >= 1 && meses.value <= 120)
const canGenerate = computed(() => validMeses.value && !!selectedCondominioId.value)

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
  if (!canGenerate.value) return
  generating.value = mode
  error.value = ''
  try {
    const response = await relatorioService.cashFlowProjectadoPdf(meses.value, selectedCondominioId.value)
    const c = condominios.value.find((x) => x.id === selectedCondominioId.value)
    const slug = c ? `-${slugify(c.nome_abreviado || c.nome)}` : ''
    const fileName = `cash-flow-projectado-${meses.value}m${slug}`
    if (mode === 'open') {
      openPdf(response.data)
    } else {
      downloadPdf(response.data, fileName)
    }
  } catch (e) {
    console.error(e)
    error.value = await extractBlobErrorMessage(e, 'Falha ao gerar o cash flow projectado.')
  } finally {
    generating.value = null
  }
}

onMounted(loadCondominios)
</script>
