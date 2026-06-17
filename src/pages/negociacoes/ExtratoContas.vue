<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">Extrato de Contas</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Movimentos de débito e crédito da negociação.
        </p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <span v-if="dados?.gerado_em" class="text-xs text-muted-foreground">
          Gerado em {{ formatGeradoEm(dados.gerado_em) }}
        </span>
        <button @click="load" :disabled="loading"
          class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors disabled:opacity-50">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <RefreshCcw v-else class="w-4 h-4" />
          Actualizar
        </button>
        <router-link to="/negociacoes"
          class="px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted/70 text-sm transition-colors">
          Voltar
        </router-link>
      </div>
    </div>

    <div v-if="loading && !dados" class="space-y-4 animate-pulse">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="bg-card border border-border rounded-xl p-5 h-28">
          <div class="h-3 w-24 rounded bg-muted mb-3"></div>
          <div class="h-6 w-32 rounded bg-muted"></div>
        </div>
      </div>
      <div class="h-64 rounded-xl border border-border bg-muted/30"></div>
    </div>

    <div v-else-if="error" class="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
      {{ error }}
    </div>

    <template v-else-if="dados">
      <!-- Cabeçalho da negociação -->
      <div class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-muted-foreground">Nº contrato</p>
            <p class="font-semibold text-base">{{ negociacao?.numero || '—' }}</p>
            <p v-if="negociacao?.data_contrato" class="text-xs text-muted-foreground mt-0.5">
              {{ formatDate(negociacao.data_contrato) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Estado</p>
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border mt-1"
              :class="estadoMeta.classes">
              {{ estadoMeta.label }}
            </span>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Imóvel</p>
            <p class="font-semibold text-base truncate">
              {{ negociacao?.imovel?.referencia || `#${negociacao?.imovel?.id ?? '—'}` }}
            </p>
            <p v-if="condominioLabel" class="text-xs text-muted-foreground mt-0.5 truncate">
              {{ condominioLabel }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Entidade</p>
            <p class="font-semibold text-base truncate">{{ entidade?.nome || '—' }}</p>
            <p v-if="entidade?.num_entidade" class="text-xs text-muted-foreground mt-0.5">
              Nº {{ entidade.num_entidade }}<span v-if="entidade?.telefone"> · {{ entidade.telefone }}</span>
            </p>
          </div>
        </div>

        <div v-if="negociacao?.observacao" class="text-xs text-muted-foreground border-t border-border pt-3">
          <span class="font-medium text-foreground">Observação:</span> {{ negociacao.observacao }}
        </div>
      </div>

      <!-- Totais -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
            <ArrowDown class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">Total débito</p>
            <p class="text-xl font-bold break-words">{{ converteParaMonetario(totais.total_debito) }}</p>
          </div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <ArrowUp class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">Total crédito</p>
            <p class="text-xl font-bold break-words">{{ converteParaMonetario(totais.total_credito) }}</p>
          </div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', saldoColor]">
            <Wallet class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">Saldo actual</p>
            <p class="text-xl font-bold break-words">{{ converteParaMonetario(totais.saldo_actual) }}</p>
          </div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <Hash class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">Nº linhas</p>
            <p class="text-xl font-bold">{{ totais.num_linhas ?? linhas.length }}</p>
          </div>
        </div>
      </div>

      <!-- Tabela de movimentos -->
      <div class="bg-card border border-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/40">
              <tr>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">Data</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Descrição</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Referência</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Item</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Tipo pag.</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Estado</th>
                <th class="text-right px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">Débito</th>
                <th class="text-right px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">Crédito</th>
                <th class="text-right px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!linhas.length">
                <td colspan="9" class="text-center py-10 text-muted-foreground">
                  Sem movimentos registados.
                </td>
              </tr>
              <tr v-else v-for="(linha, idx) in linhas" :key="idx"
                class="border-b border-border last:border-0 hover:bg-muted/30">
                <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(linha.data) }}</td>
                <td class="px-3 py-2">
                  <div class="font-medium">{{ linha.descricao || '—' }}</div>
                  <div v-if="linha.observacao" class="text-xs text-muted-foreground">{{ linha.observacao }}</div>
                </td>
                <td class="px-3 py-2 text-xs text-muted-foreground">{{ linha.referencia || '—' }}</td>
                <td class="px-3 py-2 text-xs">
                  <span v-if="linha.item_nome || linha.item_codigo" class="whitespace-nowrap">
                    {{ linha.item_nome || linha.item_codigo }}
                    <span v-if="linha.item_nome && linha.item_codigo" class="text-muted-foreground">
                      ({{ linha.item_codigo }})
                    </span>
                  </span>
                  <span v-else class="text-muted-foreground">—</span>
                </td>
                <td class="px-3 py-2 text-xs text-muted-foreground">{{ linha.tipo_pagamento_codigo || '—' }}</td>
                <td class="px-3 py-2">
                  <span v-if="linha.estado_label || linha.estado"
                    class="px-2 py-0.5 text-[11px] rounded-full whitespace-nowrap"
                    :class="estadoClass(linha)">
                    {{ linha.estado_label || linha.estado }}
                  </span>
                  <span v-else class="text-muted-foreground text-xs">—</span>
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap font-medium"
                  :class="Number(linha.debito) > 0 ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'">
                  {{ Number(linha.debito) > 0 ? converteParaMonetario(linha.debito) : '—' }}
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap font-medium"
                  :class="Number(linha.credito) > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'">
                  {{ Number(linha.credito) > 0 ? converteParaMonetario(linha.credito) : '—' }}
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap font-semibold">
                  {{ converteParaMonetario(linha.saldo) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, RefreshCcw, ArrowDown, ArrowUp, Wallet, Hash } from 'lucide-vue-next'
import relatorioService from '@/services/relatorioService'
import { converteParaMonetario } from '@/utils/formatacao'

const route = useRoute()
const dados = ref(null)
const loading = ref(false)
const error = ref('')

const negociacao = computed(() => dados.value?.negociacao || null)
const linhas = computed(() => Array.isArray(dados.value?.linhas) ? dados.value.linhas : [])
const totais = computed(() => dados.value?.totais || {})

const entidade = computed(() => {
  const raw = negociacao.value?.entidade_principal ?? negociacao.value?.entidadePrincipal
  if (Array.isArray(raw)) return raw[0] || null
  return raw || null
})

const condominioLabel = computed(() => {
  const c = negociacao.value?.imovel?.condominio
  if (!c) return ''
  return c.nome_abreviado ? `${c.nome} (${c.nome_abreviado})` : c.nome
})

const ESTADO_LABELS = {
  RA: { label: 'Rascunho', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
  RE: { label: 'Reservado', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
  CO: { label: 'Concluído', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CA: { label: 'Cancelado', classes: 'bg-red-100 text-red-700 border-red-200' },
}

const estadoMeta = computed(() => {
  const code = String(negociacao.value?.estado ?? '').toUpperCase()
  return ESTADO_LABELS[code] || {
    label: negociacao.value?.estado || '—',
    classes: 'bg-muted text-muted-foreground border-border'
  }
})

const saldoColor = computed(() => {
  const saldo = Number(totais.value?.saldo_actual ?? 0)
  if (saldo > 0) return 'bg-red-500'
  if (saldo < 0) return 'bg-emerald-500'
  return 'bg-slate-400'
})

function formatGeradoEm(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

function formatDate(value) {
  if (!value) return '—'
  // já vem como dd/mm/yyyy ou yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-PT')
}

function estadoClass(linha) {
  const estado = String(linha?.estado_label || linha?.estado || '').toLowerCase()
  if (linha?.tipo === 'CREDITO') {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
  }
  if (estado.includes('liquid') || estado === 'l') {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
  }
  if (estado.includes('vencid') || estado.includes('atras')) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
  }
  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
}

async function load() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  error.value = ''
  try {
    const res = await relatorioService.negociacaoExtratoContas(id)
    dados.value = res?.data?.dados ?? res?.data ?? null
    if (!dados.value) {
      error.value = 'Resposta do servidor sem dados.'
    }
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Falha ao carregar o extrato.'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, () => load())
onMounted(load)
</script>
