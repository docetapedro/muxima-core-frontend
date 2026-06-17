<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
  >
    <div
      class="modal-surface w-full max-w-4xl border border-zinc-300 rounded-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
      style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;"
    >
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold">
          {{ isEdit ? 'Editar negociação' : 'Nova negociação' }}
        </h3>
      </div>

      <div
        v-if="isEdit && editIsLocked"
        class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800"
      >
        Esta negociação está {{ estadoLabel(record?.estado).toLowerCase() }}. Só é possível editar Nº Contrato, Estado e Data de entrega.
      </div>

      <form class="space-y-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-3">
            <label class="text-xs text-foreground block mb-1">Imóvel *</label>

            <input
              v-model="imovelSearch"
              type="text"
              :disabled="isEdit"
              placeholder="Filtrar por referência ou condomínio..."
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <select
              v-model="form.imovel_id"
              :disabled="isEdit"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option :value="null">Selecione</option>
              <option v-for="i in filteredImoveis" :key="i.id" :value="i.id">
                {{ getImovelLabel(i) }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Nº Contrato</label>
            <input
              v-model="form.numero"
              type="text"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Estado</label>
            <select
              v-model="form.estado"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
              required
            >
              <option value="">Selecione</option>
              <option value="RA">Rascunho</option>
              <option v-if="isEdit" value="RE">Reservado</option>
              <option v-if="isEdit" value="CO">Concluído</option>
              <option v-if="isEdit" value="CA">Cancelado</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Papel</label>
            <select
              v-model="form.papel"
              :disabled="editIsLocked"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              required
            >
              <option value="TI">TI - Titular</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="text-xs text-foreground block mb-1">Entidade (filtrar)</label>

            <input
              v-model="entidadeSearch"
              type="text"
              :disabled="editIsLocked"
              placeholder="Filtrar pelo Nº Entidade, Nº BI, NIF ou Nome..."
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <select
              v-model="form.entidade_id"
              :disabled="editIsLocked"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option :value="null">Selecione</option>
              <option v-for="e in filteredEntidades" :key="e.id" :value="e.id">
                {{ e.nome ?? '-' }} · {{ e.num_entidade ?? '-' }} · BI: {{ e.num_bi ?? '-' }} · NIF: {{ e.nif ?? e.NIF ?? '-' }}
              </option>
            </select>
          </div>

          <div class="md:col-span-3 border border-border rounded-md p-3 bg-muted/5 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div>
                <label class="text-sm font-semibold">Itens da negociação *</label>
                <p class="text-xs text-muted-foreground">O item Imóvel (IM) é obrigatório. Pode adicionar mais itens com valor, prestações, periodicidade e desconto próprios.</p>
              </div>
              <button
                type="button"
                class="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="editIsLocked || !availableItemsFor(rows, -1).length"
                @click="addNegotiationItem(rows)"
              >
                + Adicionar item
              </button>
            </div>

            <div
              v-if="!rows.length"
              class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-4 text-center"
            >
              A carregar itens...
            </div>

            <div
              v-for="(row, idx) in rows"
              :key="row._key"
              class="border border-border rounded-md p-3 space-y-2 bg-background"
              :class="row._locked ? 'ring-1 ring-primary/30' : ''"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs text-muted-foreground">
                  Item #{{ idx + 1 }}<span v-if="row._locked"> · Obrigatório</span>
                </span>
                <button
                  v-if="!row._locked"
                  type="button"
                  class="text-xs text-red-600 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                  :disabled="editIsLocked"
                  @click="removeNegotiationItem(rows, idx)"
                >
                  Remover
                </button>
              </div>

              <div>
                <label class="text-xs text-muted-foreground block mb-1">Item *</label>
                <div v-if="row._locked" class="px-3 py-2 rounded-md border border-input bg-muted text-sm font-medium">
                  {{ itemRowLabel(row) }}
                </div>
                <select
                  v-else
                  v-model="row.item_id"
                  :disabled="editIsLocked"
                  required
                  class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione</option>
                  <option v-for="opt in availableItemsFor(rows, idx)" :key="opt.id" :value="opt.id">
                    {{ itemLabel(opt) }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-12 gap-2">
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Valor *</label>
                  <input
                    :value="row.valor"
                    type="text"
                    inputmode="decimal"
                    required
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @keydown="handleMoneyKeydown"
                    @input="handleItemMoneyInput(row, 'valor', $event)"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Desconto</label>
                  <input
                    :value="row.desconto"
                    type="text"
                    inputmode="decimal"
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @keydown="handleMoneyKeydown"
                    @input="handleItemMoneyInput(row, 'desconto', $event)"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Nº Prest. *</label>
                  <input
                    v-model="row.num_prestacoes"
                    type="number"
                    min="0"
                    required
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Periodicidade *</label>
                  <select
                    v-model="row.periodicidade"
                    required
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">-</option>
                    <option value="M">M - Mensal</option>
                    <option value="T">T - Trimestral</option>
                    <option value="B">B - Bimestral</option>
                    <option value="S">S - Semestral</option>
                    <option value="A">A - Anual</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Prestação *</label>
                  <input
                    :value="row.prestacao"
                    type="text"
                    inputmode="decimal"
                    required
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @keydown="handleMoneyKeydown"
                    @input="handleItemMoneyInput(row, 'prestacao', $event)"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs text-muted-foreground block mb-1">Down Payment</label>
                  <input
                    :value="row.down_payment"
                    type="text"
                    inputmode="decimal"
                    :disabled="editIsLocked"
                    class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @keydown="handleMoneyKeydown"
                    @input="handleItemMoneyInput(row, 'down_payment', $event)"
                  />
                </div>
              </div>
            </div>

            <p v-if="rows.length" class="text-xs text-muted-foreground">
              Total venda (soma de Valor − Desconto):
              <span class="font-medium text-foreground">{{ converteParaMonetario(computeNegotiationTotal(rows)) }}</span>
            </p>
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Modelo de entrega *</label>
            <select
              v-model="form.modelo_entrega_id"
              :disabled="editIsLocked"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option :value="null">Selecione</option>
              <option v-for="m in modeloEntregas" :key="m.id" :value="m.id">
                {{ m.codigo ? `${m.codigo} - ${m.nome}` : m.nome }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Data contrato *</label>
            <div
              class="negociacao-datepicker-shell"
              data-vdt-mode="light"
              :class="editIsLocked ? 'opacity-60 pointer-events-none' : ''"
            >
              <DatePicker v-model="form.data_contrato" :disabled="editIsLocked" locale="en-US" mode="light" theme="neutral" />
            </div>
          </div>

          <div>
            <label class="text-xs text-foreground block mb-1">Data entrega</label>
            <div class="negociacao-datepicker-shell" data-vdt-mode="light">
              <DatePicker v-model="form.data_entrega" locale="en-US" mode="light" theme="neutral" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <span v-else class="text-sm text-muted-foreground"></span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 text-sm"
              :disabled="loading"
              @click="close"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 text-sm font-medium"
              :disabled="loading"
            >
              <span v-if="loading">A guardar...</span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { DatePicker } from '@tiaohsun/vue-datepicker'
import '@tiaohsun/vue-datepicker/style'
import { toast } from 'vue-sonner'
import http from '@/api/http'
import negociacaoService from '@/services/negociacaoService'
import { converteParaMonetario, formataEntradaNumerica } from '@/utils/formatacao'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  record: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const { handleApiError } = useApiErrorHandler()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isEdit = computed(() => props.mode === 'edit')

const editIsLocked = computed(() => {
  if (!isEdit.value) return false
  const estado = String(props.record?.estado ?? '').toUpperCase()
  return estado === 'RE' || estado === 'CO'
})

const loading = ref(false)
const error = ref('')

const form = ref(emptyForm())
const rows = ref([])

const imoveis = ref([])
const entidades = ref([])
const items = ref([])
const moedas = ref([])
const modeloEntregas = ref([])

const imovelSearch = ref('')
const entidadeSearch = ref('')

function emptyForm() {
  return {
    imovel_id: null,
    numero: '',
    estado: '',
    modelo_entrega_id: null,
    data_contrato: '',
    data_entrega: '',
    observacao: '',
    activo: true,
    entidade_id: null,
    papel: 'TI'
  }
}

const aoaMoedaId = computed(() => {
  const aoa = moedas.value.find((m) => {
    const sigla = String(m?.sigla ?? m?.codigo ?? m?.nome ?? '').trim().toUpperCase()
    return sigla === 'AOA' || sigla.includes('KWANZA')
  })
  return aoa?.id ?? null
})

const imItem = computed(() => {
  const list = items.value || []
  const byCode = list.find((i) => {
    const codes = [i?.codigo, i?.sigla, i?.code, i?.abreviatura]
      .map((c) => String(c ?? '').trim().toUpperCase())
    return codes.includes('IM')
  })
  if (byCode) return byCode

  const byName = list.find((i) => {
    const nome = String(i?.nome ?? i?.descricao ?? i?.label ?? '').trim().toLowerCase()
    return nome === 'imóvel' || nome === 'imovel' || nome.startsWith('imóvel') || nome.startsWith('imovel')
  })
  return byName || null
})

const filteredImoveis = computed(() => {
  const q = (imovelSearch.value || '').trim().toLowerCase()
  const list = imoveis.value

  const selectedId = form.value?.imovel_id

  if (!q) return list

  const matches = list.filter((i) => {
    const ref = String(i?.referencia ?? '').toLowerCase()
    const cond = String(i?.condominio?.nome ?? i?.condominio?.nome_abreviado ?? '').toLowerCase()
    return ref.includes(q) || cond.includes(q)
  })

  if (selectedId && !matches.some((i) => String(i.id) === String(selectedId))) {
    const selected = list.find((i) => String(i.id) === String(selectedId))
    if (selected) matches.unshift(selected)
  }
  return matches
})

const filteredEntidades = computed(() => {
  const q = (entidadeSearch.value || '').trim().toLowerCase()
  const list = entidades.value
  const selectedId = form.value?.entidade_id

  if (!q) return list

  const matches = list.filter((e) => {
    const numEnt = String(e.num_entidade ?? e.numEntidade ?? '').toLowerCase()
    const numBi = String(e.num_bi ?? '').toLowerCase()
    const nif = String(e.nif ?? e.NIF ?? '').toLowerCase()
    const nome = String(e.nome ?? '').toLowerCase()
    return numEnt.includes(q) || numBi.includes(q) || nif.includes(q) || nome.includes(q)
  })

  if (selectedId && !matches.some((e) => String(e.id) === String(selectedId))) {
    const selected = list.find((e) => String(e.id) === String(selectedId))
    if (selected) matches.unshift(selected)
  }
  return matches
})

function getImovelLabel(i) {
  const ref = i?.referencia ?? '-'
  const cond = i?.condominio?.nome ?? i?.condominio?.nome_abreviado
  const tipo = i?.tipoImovel?.nome
  const tipologia = i?.tipologia?.nome
  const partes = [ref, cond, tipo && tipologia ? `${tipo} · ${tipologia}` : (tipo || tipologia)]
  return partes.filter(Boolean).join(' · ')
}

function estadoLabel(estado) {
  const map = { RA: 'Rascunho', RE: 'Reservado', CO: 'Concluído', CA: 'Cancelado' }
  if (!estado) return '-'
  return map[estado] || estado
}

function emptyNegotiationItem() {
  return {
    _key: `row-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
    item_id: '',
    valor: '',
    desconto: '',
    num_prestacoes: null,
    periodicidade: '',
    prestacao: '',
    down_payment: ''
  }
}

function addNegotiationItem(target) { target.push(emptyNegotiationItem()) }
function removeNegotiationItem(target, idx) { target.splice(idx, 1) }

function availableItemsFor(target, currentIdx) {
  const selectedIds = target
    .map((r, i) => (i === currentIdx ? null : r.item_id))
    .filter((id) => id !== null && id !== undefined && id !== '')
    .map(String)
  return items.value.filter((opt) => !selectedIds.includes(String(opt.id)))
}

function itemLabel(opt) {
  return opt?.nome || opt?.descricao || opt?.codigo || opt?.label || `Item #${opt?.id ?? '-'}`
}

function itemRowLabel(row) {
  if (row?.item) return itemLabel(row.item)
  const opt = items.value.find((o) => String(o.id) === String(row?.item_id))
  if (opt) return itemLabel(opt)
  return `Item #${row?.item_id ?? '-'}`
}

const allowedMoneyKeys = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Enter']

function handleMoneyKeydown(event) {
  if (allowedMoneyKeys.includes(event.key) || event.ctrlKey || event.metaKey) return
  if (!/[\d,]/.test(event.key)) event.preventDefault()
}

function handleItemMoneyInput(row, field, event) {
  const input = event.target
  const rawValue = String(input.value || '').replace(/[^\d,]/g, '')
  const formattedValue = formataEntradaNumerica(rawValue)
  input.value = formattedValue
  row[field] = formattedValue
}

function parseMoneyValue(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value).replace(/\s/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function computeNegotiationTotal(target) {
  return target.reduce((acc, r) => acc + (parseMoneyValue(r.valor) - parseMoneyValue(r.desconto)), 0)
}

function validateNegotiationItems(target) {
  if (!target.length) return 'Adicione pelo menos um item à negociação.'
  if (imItem.value) {
    const hasIm = target.some((r) => String(r.item_id) === String(imItem.value.id))
    if (!hasIm) return 'O item Imóvel (IM) é obrigatório em todas as negociações.'
  }
  const seen = new Set()
  for (const r of target) {
    if (!r.item_id) return 'Selecione o item em todas as linhas.'
    const key = String(r.item_id)
    if (seen.has(key)) return 'Não é permitido repetir o mesmo item na mesma negociação.'
    seen.add(key)
  }
  return null
}

function getPivotPrincipal(neg) {
  const candidates = [
    neg?.entidade_principal,
    neg?.entidadePrincipal,
    neg?.negociacao_entidades,
    neg?.negociacaoEntidades,
    neg?.entidades
  ]

  const isPrincipal = (entry) => {
    const flag = entry?.pivot?.principal ?? entry?.principal
    return flag === true || flag === 1 || String(flag) === '1'
  }

  for (const c of candidates) {
    if (!c) continue
    if (Array.isArray(c)) {
      if (!c.length) continue
      return c.find(isPrincipal) || c[0]
    }
    return c
  }
  return null
}

function resolveNegotiationEntidadeId(neg) {
  const entry = getPivotPrincipal(neg)
  if (!entry) return neg?.entidade_id ?? neg?.entidade?.id ?? null
  return (
    entry?.pivot?.entidade_id ??
    entry?.entidade_id ??
    entry?.entidade?.id ??
    entry?.id ??
    neg?.entidade_id ??
    neg?.entidade?.id ??
    null
  )
}

function resolveNegotiationPapel(neg) {
  const entry = getPivotPrincipal(neg)
  return entry?.pivot?.papel ?? entry?.papel ?? neg?.papel ?? 'TI'
}

function resolveModeloEntregaId(neg) {
  const candidates = [
    neg?.modeloEntrega,
    neg?.modelo_entrega,
    neg?.modelo_entrega_id,
    neg?.modeloEntregaId
  ]
  for (const c of candidates) {
    if (c == null || c === '') continue
    if (typeof c === 'object') {
      const id = c?.id ?? c?.value
      if (id != null && id !== '') return id
      continue
    }
    return c
  }
  return null
}

function negotiationItemsFromRecord(neg) {
  if (!neg) return []
  const itemLookup = {}
  const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []
  plano.forEach((p) => {
    const ni = p?.negociacaoItem ?? p?.negociacao_item ?? null
    if (ni?.id != null && ni?.item) itemLookup[String(ni.id)] = ni.item
  })

  const source =
    neg?.itens ??
    neg?.negociacaoItens ??
    neg?.negociacao_itens ??
    neg?.negociacaoItems ??
    neg?.negociacao_items ??
    []

  if (!Array.isArray(source) || !source.length) return []

  return source.map((it) => {
    const resolvedItem = it.item ?? itemLookup[String(it.id)] ?? null
    return {
      _key: `row-${it.id ?? Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
      item_id: it.item_id ?? it.item?.id ?? resolvedItem?.id ?? '',
      item: resolvedItem,
      valor: it.valor != null && it.valor !== '' ? formataEntradaNumerica(it.valor) : '',
      desconto: it.desconto != null && it.desconto !== '' ? formataEntradaNumerica(it.desconto) : '',
      num_prestacoes: it.num_prestacoes ?? null,
      periodicidade: it.periodicidade ?? '',
      prestacao: it.prestacao != null && it.prestacao !== '' ? formataEntradaNumerica(it.prestacao) : '',
      down_payment: it.down_payment != null && it.down_payment !== '' ? formataEntradaNumerica(it.down_payment) : '',
      saldo_acumulado: it.saldo_acumulado != null && it.saldo_acumulado !== '' ? formataEntradaNumerica(it.saldo_acumulado) : ''
    }
  })
}

function normalizeNegotiationPayload() {
  const itens = rows.value.map((r) => ({
    item_id: r.item_id,
    item: r.item_id,
    valor: parseMoneyValue(r.valor),
    desconto: parseMoneyValue(r.desconto),
    num_prestacoes: r.num_prestacoes != null && r.num_prestacoes !== '' ? Number(r.num_prestacoes) : null,
    periodicidade: r.periodicidade || null,
    prestacao: parseMoneyValue(r.prestacao),
    down_payment: parseMoneyValue(r.down_payment)
  }))

  const totalDownPayment = itens.reduce((acc, it) => acc + (it.down_payment || 0), 0)

  return {
    imovel: form.value.imovel_id,
    numero: form.value.numero,
    estado: form.value.estado,
    moeda: aoaMoedaId.value,
    modelo_entrega: form.value.modelo_entrega_id,
    valor_venda: computeNegotiationTotal(rows.value),
    downpayment: totalDownPayment,
    data_contrato: form.value.data_contrato || null,
    data_entrega: form.value.data_entrega || null,
    observacao: form.value.observacao,
    activo: form.value.activo,
    entidade: form.value.entidade_id,
    papel: form.value.papel,
    itens
  }
}

async function loadOptions() {
  const tasks = []

  if (!imoveis.value.length) {
    tasks.push(
      http.get('/api/imoveis', { params: { per_page: 1000 } })
        .then((res) => {
          const dados = res?.data?.dados
          imoveis.value = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        })
        .catch(() => { imoveis.value = [] })
    )
  }

  if (!entidades.value.length) {
    tasks.push(
      http.get('/api/entidades')
        .then((res) => {
          const dados = res?.data?.dados
          entidades.value = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        })
        .catch(() => { entidades.value = [] })
    )
  }

  if (!items.value.length) {
    tasks.push(
      http.get('/api/items')
        .then((res) => {
          const dados = res?.data?.dados
          items.value = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        })
        .catch(() => { items.value = [] })
    )
  }

  if (!moedas.value.length) {
    tasks.push(
      http.get('/api/moedas')
        .then((res) => {
          const dados = res?.data?.dados
          moedas.value = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        })
        .catch(() => { moedas.value = [] })
    )
  }

  if (!modeloEntregas.value.length) {
    tasks.push(
      http.get('/api/modelo-entregas', { params: { per_page: 1000 } })
        .then((res) => {
          const dados = res?.data?.dados
          modeloEntregas.value = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        })
        .catch(() => { modeloEntregas.value = [] })
    )
  }

  await Promise.all(tasks)
}

function resetForCreate() {
  form.value = { ...emptyForm(), estado: 'RA', papel: 'TI' }
  rows.value = imItem.value
    ? [{ ...emptyNegotiationItem(), item_id: imItem.value.id, _locked: true }]
    : []
  error.value = ''
  imovelSearch.value = ''
  entidadeSearch.value = ''
}

function loadForEdit(neg) {
  if (!neg) {
    resetForCreate()
    return
  }

  form.value = {
    imovel_id: neg?.imovel?.id ?? neg?.imovel_id ?? null,
    numero: neg?.numero ?? '',
    estado: neg?.estado ?? '',
    modelo_entrega_id: resolveModeloEntregaId(neg),
    data_contrato: neg?.data_contrato ?? '',
    data_entrega: neg?.data_entrega ?? '',
    observacao: neg?.observacao ?? '',
    activo: neg?.activo ?? true,
    entidade_id: resolveNegotiationEntidadeId(neg),
    papel: resolveNegotiationPapel(neg)
  }

  const r = negotiationItemsFromRecord(neg)
  if (imItem.value) {
    const imIdx = r.findIndex((row) => String(row.item_id) === String(imItem.value.id))
    if (imIdx === -1) {
      r.unshift({ ...emptyNegotiationItem(), item_id: imItem.value.id, _locked: true })
    } else {
      const [imRow] = r.splice(imIdx, 1)
      imRow._locked = true
      r.unshift(imRow)
    }
  }
  rows.value = r

  error.value = ''
  imovelSearch.value = ''
  entidadeSearch.value = ''
}

watch(visible, async (open) => {
  if (!open) return
  await loadOptions()
  if (isEdit.value) {
    loadForEdit(props.record)
  } else {
    resetForCreate()
  }
})

watch(() => props.record, (neg) => {
  if (!visible.value || !isEdit.value) return
  loadForEdit(neg)
})

function close() {
  if (loading.value) return
  visible.value = false
}

async function submit() {
  const itemErr = validateNegotiationItems(rows.value)
  if (itemErr) {
    error.value = itemErr
    toast.error(itemErr)
    return
  }

  if (!form.value.imovel_id) {
    error.value = 'Seleccione um imóvel.'
    toast.error(error.value)
    return
  }

  if (!form.value.modelo_entrega_id) {
    error.value = 'Seleccione o modelo de entrega.'
    toast.error(error.value)
    return
  }

  loading.value = true
  error.value = ''

  try {
    const payload = normalizeNegotiationPayload()
    const res = isEdit.value
      ? await negociacaoService.atualizar(props.record.id, payload)
      : await negociacaoService.criar(payload)

    toast.success(res?.data?.message || (isEdit.value ? 'Negociação atualizada com sucesso.' : 'Negociação criada com sucesso.'))
    emit('success')
    visible.value = false
  } catch (e) {
    console.error(e)
    error.value = handleApiError(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-surface {
  color-scheme: light;
  color: #000;
}

.modal-surface :deep(*) { color: #000 !important; }
.modal-surface :deep(.text-red-500),
.modal-surface :deep(.text-red-600),
.modal-surface :deep(.text-red-700),
.modal-surface :deep(.text-destructive) { color: #dc2626 !important; }
.modal-surface :deep(.text-muted-foreground) { color: #000 !important; }
.modal-surface :deep(label) { color: #000 !important; }
.modal-surface :deep(.bg-card),
.modal-surface :deep(.bg-background),
.modal-surface :deep(.border),
.modal-surface :deep(.border-border) {
  background-color: #fff !important;
  border-color: #d1d5db !important;
}
.modal-surface :deep(input),
.modal-surface :deep(select),
.modal-surface :deep(textarea) {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #d1d5db !important;
}
.modal-surface :deep(input::placeholder),
.modal-surface :deep(textarea::placeholder) { color: #6b7280 !important; }

.negociacao-datepicker-shell {
  --color-vdt-surface: #f9fafb;
  --color-vdt-surface-secondary: #f3f4f6;
  --color-vdt-surface-elevated: #ffffff;
  --color-vdt-content: #000000;
  --color-vdt-content-secondary: #111827;
  --color-vdt-content-muted: #6b7280;
  --color-vdt-outline: #d1d5db;
  --color-vdt-interactive-hover: #e5e7eb;
  --color-vdt-interactive-active: #dbe1e7;
}

.negociacao-datepicker-shell :deep(.date-picker-container) {
  background-color: #f9fafb !important;
  color: #000 !important;
}

.negociacao-datepicker-shell :deep(*) { color: inherit; }
</style>
