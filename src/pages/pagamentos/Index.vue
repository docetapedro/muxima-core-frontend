<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Pagamentos</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de pagamentos</p>
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
        v-model="searchTerm"
        type="text"
        placeholder="Número operação, Observação..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <button
        @click="pesquisar"
        :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Pesquisar
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Valor</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Moeda</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Imóvel</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">TipoPagamento</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operação</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>

            <tr v-else-if="items.length === 0">
              <td colspan="7" class="text-center py-12 text-muted-foreground">
                Nenhum pagamento encontrado.
              </td>
            </tr>

            <tr v-else v-for="pag in items" :key="pag.id" class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td class="px-4 py-3">{{ pag.data_pagamento ?? '-' }}</td>
              <td class="px-4 py-3">
                {{ pag.valor == null ? '-' : converteParaMonetario(pag.valor) }}
              </td>

              <td class="px-4 py-3">{{ pag.moeda?.sigla ?? pag.moeda?.nome ?? '-' }}</td>
              <td class="px-4 py-3">{{ pag.negociacao?.imovel?.referencia ?? '-' }}</td>
              <td class="px-4 py-3">{{ pag.tipoPagamento?.nome ?? '-' }}</td>

              <td class="px-4 py-3">{{ pag.numero_operacao ?? '-' }}</td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                    @click="openView(pag)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEdit(pag)"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    @click="openDelete(pag)"
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

    <!-- PAGINAÇÃO (opcional, se o backend devolver) -->
    <div v-if="paginacao" class="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card">
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

        <button
          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
          :disabled="paginacao.pagina_actual >= paginacao.ultima_pagina"
          @click="pesquisar(paginacao.pagina_actual + 1)"
        >
          Próxima
        </button>
      </div>
    </div>

    <PagamentoViewModal v-model="showViewModal" :Pagamento="selected" />
    <PagamentoFormModal v-model="showCreateModal" mode="create" @success="pesquisar" />
    <PagamentoFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar" />
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="o pagamento"
      :item-name="selected?.numero_operacao"
      :loading="deleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { useCrud } from '@/composables/useCrud'
import pagamentoService from '@/services/pagamentoService'
import { converteParaMonetario } from '@/utils/formatacao'
import PagamentoViewModal from '@/components/pagamentos/PagamentoViewModal.vue'
import PagamentoFormModal from '@/components/pagamentos/PagamentoFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const searchTerm = ref('')

const { items, paginacao, loading, fetchItems, destroy } = useCrud(pagamentoService)

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
    search: searchTerm.value || undefined
  })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(pag) {
  selected.value = pag
  showViewModal.value = true
}

function openEdit(pag) {
  selected.value = pag
  showEditModal.value = true
}

function openDelete(pag) {
  selected.value = pag
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
