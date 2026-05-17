<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>

      <p class="text-muted-foreground text-sm mt-1">
        Bem-vindo, {{ auth.user?.name ?? '...' }}
      </p>
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

        <div>
          <p class="text-2xl font-bold">{{ stat.value }}</p>
          <p class="text-muted-foreground text-xs">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-card border border-border rounded-xl p-5">
        <h2 class="font-semibold mb-4">Imóveis por condomínio</h2>
        <div class="space-y-2"></div>
      </div>

      <div class="bg-card border border-border rounded-xl p-5">
        <h2 class="font-semibold mb-4">Entidades activas por condomínio</h2>
        <dl class="space-y-3"></dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { Users, Building2, FileText, TrendingUp } from 'lucide-vue-next'

import imovelService from '@/services/imovelService'
import entidadeService from '@/services/entidadeService'
import condominioService from '@/services/condominioService'
import userService from '@/services/userService'

/* =========================
   STORES / ROUTER
========================= */
const auth = useAuthStore()
const router = useRouter()

/* =========================
   STATE
========================= */
const loadingStats = ref(false)

const stats = ref([
  { label: 'Imóveis', value: '0', icon: Building2, color: 'bg-emerald-500', to: '/imoveis' },
  { label: 'Entidades', value: '0', icon: Users, color: 'bg-blue-500', to: '/entidades' },
  { label: 'Condomínios', value: '0', icon: FileText, color: 'bg-amber-500', to: '/condominios' },
  { label: 'Usuários', value: '0', icon: TrendingUp, color: 'bg-purple-500', to: '/users' }
])

/* =========================
   NAVIGATION
========================= */
function goToStat(stat) {
  if (stat?.to) router.push(stat.to)
}

/* =========================
   CACHE
========================= */
const STATS_CACHE_KEY = 'dashboard_stats_totals_v1'
const STATS_CACHE_TTL_MS = 60 * 1000

function readCachedStatsTotals() {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) return null

    return parsed.totals ?? null
  } catch {
    return null
  }
}

function writeCachedStatsTotals(totals) {
  try {
    localStorage.setItem(
      STATS_CACHE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + STATS_CACHE_TTL_MS,
        totals
      })
    )
  } catch {}
}

/* =========================
   SERVICE HELPERS
========================= */
async function fetchTotal(service) {
  const res = await service.listar({ page: 1 })
  const total = res?.data?.dados?.paginacao?.total
  return typeof total === 'number' ? total : Number(total ?? 0)
}

/* =========================
   INIT
========================= */
onMounted(async () => {
  const cachedTotals = readCachedStatsTotals()

  if (cachedTotals) {
    applyTotals(cachedTotals)
  }

  loadingStats.value = true

  try {
    const [imoveisTotal, entidadesTotal, condominiosTotal, usersTotal] =
      await Promise.all([
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

    writeCachedStatsTotals(totals)
    applyTotals(totals)
  } catch (e) {
    console.error('Erro ao carregar dashboard:', e)
  } finally {
    loadingStats.value = false
  }
})

/* =========================
   APPLY STATS
========================= */
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

/* =========================
   COMPUTED
========================= */
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
</script>