<template>
  <ModalWrapper v-model="visible" :title="isEdit ? 'Editar Condomínio' : 'Novo Condomínio'" width="large">
    <form id="condominio-form" @submit.prevent="submit" class="space-y-4">
      <CondominioFormFields v-model="formData" :validation-errors="validationErrors" />

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <template #actions>
      <button type="button" @click="visible = false" class="px-4 py-2 text-sm rounded-md bg-muted hover:bg-muted/70">
        Cancelar
      </button>
      <button type="submit" form="condominio-form" :disabled="loading"
        class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin inline mr-1" />
        {{ isEdit ? 'Salvar' : 'Salvar' }}
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import ModalWrapper from '@/components/common/ModalWrapper.vue'
import CondominioFormFields from './CondominioFormFields.vue'
import condominioService from '@/services/condominioService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
import { emptyCondominio, condominioFromRecord, condominioToPayload } from '@/utils/condominioForm'

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
const formData = ref(emptyCondominio())

const isEdit = computed(() => props.mode === 'edit')

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  error.value = ''
  validationErrors.value = {}
  formData.value = props.record ? condominioFromRecord(props.record) : emptyCondominio()
})

async function submit() {
  loading.value = true
  error.value = ''
  validationErrors.value = {}

  const payload = condominioToPayload(formData.value)

  try {
    const response = isEdit.value
      ? await condominioService.atualizar(formData.value.id, payload)
      : await condominioService.criar(payload)

    alert(response.data?.message || (isEdit.value ? 'Condomínio atualizado com sucesso!' : 'Condomínio registrado com sucesso!'))
    emit('success')
    visible.value = false
  } catch (e) {
    console.error(e)
    error.value = handleApiError(e, validationErrors)
  } finally {
    loading.value = false
  }
}
</script>
