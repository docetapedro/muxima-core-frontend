<template>
  <div class="space-y-6 animate-fade-in">
    <!-- HEADER -->
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold truncate">
          Imóveis do Condomínio
        </h1>
        <p class="text-muted-foreground text-sm mt-1">
          {{ condominio?.nome || `Condomínio #${id}` }}
        </p>
      </div>

      <RouterLink
        to="/condominios"
        class="px-4 py-2 rounded-md border border-border bg-white text-black shadow-sm hover:bg-muted/70 text-sm whitespace-nowrap transition-colors"
      >
        Voltar
      </RouterLink>
    </div>

    <!-- FILTERS + PAGINATION -->
    <div class="bg-muted/30 border border-border rounded-xl p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="text-xs text-muted-foreground block mb-1">
            Tipo de Imóvel
          </label>

          <select
            v-model="filters.tipoImovel"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Todos</option>
            <option
              v-for="opt in tipoImovelOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs text-muted-foreground block mb-1">
            Tipologia
          </label>

          <select
            v-model="filters.tipologia"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Todas</option>
            <option
              v-for="opt in tipologiaOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs text-muted-foreground block mb-1">
            Disponibilidade
          </label>

          <select
            v-model="filters.ocupado"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Todos</option>
            <option value="ocupado">Ocupado</option>
            <option value="disponivel">Disponível</option>
          </select>
        </div>

        <div class="flex items-end md:col-span-3">
          <button
            type="button"
            class="w-full px-4 py-2 rounded-md border border-border text-sm hover:bg-muted/30 transition-colors"
            @click="resetFilters"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <!-- TEXTO FILTER -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs text-muted-foreground block mb-1">
            Pesquisa
          </label>

          <input
            v-model="filters.texto"
            type="text"
            placeholder="Referência, placa, quadra, lote..."
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 flex-wrap">
        <p class="text-sm text-muted-foreground">
          Mostrando
          <span class="font-medium text-foreground">{{ paginatedItems.length }}</span>
          de
          <span class="font-medium text-foreground">{{ filteredItems.length }}</span>
          imóveis
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted/30 transition-colors disabled:opacity-50"
            :disabled="page === 1"
            @click="page = Math.max(1, page - 1)"
          >
            Anterior
          </button>

          <span class="text-sm text-muted-foreground">
            Página <span class="font-medium text-foreground">{{ page }}</span> / <span class="font-medium text-foreground">{{ totalPages }}</span>
          </span>

          <button
            type="button"
            class="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted/30 transition-colors disabled:opacity-50"
            :disabled="page === totalPages"
            @click="page = Math.min(totalPages, page + 1)"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div class="bg-card border border-border rounded-xl p-6">
        <div class="h-5 w-64 bg-muted rounded mb-3"></div>
        <div class="h-4 w-80 bg-muted rounded"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-card border border-border rounded-xl p-4"
        >
          <div class="h-4 w-48 bg-muted rounded mb-3"></div>
          <div class="h-3 w-64 bg-muted rounded mb-2"></div>
          <div class="h-3 w-40 bg-muted rounded mb-3"></div>
          <div class="h-9 w-24 bg-muted rounded"></div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div v-else>
      <div v-if="filteredItems.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <RouterLink
          v-for="imovel in paginatedItems"
          :key="imovel.id"
          :to="{ name: 'imoveis.show', params: { id: imovel.id } }"
          class="group relative block overflow-hidden bg-card text-card-foreground border border-border rounded-xl p-4 flex flex-col gap-3 hover:bg-muted/20 hover:shadow-md transition-all cursor-pointer"
        >
          <div class="pointer-events-none absolute -right-6 -top-4 h-28 w-28 rounded-full bg-primary/10"></div>
          <div class="pointer-events-none absolute right-3 top-3 opacity-10 text-foreground">
            <Home class="h-20 w-20" />
          </div>

          <div class="relative flex items-start gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-muted text-foreground shadow-[3px_3px_0_0_#000]">
              <Home class="h-6 w-6" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Imóvel</p>
                <span
                  class="px-2 py-1 text-xs rounded-full shrink-0 whitespace-nowrap"
                  :class="imovel.ocupado ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                >
                  {{ imovel.ocupado ? 'Ocupado' : 'Disponível' }}
                </span>
              </div>

              <p class="font-semibold truncate mt-1">{{ imovel.referencia || '-' }}</p>

              <p class="text-sm text-muted-foreground mt-1 truncate">
                {{ imovel.tipoImovel?.nome || '-' }} · {{ imovel.tipologia?.nome || '-' }}
              </p>
            </div>
          </div>

          <div class="relative grid grid-cols-2 gap-2">
            <div class="rounded-lg border border-border p-2 bg-background/70">
              <p class="text-xs text-muted-foreground mb-1">Área do Lote</p>
              <p class="text-sm font-medium">{{ imovel.area_lote || '0,00' }}</p>
            </div>

            <div class="rounded-lg border border-border p-2 bg-background/70">
              <p class="text-xs text-muted-foreground mb-1">Andar</p>
              <p class="text-sm font-medium">{{ imovel.andar || '-' }}</p>
            </div>
          </div>

          <div class="relative flex items-center justify-between gap-3 mt-1 pt-3 border-t border-border/70">
            <p class="text-xs text-muted-foreground truncate">
              Criado: {{ imovel.created_at || '-' }}
            </p>

            <span class="px-3 py-2 rounded-md bg-muted text-foreground text-sm font-medium whitespace-nowrap">
              Saldo: {{ formatSaldoAcumulado(imovel.saldo_acumulado) }}
            </span>
          </div>

          <div class="relative flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/60 px-3 py-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Home class="h-4 w-4" />
            </div>

            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-wide text-primary">Ver imóvel</p>
              <p class="text-xs text-muted-foreground truncate">Abrir detalhes, negociação e histórico</p>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-else class="text-center py-12 text-muted-foreground">
        Nenhum imóvel encontrado com os filtros selecionados.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Home } from 'lucide-vue-next'
import http from '@/api/http'
import tipoImovelService from '@/services/tipoImovelService'
import { converteParaMonetario } from '@/utils/formatacao'

const route = useRoute()
const id = computed(() => route.params.id)

const loading = ref(false)
const condominio = ref(null)
const imoveis = ref([])

const filters = ref({
  tipoImovel: '',
  tipologia: '',
  ocupado: '', // '', 'ocupado', 'disponivel'
  texto: '',
})

const tipoImovelOptions = ref([])

const pageSize = ref(6)
const page = ref(1)


const tipologiaOptions = computed(() => {
  const map = new Map()
  for (const imovel of imoveis.value) {
    // se filtrou tipoImovel, respeitar esse filtro na lista de tipologias
    if (filters.value.tipoImovel) {
      const t = imovel.tipoImovel?.id ? String(imovel.tipoImovel.id) : ''
      if (t !== filters.value.tipoImovel) continue
    }

    const tp = imovel.tipologia
    if (!tp?.id) continue
    map.set(String(tp.id), { value: String(tp.id), label: tp.nome || `Tipologia ${tp.id}` })
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
})

const normalizedText = computed(() => (filters.value.texto || '').trim().toLowerCase())

// FILTER + PAGINATION
const filteredItems = computed(() => {
    return imoveis.value.filter((imovel) => {
    const tipoOk = !filters.value.tipoImovel
      ? true
      : String(imovel.tipoImovel?.id ?? '') === filters.value.tipoImovel

    const tipologiaOk = !filters.value.tipologia
      ? true
      : String(imovel.tipologia?.id ?? '') === filters.value.tipologia

    const ocupadoFlag = !!imovel.ocupado
    const disponibilidadeOk = !filters.value.ocupado
      ? true
      : filters.value.ocupado === 'ocupado'
        ? ocupadoFlag
        : !ocupadoFlag

    const textOk = !normalizedText.value
      ? true
      : [
          imovel.referencia,
          imovel.placa,
          imovel.quadra,
          imovel.lote,
        ]
          .map((v) => (v ?? '').toString().toLowerCase())
          .some((v) => v.includes(normalizedText.value))

    return tipoOk && tipologiaOk && disponibilidadeOk && textOk
  })
})

const totalPages = computed(() => {
  const n = Math.ceil(filteredItems.value.length / pageSize.value)
  return n > 0 ? n : 1
})

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

watch(
  () => [filters.value.tipoImovel, filters.value.tipologia, filters.value.ocupado, filters.value.texto],
  () => {
    page.value = 1
  }
)

function resetFilters() {
  filters.value.tipoImovel = ''
  filters.value.tipologia = ''
  filters.value.ocupado = ''
  filters.value.texto = ''
  page.value = 1
}

function formatSaldoAcumulado(valor) {
  if (valor == null || valor === '') return '-'
  return converteParaMonetario(valor)
}

const load = async () => {
  if (!id.value) return

  loading.value = true
  try {
    // carregar lista de tipo de imóveis do endpoint correto
    try {
      const resTipos = await tipoImovelService.listar()
      const dados = resTipos?.data?.dados

      const items =
        Array.isArray(dados?.items) ? dados.items
        : Array.isArray(dados) ? dados
        : []

      tipoImovelOptions.value = items
        .map((t) => ({
          value: String(t.id),
          label: t.nome || `Tipo ${t.id}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    } catch (e) {
      console.error(e)
      tipoImovelOptions.value = []
    }

    // carregar condomínio + imóveis
    const res = await http.get(`/api/condominios/${id.value}`)
    const dados = res?.data?.dados

    condominio.value = dados || null
    imoveis.value = Array.isArray(dados?.imoveis) ? dados.imoveis : []
  } catch (e) {
    console.error(e)
    condominio.value = null
    imoveis.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
