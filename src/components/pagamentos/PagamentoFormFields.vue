<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-muted-foreground block mb-1">Negociação *</label>
        <select
          v-model="model.negociacao"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          required
        >
          <option value="">Selecione</option>
          <option v-for="n in negociacoes" :key="n.id" :value="n.id">
            {{ getNegotiationLabel(n) }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Moeda</label>
        <select
          v-model="model.moeda"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Selecione</option>
          <option v-for="m in moedas" :key="m.id" :value="m.id">
            {{ m.nome || m.codigo || m.id }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Tipo de Pagamento *</label>
        <select
          v-model="model.tipo_pagamento"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          required
        >
          <option value="">Selecione</option>
          <option v-for="t in tiposPagamento" :key="t.id" :value="t.id">
            {{ t.nome || t.codigo || t.id }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Valor *</label>
        <input
          v-model.number="model.valor"
          type="number"
          step="0.01"
          required
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
        />
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Data Pagamento *</label>
        <input
          v-model="model.data_pagamento"
          type="date"
          required
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
        />
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Nº Operação</label>
        <input
          v-model="model.numero_operacao"
          type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
        />
      </div>
    </div>

    <div>
      <label class="text-xs text-muted-foreground block mb-1">Observação</label>
      <textarea
        v-model="model.observacao"
        rows="3"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
      />
    </div>

    <div v-if="validationErrors && Object.keys(validationErrors).length" class="space-y-1">
      <div class="text-sm text-red-600 font-medium">Erros de validação:</div>
      <ul class="text-sm text-red-600 list-disc pl-5">
        <li v-for="(msg, key) in validationErrors" :key="key">
          {{ msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import http from '@/api/http'

const props = defineProps({
  modelValue: { type: Object, required: true },
  validationErrors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const model = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  (v) => {
    model.value = { ...v }
  },
  { deep: true }
)

watch(
  model,
  (v) => {
    emit('update:modelValue', v)
  },
  { deep: true }
)

const moedas = ref([])
const tiposPagamento = ref([])
const negociacoes = ref([])

function getNegotiationLabel(n) {
  const imovelRef = n?.imovel?.referencia || '-'
  const entidadePrincipalNome = Array.isArray(n?.entidade_principal) && n.entidade_principal.length
    ? (n.entidade_principal[0]?.nome || '-')
    : '-'

  const codigo = n?.codigo || n?.id || '-'
  return `${imovelRef} · ${entidadePrincipalNome} (${codigo})`
}

async function loadSelects() {
  // moedas
  try {
    const resMoedas = await http.get('/api/moedas')
    const dados = resMoedas?.data?.dados
    const items = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
    moedas.value = items
  } catch (e) {
    moedas.value = []
  }

  // tipos de pagamento
  try {
    const resTipos = await http.get('/api/tipopagamentos')
    const dados = resTipos?.data?.dados
    const items = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
    tiposPagamento.value = items
  } catch (e) {
    tiposPagamento.value = []
  }

  // negociacoes
  try {
    const resNeg = await http.get('/api/negociacaos')
    const dados = resNeg?.data?.dados
    const items = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
    negociacoes.value = items
  } catch (e) {
    negociacoes.value = []
  }
}

onMounted(() => {
  loadSelects()
})
</script>
