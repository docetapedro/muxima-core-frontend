<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border border-dashed border-border rounded-md bg-muted/5">
        <div>
          <label class="text-xs text-muted-foreground block mb-1">Filtrar por Condomínio</label>
          <select
            v-model="filtroCondominio"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option :value="null">Todos</option>
            <option v-for="c in condominiosDisponiveis" :key="c.key" :value="c.key">
              {{ c.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs text-muted-foreground block mb-1">Filtrar por Imóvel</label>
          <select
            v-model="filtroImovel"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option :value="null">Todos</option>
            <option v-for="i in imoveisDisponiveis" :key="i.id" :value="i.id">
              {{ i.referencia }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Item da Negociação *</label>
        <select
          v-model="model.negociacao_item"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          required
        >
          <option value="">Selecione</option>
          <option v-for="n in negociacoesFiltradas" :key="n.id" :value="n.id">
            {{ getNegociacaoItemLabel(n) }}
          </option>
        </select>
        <p v-if="!negociacoesFiltradas.length" class="text-xs text-muted-foreground mt-1">
          Nenhum item disponível com este filtro.
        </p>
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
          :value="valorFormatado"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          required
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          @keydown="handleValorKeydown"
          @input="handleValorInput"
        />
      </div>

      <div>
        <label class="text-xs text-muted-foreground block mb-1">Data Pagamento *</label>
        <DatePicker v-model="model.data_pagamento" locale="en-US" />
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
import { computed, ref, watch } from 'vue'
import { DatePicker } from '@tiaohsun/vue-datepicker'
import '@tiaohsun/vue-datepicker/style'
import { formataEntradaNumerica } from '@/utils/formatacao'

const props = defineProps({
  modelValue: { type: Object, required: true },
  validationErrors: { type: Object, default: () => ({}) },
  tiposPagamento: { type: Array, default: () => [] },
  negociacoes: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const model = ref(normalizeModel(props.modelValue))

const tiposPagamento = computed(() => props.tiposPagamento || [])
const negociacoes = computed(() => props.negociacoes || [])
const valorFormatado = ref('')

const filtroCondominio = ref(null)
const filtroImovel = ref(null)

function getCondominioNome(ni) {
  return ni?.nome_do_condominio
    ?? ni?.negociacao?.imovel?.condominio?.nome
    ?? ni?.negociacao?.imovel?.condominio?.nome_abreviado
    ?? null
}

function getImovelReferencia(ni) {
  return ni?.referencia_imovel ?? ni?.negociacao?.imovel?.referencia ?? null
}

const condominiosDisponiveis = computed(() => {
  const map = new Map()
  for (const ni of negociacoes.value) {
    const nome = getCondominioNome(ni)
    if (!nome) continue
    if (!map.has(nome)) map.set(nome, { key: nome, label: nome })
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
})

const imoveisDisponiveis = computed(() => {
  const map = new Map()
  for (const ni of negociacoes.value) {
    const ref = getImovelReferencia(ni)
    if (!ref) continue
    if (filtroCondominio.value && getCondominioNome(ni) !== filtroCondominio.value) continue
    if (!map.has(ref)) map.set(ref, { id: ref, referencia: ref })
  }
  return Array.from(map.values()).sort((a, b) =>
    String(a.referencia ?? '').localeCompare(String(b.referencia ?? ''))
  )
})

const negociacoesFiltradas = computed(() => {
  const selectedId = model.value?.negociacao_item
  return negociacoes.value.filter((ni) => {
    if (selectedId != null && String(ni.id) === String(selectedId)) return true
    if (filtroCondominio.value && getCondominioNome(ni) !== filtroCondominio.value) return false
    if (filtroImovel.value && getImovelReferencia(ni) !== filtroImovel.value) return false
    return true
  })
})

watch(filtroCondominio, (cond) => {
  if (cond == null) {
    filtroImovel.value = null
    return
  }
  if (filtroImovel.value && !imoveisDisponiveis.value.some((i) => i.id === filtroImovel.value)) {
    filtroImovel.value = null
  }
})

watch(
  () => props.modelValue?.valor,
  (valor) => {
    valorFormatado.value = formataEntradaNumerica(valor)
  },
  { immediate: true }
)

function handleValorKeydown(event) {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'Enter'
  ]

  if (
    allowedKeys.includes(event.key) ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return
  }

  if (!/[\d,]/.test(event.key)) {
    event.preventDefault()
    return
  }

  if (!/^\d$/.test(event.key)) {
    return
  }

  const input = event.target
  const valorAtual = String(input.value || '')
  const virgulaIndex = valorAtual.indexOf(',')

  if (virgulaIndex === -1) {
    return
  }

  const posicaoCursor = input.selectionStart ?? valorAtual.length

  if (posicaoCursor <= virgulaIndex) {
    return
  }

  const decimaisAtuais = valorAtual.slice(virgulaIndex + 1).replace(/\D/g, '')
  const selecaoIniciaNaParteDecimal = (input.selectionStart ?? 0) > virgulaIndex
  const selecaoTerminaNaParteDecimal = (input.selectionEnd ?? 0) > virgulaIndex
  const estaEditandoDecimal = selecaoIniciaNaParteDecimal || selecaoTerminaNaParteDecimal

  if (estaEditandoDecimal && decimaisAtuais.length >= 3 && input.selectionStart === input.selectionEnd) {
    event.preventDefault()
  }
}

function handleValorInput(event) {
  const input = event.target
  const valor = input.value
    .replace(/ /g, '')
    .replace(/[^\d,]/g, '')

  const parts = valor.split(',')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  let formattedValue = integerPart
  if (parts.length === 2) {
    const decimalPart = parts[1].substring(0, 3)
    formattedValue += `,${decimalPart}`
  }

  input.value = formattedValue
  valorFormatado.value = formattedValue
  model.value.valor = formattedValue
}

function normalizeModel(source) {
  const normalized = { ...(source || {}) }
  normalized.data_pagamento = normalizeDateOnly(normalized.data_pagamento)
  return normalized
}

function normalizeDateOnly(value) {
  if (!value) return ''

  const text = String(value).trim()
  const datePart = text.split('T')[0]

  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart
  }

  return datePart.slice(0, 10)
}

let suppressModelSync = false

watch(
  () => props.modelValue,
  (v) => {
    if (suppressModelSync) {
      suppressModelSync = false
      return
    }
    model.value = normalizeModel(v)
  }
)

watch(
  model,
  (v) => {
    suppressModelSync = true
    emit('update:modelValue', v)
  },
  { deep: true }
)

function getNegociacaoItemLabel(ni) {
  if (!ni) return '-'

  const neg = ni?.negociacao ?? null
  const numero = ni?.numero ?? neg?.numero ?? null
  const imovelRef = getImovelReferencia(ni)

  const entidadeSource = neg?.entidadePrincipal ?? neg?.entidade_principal ?? ni?.entidadePrincipal ?? null
  const entidadeNome = ni?.nome_entidade
    ?? (Array.isArray(entidadeSource)
      ? entidadeSource[0]?.nome
      : entidadeSource?.nome)
    ?? null
  const numEntidade = ni?.num_entidade
    ?? (Array.isArray(entidadeSource)
      ? entidadeSource[0]?.num_entidade
      : entidadeSource?.num_entidade)
    ?? null
  const entidadeLabel = entidadeNome && numEntidade
    ? `${entidadeNome} (Nº ${numEntidade})`
    : (entidadeNome || (numEntidade ? `Nº ${numEntidade}` : null))

  const itemInner = ni?.item ?? null
  const nomeItem = ni?.nome_item
    ?? (itemInner?.codigo && itemInner?.nome
      ? `${itemInner.codigo} - ${itemInner.nome}`
      : (itemInner?.nome || itemInner?.codigo))
    ?? null

  const partes = [
    numero ? `Nº ${numero}` : null,
    imovelRef,
    entidadeLabel,
    nomeItem
  ].filter(Boolean)

  return partes.length ? partes.join(' · ') : `Item #${ni?.id ?? '-'}`
}
</script>
