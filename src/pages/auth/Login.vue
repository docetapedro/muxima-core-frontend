<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-xl bg-blue-600 dark:bg-sky-400 flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-xl">M</span>
        </div>
        <h1 class="text-2xl font-bold text-blue-600 dark:text-sky-400">Muxima</h1>
        <p class="text-muted-foreground text-sm mt-1">Sistema de Gestão de Imobiliária</p>
      </div>

      <!-- Card -->
      <div class="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-1 text-foreground">Iniciar sessão</h2>
        <p class="text-foreground text-sm mb-6">Introduza as suas credenciais</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Login field -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">E-mail ou Utilizador</label>
            <input
              v-model="form.login"
              type="text"
              placeholder="utilizador@email.com"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground
                     focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-sky-400 focus:ring-offset-1 transition-colors
                     placeholder:text-muted-foreground"
              :disabled="auth.loading"
              required
            />
          </div>

          <!-- Password field -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Palavra-passe</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-3 py-2 pr-10 rounded-md border border-input bg-background text-sm text-foreground
                       focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-sky-400 focus:ring-offset-1 transition-colors
                       placeholder:text-muted-foreground"
                :disabled="auth.loading"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-blue-600 dark:hover:text-sky-400"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="auth.error"
            class="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm"
          >
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ auth.error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-transparent
                   bg-blue-600 dark:bg-sky-400 text-white text-sm font-medium
                   hover:bg-blue-700 dark:hover:bg-sky-300 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="auth.loading" class="w-4 h-4 animate-spin" />
            {{ auth.loading ? 'A autenticar...' : 'Entrar' }}
          </button>
        </form>
      </div>

        <p class="text-center text-xs text-muted-foreground mt-6">
        © {{ new Date().getFullYear() }} Muxima. Todos os direitos reservados.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = ref({ login: '', password: '' })
const showPassword = ref(false)

async function handleLogin() {
  await auth.login(form.value)
}
</script>
