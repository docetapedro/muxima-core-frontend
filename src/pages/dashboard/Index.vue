<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>

        <p class="text-muted-foreground text-sm mt-1">
          Bem-vindo
        </p>

       
      </div>

      <span
        v-if="loadingStats || loadingChart"
        class="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
      >
        A actualizar indicadores
      </span>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-card border border-border rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
        @click="goToStat(stat)"
        role="button"
        tabindex="0"
        @keydown.enter="goToStat(stat)"
        @keydown.space.prevent="goToStat(stat)"
      >
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.color]">
          <component :is="stat.icon" class="w-5 h-5 text-white" />
        </div>

        <div class="min-w-0">
          <p class="text-2xl font-bold leading-none">{{ stat.value }}</p>
          <p class="text-muted-foreground text-xs mt-1 truncate">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-card border border-border rounded-xl p-5">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="font-semibold">Imóveis por condomínio</h2>
          <span class="text-xs text-muted-foreground">
            {{ imoveisChartItems.length }} registos
          </span>
        </div>

        <div v-if="loadingChart && !imoveisChartItems.length" class="space-y-3">
          <div v-for="placeholder in 4" :key="placeholder" class="space-y-2 animate-pulse">
            <div class="flex items-center justify-between">
              <div class="h-3 w-40 rounded bg-muted"></div>
              <div class="h-3 w-10 rounded bg-muted"></div>
            </div>
            <div class="h-3 rounded-full bg-muted"></div>
          </div>
        </div>

        <div
          v-else-if="!imoveisChartItems.length"
          class="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground"
        >
          Sem dados para exibir o gráfico.
        </div>

        <div v-else class="space-y-4">
          <div class="grid gap-3 md:grid-cols-[3rem_1fr]">
            <div class="flex h-80 flex-col justify-between py-2 text-[11px] text-muted-foreground">
              <span v-for="tick in chartTicks" :key="tick.key" class="leading-none">
                {{ tick.label }}
              </span>
            </div>

            <div class="min-w-0 overflow-x-auto pb-2">
              <div class="relative h-80 min-w-[420px] overflow-hidden rounded-xl border border-border bg-muted/10 px-4 pb-10 pt-12">
                <div class="pointer-events-none absolute inset-0 px-4 py-4">
                  <div class="flex h-full flex-col justify-between">
                    <div v-for="tick in chartTicks" :key="tick.key" class="border-t border-dashed border-border/70"></div>
                  </div>
                </div>

                <div class="pointer-events-none absolute inset-x-4 bottom-10 border-b border-border/80"></div>

                <div class="relative z-10 grid h-full items-end gap-4" :style="chartGridStyle">
                  <div
                    v-for="item in imoveisChartItems"
                    :key="item.condominio_id"
                    class="flex h-full min-w-0 flex-col justify-end"
                  >
                    <div class="flex h-[calc(100%-2rem)] items-end justify-center">
                      <div class="flex h-full w-full max-w-14 flex-col items-center justify-end">
                        <span
                          v-if="item.quantidade_imoveis > 0"
                          class="mb-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                        >
                          {{ item.quantidade_imoveis }}
                        </span>

                        <div
                          class="w-full rounded-t-md border border-emerald-600 bg-emerald-500 shadow-[0_10px_0_rgba(5,150,105,0.16)] transition-all duration-500"
                          :style="{ height: item.barHeight }"
                          :title="`${item.nome_exibicao}: ${item.quantidade_imoveis}`"
                        ></div>
                      </div>
                    </div>

                    <p class="mt-3 w-full truncate text-center text-xs font-medium text-muted-foreground" :title="item.nome_exibicao">
                      {{ item.nome_exibicao }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span>Escala baseada no maior valor da série</span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Imóveis
            </span>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-5">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="font-semibold">Entidades activas por condomínio</h2>
          <span class="text-xs text-muted-foreground">Em breve</span>
        </div>

        <dl class="space-y-3">
         
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { Users, Building2, Home, UserCog } from 'lucide-vue-next'

import imovelService from '@/services/imovelService'
import entidadeService from '@/services/entidadeService'
import condominioService from '@/services/condominioService'
import userService from '@/services/userService'
import indicadorService from '@/services/indicadorService'

const auth = useAuthStore()
const router = useRouter()

const loadingStats = ref(false)
const loadingChart = ref(false)

const stats = ref([
  { label: 'Imóveis', value: '0', icon: Home, color: 'bg-emerald-500', to: '/imoveis' },
  { label: 'Entidades', value: '0', icon: Users, color: 'bg-blue-500', to: '/entidades' },
  { label: 'Condomínios', value: '0', icon: Building2, color: 'bg-amber-500', to: '/condominios' },
  { label: 'Usuários', value: '0', icon: UserCog, color: 'bg-purple-500', to: '/users' }
])

const imoveisChartItems = ref([])

function goToStat(stat) {
  if (stat?.to) router.push(stat.to)
}

const STATS_CACHE_KEY = 'dashboard_stats_totals_v1'
const STATS_CACHE_TTL_MS = 60 * 1000
const IMOVEIS_CHART_CACHE_KEY = 'dashboard_imoveis_por_condominio_v1'
const IMOVEIS_CHART_CACHE_TTL_MS = 60 * 1000

function readCachedValue(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) return null

    return parsed.value ?? null
  } catch {
    return null
  }
}

function writeCachedValue(key, ttlMs, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        expiresAt: Date.now() + ttlMs,
        value
      })
    )
  } catch {}
}

async function fetchTotal(service) {
  const res = await service.listar({ page: 1 })
  const total = res?.data?.dados?.paginacao?.total
  return typeof total === 'number' ? total : Number(total ?? 0)
}

async function fetchImoveisPorCondominio() {
  const res = await indicadorService.imoveisPorCondominio()
  const dados = res?.data?.dados

  const lista = Array.isArray(dados) ? dados : Array.isArray(dados?.data) ? dados.data : []
  return lista
    .map((item) => {
      const quantidade = Number(item?.quantidade_imoveis ?? 0)

      return {
        condominio_id: item?.condominio_id ?? item?.id ?? item?.condominio ?? item?.nome ?? String(quantidade),
        condominio: item?.condominio ?? item?.nome ?? 'Condomínio',
        nome_abreviado: item?.nome_abreviado ?? '',
        quantidade_imoveis: Number.isFinite(quantidade) ? quantidade : 0
      }
    })
    .sort((a, b) => b.quantidade_imoveis - a.quantidade_imoveis)
}

function withBarHeight(item, maxValue) {
  const maxBarHeight = 180
  const minBarHeight = 4

  if (!maxValue) return `${minBarHeight}px`

  const ratio = Math.max(item.quantidade_imoveis / maxValue, 0)
  const height = Math.round(ratio * maxBarHeight)

  return `${Math.max(height, item.quantidade_imoveis > 0 ? minBarHeight : 0)}px`
}

onMounted(async () => {
  const cachedTotals = readCachedValue(STATS_CACHE_KEY)
  const cachedChart = readCachedValue(IMOVEIS_CHART_CACHE_KEY)

  if (cachedTotals) {
    applyTotals(cachedTotals)
  }

  if (cachedChart) {
    imoveisChartItems.value = cachedChart
  }

  loadingStats.value = true
  loadingChart.value = true

  try {
    const [imoveisTotal, entidadesTotal, condominiosTotal, usersTotal] = await Promise.all([
      fetchTotal(imovelService),
      fetchTotal(entidadeService),
      fetchTotal(condominioService),
      fetchTotal(userService)
    ])

    const totals = {
      imoveisTotal,
      entidadesTotal,
      condominiosTotal,
      usersTotal
    }

    writeCachedValue(STATS_CACHE_KEY, STATS_CACHE_TTL_MS, totals)
    applyTotals(totals)
  } catch (e) {
    console.error('Erro ao carregar dashboard:', e)
  } finally {
    loadingStats.value = false
  }

  try {
    const chartData = await fetchImoveisPorCondominio()
    const normalizedChart = chartData.map((item) => ({
      ...item,
      nome_exibicao: item.nome_abreviado?.trim() || item.condominio,
      barHeight: '0px'
    }))

    const maxValue = Math.max(...normalizedChart.map((item) => item.quantidade_imoveis), 0)
    imoveisChartItems.value = normalizedChart.map((item) => ({
      ...item,
      barHeight: withBarHeight(item, maxValue)
    }))

    writeCachedValue(IMOVEIS_CHART_CACHE_KEY, IMOVEIS_CHART_CACHE_TTL_MS, imoveisChartItems.value)
  } catch (e) {
    console.error('Erro ao carregar imóveis por condomínio:', e)
  } finally {
    loadingChart.value = false
  }
})

function applyTotals(totals) {
  stats.value = stats.value.map((s) => {
    switch (s.label) {
      case 'Imóveis':
        return { ...s, value: String(totals.imoveisTotal ?? 0) }
      case 'Entidades':
        return { ...s, value: String(totals.entidadesTotal ?? 0) }
      case 'Condomínios':
        return { ...s, value: String(totals.condominiosTotal ?? 0) }
      case 'Usuários':
        return { ...s, value: String(totals.usersTotal ?? 0) }
      default:
        return s
    }
  })
}

const userRole = computed(() => {
  if (auth.user?.superadministrador) return 'Super Admin'
  if (auth.user?.administrador) return 'Administrador'
  if (auth.user?.consultor) return 'Consultor'
  if (auth.user?.beneficiario) return 'Beneficiário'
  return 'Utilizador'
})

const permissionsCount = computed(() => {
  const perms = auth.user?.permissions || []
  return perms.includes('*') ? 'Todas' : perms.length
})

const chartMaxValue = computed(() => {
  return Math.max(...imoveisChartItems.value.map((item) => item.quantidade_imoveis), 0)
})

const chartTicks = computed(() => {
  const max = chartMaxValue.value

  if (max <= 0) {
    return [
      { key: 'tick-3', label: '0' },
      { key: 'tick-2', label: '0' },
      { key: 'tick-1', label: '0' },
      { key: 'tick-0', label: '0' }
    ]
  }

  const step = Math.max(Math.ceil(max / 3), 1)
  const top = step * 3

  return [
    { key: 'tick-3', label: String(top) },
    { key: 'tick-2', label: String(step * 2) },
    { key: 'tick-1', label: String(step) },
    { key: 'tick-0', label: '0' }
  ]
})

const chartGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(imoveisChartItems.value.length, 1)}, minmax(72px, 1fr))`
}))
</script>
