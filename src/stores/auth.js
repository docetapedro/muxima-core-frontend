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
  const permissions = computed(() => user.value?.permissions || [])

  const hasPermission = (perm) => {
    if (!user.value) return false
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(perm)
  }

  // --- Actions ---
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(credentials)

      accessToken.value = data.token
      refreshToken.value = data.refresh_token
      user.value = data.user

      localStorage.setItem('access_token', data.token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push({ name: 'dashboard' })
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao iniciar sessão.'
      throw err
    } finally {
      loading.value = false
    }
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
    isAuthenticated, isAdmin, permissions,
    hasPermission, login, logout, clearSession,
  }
})
