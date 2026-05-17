<template>
  <ModalWrapper v-model="visible" title="Detalhes da Província" width="large">
    <div v-if="provincia" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ provincia.nome || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Província não encontrada.
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

const props = defineProps({
  modelValue: Boolean,
  provincia: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
