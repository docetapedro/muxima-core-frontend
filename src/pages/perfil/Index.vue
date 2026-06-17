<template>
  <div class="space-y-6 animate-fade-in max-w-3xl">
    <div>
      <h1 class="text-2xl font-bold">O Meu Perfil</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Actualize os seus dados pessoais ou altere a sua password.
      </p>
    </div>

    <div v-if="loadingProfile" class="bg-card border border-border rounded-xl p-10 flex items-center justify-center text-muted-foreground">
      <Loader2 class="w-5 h-5 animate-spin mr-2" />
      A carregar perfil...
    </div>

    <form v-else @submit.prevent="submit" class="space-y-6">
      <section class="bg-card border border-border rounded-xl p-5 space-y-4">
        <header>
          <h2 class="text-base font-semibold">Dados pessoais</h2>
          <p class="text-xs text-muted-foreground">Identificação básica da conta.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Nome *</label>
            <input v-model="form.name" type="text" required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.name }" />
            <p v-if="validationErrors.name" class="text-xs text-red-600 mt-1">{{ validationErrors.name[0] }}</p>
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Username *</label>
            <input v-model="form.username" type="text" required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.username }" />
            <p v-if="validationErrors.username" class="text-xs text-red-600 mt-1">{{ validationErrors.username[0] }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="text-sm font-medium mb-1 block">Email *</label>
            <input v-model="form.email" type="email" required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.email }" />
            <p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email[0] }}</p>
          </div>
        </div>
      </section>

      <section class="bg-card border border-border rounded-xl p-5 space-y-4">
        <header class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold">Alterar password</h2>
            <p class="text-xs text-muted-foreground">
              Deixe os campos vazios para manter a password actual.
            </p>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="text-sm font-medium mb-1 block">Password actual</label>
            <input v-model="form.password_actual" type="password" autocomplete="current-password"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.password_actual }" />
            <p v-if="validationErrors.password_actual" class="text-xs text-red-600 mt-1">
              {{ validationErrors.password_actual[0] }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Nova password</label>
            <input v-model="form.password" type="password" autocomplete="new-password"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.password }" />
            <p v-if="validationErrors.password" class="text-xs text-red-600 mt-1">{{ validationErrors.password[0] }}</p>
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Confirmar nova password</label>
            <input v-model="form.password_confirmation" type="password" autocomplete="new-password"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              :class="{ 'border-red-500': validationErrors.password_confirmation }" />
            <p v-if="validationErrors.password_confirmation" class="text-xs text-red-600 mt-1">
              {{ validationErrors.password_confirmation[0] }}
            </p>
          </div>
        </div>
      </section>

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>

      <div class="flex items-center justify-end gap-2">
        <button type="button" @click="reset" :disabled="saving"
          class="px-4 py-2 text-sm rounded-md bg-muted text-foreground hover:bg-muted/70 disabled:opacity-50">
          Repor
        </button>
        <button type="submit" :disabled="saving"
          class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          Guardar alterações
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import perfilService from '@/services/perfilService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { handleApiError } = useApiErrorHandler()

const loadingProfile = ref(true)
const saving = ref(false)
const error = ref('')
const validationErrors = ref({})

function emptyForm() {
  return {
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    password_actual: ''
  }
}

const form = ref(emptyForm())
const original = ref(emptyForm())

function fillFromRecord(u) {
  return {
    name: u?.name ?? u?.nome ?? '',
    username: u?.username ?? u?.usuario ?? '',
    email: u?.email ?? '',
    password: '',
    password_confirmation: '',
    password_actual: ''
  }
}

async function carregar() {
  loadingProfile.value = true
  try {
    const { data } = await perfilService.obter()
    const u = data?.dados ?? data ?? {}
    original.value = fillFromRecord(u)
    form.value = { ...original.value }
  } catch (e) {
    console.error(e)
    error.value = handleApiError(e, validationErrors)
  } finally {
    loadingProfile.value = false
  }
}

function reset() {
  form.value = { ...original.value }
  validationErrors.value = {}
  error.value = ''
}

function buildPayload() {
  const payload = {
    name: form.value.name,
    username: form.value.username,
    email: form.value.email
  }
  if (form.value.password || form.value.password_confirmation || form.value.password_actual) {
    payload.password = form.value.password
    payload.password_confirmation = form.value.password_confirmation
    payload.password_actual = form.value.password_actual
  }
  return payload
}

async function submit() {
  saving.value = true
  error.value = ''
  validationErrors.value = {}
  try {
    const { data } = await perfilService.atualizar(buildPayload())
    const u = data?.dados ?? data ?? null
    if (u && typeof u === 'object') {
      auth.user = u
      localStorage.setItem('user', JSON.stringify(u))
      original.value = fillFromRecord(u)
    } else {
      original.value = { ...form.value, password: '', password_confirmation: '', password_actual: '' }
    }
    form.value = { ...original.value }
    toast.success(data?.message || 'Perfil actualizado com sucesso.')
  } catch (e) {
    console.error(e)
    error.value = handleApiError(e, validationErrors)
  } finally {
    saving.value = false
  }
}

onMounted(carregar)
</script>
