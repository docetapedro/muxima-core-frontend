<template>
  <ModalWrapper v-model="visible" title="Detalhes do Pagamento" width="large">
    <div v-if="current" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Negociação ID</p>
          <p class="font-medium">{{ current.negociacao_id ?? '-' }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Moeda ID</p>
          <p class="font-medium">{{ current.moeda_id ?? '-' }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Tipo Pagamento ID</p>
          <p class="font-medium">{{ current.tipo_pagamento_id ?? '-' }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Valor</p>
          <p class="font-medium">
            {{ current.valor == null ? '-' : converteParaMonetario(current.valor) }}
          </p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Data Pagamento</p>
          <p class="font-medium">{{ current.data_pagamento ?? '-' }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Nº Operação</p>
          <p class="font-medium">{{ current.numero_operacao ?? '-' }}</p>
        </div>
      </div>

      <div class="rounded-lg border border-border p-3">
        <p class="text-xs text-muted-foreground mb-1">Observação</p>
        <p class="text-sm">{{ current.observacao || '-' }}</p>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Pagamento não encontrado.
    </div>

    <template #actions>
      <button
        type="button"
        @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Fechar
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'
import { converteParaMonetario } from '@/utils/formatacao'

const props = defineProps({
  modelValue: Boolean,
  // compatibilidade: Index pode passar :Pagamento (ou :record)
  Pagamento: { type: Object, default: null },
  record: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const current = computed(() => props.Pagamento ?? props.record)
</script>
