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

      <select
        v-model="selectedTipoPagamento"
        class="min-w-56 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os tipos</option>
        <option v-for="tipo in tiposPagamento" :key="tipo.id" :value="tipo.id">
          {{ tipo.nome || tipo.descricao || tipo.codigo || `Tipo ${tipo.id}` }}
        </option>
      </select>

      <select
        v-model="selectedItem"
        class="min-w-56 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="null">Todos os itens</option>
        <option v-for="it in itemOptions" :key="it.id" :value="it.id">
          {{ itemSelectLabel(it) }}
        </option>
      </select>

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
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Imóvel</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Tipo Pagamento</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Item Negociação</th>
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

              <td class="px-4 py-3">{{ getImovelReferencia(pag) }}</td>
              <td class="px-4 py-3">{{ getTipoPagamentoLabel(pag) }}</td>
              <td class="px-4 py-3">{{ getNegociacaoItemLabel(pag) }}</td>

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
                    :disabled="pdfLoading[`${pag.id}-nota`]"
                    @click="gerarNotaPdf(pag)"
                    class="text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                    title="Imprimir nota de pagamento"
                  >
                    <Loader2 v-if="pdfLoading[`${pag.id}-nota`]" class="w-4 h-4 animate-spin" />
                    <FileText v-else class="w-4 h-4" />
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

    <PagamentoViewModal
      v-model="showViewModal"
      :Pagamento="selected"
      :tipos-pagamento="tiposPagamento"
      :negociacoes="negociacoes"
    />
    <PagamentoFormModal
      v-model="showCreateModal"
      mode="create"
      :tipos-pagamento="tiposPagamento"
      :negociacoes="negociacoes"
      @success="pesquisar"
    />
    <PagamentoFormModal
      v-model="showEditModal"
      mode="edit"
      :record="selected"
      :tipos-pagamento="tiposPagamento"
      :negociacoes="negociacoes"
      @success="pesquisar"
    />
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
import { ref, onMounted } from 'vue'
import { EyeIcon, FileText, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useCrud } from '@/composables/useCrud'
import http from '@/api/http'
import pagamentoService from '@/services/pagamentoService'
import relatorioService from '@/services/relatorioService'
import { converteParaMonetario } from '@/utils/formatacao'
import PagamentoViewModal from '@/components/pagamentos/PagamentoViewModal.vue'
import PagamentoFormModal from '@/components/pagamentos/PagamentoFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const searchTerm = ref('')
const selectedTipoPagamento = ref(null)
const selectedItem = ref(null)

const { items, paginacao, loading, fetchItems, destroy } = useCrud(pagamentoService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const tiposPagamento = ref([])
const itemOptions = ref([])
const negociacoes = ref([])

function normalizeItems(payload) {
  const dados = payload?.data?.dados
  return Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
}

function getTipoPagamentoLabel(pag) {
  const tipoId = pag?.tipoPagamento?.id ?? pag?.tipo_pagamento_id ?? pag?.tipo_pagamento
  const tipo = tiposPagamento.value.find((item) => String(item.id) === String(tipoId))
  return tipo?.nome || tipo?.descricao || tipo?.codigo || pag?.tipoPagamento?.nome || pag?.tipo_pagamento?.nome || pag?.tipo_pagamento?.descricao || '-'
}

function getNegociacaoItemRecord(pag) {
  const niId =
    pag?.negociacaoItem?.id
    ?? pag?.negociacao_item_id
    ?? (typeof pag?.negociacao_item === 'object' ? pag?.negociacao_item?.id : pag?.negociacao_item)
  return negociacoes.value.find((record) => String(record.id) === String(niId)) ?? null
}

function getNegociacaoItemLabel(pag) {
  const ni = getNegociacaoItemRecord(pag)
  const nome = ni?.nome_item
    ?? pag?.negociacaoItem?.item?.nome
    ?? pag?.negociacao_item?.item?.nome
  const codigo = ni?.codigo_item
    ?? pag?.negociacaoItem?.item?.codigo
    ?? pag?.negociacao_item?.item?.codigo
  if (nome && codigo) return `${nome} (${codigo})`
  return nome || codigo || '-'
}

function itemSelectLabel(it) {
  if (!it) return ''
  const nome = it.nome || it.descricao
  const codigo = it.codigo
  if (nome && codigo) return `${nome} (${codigo})`
  return nome || codigo || `Item #${it.id}`
}

function getImovelReferencia(pag) {
  const ni = getNegociacaoItemRecord(pag)
  return (
    ni?.referencia_imovel
    || pag?.negociacaoItem?.negociacao?.imovel?.referencia
    || pag?.negociacao_item?.negociacao?.imovel?.referencia
    || pag?.negociacao?.imovel?.referencia
    || pag?.imovel?.referencia
    || '-'
  )
}

async function loadSelects() {
  const [tiposRes, itensRes, negRes] = await Promise.allSettled([
    http.get('/api/tipopagamentos'),
    http.get('/api/items'),
    http.get('/api/negociacao-items/lista')
  ])

  tiposPagamento.value = tiposRes.status === 'fulfilled' ? normalizeItems(tiposRes.value) : []
  itemOptions.value = itensRes.status === 'fulfilled' ? normalizeItems(itensRes.value) : []
  negociacoes.value = negRes.status === 'fulfilled' ? normalizeItems(negRes.value) : []
}

function pesquisar(page = 1) {
  fetchItems({
    page,
    search: searchTerm.value || undefined,
    tipo_pagamento: selectedTipoPagamento.value || undefined,
    item: selectedItem.value || undefined
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

const pdfLoading = ref({})

async function gerarNotaPdf(pag) {
  if (!pag?.id) return
  const key = `${pag.id}-nota`
  pdfLoading.value[key] = true
  try {
    const response = await relatorioService.pagamentoNotaPdf(pag.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar a nota de pagamento.'
    if (e?.response?.data instanceof Blob && e.response.data.type === 'application/json') {
      try {
        const text = await e.response.data.text()
        msg = JSON.parse(text)?.message || msg
      } catch {}
    } else if (e?.response?.data?.message) {
      msg = e.response.data.message
    }
    toast.error(msg)
  } finally {
    pdfLoading.value[key] = false
  }
}

onMounted(() => {
  pesquisar(1)
  loadSelects()
})
</script>
