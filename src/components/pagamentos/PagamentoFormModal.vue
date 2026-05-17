<template>
  <ModalWrapper
    v-model="visible"
    :title="isEdit ? 'Editar Pagamento' : 'Novo Pagamento'"
    width="large"
  >
    <form id="pagamento-form" @submit.prevent="submit" class="space-y-4">
      <PagamentoFormFields v-model="formData" :validation-errors="validationErrors" />

      <div v-if="error" class="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <template #actions>
      <button
        type="button"
        @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-muted hover:bg-muted/70"
      >
        Cancelar
      </button>

      <button
        type="submit"
        form="pagamento-form"
        :disabled="loading"
        class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin inline mr-1" />
        {{ isEdit ? 'Salvar' : 'Salvar' }}
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import ModalWrapper from '@/components/common/ModalWrapper.vue'
import PagamentoFormFields from './PagamentoFormFields.vue'
import pagamentoService from '@/services/pagamentoService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

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

const emptyForm = () => ({
  negociacao: null,
  moeda: null,
  tipo_pagamento: null,
  valor: null,
  data_pagamento: '',
  observacao: '',
  numero_operacao: ''
})

const formData = ref(emptyForm())

const isEdit = computed(() => props.mode === 'edit')

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    visible.value = v
  }
)

watch(visible, (v) => {
  emit('update:modelValue', v)
})

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    error.value = ''
    validationErrors.value = {}
    formData.value = props.record ? { ...emptyForm(), ...props.record } : emptyForm()

    // normaliza alguns campos vindos do backend
    if (formData.value.data_pagamento == null) formData.value.data_pagamento = ''
    formData.value.observacao = formData.value.observacao ?? ''
    formData.value.numero_operacao = formData.value.numero_operacao ?? ''

    // compatibilidade: backend pode trazer moeda_id/tipo_pagamento_id
    if (formData.value.moeda == null && formData.value.moeda_id != null) {
      formData.value.moeda = formData.value.moeda_id
    }
    if (formData.value.tipo_pagamento == null && formData.value.tipo_pagamento_id != null) {
      formData.value.tipo_pagamento = formData.value.tipo_pagamento_id
    }
  }
)

async function submit() {
  loading.value = true
  error.value = ''
  validationErrors.value = {}

  try {
    const response = isEdit.value
      ? await pagamentoService.atualizar(props.record.id, formData.value)
      : await pagamentoService.criar(formData.value)

    alert(response.data?.message || (isEdit.value ? 'Pagamento atualizado!' : 'Pagamento registado!'))
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
