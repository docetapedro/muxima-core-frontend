<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold">Inadimplência por Condomínio</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Seleccione um condomínio e gere o PDF com a lista de inadimplência.
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
        <button @click="gerarPdf({ mode: 'open' })" :disabled="!selectedCondominioId || generating"
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Loader2 v-if="generating === 'open'" class="w-4 h-4 animate-spin" />
          <FileText v-else class="w-4 h-4" />
          Gerar e abrir PDF
        </button>

        <button @click="gerarPdf({ mode: 'download' })" :disabled="!selectedCondominioId || generating"
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

const condominios = ref([])
const loadingCondominios = ref(false)
const selectedCondominioId = ref(null)
const generating = ref(null) // null | 'open' | 'download'
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

async function gerarPdf({ mode }) {
  if (!selectedCondominioId.value) return
  generating.value = mode
  error.value = ''
  try {
    const response = await relatorioService.inadimplenciaPdf(selectedCondominioId.value)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    if (mode === 'open') {
      window.open(url, '_blank', 'noopener,noreferrer')
      // revoga depois de algum tempo para a aba ter tempo de carregar
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } else {
      const condominio = condominios.value.find((c) => c.id === selectedCondominioId.value)
      const slug = (condominio?.nome_abreviado || condominio?.nome || `condominio-${selectedCondominioId.value}`)
        .toString()
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      const a = document.createElement('a')
      a.href = url
      a.download = `inadimplencia-${slug}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.error(e)
    // se o backend devolveu um erro JSON apesar de termos pedido blob, tentamos lê-lo
    if (e?.response?.data instanceof Blob && e.response.data.type === 'application/json') {
      try {
        const text = await e.response.data.text()
        const parsed = JSON.parse(text)
        error.value = parsed?.message || 'Falha ao gerar o relatório.'
      } catch {
        error.value = 'Falha ao gerar o relatório.'
      }
    } else {
      error.value = e?.response?.data?.message || 'Falha ao gerar o relatório.'
    }
  } finally {
    generating.value = null
  }
}

onMounted(loadCondominios)
</script>
