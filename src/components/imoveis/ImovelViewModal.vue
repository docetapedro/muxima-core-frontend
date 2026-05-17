<template>
  <ModalWrapper v-model="visible" title="Detalhes do Imóvel" width="large">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <label class="text-xs font-medium text-muted-foreground">Placa</label>
        <p class="text-sm mt-1">{{ imovel?.placa || '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Quadra / Lote</label>
        <p class="text-sm mt-1">{{ quadraLote }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Condomínio</label>
        <p class="text-sm mt-1">{{ imovel?.condominio ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Tipo de Lote</label>
        <p class="text-sm mt-1">{{ imovel?.tipo_lote ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Modelo</label>
        <p class="text-sm mt-1">{{ imovel?.modelo ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Tipologia</label>
        <p class="text-sm mt-1">{{ imovel?.tipologia ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Tipo de Imóvel</label>
        <p class="text-sm mt-1">{{ imovel?.tipo_imovel ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Área do Lote (m²)</label>
        <p class="text-sm mt-1">{{ imovel?.area_lote ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Moeda</label>
        <p class="text-sm mt-1">{{ imovel?.moeda ?? '-' }}</p>
      </div>
     
      <div>
        <label class="text-xs font-medium text-muted-foreground">Estado do Imóvel</label>
        <p class="text-sm mt-1">{{ imovel?.estado_imovel ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Valor da Obra</label>
        <p class="text-sm mt-1">{{ imovel?.valor_obra ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Data de Entrega</label>
        <p class="text-sm mt-1">{{ formatDate(imovel?.data_entrega) }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Data Prevista Conclusão</label>
        <p class="text-sm mt-1">{{ formatDate(imovel?.data_prevista_conclusao) }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Prazo de Entrega</label>
        <p class="text-sm mt-1">{{ imovel?.prazo_entrega ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Latitude</label>
        <p class="text-sm mt-1">{{ imovel?.latitude ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Longitude</label>
        <p class="text-sm mt-1">{{ imovel?.longitude ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Altitude</label>
        <p class="text-sm mt-1">{{ imovel?.altitude ?? '-' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Entregue</label>
        <p class="text-sm mt-1">{{ imovel?.entregue ? 'Sim' : 'Não' }}</p>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground">Concluído</label>
        <p class="text-sm mt-1">{{ imovel?.concluido ? 'Sim' : 'Não' }}</p>
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
  imovel: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const quadraLote = computed(() => {
  if (!props.imovel?.quadra && !props.imovel?.lote) return '-'
  return `${props.imovel.quadra || ''} / ${props.imovel.lote || ''}`.trim()
})

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-PT')
}
</script>
