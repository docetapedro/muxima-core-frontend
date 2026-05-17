<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <aside :class="[
      'flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-40',
      sidebarOpen ? 'w-64' : 'w-16',
      'hidden md:flex'
    ]">
      <div class="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">M</span>
        </div>
        <span v-if="sidebarOpen" class="font-semibold text-white text-sm truncate">Muxima</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
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

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <header class="h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div class="flex items-center gap-3">
          <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-md hover:bg-muted transition-colors">
            <Menu class="w-5 h-5" />
          </button>
          <div class="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{{ currentSection }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="toggleDark()" class="p-2 rounded-md hover:bg-muted transition-colors">
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <div class="relative" ref="userMenuRef">
            <button @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
              <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span class="text-white text-xs font-semibold">{{ userInitials }}</span>
              </div>
              <ChevronDown class="w-4 h-4 text-muted-foreground" />
            </button>

            <div v-if="userMenuOpen"
              class="absolute right-0 top-full mt-1 w-48 rounded-md border border-border bg-card shadow-lg z-50 py-1">
              <div class="px-3 py-2 border-b border-border">
                <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ auth.user?.email }}</p>
              </div>
              <button @click="auth.logout()"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                <LogOut class="w-4 h-4" />
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
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
import { ref, computed, watch, reactive } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useDark, useToggle, onClickOutside } from '@vueuse/core'
import { Menu, LogOut, Sun, Moon, ChevronDown } from 'lucide-vue-next'
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

const userInitials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
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
