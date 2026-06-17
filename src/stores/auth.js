import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  function safeJson(value) {
    try {
      return JSON.parse(value || 'null')
    } catch (e) {
      return null
    }
  }

  const user = ref(safeJson(localStorage.getItem('user')))
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // --- Getters ---
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.administrador || user.value?.superadministrador)
  const isSuperAdmin = computed(() => !!user.value?.superadministrador)
  const permissions = computed(() => user.value?.permissions || [])

  const hasPermission = (perm) => {
    if (!user.value) return false
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(perm)
  }

  function unwrap(data) {
    return data?.dados ?? data ?? {}
  }

  function persistSession({ token, refresh_token, user: u }) {
    if (token !== undefined) {
      accessToken.value = token
      if (token) localStorage.setItem('access_token', token)
    }
    if (refresh_token !== undefined) {
      refreshToken.value = refresh_token
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
    }
    if (u !== undefined && u !== null) {
      user.value = u
      localStorage.setItem('user', JSON.stringify(u))
    }
  }

  // --- Actions ---
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(credentials)
      const payload = unwrap(data)

      persistSession({
        token: payload.token ?? payload.access_token,
        refresh_token: payload.refresh_token,
        user: payload.user ?? payload.utilizador ?? null
      })

      if (!user.value) {
        try { await fetchMe() } catch (_) {}
      }

      router.push({ name: 'dashboard' })
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao iniciar sessão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return null
    try {
      const { data } = await authApi.me()
      const payload = unwrap(data)
      const u = payload.user ?? payload.utilizador ?? payload
      if (u && (u.id || u.email || u.name || u.nome)) {
        user.value = u
        localStorage.setItem('user', JSON.stringify(u))
        return u
      }
    } catch (_) {
      // silencia — usuário ainda pode usar a app
    }
    return null
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (_) {
      // ignora erros de rede no logout
    } finally {
      clearSession()
      router.push({ name: 'login' })
    }
  }

  function clearSession() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  return {
    user, accessToken, refreshToken,
    loading, error,
    isAuthenticated, isAdmin, isSuperAdmin, permissions,
    hasPermission, login, logout, clearSession, fetchMe,
  }
})
