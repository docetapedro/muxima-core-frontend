<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Entidades</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de entidades</p>
      </div>
      <button @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        <PlusCircleIcon class="w-4 h-4" />
        Novo
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input v-model="searchTerm" type="text" placeholder="Nome, Email, Telefone..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <select v-model="tipoFilter"
        class="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">Tipo</option>
        <option value="P">Pessoa</option>
        <option value="E">Empresa</option>
      </select>
      <button @click="pesquisar" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Pesquisar
      </button>
    </div>

    <!-- TOTAL (acima da tabela) -->
    <div v-if="paginacao" class="text-xs text-muted-foreground">
      Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>

    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nº Entidade</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">NIF</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nº BI</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Telefone</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="4" class="text-center py-12 text-muted-foreground">
                Nenhuma entidade encontrada.
              </td>
            </tr>
            <tr v-else v-for="entidade in items" :key="entidade.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td class="px-4 py-3">{{ getTipoEntidadeLabel(entidade.tipo) }}</td>
              <td class="px-4 py-3">{{ entidade.num_entidade }}</td>
              <td class="px-4 py-3">{{ entidade.nome }}</td>
              <td class="px-4 py-3">{{ entidade
              .email }}</td>
              <td class="px-4 py-3">{{ entidade.nif }}</td>
              <td class="px-4 py-3">{{ entidade.num_bi }}</td>
              <td class="px-4 py-3">{{ entidade.telefone }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button @click="openView(entidade)" class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="openEdit(entidade)" class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button @click="openDelete(entidade)" class="text-red-600 hover:text-red-700 transition-colors"
                    title="Excluir">
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
    <div v-if="paginacao" class="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card">
      <div class="text-xs text-muted-foreground">
        Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>
        · Página <span class="font-medium text-foreground">{{ paginacao.pagina_actual }}</span> de
        <span class="font-medium text-foreground">{{ paginacao.ultima_pagina }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
          :disabled="paginacao.pagina_actual <= 1" @click="pesquisar(paginacao.pagina_actual - 1)">
          Anterior
        </button>

        <div class="flex items-center gap-1">
          <button v-for="page in pagesToShow" :key="page" class="px-3 py-1 rounded-md border text-sm hover:bg-muted"
            :class="page === paginacao.pagina_actual ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'"
            @click="pesquisar(page)">
            {{ page }}
          </button>
        </div>

        <button
          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
          :disabled="paginacao.pagina_actual >= paginacao.ultima_pagina"
          @click="pesquisar(paginacao.pagina_actual + 1)">
          Próxima
        </button>
      </div>
    </div>

    <EntidadeViewModal v-model="showViewModal" :Entidade="selected" />
    <EntidadeFormModal v-model="showCreateModal" mode="create" @success="pesquisar" />
    <EntidadeFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar" />
    <ConfirmDeleteModal v-model="showDeleteModal" entity-label="a entidade" :item-name="selected?.nome"
      :loading="deleting" :error="deleteError" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { useCrud } from '@/composables/useCrud'
import entidadeservice from '@/services/entidadeService'
import { getTipoEntidadeLabel } from '@/utils/entidadeLabels'
import EntidadeViewModal from '@/components/entidades/EntidadeViewModal.vue'
import EntidadeFormModal from '@/components/entidades/EntidadeFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const searchTerm = ref('')
const tipoFilter = ref('')
const { items, paginacao, loading, fetchItems, destroy } = useCrud(entidadeservice)

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

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

function pesquisar(page = 1) {
  fetchItems({
    page,
    search: searchTerm.value || undefined,
    tipo: tipoFilter.value || undefined,
    tipo_entidade: tipoFilter.value || undefined
  })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(Entidade) {
  selected.value = Entidade
  showViewModal.value = true
}

async function openEdit(Entidade) {
  selected.value = Entidade
  try {
    const res = await entidadeservice.obter(Entidade.id)
    const full = res?.data?.dados ?? res?.data ?? null
    if (full) selected.value = full
  } catch (e) {
    console.error(e)
  }
  showEditModal.value = true
}

function openDelete(Entidade) {
  selected.value = Entidade
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
