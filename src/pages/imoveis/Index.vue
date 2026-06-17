<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Imóveis</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de imóveis</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <PlusCircleIcon class="w-4 h-4" />
        Novo
      </button>
    </div>

    <!-- FILTROS -->
    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Referência..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <select
        v-model.number="filters.condominio"
        class="min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os condomínios</option>
        <option v-for="c in condominioOptions" :key="c.id" :value="c.id">
          {{ c.nome ?? c.label ?? c.id }}
        </option>
      </select>

      <select
        v-model.number="filters.tipologia"
        class="min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todas as tipologias</option>
        <option v-for="t in tipologiasOptions" :key="t.id" :value="t.id">
          {{ t.nome ?? t.label ?? t.id }}
        </option>
      </select>

      <select
        v-model.number="filters.tipo_imovel"
        class="min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os tipos de imóvel</option>
        <option v-for="ti in tipoImovelOptions" :key="ti.id" :value="ti.id">
          {{ ti.nome ?? ti.label ?? ti.id }}
        </option>
      </select>

      <select
        v-model.number="filters.modelo"
        class="min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os modelos</option>
        <option v-for="m in modeloOptions" :key="m.id" :value="m.id">
          {{ m.nome ?? m.label ?? m.id }}
        </option>
      </select>

      <select
        v-model="filters.ocupado"
        class="min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os estados</option>
        <option :value="true">Ocupados</option>
        <option :value="false">Livres</option>
      </select>

      <button
        @click="pesquisar(1)"
        :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Pesquisar
      </button>
    </div>

    <div v-if="paginacao" class="text-xs text-muted-foreground">
      Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Referência</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Condomínio</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Tipo Imóvel</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Tipologia</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Modelo</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Quadra</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Lote</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>

            <tr v-else-if="items.length === 0">
              <td colspan="9" class="text-center py-12 text-muted-foreground">
                Nenhum imóvel encontrado.
              </td>
            </tr>

            <tr
              v-else
              v-for="imovel in items"
              :key="imovel.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              :class="isImovelOccupied(imovel) ? 'bg-red-50/60 dark:bg-red-950/20' : ''"
            >
              <td class="px-4 py-3">{{ imovel.referencia }}</td>
              <td class="px-4 py-3">{{ imovel.condominio?.nome ?? '-' }}</td>
              <td class="px-4 py-3">{{ imovel.tipoImovel?.nome ?? '-' }}</td>
              <td class="px-4 py-3">{{ imovel.tipologia?.nome ?? imovel.tipologia ?? '-' }}</td>
              <td class="px-4 py-3">{{ imovel.modelo?.nome ?? imovel.modelo ?? '-' }}</td>
              <td class="px-4 py-3">{{ imovel.quadra }}</td>
              <td class="px-4 py-3">{{ imovel.lote }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border"
                  :class="isImovelOccupied(imovel)
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'"
                >
                  {{ isImovelOccupied(imovel) ? 'Ocupado' : 'Livre' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                    @click="openView(imovel)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="openEdit(imovel)"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="openDelete(imovel)"
                    class="text-red-600 hover:text-red-700 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="paginacao" class="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card">
      <div class="text-xs text-muted-foreground">
        Página <span class="font-medium text-foreground">{{ paginacao.pagina_actual }}</span> de
        <span class="font-medium text-foreground">{{ paginacao.ultima_pagina }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
          :disabled="paginacao.pagina_actual <= 1"
          @click="pesquisar(paginacao.pagina_actual - 1)"
        >
          Anterior
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in pagesToShow"
            :key="page"
            class="px-3 py-1 rounded-md border text-sm hover:bg-muted"
            :class="page === paginacao.pagina_actual
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border text-foreground'"
            @click="pesquisar(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
          :disabled="paginacao.pagina_actual >= paginacao.ultima_pagina"
          @click="pesquisar(paginacao.pagina_actual + 1)"
        >
          Próxima
        </button>
      </div>
    </div>

    <ImovelViewModal v-model="showViewModal" :imovel="selected" />
    <ImovelFormModal v-model="showCreateModal" mode="create" @success="pesquisar(paginacao?.pagina_actual || 1)" />
    <ImovelFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar(paginacao?.pagina_actual || 1)" />

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="o imóvel"
      :item-name="deleteLabel"
      :loading="deleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'

import { useCrud } from '@/composables/useCrud'
import { getCachedLookup } from '@/composables/useLookupCache'
import imovelService from '@/services/imovelService'
import condominioService from '@/services/condominioService'
import modeloService from '@/services/modeloService'
import tipologiaService from '@/services/tipologiaService'
import tipoImovelService from '@/services/tipoImovelService'
import tipoLoteService from '@/services/tipoLoteService'

import ImovelViewModal from '@/components/imoveis/ImovelViewModal.vue'
import ImovelFormModal from '@/components/imoveis/ImovelFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import { formatImovelLabel } from '@/utils/imovelForm'

const router = useRouter()

const searchTerm = ref('')
const filters = ref({
  condominio: null,
  tipologia: null,
  tipo_imovel: null,
  modelo: null,
  ocupado: null
})

const condominioOptions = ref([])
const tipologiasOptions = ref([])
const tipoImovelOptions = ref([])
const modeloOptions = ref([])

const { items, paginacao, loading, fetchItems, destroy } = useCrud(imovelService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const deleteLabel = computed(() => formatImovelLabel(selected.value))

const pagesToShow = computed(() => {
  if (!paginacao.value) return []
  const last = paginacao.value.ultima_pagina
  const current = paginacao.value.pagina_actual

  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)

  const pages = []
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

function pesquisar(page = 1) {
  fetchItems({
    page,
    referencia: searchTerm.value || undefined,
    condominio: filters.value.condominio || undefined,
    tipologia: filters.value.tipologia || undefined,
    tipo_imovel: filters.value.tipo_imovel || undefined,
    modelo: filters.value.modelo || undefined,
    ocupado: filters.value.ocupado === null ? undefined : filters.value.ocupado
  })
}

function isImovelOccupied(imovel) {
  return Boolean(imovel?.ocupado)
}

function parseItems(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && (it.id != null || it.value != null))
}

async function loadOptions() {
  // Usa o cache de lookups partilhado — assim os mesmos dados servem tanto
  // os filtros desta página como o modal "Novo Imóvel" sem refazer GETs.
  try {
    const [condominios, tipologias, tiposImoveis, modelos] = await Promise.all([
      getCachedLookup('lookup:condominios', async () => parseItems(await condominioService.listar())),
      getCachedLookup('lookup:tipologias', async () => parseItems(await tipologiaService.listar())),
      getCachedLookup('lookup:tipoImoveis', async () => parseItems(await tipoImovelService.listar())),
      getCachedLookup('lookup:modelos', async () => parseItems(await modeloService.listar()))
    ])

    condominioOptions.value = condominios
    tipologiasOptions.value = tipologias
    tipoImovelOptions.value = tiposImoveis
    modeloOptions.value = modelos
  } catch (e) {
    console.error(e)
    condominioOptions.value = []
    tipologiasOptions.value = []
    tipoImovelOptions.value = []
    modeloOptions.value = []
  }

  // Prefetch adicional do lookup que só o modal usa (não há filtro
  // por tipo de lote nesta página).
  getCachedLookup('lookup:tipoLotes', async () => parseItems(await tipoLoteService.listar()))
}

function openCreate() {
  showCreateModal.value = true
}

function openView(imovel) {
  router.push({
    name: 'imoveis.show',
    params: { id: imovel.id }
  })
}

async function openEdit(imovel) {
  try {
    const res = await imovelService.obter(imovel.id)
    selected.value = res.data?.dados ?? res.data ?? imovel
  } catch (e) {
    console.error(e)
    selected.value = imovel
  }
  showEditModal.value = true
}

function openDelete(imovel) {
  selected.value = imovel
  deleteError.value = ''
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selected.value) return
  deleting.value = true
  deleteError.value = ''
  const ok = await destroy(selected.value.id, deleteError)
  deleting.value = false
  if (ok) {
    showDeleteModal.value = false
    selected.value = null
  }
}

onMounted(() => {
  pesquisar(1)
  loadOptions()
})
</script>
