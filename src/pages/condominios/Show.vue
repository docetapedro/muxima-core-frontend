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
        class="px-4 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm whitespace-nowrap"
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
        <div
          v-for="imovel in paginatedItems"
          :key="imovel.id"
          class="bg-muted/20 border border-border rounded-xl p-4 flex flex-col gap-3 hover:bg-muted/40 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs text-muted-foreground mb-1">Referência</p>
              <p class="font-semibold truncate">{{ imovel.referencia || '-' }}</p>

              <p class="text-sm text-muted-foreground mt-1 truncate">
                {{ imovel.tipoImovel?.nome || '-' }} · {{ imovel.tipologia?.nome || '-' }}
              </p>
            </div>

            <span
              class="px-2 py-1 text-xs rounded-full shrink-0 whitespace-nowrap"
              :class="imovel.ocupado ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
            >
              {{ imovel.ocupado ? 'Ocupado' : 'Disponível' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-lg border border-border p-2">
              <p class="text-xs text-muted-foreground mb-1">Área do Lote</p>
              <p class="text-sm font-medium">{{ imovel.area_lote || '0,00' }}</p>
            </div>

            <div class="rounded-lg border border-border p-2">
              <p class="text-xs text-muted-foreground mb-1">Andar</p>
              <p class="text-sm font-medium">{{ imovel.andar || '-' }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 mt-1">
            <p class="text-xs text-muted-foreground truncate">
              Criado: {{ imovel.created_at || '-' }}
            </p>

            <RouterLink
              :to="{ name: 'imoveis.show', params: { id: imovel.id } }"
              class="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Ver imóvel
            </RouterLink>
          </div>
        </div>
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
import http from '@/api/http'
import tipoImovelService from '@/services/tipoImovelService'

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
