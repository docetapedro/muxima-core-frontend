<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Negociações</h1>
        <p class="text-muted-foreground text-sm mt-1">Lista de negociações</p>
      </div>

      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <PlusCircleIcon class="w-4 h-4" />
        Nova 
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Número, imóvel, entidade..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <select
        v-model="estadoFilter"
        class="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Todos os estados</option>
        <option value="RA">Rascunho</option>
        <option value="RE">Reservado</option>
        <option value="CO">Concluído</option>
        <option value="CA">Cancelado</option>
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

    <div v-if="paginacao" class="text-xs text-muted-foreground">
      Total: <span class="font-medium text-foreground">{{ paginacao.total }}</span>
      · Página <span class="font-medium text-foreground">{{ paginacao.pagina_actual }}</span> de
      <span class="font-medium text-foreground">{{ paginacao.ultima_pagina }}</span>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nº</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Imóvel</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Entidade</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Valor</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Prestação</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Data contrato</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>

            <tr v-else-if="items.length === 0">
              <td colspan="8" class="text-center py-12 text-muted-foreground">
                Nenhuma negociação encontrada.
              </td>
            </tr>

            <tr
              v-else
              v-for="negociacao in items"
              :key="negociacao.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3">{{ negociacao.numero || '-' }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border"
                  :class="getEstadoMeta(negociacao.estado).classes"
                >
                  {{ getEstadoMeta(negociacao.estado).label }}
                </span>
              </td>
              <td class="px-4 py-3">
                {{ negociacao.imovel?.referencia || negociacao.imovel_referencia || negociacao.imovel_id || '-' }}
              </td>
              <td class="px-4 py-3">
                {{ getEntidadeLabel(negociacao) }}
              </td>
              <td class="px-4 py-3">
                {{ negociacao.valor_venda == null ? '-' : converteParaMonetario(negociacao.valor_venda) }}
              </td>
              <td class="px-4 py-3">
                {{ negociacao.prestacao == null ? '-' : converteParaMonetario(negociacao.prestacao) }}
              </td>
              <td class="px-4 py-3">{{ negociacao.data_contrato || '-' }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                    @click="openView(negociacao)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEdit(negociacao)"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    v-if="isRascunho(negociacao)"
                    :disabled="negociacaoPdfLoading[`${negociacao.id}-simulacao`]"
                    @click="gerarSimulacaoPdf(negociacao)"
                    class="text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50"
                    title="Imprimir simulação"
                  >
                    <Loader2 v-if="negociacaoPdfLoading[`${negociacao.id}-simulacao`]" class="w-4 h-4 animate-spin" />
                    <FileText v-else class="w-4 h-4" />
                  </button>

                  <button
                    v-if="podeImprimirContrato(negociacao)"
                    :disabled="negociacaoPdfLoading[`${negociacao.id}-contrato`]"
                    @click="gerarContratoPdf(negociacao)"
                    class="text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                    title="Imprimir contrato"
                  >
                    <Loader2 v-if="negociacaoPdfLoading[`${negociacao.id}-contrato`]" class="w-4 h-4 animate-spin" />
                    <FileText v-else class="w-4 h-4" />
                  </button>

                  <button
                    v-if="podeImprimirTermoQuitacao(negociacao)"
                    :disabled="negociacaoPdfLoading[`${negociacao.id}-termo-quitacao`]"
                    @click="gerarTermoQuitacaoPdf(negociacao)"
                    class="text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                    title="Imprimir termo de quitação"
                  >
                    <Loader2 v-if="negociacaoPdfLoading[`${negociacao.id}-termo-quitacao`]" class="w-4 h-4 animate-spin" />
                    <FileText v-else class="w-4 h-4" />
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

    <div
      v-if="showViewModal && selected"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
    >
      <div
        class="modal-surface w-full max-w-2xl border border-zinc-300 rounded-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
        style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;"
      >
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Detalhes da negociação</h3>
          <button
            type="button"
            class="px-3 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 text-sm"
            @click="showViewModal = false"
          >
            Fechar
          </button>
        </div>

        <div class="space-y-3">
          <details class="rounded-lg border border-border p-3 bg-muted/10" open>
            <summary class="cursor-pointer select-none font-semibold text-sm">Identificação & Totais</summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Nº</p>
                <p class="font-medium">{{ selected.numero || '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Estado</p>
                <p class="font-medium">{{ estadoTexto(selected.estado) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Imóvel</p>
                <p class="font-medium">{{ selected.imovel?.referencia || selected.imovel_referencia || '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Titular</p>
                <p class="font-medium">
                  {{ getTitularInfo(selected).nome || '-' }}
                  <span v-if="getTitularInfo(selected).numEntidade" class="text-muted-foreground font-normal">
                    · Nº {{ getTitularInfo(selected).numEntidade }}
                  </span>
                </p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Total venda</p>
                <p class="font-medium">{{ converteParaMonetario(selectedTotais.totalVenda) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Total desconto</p>
                <p class="font-medium">{{ converteParaMonetario(selectedTotais.totalDesconto) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Downpayment</p>
                <p class="font-medium">{{ converteParaMonetario(selected.downpayment ?? 0) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Saldo acumulado</p>
                <p class="font-medium">{{ converteParaMonetario(selected.saldo_acumulado ?? 0) }}</p>
              </div>
            </div>
          </details>

          <details class="rounded-lg border border-border p-3 bg-muted/10" open>
            <summary class="cursor-pointer select-none font-semibold text-sm">
              Itens ({{ negotiationItemsFromRecord(selected).length }})
            </summary>

            <div class="mt-3 space-y-2">
              <div
                v-if="!negotiationItemsFromRecord(selected).length"
                class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-3 text-center"
              >
                {{ detailLoading ? 'A carregar itens...' : 'Sem itens registados.' }}
              </div>

              <div
                v-for="(row, idx) in negotiationItemsFromRecord(selected)"
                :key="row._key"
                class="rounded-lg border border-border p-3 bg-background"
              >
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs text-muted-foreground">Item #{{ idx + 1 }}</span>
                  <span class="text-xs font-medium">{{ itemRowLabel(row) }}</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <p class="text-muted-foreground">Valor</p>
                    <p class="font-medium">{{ row.valor || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Desconto</p>
                    <p class="font-medium">{{ row.desconto || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Nº Prest.</p>
                    <p class="font-medium">{{ row.num_prestacoes ?? '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Periodicidade</p>
                    <p class="font-medium">{{ row.periodicidade || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Prestação</p>
                    <p class="font-medium">{{ row.prestacao || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Saldo acumulado</p>
                    <p class="font-medium text-emerald-700 dark:text-emerald-300">{{ row.saldo_acumulado || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </details>

          <details class="rounded-lg border border-border p-3 bg-muted/10">
            <summary class="cursor-pointer select-none font-semibold text-sm">Datas & Status</summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Data contrato</p>
                <p class="font-medium">{{ selected.data_contrato ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Data entrega</p>
                <p class="font-medium">{{ selected.data_entrega ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Activo</p>
                <p class="font-medium">{{ String(selected.activo) === '1' || selected.activo === true ? 'Sim' : 'Não' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Observação</p>
                <p class="text-sm">{{ selected.observacao || '-' }}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <NegociacaoFormModal
      v-model="showCreateModal"
      mode="create"
      @success="pesquisar(paginacao?.pagina_actual || 1)"
    />

    <NegociacaoFormModal
      v-model="showEditModal"
      mode="edit"
      :record="selected"
      @success="pesquisar(paginacao?.pagina_actual || 1)"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { EyeIcon, FileText, Loader2, Search, Pencil, PlusCircleIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useCrud } from '@/composables/useCrud'
import negociacaoService from '@/services/negociacaoService'
import relatorioService from '@/services/relatorioService'
import { converteParaMonetario, formataEntradaNumerica } from '@/utils/formatacao'
import NegociacaoFormModal from '@/components/negociacoes/NegociacaoFormModal.vue'

const searchTerm = ref('')
const estadoFilter = ref('')

const { items, paginacao, loading, fetchItems } = useCrud(negociacaoService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selected = ref(null)

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
    search: searchTerm.value || undefined,
    estado: estadoFilter.value || undefined
  })
}

const detailLoading = ref(false)

async function fetchFullNegociacao(neg) {
  if (!neg?.id) return neg
  try {
    const res = await negociacaoService.obter(neg.id)
    return res?.data?.dados ?? neg
  } catch (e) {
    console.error(e)
    return neg
  }
}

async function openView(negociacao) {
  selected.value = negociacao
  showViewModal.value = true

  detailLoading.value = true
  try {
    const full = await fetchFullNegociacao(negociacao)
    if (showViewModal.value) selected.value = full
  } finally {
    detailLoading.value = false
  }
}

function openCreate() {
  selected.value = null
  showCreateModal.value = true
}

async function openEdit(negociacao) {
  detailLoading.value = true
  try {
    const full = await fetchFullNegociacao(negociacao)
    selected.value = full
    showEditModal.value = true
  } finally {
    detailLoading.value = false
  }
}

function getEntidadePrincipal(negociacao) {
  const entidades = Array.isArray(negociacao?.entidade_principal) ? negociacao.entidade_principal : []
  const principal = entidades.find((entidade) => String(entidade?.pivot?.principal ?? '') === '1')
  return principal || entidades[0] || null
}

function getEntidadeLabel(negociacao) {
  const entidade = getEntidadePrincipal(negociacao)
  return entidade?.nome || entidade?.razao_social || entidade?.num_entidade || negociacao?.entidade_nome || '-'
}

function getPivotPrincipal(neg) {
  const candidates = [
    neg?.entidade_principal,
    neg?.entidadePrincipal,
    neg?.negociacao_entidades,
    neg?.negociacaoEntidades,
    neg?.entidades
  ]

  const isPrincipal = (entry) => {
    const flag = entry?.pivot?.principal ?? entry?.principal
    return flag === true || flag === 1 || String(flag) === '1'
  }

  for (const c of candidates) {
    if (!c) continue
    if (Array.isArray(c)) {
      if (!c.length) continue
      return c.find(isPrincipal) || c[0]
    }
    return c
  }
  return null
}

function getTitularInfo(neg) {
  const entry = getPivotPrincipal(neg)
  if (!entry) return { nome: null, numEntidade: null }
  return {
    nome: entry?.nome ?? entry?.entidade?.nome ?? entry?.razao_social ?? null,
    numEntidade: entry?.num_entidade ?? entry?.entidade?.num_entidade ?? entry?.numEntidade ?? null
  }
}

function negotiationItemsFromRecord(neg) {
  if (!neg) return []
  const itemLookup = {}
  const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []
  plano.forEach((p) => {
    const ni = p?.negociacaoItem ?? p?.negociacao_item ?? null
    if (ni?.id != null && ni?.item) itemLookup[String(ni.id)] = ni.item
  })

  const source =
    neg?.itens ??
    neg?.negociacaoItens ??
    neg?.negociacao_itens ??
    neg?.negociacaoItems ??
    neg?.negociacao_items ??
    []

  if (!Array.isArray(source) || !source.length) return []

  return source.map((it) => {
    const resolvedItem = it.item ?? itemLookup[String(it.id)] ?? null
    return {
      _key: `row-${it.id ?? Math.random().toString(36).slice(2, 10)}`,
      item_id: it.item_id ?? it.item?.id ?? resolvedItem?.id ?? '',
      item: resolvedItem,
      valor: it.valor != null && it.valor !== '' ? formataEntradaNumerica(it.valor) : '',
      desconto: it.desconto != null && it.desconto !== '' ? formataEntradaNumerica(it.desconto) : '',
      num_prestacoes: it.num_prestacoes ?? null,
      periodicidade: it.periodicidade ?? '',
      prestacao: it.prestacao != null && it.prestacao !== '' ? formataEntradaNumerica(it.prestacao) : '',
      saldo_acumulado: it.saldo_acumulado != null && it.saldo_acumulado !== '' ? formataEntradaNumerica(it.saldo_acumulado) : ''
    }
  })
}

function itemRowLabel(row) {
  const opt = row?.item
  if (!opt) return `Item #${row?.item_id ?? '-'}`
  return opt?.nome || opt?.descricao || opt?.codigo || opt?.label || `Item #${opt?.id ?? '-'}`
}

function parseMoneyValue(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value).replace(/\s/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function getNegotiationTotals(neg) {
  const rs = negotiationItemsFromRecord(neg)
  if (rs.length) {
    return {
      totalVenda: rs.reduce((acc, r) => acc + parseMoneyValue(r.valor), 0),
      totalDesconto: rs.reduce((acc, r) => acc + parseMoneyValue(r.desconto), 0)
    }
  }
  return {
    totalVenda: parseMoneyValue(neg?.valor_venda),
    totalDesconto: parseMoneyValue(neg?.desconto)
  }
}

const selectedTotais = computed(() => getNegotiationTotals(selected.value))

function estadoTexto(estado) {
  const map = { RA: 'Rascunho', RE: 'Reservado', CO: 'Concluído', CA: 'Cancelado' }
  if (!estado) return '-'
  return map[String(estado).toUpperCase()] || String(estado)
}

const ESTADOS_CONTRATO_IMPRIMIVEL = new Set(['RE', 'CO', 'AC'])
function podeImprimirContrato(neg) {
  return ESTADOS_CONTRATO_IMPRIMIVEL.has(String(neg?.estado ?? '').toUpperCase())
}

function isRascunho(neg) {
  return String(neg?.estado ?? '').toUpperCase() === 'RA'
}

function podeImprimirTermoQuitacao(neg) {
  return String(neg?.estado ?? '').toUpperCase() === 'AC'
}

const negociacaoPdfLoading = ref({})

async function gerarContratoPdf(neg) {
  if (!neg?.id) return
  const key = `${neg.id}-contrato`
  negociacaoPdfLoading.value[key] = true
  try {
    const response = await relatorioService.negociacaoContratoPdf(neg.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar o contrato.'
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
    negociacaoPdfLoading.value[key] = false
  }
}

async function gerarSimulacaoPdf(neg) {
  if (!neg?.id) return
  const key = `${neg.id}-simulacao`
  negociacaoPdfLoading.value[key] = true
  try {
    const response = await relatorioService.negociacaoSimulacaoPdf(neg.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar a simulação.'
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
    negociacaoPdfLoading.value[key] = false
  }
}

async function gerarTermoQuitacaoPdf(neg) {
  if (!neg?.id) return
  const key = `${neg.id}-termo-quitacao`
  negociacaoPdfLoading.value[key] = true
  try {
    const response = await relatorioService.negociacaoTermoQuitacaoPdf(neg.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar o termo de quitação.'
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
    negociacaoPdfLoading.value[key] = false
  }
}

function getEstadoMeta(estado) {
  const map = {
    RA: { label: 'Rascunho', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
    RE: { label: 'Reservado', classes: 'bg-amber-100 text-amber-800 border-amber-200' },
    CO: { label: 'Concluído', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    CA: { label: 'Cancelado', classes: 'bg-red-100 text-red-700 border-red-200' }
  }

  if (!estado) return { label: '-', classes: 'bg-muted text-muted-foreground border-border' }
  return map[String(estado).toUpperCase()] || {
    label: String(estado),
    classes: 'bg-muted text-muted-foreground border-border'
  }
}

onMounted(() => {
  pesquisar(1)
})
</script>
