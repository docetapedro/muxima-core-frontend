<template>
  <ModalWrapper v-model="visible" title="Detalhes do Tipo de Imóvel" width="large">
    <div v-if="tipoImovel" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ tipoImovel.nome || '-' }}</div>
          </div>
        </div>
      </div>
       <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Descrição</div>
            <div class="font-medium">{{ tipoImovel.descricao || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Tipo de imóvel não encontrado.
    </div>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  tipoImovel: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
