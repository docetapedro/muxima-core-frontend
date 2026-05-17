<template>
  <ModalWrapper v-model="visible" title="Detalhes do Utilizador" width="medium">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-xs font-medium text-muted-foreground">Nome</label>
        <p class="text-sm mt-1">{{ user?.name }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Utilizador</label>
        <p class="text-sm mt-1">{{ user?.username }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">E-mail</label>
        <p class="text-sm mt-1">{{ user?.email }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Administrador</label>
        <p class="text-sm mt-1">{{ user?.administrador ? 'Sim' : 'Não' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Superadministrador</label>
        <p class="text-sm mt-1">{{ user?.superadministrador ? 'Sim' : 'Não' }}</p>
      </div>
    
      <div>
        <label class="text-xs font-medium text-muted-foreground">Activo</label>
        <p class="text-sm mt-1">{{ user?.activo ? 'Sim' : 'Não' }}</p>
      </div>
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
  user: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
