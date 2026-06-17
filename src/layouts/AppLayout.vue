<template>
  <div class="flex h-screen overflow-hidden bg-background text-foreground">
    <aside
      :class="[
        'flex flex-col bg-slate-950 text-slate-50 shadow-none transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-16',
        'hidden md:flex'
      ]"
      style="box-shadow: none; background-image: none; filter: none;"
    >
      <div class="flex items-center gap-3 px-4 h-16 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">M</span>
        </div>
        <span v-if="sidebarOpen" class="font-semibold text-white text-sm truncate">Muxima</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-1 text-slate-50">
        <NavMenuItem
          v-for="item in navigation"
          :key="item.name"
          :item="item"
          :depth="0"
          :sidebar-open="sidebarOpen"
          :current-path="route.path"
          :is-expanded="isGroupExpanded"
          :on-toggle="toggleGroup"
        />
      </nav>
    </aside>

    <div class="flex flex-col flex-1 min-w-0 overflow-visible">
      <header
        :class="[
          'h-16 border-b flex items-center justify-between px-4 shrink-0 transition-colors',
          isDark ? 'bg-slate-950 text-slate-50 border-slate-800' : 'bg-white text-slate-900 border-border'
        ]"
      >
        <div class="flex items-center gap-3">
          <button
            @click="sidebarOpen = !sidebarOpen"
            :class="[
              'p-2 rounded-md transition-colors',
              isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            ]"
          >
            <Menu class="w-5 h-5" />
          </button>
          <div :class="['hidden sm:flex items-center gap-2 text-sm', isDark ? 'text-slate-300' : 'text-slate-700']">
            <span>{{ currentSection }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleDark()"
            :class="[
              'p-2 rounded-md transition-colors',
              isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            ]"
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <div class="relative" ref="userMenuRef">
            <button @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                <span class="text-white text-xs font-semibold">{{ userInitials }}</span>
              </div>
              <div class="hidden sm:flex flex-col items-start leading-tight min-w-0 max-w-[180px]">
                <span class="text-sm font-medium truncate w-full" :class="isDark ? 'text-slate-50' : 'text-slate-900'">
                  {{ userDisplayName }}
                </span>
                <span class="text-xs truncate w-full" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
                  {{ userDisplayEmail }}
                </span>
              </div>
              <ChevronDown class="w-4 h-4 text-muted-foreground shrink-0" />
            </button>

            <div v-if="userMenuOpen"
              class="absolute right-0 top-full mt-2 w-64 rounded-xl border-2 border-border bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 z-50 py-1 overflow-hidden">
              <div class="px-3 py-2 border-b border-border/70 bg-slate-100 dark:bg-slate-800/80">
                <p class="text-sm font-semibold truncate text-slate-900 dark:text-slate-50">{{ userDisplayName }}</p>
                <p class="text-xs truncate text-slate-600 dark:text-slate-300">{{ userDisplayEmail }}</p>
              </div>
              <RouterLink :to="{ name: 'perfil' }" @click="userMenuOpen = false"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left font-medium">
                <UserCircle class="w-4 h-4" />
                O meu perfil
              </RouterLink>
              <button @click="auth.logout()"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left font-medium border-t border-border/70">
                <LogOut class="w-4 h-4" />
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6 bg-background text-foreground">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useDark, useToggle, onClickOutside } from '@vueuse/core'
import { Menu, LogOut, Sun, Moon, ChevronDown, UserCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import NavMenuItem from '@/components/layout/NavMenuItem.vue'
import { navigation, findActiveNavItem, findExpandedGroupNames } from '@/config/navigation'

const auth = useAuthStore()
const route = useRoute()
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
  selector: 'html',
  attribute: 'class',
})
const toggleDark = useToggle(isDark)

const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const userMenuRef = ref(null)
const expandedGroups = reactive({})

onClickOutside(userMenuRef, () => { userMenuOpen.value = false })

function isGroupExpanded(name) {
  return expandedGroups[name] === true
}

function toggleGroup(name) {
  if (!sidebarOpen.value) {
    sidebarOpen.value = true
    expandedGroups[name] = true
    return
  }
  expandedGroups[name] = !expandedGroups[name]
}

function syncExpandedForRoute(path) {
  const activeGroups = findExpandedGroupNames(path)
  for (const name of activeGroups) {
    expandedGroups[name] = true
  }
}

watch(() => route.path, syncExpandedForRoute, { immediate: true })

const currentSection = computed(() => {
  return findActiveNavItem(route.path)?.label || 'Painel Principal'
})

const userDisplayName = computed(() => {
  const user = auth.user || {}
  return (
    user.name ||
    user.nome ||
    user.username ||
    user.usuario ||
    user.full_name ||
    user.fullName ||
    user.entidade?.nome ||
    (user.email ? user.email.split('@')[0] : '') ||
    'Utilizador'
  )
})

const userDisplayEmail = computed(() => {
  const user = auth.user || {}
  return user.email || user.email_address || user.mail || user.username || user.usuario || ''
})

const userInitials = computed(() => {
  const name = userDisplayName.value || ''
  const parts = name.split(/[\s.@_-]+/).filter(Boolean)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
    ? ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
    : (name[0] || 'U').toUpperCase()
})

onMounted(() => {
  if (auth.isAuthenticated && (!auth.user || !auth.user.email)) {
    auth.fetchMe()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
