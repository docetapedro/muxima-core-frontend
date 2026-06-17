<template>
  <ModalWrapper
    v-model="visible"
    :title="isEdit ? 'Editar Província' : 'Nova Província'"
    width="large"
  >
    <form id="provincia-form" @submit.prevent="submit" class="space-y-4">
      <ProvinciaFormFields
        v-model="formData"
        :validation-errors="validationErrors"
      />

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <template #actions>
      <button
        type="button"
        @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-muted text-black hover:bg-muted/70"
      >
        Cancelar
      </button>

      <button
        type="submit"
        form="provincia-form"
        :disabled="loading"
        class="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
      >
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
import ProvinciaFormFields from './ProvinciaFormFields.vue'
import provinciaService from '@/services/provinciaService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
import { toast } from 'vue-sonner'
import { emptyProvincia, provinciaFromRecord, provinciaToPayload } from '@/utils/provinciaForm'
import { invalidateLookup } from '@/composables/useLookupCache'

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
const formData = ref(emptyProvincia())

const isEdit = computed(() => props.mode === 'edit')

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  error.value = ''
  validationErrors.value = {}
  formData.value = props.record ? provinciaFromRecord(props.record) : emptyProvincia()
})

async function submit() {
  loading.value = true
  error.value = ''
  validationErrors.value = {}

  const payload = provinciaToPayload(formData.value)

  try {
    const response = isEdit.value
      ? await provinciaService.atualizar(formData.value.id, payload)
      : await provinciaService.criar(payload)

    invalidateLookup('lookup:provincias')
    toast.success(response.data?.message || (isEdit.value ? 'Província atualizada com sucesso!' : 'Província registrada com sucesso!'))
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
