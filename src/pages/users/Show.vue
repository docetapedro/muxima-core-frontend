<template>
  <div class="space-y-6 animate-fade-in">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Detalhe do Utilizador</h1>
        <p class="text-muted-foreground text-sm">
          Informações completas do perfil
        </p>
      </div>

      <RouterLink
        to="/users"
        class="px-4 py-2 rounded-md bg-muted text-black hover:bg-muted/70 text-sm"
      >
        Voltar
      </RouterLink>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-4 animate-pulse">

      <div class="bg-card border border-border rounded-xl p-6 flex justify-between">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-muted"></div>
          <div class="space-y-2">
            <div class="h-4 w-40 bg-muted rounded"></div>
            <div class="h-3 w-56 bg-muted rounded"></div>
            <div class="flex gap-2 mt-2">
              <div class="h-5 w-16 bg-muted rounded-full"></div>
              <div class="h-5 w-16 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
        <div class="h-4 w-24 bg-muted rounded"></div>
      </div>

    </div>

    <!-- CONTENT -->
    <div v-else-if="user" class="space-y-6">

      <!-- PROFILE HEADER -->
      <div class="bg-card border border-border rounded-xl p-6 flex items-center justify-between">

        <div class="flex items-center gap-4">

          <!-- Avatar -->
          <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {{ initials }}
          </div>

          <div>
            <h2 class="text-lg font-semibold">{{ user.name }}</h2>
            <p class="text-sm text-muted-foreground">{{ user.email }}</p>

            <div class="flex gap-2 mt-2">
              <span class="px-2 py-1 text-xs rounded-full bg-muted">
                {{ user.username }}
              </span>

              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="user.activo == '1'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'"
              >
                {{ user.activo == '1' ? 'Activo' : 'Inativo' }}
              </span>
            </div>
          </div>

        </div>

        <div class="text-right text-sm text-muted-foreground">
          <p>Criado</p>
          <p class="font-medium text-foreground">{{ user.created_at }}</p>
        </div>

      </div>

      <!-- DETAILS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <User class="w-5 h-5 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Username</p>
            <p class="font-medium">{{ user.username }}</p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Mail class="w-5 h-5 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Email</p>
            <p class="font-medium">{{ user.email }}</p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Shield class="w-5 h-5 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Perfil</p>
            <p class="font-medium">{{ perfil }}</p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Palette class="w-5 h-5 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Tema</p>
            <p class="font-medium capitalize">{{ user.tema }}</p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Clock class="w-5 h-5 text-muted-foreground" />
          <div>
            <p class="text-xs text-muted-foreground">Atualizado</p>
            <p class="font-medium">{{ user.updated_at }}</p>
          </div>
        </div>

      </div>

    </div>

    <!-- EMPTY -->
    <div v-else class="text-center py-20 text-muted-foreground">
      Utilizador não encontrado.
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate, RouterLink } from 'vue-router'
import http from '@/api/http'

import {
  User,
  Mail,
  Shield,
  Palette,
  Clock
} from 'lucide-vue-next'

const route = useRoute()

const user = ref(null)
const loading = ref(false)

/* FETCH USER */
const loadUser = async (id) => {
  if (!id) return

  loading.value = true
  try {
    const res = await http.get(`/api/users/${id}`)
    user.value = res.data.dados || null
  } catch (e) {
    console.error(e)
    user.value = null
  } finally {
    loading.value = false
  }
}

/* first load */
onMounted(() => {
  loadUser(route.params.id)
})

/* route change */
onBeforeRouteUpdate((to) => {
  loadUser(to.params.id)
})

/* initials */
const initials = computed(() => {
  if (!user.value?.name) return ''
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

/* perfil */
const perfil = computed(() => {
  if (user.value?.superadministrador == '1') return 'Super Administrador'
  if (user.value?.administrador == '1') return 'Administrador'
  if (user.value?.consultor == '1') return 'Consultor'
  return 'Beneficiário'
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
