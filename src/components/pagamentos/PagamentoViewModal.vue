<template>
  <ModalWrapper v-model="visible" title="Detalhes do Pagamento" width="large">
    <div v-if="current" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Tipo Pagamento</p>
          <p class="font-medium">{{ getTipoPagamentoLabel(current) }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Item Pagamento</p>
          <p class="font-medium">{{ getItemPagamentoLabel(current) }}</p>
        </div>

        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground mb-1">Imóvel</p>
          <p class="font-medium">{{ getImovelReferencia(current) }}</p>
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
  record: { type: Object, default: null },
  tiposPagamento: { type: Array, default: () => [] },
  negociacoes: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const current = computed(() => props.Pagamento ?? props.record)

function getTipoPagamentoLabel(pag) {
  const tipoId =
    pag?.tipoPagamento?.id
    ?? pag?.tipo_pagamento_id
    ?? (typeof pag?.tipo_pagamento === 'object' ? pag?.tipo_pagamento?.id : pag?.tipo_pagamento)
  const tipo = props.tiposPagamento.find((item) => String(item.id) === String(tipoId))
  return (
    tipo?.nome
    || tipo?.descricao
    || tipo?.codigo
    || pag?.tipoPagamento?.nome
    || pag?.tipoPagamento?.descricao
    || pag?.tipo_pagamento?.nome
    || pag?.tipo_pagamento?.descricao
    || '-'
  )
}

function getNegociacaoItemRecord(pag) {
  const niId =
    pag?.negociacaoItem?.id
    ?? pag?.negociacao_item_id
    ?? (typeof pag?.negociacao_item === 'object' ? pag?.negociacao_item?.id : pag?.negociacao_item)
  return props.negociacoes.find((r) => String(r.id) === String(niId)) ?? null
}

function getItemPagamentoLabel(pag) {
  const ni = getNegociacaoItemRecord(pag)
  return (
    ni?.nome_item
    || pag?.negociacaoItem?.item?.nome
    || pag?.negociacaoItem?.item?.codigo
    || pag?.negociacao_item?.item?.nome
    || pag?.negociacao_item?.item?.codigo
    || pag?.itemPagamento?.nome
    || pag?.item_pagamento?.nome
    || '-'
  )
}

function getImovelReferencia(pag) {
  const ni = getNegociacaoItemRecord(pag)
  return (
    ni?.referencia_imovel
    || pag?.negociacaoItem?.negociacao?.imovel?.referencia
    || pag?.negociacao_item?.negociacao?.imovel?.referencia
    || pag?.negociacao?.imovel?.referencia
    || pag?.imovel?.referencia
    || pag?.imovel_referencia
    || '-'
  )
}
</script>
