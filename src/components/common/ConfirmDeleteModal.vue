<template>
  <ModalWrapper v-model="visible" title="Confirmar exclusão" width="small">
    <p class="text-sm text-muted-foreground mb-6">
      Tens a certeza que queres eliminar {{ entityLabel }}
      <span class="font-medium text-foreground">{{ itemName }}</span>?
    </p>

    <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
      {{ error }}
    </div>

    <template #actions>
      <button
        type="button"
        @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-muted text-black hover:bg-muted/70"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="emit('confirm')"
        :disabled="loading"
        class="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin inline mr-1" />
        Sim, eliminar
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import ModalWrapper from './ModalWrapper.vue'

const props = defineProps({
  modelValue: Boolean,
  entityLabel: { type: String, default: 'o registo' },
  itemName: { type: String, default: '' },
  loading: Boolean,
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
