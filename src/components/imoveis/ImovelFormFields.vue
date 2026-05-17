<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Condominio -->
    <div>
      <label class="text-sm font-medium mb-1 block">Condomínio *</label>
      <select
        v-model.number="formData.condominio"
        required
        :class="fieldClass('condominio')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione um condomínio...</option>
        <option v-for="c in condominios" :key="c.id" :value="c.id">
          {{ c.nome ?? c.label ?? c.id }}
        </option>
      </select>
      <p v-if="validationErrors.condominio" class="text-xs text-red-600 mt-1">
        {{ validationErrors.condominio[0] }}
      </p>
      <div v-if="loadingCondominios" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

   

        <!-- Modelo -->
   

    <!-- Tipologia -->
    <div>
      <label class="text-sm font-medium mb-1 block">Tipologia *</label>
      <select
        v-model.number="formData.tipologia"
        required
        :class="fieldClass('tipologia')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione a tipologia...</option>
        <option v-for="t in tipologias" :key="t.id" :value="t.id">
          {{ t.nome ?? t.label ?? t.id }}
        </option>
      </select>
      <p v-if="validationErrors.tipologia" class="text-xs text-red-600 mt-1">{{ validationErrors.tipologia[0] }}</p>
      <div v-if="loadingTipologias" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

    <!-- Tipo Imóvel -->
    <div>
      <label class="text-sm font-medium mb-1 block">Tipo de Imóvel *</label>
      <select
        v-model.number="formData.tipo_imovel"
        required
        :class="fieldClass('tipo_imovel')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione o tipo de imóvel...</option>
        <option v-for="t in tiposImoveis" :key="t.id" :value="t.id">
          {{ t.nome ?? t.label ?? t.id }}
        </option>
      </select>
      <p v-if="validationErrors.tipo_imovel" class="text-xs text-red-600 mt-1">{{ validationErrors.tipo_imovel[0] }}</p>
      <div v-if="loadingTiposImoveis" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>


    
    <!-- Tipo de Lote -->
    <div>
      <label class="text-sm font-medium mb-1 block">Tipo de Lote </label>
      <select
        v-model.number="formData.tipo_lote"
        :class="fieldClass('tipo_lote')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione o tipo de lote...</option>
        <option v-for="t in tiposLotes" :key="t.id" :value="t.id">
          {{ t.nome ?? t.label ?? t.id }}
        </option>
      </select>
      <p v-if="validationErrors.tipo_lote" class="text-xs text-red-600 mt-1">{{ validationErrors.tipo_lote[0] }}</p>
      <div v-if="loadingTiposLotes" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

     <div>
      <label class="text-sm font-medium mb-1 block">Modelo</label>
      <select
        v-model.number="formData.modelo"
        
        :class="fieldClass('modelo')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione o modelo...</option>
        <option v-for="mo in modelos" :key="mo.id" :value="mo.id">
          {{ mo.nome ?? mo.label ?? mo.id }}
        </option>
      </select>
      <p v-if="validationErrors.modelo" class="text-xs text-red-600 mt-1">{{ validationErrors.modelo[0] }}</p>
      <div v-if="loadingModelos" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

     <div>
      <label class="text-sm font-medium mb-1 block">Moeda </label>
      <select
        v-model.number="formData.moeda"
        :class="fieldClass('moeda')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione a moeda...</option>
        <option v-for="m in moedas" :key="m.id" :value="m.id">
          {{ m.nome ?? m.label ?? m.id }}
        </option>
      </select>
      <p v-if="validationErrors.moeda" class="text-xs text-red-600 mt-1">{{ validationErrors.moeda[0] }}</p>
      <div v-if="loadingMoedas" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

     <!-- Quadra -->
    <div>
      <label class="text-sm font-medium mb-1 block">Quadra </label>
      <input
        v-model="formData.quadra"
        type="text"
        
        :class="fieldClass('quadra')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.quadra" class="text-xs text-red-600 mt-1">{{ validationErrors.quadra[0] }}</p>
    </div>

    <!-- Lote -->
    <div>
      <label class="text-sm font-medium mb-1 block">Lote </label>
      <input
        v-model="formData.lote"
        type="text"
        :class="fieldClass('lote')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.lote" class="text-xs text-red-600 mt-1">{{ validationErrors.lote[0] }}</p>
    </div>


    <!-- Placa -->
    <div>
      <label class="text-sm font-medium mb-1 block">Placa</label>
      <input
        v-model="formData.placa"
        type="text"
        :class="fieldClass('placa')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.placa" class="text-xs text-red-600 mt-1">{{ validationErrors.placa[0] }}</p>
    </div>

    <!-- Área do Lote -->
    <div>
      <label class="text-sm font-medium mb-1 block">Área do Lote (m²)</label>
      <input
        v-model.number="formData.area_lote"
        type="number"
        step="0.01"
        min="0"
        :class="fieldClass('area_lote')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.area_lote" class="text-xs text-red-600 mt-1">{{ validationErrors.area_lote[0] }}</p>
    </div>

    <!-- Moeda -->
   

    <!-- Valor Obra -->
    <div>
      <label class="text-sm font-medium mb-1 block">Valor da Obra</label>
      <input
        v-model.number="formData.valor_obra"
        type="number"
        step="0.01"
        min="0"
        :class="fieldClass('valor_obra')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.valor_obra" class="text-xs text-red-600 mt-1">{{ validationErrors.valor_obra[0] }}</p>
    </div>

    <!-- Data entrega -->
    <div>
      <label class="text-sm font-medium mb-1 block">Data de Entrega</label>
      <input
        v-model="formData.data_entrega"
        type="date"
        :class="fieldClass('data_entrega')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.data_entrega" class="text-xs text-red-600 mt-1">{{ validationErrors.data_entrega[0] }}</p>
    </div>

    <!-- Data prevista -->
    <div>
      <label class="text-sm font-medium mb-1 block">Data Prevista Conclusão</label>
      <input
        v-model="formData.data_prevista_conclusao"
        type="date"
        :class="fieldClass('data_prevista_conclusao')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.data_prevista_conclusao" class="text-xs text-red-600 mt-1">{{ validationErrors.data_prevista_conclusao[0] }}</p>
    </div>

    <!-- Prazo -->
    <div>
      <label class="text-sm font-medium mb-1 block">Prazo de Entrega</label>
      <input
        v-model="formData.prazo_entrega"
        type="text"
        placeholder="Ex: 90"
        :class="fieldClass('prazo_entrega')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.prazo_entrega" class="text-xs text-red-600 mt-1">{{ validationErrors.prazo_entrega[0] }}</p>
    </div>

    <!-- Latitude -->
    <div>
      <label class="text-sm font-medium mb-1 block">Latitude</label>
      <input
        v-model.number="formData.latitude"
        type="number"
        step="any"
        :class="fieldClass('latitude')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.latitude" class="text-xs text-red-600 mt-1">{{ validationErrors.latitude[0] }}</p>
    </div>

    <!-- Longitude -->
    <div>
      <label class="text-sm font-medium mb-1 block">Longitude</label>
      <input
        v-model.number="formData.longitude"
        type="number"
        step="any"
        :class="fieldClass('longitude')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.longitude" class="text-xs text-red-600 mt-1">{{ validationErrors.longitude[0] }}</p>
    </div>

    <!-- Altitude -->
    <div>
      <label class="text-sm font-medium mb-1 block">Altitude</label>
      <input
        v-model.number="formData.altitude"
        type="number"
        step="0.01"
        :class="fieldClass('altitude')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.altitude" class="text-xs text-red-600 mt-1">{{ validationErrors.altitude[0] }}</p>
    </div>


    <div v-if="props.mode !== 'edit'">
      <label class="text-sm font-medium mb-1 block">Quantidade</label>
      <input
        v-model.number="formData.quantidade"
        type="number"
        step="1"
        :class="fieldClass('quantidade')"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p v-if="validationErrors.quantidade" class="text-xs text-red-600 mt-1">{{ validationErrors.quantidade[0] }}</p>
    </div>

    <!-- Flags -->
    <div class="col-span-full flex flex-wrap gap-6 pt-1">
      <label class="flex items-center gap-2">
        <input v-model="formData.entregue" type="checkbox" class="rounded border-input" />
        <span class="text-sm">Entregue</span>
      </label>
      <label class="flex items-center gap-2">
        <input v-model="formData.concluido" type="checkbox" class="rounded border-input" />
        <span class="text-sm">Concluído</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import condominioService from '@/services/condominioService'
import modeloService from '@/services/modeloService'
import tipologiaService from '@/services/tipologiaService'
import tipoImovelService from '@/services/tipoImovelService'
import tipoLoteService from '@/services/tipoLoteService'
import moedaService from '@/services/moedaService'

const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'create' }
})

const formData = defineModel({ type: Object, required: true })

function fieldClass(name) {
  return props.validationErrors[name] ? 'border-red-500' : ''
}

function parseItems(res) {
  return res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
}

const condominios = ref([])
const modelos = ref([])
const tipologias = ref([])
const tiposImoveis = ref([])
const tiposLotes = ref([])
const moedas = ref([])

const loadingCondominios = ref(false)
const loadingModelos = ref(false)
const loadingTipologias = ref(false)
const loadingTiposImoveis = ref(false)
const loadingTiposLotes = ref(false)
const loadingMoedas = ref(false)

async function loadCondominios() {
  loadingCondominios.value = true
  try {
    const res = await condominioService.listar()
    condominios.value = parseItems(res)
  } finally {
    loadingCondominios.value = false
  }
}

async function loadTipologias() {
  loadingTipologias.value = true
  try {
    const res = await tipologiaService.listar()
    tipologias.value = parseItems(res)
  } finally {
    loadingTipologias.value = false
  }
}

async function loadTiposImoveis() {
  loadingTiposImoveis.value = true
  try {
    const res = await tipoImovelService.listar()
    tiposImoveis.value = parseItems(res)
  } finally {
    loadingTiposImoveis.value = false
  }
}

async function loadTiposLotes() {
  loadingTiposLotes.value = true
  try {
    const res = await tipoLoteService.listar()
    tiposLotes.value = parseItems(res)
  } finally {
    loadingTiposLotes.value = false
  }
}

async function loadMoedas() {
  loadingMoedas.value = true
  try {
    const res = await moedaService.listar()
    moedas.value = parseItems(res)
  } finally {
    loadingMoedas.value = false
  }
}

async function loadModelos() {
  loadingModelos.value = true
  try {
    const res = await modeloService.listar()
    modelos.value = parseItems(res)
  } finally {
    loadingModelos.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadCondominios(),
    loadTipologias(),
    loadTiposImoveis(),
    loadTiposLotes(),
    loadMoedas(),
    loadModelos(),
  ])
})
</script>
