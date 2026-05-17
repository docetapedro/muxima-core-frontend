<template>
  <ModalWrapper v-model="visible" title="Detalhes do Câmbio" width="large">
    <div v-if="currentCambio" class="grid grid-cols-1 md:grid-cols-2 gap-4">
     
        <div class="space-y-2">
          <div>
            <div class="text-xs text-muted-foreground">Data</div>
            <div class="font-medium">{{ currentCambio.data_cambio || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">USD</div>
            <div class="font-medium">{{ currentCambio.cambio_usd || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">EUR</div>
            <div class="font-medium">{{ currentCambio.cambio_eur || '-' }}</div>
          </div>
        </div>
      </div>
    

    <div v-else class="text-center py-10 text-muted-foreground">
      Cambio não encontrado.
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
import { getEstadoCivilLabel, formatDate } from '@/utils/entidadeLabels'

const props = defineProps({
  modelValue: Boolean,
  // compatibilidade: o Index está passando :Cambio (E maiúsculo)
  Cambio: { type: Object, default: null },
  entidade: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentCambio = computed(() => props.Cambio ?? props.entidade)
</script>
