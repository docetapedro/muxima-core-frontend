<template>
  <ModalWrapper v-model="visible" title="Detalhes do Tipo de Projecto" width="large">
    <div v-if="tipoProjecto" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="text-xs text-muted-foreground">Nome</div>
        <div class="font-medium">{{ tipoProjecto.nome || '-' }}</div>
      </div>

      <div>
        <div class="text-xs text-muted-foreground">Descrição</div>
        <div class="font-medium">{{ tipoProjecto.descricao || '-' }}</div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Tipo de projecto não encontrado.
    </div>

    <template #actions>
      <button type="button" @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
        Fechar
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  tipoProjecto: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
