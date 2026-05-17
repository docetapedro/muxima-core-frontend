<template>
  <ModalWrapper v-model="visible" :title="isEdit ? 'Editar Imóvel' : 'Novo Imóvel'" width="large">
    <form id="imovel-form" @submit.prevent="submit" class="space-y-4">
      <ImovelFormFields v-model="formData" :validation-errors="validationErrors" :mode="mode" />

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <template #actions>
      <button type="button" @click="visible = false" class="px-4 py-2 text-sm rounded-md bg-muted hover:bg-muted/70">
        Cancelar
      </button>
      <button type="submit" form="imovel-form" :disabled="loading"
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
import ImovelFormFields from './ImovelFormFields.vue'
import imovelService from '@/services/imovelService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
import { emptyImovel, imovelFromRecord, imovelToPayload } from '@/utils/imovelForm'

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
const formData = ref(emptyImovel())

const isEdit = computed(() => props.mode === 'edit')

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  error.value = ''
  validationErrors.value = {}
  formData.value = props.record ? imovelFromRecord(props.record) : emptyImovel()
})

async function submit() {
  loading.value = true
  error.value = ''
  validationErrors.value = {}

  const payload = imovelToPayload(formData.value)

  try {
    const response = isEdit.value
      ? await imovelService.atualizar(formData.value.id, payload)
      : await imovelService.criar(payload)

    alert(response.data?.message || (isEdit.value ? 'Imóvel atualizado !' : 'Imóvel registado!'))
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
