<template>
  <ModalWrapper v-model="visible" :title="isEdit ? 'Editar Utilizador' : 'Novo Utilizador'" width="medium">
    <form id="user-form" @submit.prevent="submit" class="space-y-4">
      <UserFormFields
        v-model="formData"
        :validation-errors="validationErrors"
        :password-required="!isEdit"
      />

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <template #actions>
      <button type="button" @click="visible = false" class="px-4 py-2 text-sm rounded-md bg-muted text-black hover:bg-muted/70">
        Cancelar
      </button>
      <button type="submit" form="user-form" :disabled="loading"
        class="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin inline mr-1" />
        Salvar
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import ModalWrapper from '@/components/common/ModalWrapper.vue'
import UserFormFields from './UserFormFields.vue'
import userService from '@/services/userService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
import { emptyUser, userFromRecord } from '@/utils/userForm'

const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, default: 'create' },
  record: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const { handleApiError } = useApiErrorHandler()
const loading = ref(false)
const error = ref('')
const validationErrors = ref({})
const formData = ref(emptyUser())

const isEdit = computed(() => props.mode === 'edit')

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  error.value = ''
  validationErrors.value = {}
  formData.value = props.record ? userFromRecord(props.record) : emptyUser()
})

  async function submit() {
    loading.value = true
    error.value = ''
    validationErrors.value = {}
    const payload = { ...formData.value }
    // API expects 0/1 instead of boolean for these fields
    ;['activo', 'administrador', 'superadministrador'].forEach((key) => {
      if (typeof payload[key] === 'boolean') payload[key] = payload[key] ? 1 : 0
    })

    if (isEdit.value && !payload.password) {
      delete payload.password
    }

    try {
      const response = isEdit.value
        ? await userService.atualizar(payload.id, payload)
        : await userService.criar(payload)

      const message =
        response.data?.message || (isEdit.value ? 'Utilizador atualizado!' : 'Utilizador criado!')

      toast.success(message)
      emit('success')
      visible.value = false
    } catch (e) {
      console.error(e)
      error.value = handleApiError(e, validationErrors)
      toast.error(error.value || 'Erro ao guardar o utilizador')
    } finally {
      loading.value = false
    }
}
</script>
