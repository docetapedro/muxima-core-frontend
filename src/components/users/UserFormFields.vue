<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input v-model="formData.name" type="text" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <p v-if="validationErrors.name" class="text-xs text-red-600 mt-1">{{ validationErrors.name[0] }}</p>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">Utilizador *</label>
      <input v-model="formData.username" type="text" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <p v-if="validationErrors.username" class="text-xs text-red-600 mt-1">{{ validationErrors.username[0] }}</p>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">E-mail *</label>
      <input v-model="formData.email" type="email" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email[0] }}</p>
    </div>
    <div>
      <label class="text-sm font-medium mb-1 block">{{ passwordLabel }}</label>
      <input v-model="formData.password" type="password" :required="passwordRequired"
        :placeholder="passwordPlaceholder"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <p v-if="validationErrors.password" class="text-xs text-red-600 mt-1">{{ validationErrors.password[0] }}</p>
    </div>
   
    <div class="col-span-2">
      <div class="flex gap-4 flex-wrap">
        <label class="flex items-center gap-2">
          <input v-model="formData.administrador" type="checkbox" class="rounded border-input" />
          <span class="text-sm">Administrador</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="formData.superadministrador" type="checkbox" class="rounded border-input" />
          <span class="text-sm">Superadministrador</span>
        </label>
        
        <label class="flex items-center gap-2">
          <input v-model="formData.activo" type="checkbox" class="rounded border-input" />
          <span class="text-sm">Activo</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) },
  passwordRequired: { type: Boolean, default: true }
})

const formData = defineModel({ type: Object, required: true })

const passwordLabel = computed(() => (props.passwordRequired ? 'Senha *' : 'Nova Senha'))
const passwordPlaceholder = computed(() =>
  props.passwordRequired ? '' : 'Deixar em branco para manter a atual'
)
</script>
