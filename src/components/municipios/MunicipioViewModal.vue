<template>
  <ModalWrapper v-model="visible" :title="`Município`" width="large">
    <div v-if="municipio" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ municipio.nome || '-' }}</div>
          </div>

          <div class="space-y-1">
            <div class="text-xs text-muted-foreground">Província</div>
            <div class="font-medium">
              {{ provinciaNome }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Município não encontrado.
    </div>
  </ModalWrapper>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  municipio: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const provinciaNome = computed(() => {
  if (!props.municipio) return '-'
  if (props.municipio.provincia?.nome) return props.municipio.provincia.nome
  return props.municipio.provincia?.nome ?? props.municipio.provincia ?? '-'
})
</script>
