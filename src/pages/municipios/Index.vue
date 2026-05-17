<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Municípios</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de municípios</p>
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
        v-model="filterNome"
        type="text"
        placeholder="Nome..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <select
        v-model="filterProvinciaId"
        class="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todas as províncias</option>
        <option v-for="prov in provincias" :key="prov.id ?? prov.value ?? prov.nome" :value="prov.id ?? prov.value ?? prov">
          {{ prov.nome ?? prov.label ?? prov.value }}
        </option>
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

    <!-- TOTAL (acima da tabela) -->
    <div v-if="paginacao" class="text-xs text-muted-foreground">
      Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>
    </div>

    <!-- TABELA -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Província</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>

            <tr v-else-if="items.length === 0">
              <td colspan="3" class="text-center py-12 text-muted-foreground">
                Nenhum município encontrado.
              </td>
            </tr>

            <tr
              v-else
              v-for="municipio in items"
              :key="municipio.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3">{{ municipio.nome || '-' }}</td>
              <td class="px-4 py-3">{{ municipio.provincia?.nome || '-' }}</td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                    @click="openView(municipio)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEdit(municipio)"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    @click="openDelete(municipio)"
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

    <!-- PAGINAÇÃO -->
    <div
      v-if="paginacao"
      class="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card"
    >
      <div class="text-xs text-muted-foreground">
        Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>
        · Página <span class="font-medium text-foreground">{{ paginacao.pagina_actual }}</span> de
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
            :class="page === paginacao.pagina_actual ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'"
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

    <!-- MODAIS -->
    <MunicipioViewModal v-model="showViewModal" :municipio="selected" />
    <MunicipioFormModal v-model="showCreateModal" mode="create" @success="pesquisar(paginacao?.pagina_actual || 1)" />
    <MunicipioFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar(paginacao?.pagina_actual || 1)" />

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="o município"
      :item-name="selected?.nome"
      :loading="deleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { useCrud } from '@/composables/useCrud'
import municipioService from '@/services/municipioService'
import provinciaService from '@/services/provinciaService'

import MunicipioViewModal from '@/components/municipios/MunicipioViewModal.vue'
import MunicipioFormModal from '@/components/municipios/MunicipioFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const filterNome = ref('')
const filterProvinciaId = ref(null)

const provincias = ref([])

const { items, paginacao, loading, fetchItems, destroy } = useCrud(municipioService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

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

async function loadProvincias() {
  try {
    const res = await provinciaService.listar()
    const items = res.data?.dados?.items ?? res.data?.dados ?? res.data?.items ?? []
    provincias.value = items
  } catch (e) {
    console.error(e)
    provincias.value = []
  }
}

function pesquisar(page = 1) {
  fetchItems({
    page,
    nome: filterNome.value || undefined,
    provincia_id: filterProvinciaId.value || undefined,
  })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(municipio) {
  selected.value = municipio
  showViewModal.value = true
}

function openEdit(municipio) {
  selected.value = municipio
  showEditModal.value = true
}

function openDelete(municipio) {
  selected.value = municipio
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

onMounted(async () => {
  await loadProvincias()
  pesquisar(1)
})
</script>
