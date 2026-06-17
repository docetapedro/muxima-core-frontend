<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">Análise Financeira</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Visão geral de vendas, recebimentos, cobrança e inadimplência.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="dados?.gerado_em" class="text-xs text-muted-foreground">
          Gerado em {{ formatGeradoEm(dados.gerado_em) }}
        </span>
        <button @click="load" :disabled="loading"
          class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors disabled:opacity-50">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <RefreshCcw v-else class="w-4 h-4" />
          Actualizar
        </button>
      </div>
    </div>

    <div v-if="loading && !dados" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      <div v-for="n in 4" :key="n" class="bg-card border border-border rounded-xl p-5 h-28">
        <div class="h-3 w-24 rounded bg-muted mb-3"></div>
        <div class="h-7 w-32 rounded bg-muted"></div>
      </div>
    </div>

    <div v-else-if="error" class="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
      {{ error }}
    </div>

    <template v-else-if="dados">
      <!-- KPIs principais -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="card in kpiCards" :key="card.label"
          class="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', card.color]">
            <component :is="card.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-muted-foreground truncate">{{ card.label }}</p>
            <p class="text-xl font-bold mt-1 break-words">{{ converteParaMonetario(card.value) }}</p>
            <p v-if="card.sub" class="text-[11px] text-muted-foreground mt-1 truncate">{{ card.sub }}</p>
          </div>
        </div>
      </div>

      <!-- KPIs secundários -->
      <div v-if="dados.kpis" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-card border border-border rounded-xl p-5">
          <p class="text-xs text-muted-foreground">Taxa de cobrança</p>
          <p class="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {{ formatPercent(dados.kpis.taxa_cobranca) }}
          </p>
          <p class="text-[11px] text-muted-foreground mt-1">Recebido sobre o previsto</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <p class="text-xs text-muted-foreground">Taxa de inadimplência</p>
          <p class="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
            {{ formatPercent(dados.kpis.taxa_inadimplencia) }}
          </p>
          <p class="text-[11px] text-muted-foreground mt-1">Em dívida sobre o total venda</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <p class="text-xs text-muted-foreground">Ticket médio</p>
          <p class="text-2xl font-bold mt-1">{{ converteParaMonetario(dados.kpis.ticket_medio) }}</p>
          <p class="text-[11px] text-muted-foreground mt-1">Valor médio por contrato</p>
        </div>
      </div>

      <!-- Volumes -->
      <div v-if="dados.volumes" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="vol in volumeCards" :key="vol.label"
          class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', vol.color]">
            <component :is="vol.icon" class="w-4 h-4 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground truncate">{{ vol.label }}</p>
            <p class="text-lg font-bold leading-tight">{{ vol.value }}</p>
          </div>
        </div>
      </div>

      <!-- Cashflow próximo -->
      <div v-if="dados.cashflow_proximo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center shrink-0">
              <CalendarClock class="w-5 h-5 text-white" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted-foreground">A vencer nos próximos 7 dias</p>
              <p class="text-xl font-bold">{{ converteParaMonetario(dados.cashflow_proximo.a_vencer_7_dias) }}</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                {{ dados.cashflow_proximo.num_prestacoes_7_dias ?? 0 }} prestação(ões)
              </p>
            </div>
          </div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <CalendarRange class="w-5 h-5 text-white" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted-foreground">A vencer nos próximos 30 dias</p>
              <p class="text-xl font-bold">{{ converteParaMonetario(dados.cashflow_proximo.a_vencer_30_dias) }}</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                {{ dados.cashflow_proximo.num_prestacoes_30_dias ?? 0 }} prestação(ões)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recebido vs Previsto -->
      <div class="bg-card border border-border rounded-xl p-5 space-y-3">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="font-semibold">Recebido vs Previsto</h2>
          <span class="text-xs text-muted-foreground">
            {{ converteParaMonetario(dados.total_recebido) }} de
            {{ converteParaMonetario(dados.total_previsto_receber) }}
            · <span class="font-medium text-foreground">{{ percentRecebido.toFixed(1) }}%</span>
          </span>
        </div>
        <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div class="h-full rounded-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${Math.min(percentRecebido, 100)}%` }"></div>
        </div>
        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Recebido
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-muted-foreground/40"></span> Por receber
          </span>
        </div>
      </div>

      <!-- Recebido nos últimos 12 meses -->
      <div v-if="recebido12.length" class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="font-semibold">Recebido nos últimos 12 meses</h2>
          <span class="text-xs text-muted-foreground">
            Total <span class="font-medium text-foreground">{{ converteParaMonetario(total12) }}</span>
          </span>
        </div>

        <div class="overflow-x-auto">
          <div class="relative h-56 min-w-[480px] rounded-lg border border-border bg-muted/10 px-4 pt-8 pb-10">
            <div class="pointer-events-none absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between">
              <div v-for="tick in 4" :key="tick" class="border-t border-dashed border-border/70"></div>
            </div>
            <div class="relative h-full grid items-end gap-2"
              :style="{ gridTemplateColumns: `repeat(${recebido12.length}, minmax(28px, 1fr))` }">
              <div v-for="(m, idx) in recebido12" :key="idx" class="flex flex-col justify-end items-center h-full">
                <span v-if="m.valor > 0"
                  class="mb-1 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200 whitespace-nowrap">
                  {{ shortMoney(m.valor) }}
                </span>
                <div class="w-full max-w-10 rounded-t-md bg-emerald-500 border border-emerald-600 transition-all duration-500"
                  :style="{ height: barHeight12(m.valor) }"
                  :title="`${m.label}: ${converteParaMonetario(m.valor)}`"></div>
                <span class="mt-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ m.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribuição venda + dívida por condomínio -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Venda -->
        <div class="bg-card border border-border rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <h2 class="font-semibold">Venda por condomínio</h2>
            <span class="text-xs text-muted-foreground">
              {{ distribuicaoVenda.length }} condomínio(s)
            </span>
          </div>
          <div v-if="!distribuicaoVenda.length"
            class="text-sm text-muted-foreground border border-dashed border-border rounded-lg py-6 text-center">
            Sem dados.
          </div>
          <div v-else class="space-y-3">
            <div v-for="(row, idx) in distribuicaoVenda" :key="row.condominio_id ?? idx" class="space-y-1.5">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-medium truncate">{{ row.condominio_nome || `Condomínio #${row.condominio_id}` }}</span>
                <span class="text-xs text-muted-foreground whitespace-nowrap">
                  {{ converteParaMonetario(row.total_venda) }}
                  · <span class="font-medium text-foreground">{{ Number(row.percentagem ?? 0).toFixed(1) }}%</span>
                  · {{ row.num_contratos ?? 0 }} contrato(s)
                </span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div class="h-full rounded-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${Math.max(2, Math.min(Number(row.percentagem ?? 0), 100))}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dívida -->
        <div class="bg-card border border-border rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <h2 class="font-semibold">Dívida por condomínio</h2>
            <span class="text-xs text-muted-foreground">
              Total <span class="font-medium text-foreground">{{ converteParaMonetario(dados.total_em_divida) }}</span>
            </span>
          </div>
          <div v-if="!distribuicaoDivida.length"
            class="text-sm text-muted-foreground border border-dashed border-border rounded-lg py-6 text-center">
            Sem dívida registada.
          </div>
          <div v-else class="space-y-3">
            <div v-for="(row, idx) in distribuicaoDivida" :key="row.condominio_id ?? idx" class="space-y-1.5">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-medium truncate">{{ row.condominio_nome || `Condomínio #${row.condominio_id}` }}</span>
                <span class="text-xs text-muted-foreground whitespace-nowrap">
                  {{ converteParaMonetario(row.em_divida) }}
                  · <span class="font-medium text-foreground">{{ Number(row.percentagem ?? 0).toFixed(1) }}%</span>
                  · {{ row.num_contratos_em_divida ?? 0 }} contrato(s)
                </span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="barColor(idx)"
                  :style="{ width: `${Math.max(2, Math.min(Number(row.percentagem ?? 0), 100))}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aging buckets -->
      <div v-if="dados.distribuicao_aging" class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="font-semibold">Aging da dívida</h2>
          <span class="text-xs text-muted-foreground">
            Total <span class="font-medium text-foreground">{{ converteParaMonetario(totalAging) }}</span>
          </span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="bucket in agingBuckets" :key="bucket.label"
            class="rounded-lg border border-border p-3 space-y-2">
            <div class="flex items-center gap-2">
              <span :class="['h-2 w-2 rounded-full', bucket.dot]"></span>
              <p class="text-xs font-medium">{{ bucket.label }}</p>
            </div>
            <p class="text-base font-bold">{{ converteParaMonetario(bucket.value) }}</p>
            <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :class="bucket.bar"
                :style="{ width: `${agingPercent(bucket.value)}%` }"></div>
            </div>
            <p class="text-[11px] text-muted-foreground">{{ agingPercent(bucket.value).toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <!-- Top inadimplentes -->
      <div v-if="topInadimplentes.length" class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <h2 class="font-semibold">Top inadimplentes</h2>
          <span class="text-xs text-muted-foreground">{{ topInadimplentes.length }} entidade(s)</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/40">
              <tr>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">#</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Entidade</th>
                <th class="text-left px-3 py-2 font-medium text-muted-foreground">Nº Entidade</th>
                <th class="text-right px-3 py-2 font-medium text-muted-foreground">Em dívida</th>
                <th class="text-right px-3 py-2 font-medium text-muted-foreground">Contratos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in topInadimplentes" :key="row.entidade_id ?? idx"
                class="border-b border-border last:border-0 hover:bg-muted/30">
                <td class="px-3 py-2">{{ idx + 1 }}</td>
                <td class="px-3 py-2 font-medium truncate">{{ row.entidade_nome || '—' }}</td>
                <td class="px-3 py-2 text-muted-foreground">{{ row.entidade_num_entidade || '—' }}</td>
                <td class="px-3 py-2 text-right font-semibold text-red-700 dark:text-red-300">
                  {{ converteParaMonetario(row.em_divida) }}
                </td>
                <td class="px-3 py-2 text-right">{{ row.num_contratos ?? 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Loader2, RefreshCcw, TrendingUp, Clock3, Wallet, AlertTriangle,
  CalendarClock, CalendarRange, Handshake, Home, Users, UserX
} from 'lucide-vue-next'
import relatorioService from '@/services/relatorioService'
import { converteParaMonetario } from '@/utils/formatacao'

const dados = ref(null)
const loading = ref(false)
const error = ref('')

const kpiCards = computed(() => {
  if (!dados.value) return []
  const recebidoSub = dados.value.recebido?.recebido_mes_actual != null
    ? `Mês actual: ${converteParaMonetario(dados.value.recebido.recebido_mes_actual)}`
    : null
  return [
    { label: 'Total venda', value: dados.value.total_venda, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Previsto receber', value: dados.value.total_previsto_receber, icon: Clock3, color: 'bg-amber-500' },
    { label: 'Recebido', value: dados.value.total_recebido, icon: Wallet, color: 'bg-emerald-500', sub: recebidoSub },
    { label: 'Em dívida', value: dados.value.total_em_divida, icon: AlertTriangle, color: 'bg-red-500' },
  ]
})

const volumeCards = computed(() => {
  const v = dados.value?.volumes
  if (!v) return []
  return [
    { label: 'Negociações activas', value: v.num_negociacoes_activas ?? 0, icon: Handshake, color: 'bg-indigo-500' },
    { label: 'Imóveis negociados', value: v.num_imoveis_negociados ?? 0, icon: Home, color: 'bg-emerald-500' },
    { label: 'Entidades com contrato', value: v.num_entidades_com_contrato ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Entidades inadimplentes', value: v.num_entidades_inadimplentes ?? 0, icon: UserX, color: 'bg-red-500' },
  ]
})

const percentRecebido = computed(() => {
  const previsto = Number(dados.value?.total_previsto_receber ?? 0)
  const recebido = Number(dados.value?.total_recebido ?? 0)
  if (!Number.isFinite(previsto) || previsto <= 0) return 0
  return Math.max(0, (recebido / previsto) * 100)
})

const recebido12 = computed(() => {
  const lista = dados.value?.recebido?.recebido_12_meses
  return Array.isArray(lista) ? lista : []
})

const total12 = computed(() =>
  recebido12.value.reduce((acc, m) => acc + Number(m?.valor ?? 0), 0)
)

const max12 = computed(() =>
  Math.max(0, ...recebido12.value.map((m) => Number(m?.valor ?? 0)))
)

function barHeight12(valor) {
  const max = max12.value
  if (!max) return '4px'
  const ratio = Math.max(0, Number(valor ?? 0) / max)
  const px = Math.round(ratio * 130)
  return `${Math.max(px, valor > 0 ? 6 : 0)}px`
}

function shortMoney(value) {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n) || n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return String(n)
}

const distribuicaoVenda = computed(() => {
  const lista = dados.value?.distribuicao_venda_por_condominio
  if (!Array.isArray(lista)) return []
  return [...lista].sort((a, b) => Number(b.percentagem ?? 0) - Number(a.percentagem ?? 0))
})

const distribuicaoDivida = computed(() => {
  const lista = dados.value?.distribuicao_divida_por_condominio
  if (!Array.isArray(lista)) return []
  return [...lista].sort((a, b) => Number(b.percentagem ?? 0) - Number(a.percentagem ?? 0))
})

const agingBuckets = computed(() => {
  const a = dados.value?.distribuicao_aging || {}
  return [
    { label: '0–30 dias', value: Number(a.bucket_0_30 ?? 0), bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
    { label: '31–60 dias', value: Number(a.bucket_31_60 ?? 0), bar: 'bg-amber-500', dot: 'bg-amber-500' },
    { label: '61–90 dias', value: Number(a.bucket_61_90 ?? 0), bar: 'bg-orange-500', dot: 'bg-orange-500' },
    { label: '> 90 dias', value: Number(a.bucket_90_mais ?? 0), bar: 'bg-red-500', dot: 'bg-red-500' },
  ]
})

const totalAging = computed(() => agingBuckets.value.reduce((acc, b) => acc + b.value, 0))

function agingPercent(value) {
  const total = totalAging.value
  if (!total) return 0
  return (Number(value ?? 0) / total) * 100
}

const topInadimplentes = computed(() => {
  const lista = dados.value?.top_5_inadimplentes
  return Array.isArray(lista) ? lista : []
})

const BAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-blue-500',
  'bg-violet-500', 'bg-fuchsia-500'
]

function barColor(idx) {
  return BAR_COLORS[idx % BAR_COLORS.length]
}

function formatGeradoEm(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

function formatPercent(value) {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n)) return '0%'
  return `${n.toFixed(2).replace('.', ',')}%`
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await relatorioService.analiseFinanceira()
    dados.value = res?.data?.dados ?? res?.data ?? null
    if (!dados.value) {
      error.value = 'Resposta do servidor sem dados.'
    }
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Falha ao carregar a análise financeira.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
