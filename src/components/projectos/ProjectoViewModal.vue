<template>
  <ModalWrapper v-model="visible" title="Detalhes do Projecto" width="large">
    <div v-if="projecto" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ projecto.nome || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Projecto não encontrado.
    </div>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  projecto: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
