<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Tipologias</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de tipologias</p>
      </div>

      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <PlusCircleIcon class="w-4 h-4" />
        Novo
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input
        v-model="filterNome"
        type="text"
        placeholder="Nome..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

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
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="2" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>

            <tr v-else-if="items.length === 0">
              <td colspan="2" class="text-center py-12 text-muted-foreground">
                Nenhum tipologia encontrado.
              </td>
            </tr>

            <tr
              v-else
              v-for="tipologia in items"
              :key="tipologia.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3">{{ tipologia.nome || '-' }}</td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                    @click="openView(tipologia)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEdit(tipologia)"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    @click="openDelete(tipologia)"
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

    <TipologiaViewModal v-model="showViewModal" :tipologia="selected" />
    <TipologiaFormModal
      v-model="showCreateModal"
      mode="create"
      @success="pesquisar(paginacao?.pagina_actual || 1)"
    />
    <TipologiaFormModal
      v-model="showEditModal"
      mode="edit"
      :record="selected"
      @success="pesquisar(paginacao?.pagina_actual || 1)"
    />

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="a tipologia"
      :item-name="deleteName"
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
import tipologiaService from '@/services/tipologiaService'

import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import TipologiaViewModal from '@/components/tipologias/TipologiaViewModal.vue'
import TipologiaFormModal from '@/components/tipologias/TipologiaFormModal.vue'

const filterNome = ref('')

const { items, paginacao, loading, fetchItems, destroy } = useCrud(tipologiaService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const deleteName = computed(() => selected.value?.nome ?? '')

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
    nome: filterNome.value || undefined,
  })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(tipologia) {
  selected.value = tipologia
  showViewModal.value = true
}

function openEdit(tipologia) {
  selected.value = tipologia
  showEditModal.value = true
}

function openDelete(tipologia) {
  selected.value = tipologia
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
})
</script>
