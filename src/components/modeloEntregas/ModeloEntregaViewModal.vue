<template>
  <ModalWrapper v-model="visible" title="Detalhes do Modelo de Entrega" width="large">
    <div v-if="modeloEntrega" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-1">
            <div class="text-xs text-muted-foreground">Código</div>
            <div class="font-medium">{{ modeloEntrega.codigo || '-' }}</div>
          </div>

          <div class="md:col-span-3">
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ modeloEntrega.nome || '-' }}</div>
          </div>

          <div class="md:col-span-4">
            <div class="text-xs text-muted-foreground mb-1">Descrição</div>
            <div class="text-sm whitespace-pre-wrap">{{ modeloEntrega.descricao || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Modelo de entrega não encontrado.
    </div>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  modeloEntrega: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
