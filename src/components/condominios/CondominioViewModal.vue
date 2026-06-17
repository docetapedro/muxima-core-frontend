<template>
  <ModalWrapper v-model="visible" title="Detalhes do Condomínio" width="large">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="col-span-full">
        <label class="text-xs font-medium text-muted-foreground">Nome</label>
        <p class="text-sm mt-1">{{ condominio?.nome ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Nome abreviado</label>
        <p class="text-sm mt-1">{{ condominio?.nome_abreviado ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Município ID</label>
        <p class="text-sm mt-1">{{ condominio?.municipio_id ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Projecto ID</label>
        <p class="text-sm mt-1">{{ condominio?.projecto_id ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Valor global</label>
        <p class="text-sm mt-1">{{ condominio?.valor_global ?? '-' }}</p>
      </div>

      <div class="col-span-full">
        <label class="text-xs font-medium text-muted-foreground">Descrição</label>
        <p class="text-sm mt-1">{{ condominio?.descricao ?? '-' }}</p>
      </div>

      <div class="col-span-full">
        <label class="text-xs font-medium text-muted-foreground">Localização</label>
        <p class="text-sm mt-1">{{ condominio?.localizacao ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Latitude</label>
        <p class="text-sm mt-1">{{ condominio?.latitude ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Longitude</label>
        <p class="text-sm mt-1">{{ condominio?.longitude ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Dimensão</label>
        <p class="text-sm mt-1">{{ condominio?.dimensao ?? '-' }}</p>
      </div>

      <div>
        <label class="text-xs font-medium text-muted-foreground">Data de abertura</label>
        <p class="text-sm mt-1">{{ formatDate(condominio?.data_abertura) }}</p>
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
  condominio: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-PT')
}
</script>
