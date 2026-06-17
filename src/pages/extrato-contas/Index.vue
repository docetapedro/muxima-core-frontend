<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold">Extrato de Contas</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Seleccione condomínio, imóvel e negociação para visualizar a conta-corrente.
      </p>
    </div>

    <div class="bg-card border border-border rounded-xl p-6 space-y-4 max-w-3xl">
      <!-- 1. Condomínio -->
      <div>
        <label class="block text-sm font-medium mb-1">1. Condomínio *</label>
        <select v-model.number="selectedCondominioId"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option :value="null" disabled>Seleccione um condomínio...</option>
          <option v-for="c in condominios" :key="c.id" :value="c.id">
            {{ c.nome }}<span v-if="c.nome_abreviado"> · {{ c.nome_abreviado }}</span>
          </option>
        </select>
        <p v-if="loadingCondominios" class="text-xs text-muted-foreground mt-2">A carregar condomínios...</p>
      </div>

      <!-- 2. Imóvel (só quando há condomínio) -->
      <div v-if="selectedCondominioId">
        <label class="block text-sm font-medium mb-1">2. Imóvel *</label>

        <input v-model="imovelFilter" type="text" placeholder="Filtrar por referência, quadra ou lote..."
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2" />

        <select v-model.number="selectedImovelId"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :disabled="loadingImoveis">
          <option :value="null" disabled>{{ loadingImoveis ? 'A carregar...' : 'Seleccione um imóvel...' }}</option>
          <option v-for="i in filteredImoveis" :key="i.id" :value="i.id">
            {{ imovelLabel(i) }}
          </option>
        </select>
        <p v-if="!loadingImoveis && !imoveis.length" class="text-xs text-muted-foreground mt-2">
          Sem imóveis neste condomínio.
        </p>
      </div>

      <!-- 3. Negociação (só quando há imóvel) -->
      <div v-if="selectedImovelId">
        <label class="block text-sm font-medium mb-1">3. Negociação *</label>

        <select v-model.number="selectedNegociacaoId"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :disabled="loadingNegociacoes">
          <option :value="null" disabled>{{ loadingNegociacoes ? 'A carregar...' : 'Seleccione uma negociação...' }}</option>
          <option v-for="n in negociacoesFiltradas" :key="n.id" :value="n.id">
            {{ negociacaoLabel(n) }}
          </option>
        </select>
        <p v-if="!loadingNegociacoes && !negociacoesFiltradas.length" class="text-xs text-muted-foreground mt-2">
          Sem negociações activas neste imóvel.
        </p>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button @click="abrir" :disabled="!selectedNegociacaoId"
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <ArrowRight class="w-4 h-4" />
          Abrir conta-corrente
        </button>
      </div>

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import http from '@/api/http'
import condominioService from '@/services/condominioService'
import imovelService from '@/services/imovelService'
import { getCachedLookup } from '@/composables/useLookupCache'

const router = useRouter()

const condominios = ref([])
const imoveis = ref([])
const negociacoes = ref([])

const loadingCondominios = ref(false)
const loadingImoveis = ref(false)
const loadingNegociacoes = ref(false)

const selectedCondominioId = ref(null)
const selectedImovelId = ref(null)
const selectedNegociacaoId = ref(null)

const imovelFilter = ref('')
const error = ref('')

function parseList(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && it.id != null)
}

function parseSingle(res) {
  return res?.data?.dados ?? res?.data ?? null
}

function imovelLabel(i) {
  const ref = i.referencia ? `${i.referencia}` : `Imóvel #${i.id}`
  const extras = []
  if (i.quadra) extras.push(`Qd. ${i.quadra}`)
  if (i.lote) extras.push(`Lt. ${i.lote}`)
  return extras.length ? `${ref} · ${extras.join(' · ')}` : ref
}

function negociacaoLabel(n) {
  const numero = n.numero ? `Nº ${n.numero}` : `#${n.id}`
  const estado = n.estado || ''
  const entidade =
    (Array.isArray(n.entidade_principal) ? n.entidade_principal[0]?.nome : n.entidade_principal?.nome)
    || n.entidadePrincipal?.nome
    || ''
  const parts = [numero]
  if (estado) parts.push(`[${estado}]`)
  if (entidade) parts.push(entidade)
  return parts.join(' · ')
}

const filteredImoveis = computed(() => {
  const term = imovelFilter.value.trim().toLowerCase()
  if (!term) return imoveis.value
  return imoveis.value.filter((i) => imovelLabel(i).toLowerCase().includes(term))
})

const ESTADOS_OCULTOS = new Set(['RA', 'CA'])
const negociacoesFiltradas = computed(() =>
  negociacoes.value.filter((n) => !ESTADOS_OCULTOS.has(String(n?.estado ?? '').toUpperCase()))
)

async function loadCondominios() {
  loadingCondominios.value = true
  try {
    condominios.value = await getCachedLookup(
      'lookup:condominios',
      async () => parseList(await condominioService.listar())
    )
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Falha ao carregar condomínios.'
    toast.error(error.value)
  } finally {
    loadingCondominios.value = false
  }
}

async function loadImoveis(condominioId) {
  if (!condominioId) {
    imoveis.value = []
    return
  }
  loadingImoveis.value = true
  try {
    const res = await imovelService.listar({
      condominio: condominioId,
      condominio_id: condominioId,
      quantidade: 500,
    })
    imoveis.value = parseList(res)
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Falha ao carregar imóveis.'
    toast.error(error.value)
    imoveis.value = []
  } finally {
    loadingImoveis.value = false
  }
}

async function loadNegociacoes(imovelId) {
  if (!imovelId) {
    negociacoes.value = []
    return
  }
  loadingNegociacoes.value = true
  try {
    // Tentar primeiro filtro directo no /api/negociacoes; se o backend não
    // suportar, cai-se no fallback de buscar o imóvel completo (que traz
    // .negociacoes aninhadas).
    let lista = []
    try {
      const res = await http.get('/api/negociacoes', {
        params: { imovel: imovelId, imovel_id: imovelId, quantidade: 100 }
      })
      lista = parseList(res)
    } catch {
      lista = []
    }
    if (!lista.length) {
      const imovelRes = await imovelService.obter(imovelId)
      const imovel = parseSingle(imovelRes)
      lista = Array.isArray(imovel?.negociacoes) ? imovel.negociacoes : []
    }
    negociacoes.value = lista
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Falha ao carregar negociações.'
    toast.error(error.value)
    negociacoes.value = []
  } finally {
    loadingNegociacoes.value = false
  }
}

function abrir() {
  if (!selectedNegociacaoId.value) return
  router.push({
    name: 'negociacoes.extrato-contas',
    params: { id: selectedNegociacaoId.value }
  })
}

// Cascata: ao mudar de condomínio, reset imóvel + negociação, recarrega imóveis.
watch(selectedCondominioId, async (id) => {
  selectedImovelId.value = null
  selectedNegociacaoId.value = null
  imovelFilter.value = ''
  imoveis.value = []
  negociacoes.value = []
  error.value = ''
  if (id) await loadImoveis(id)
})

// Cascata: ao mudar de imóvel, reset negociação, recarrega negociações.
watch(selectedImovelId, async (id) => {
  selectedNegociacaoId.value = null
  negociacoes.value = []
  error.value = ''
  if (id) await loadNegociacoes(id)
})

// Auto-redirect quando o utilizador escolhe a negociação.
watch(selectedNegociacaoId, (id) => {
  if (id) abrir()
})

onMounted(loadCondominios)
</script>
