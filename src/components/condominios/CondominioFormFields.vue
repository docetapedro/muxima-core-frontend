<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Município *</label>

      <select
        v-model.number="formData.municipio"
        required
        :class="fieldClass('municipio')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione um município...</option>
        <option v-for="m in municipios" :key="m.id ?? m.value ?? m" :value="m.id ?? m.value ?? m">
          {{ m.nome ?? m.label ?? m.id ?? m.value ?? m }}
        </option>
      </select>

      <p v-if="validationErrors.municipio" class="text-xs text-red-600 mt-1">
        {{ validationErrors.municipio[0] }}
      </p>

      <div v-if="loadingMunicipios" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Projecto *</label>

      <select
        v-model.number="formData.projecto"
        required
        :class="fieldClass('projecto')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione um projecto...</option>
        <option v-for="p in projectos" :key="p.id ?? p.value ?? p" :value="p.id ?? p.value ?? p">
          {{ p.nome ?? p.label ?? p.id ?? p.value ?? p }}
        </option>
      </select>

      <p v-if="validationErrors.projecto" class="text-xs text-red-600 mt-1">
        {{ validationErrors.projecto[0] }}
      </p>

      <div v-if="loadingProjectos" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Moeda *</label>

      <select
        v-model.number="formData.moeda"
        required
        :class="fieldClass('moeda')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione uma moeda...</option>
        <option v-for="m in moedas" :key="m.id ?? m.value ?? m" :value="m.id ?? m.value ?? m">
          {{ m.nome ?? m.label ?? m.id ?? m.value ?? m }}
        </option>
      </select>

      <p v-if="validationErrors.moeda" class="text-xs text-red-600 mt-1">
        {{ validationErrors.moeda[0] }}
      </p>

      <div v-if="loadingMoedas" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Condomínio (Nome) *</label>
      <input
        v-model="formData.nome"
        type="text"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('nome')"
      />
      <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">{{ validationErrors.nome[0] }}</p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Nome abreviado *</label>
      <input
        v-model="formData.nome_abreviado"
        type="text"
        required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('nome_abreviado')"
      />
      <p v-if="validationErrors.nome_abreviado" class="text-xs text-red-600 mt-1">
        {{ validationErrors.nome_abreviado[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Valor global</label>
      <input
        v-model.number="formData.valor_global"
        type="number"
        step="0.01"
        min="0"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('valor_global')"
      />
      <p v-if="validationErrors.valor_global" class="text-xs text-red-600 mt-1">
        {{ validationErrors.valor_global[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Valor dólar</label>
      <input
        v-model.number="formData.valor_dolar"
        type="number"
        step="0.01"
        min="0"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('valor_dolar')"
      />
      <p v-if="validationErrors.valor_dolar" class="text-xs text-red-600 mt-1">
        {{ validationErrors.valor_dolar[0] }}
      </p>
    </div>

    <div class="col-span-full">
      <label class="text-sm font-medium mb-1 block">Descrição</label>
      <input
        v-model="formData.descricao"
        type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('descricao')"
      />
      <p v-if="validationErrors.descricao" class="text-xs text-red-600 mt-1">
        {{ validationErrors.descricao[0] }}
      </p>
    </div>

    <div class="col-span-full">
      <label class="text-sm font-medium mb-1 block">Localização</label>
      <input
        v-model="formData.localizacao"
        type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('localizacao')"
      />
      <p v-if="validationErrors.localizacao" class="text-xs text-red-600 mt-1">
        {{ validationErrors.localizacao[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Latitude</label>
      <input
        v-model.number="formData.latitude"
        type="number"
        step="1"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('latitude')"
      />
      <p v-if="validationErrors.latitude" class="text-xs text-red-600 mt-1">
        {{ validationErrors.latitude[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Longitude</label>
      <input
        v-model.number="formData.longitude"
        type="number"
        step="1"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('longitude')"
      />
      <p v-if="validationErrors.longitude" class="text-xs text-red-600 mt-1">
        {{ validationErrors.longitude[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Dimensão</label>
      <input
        v-model.number="formData.dimensao"
        type="number"
        step="0.01"
        min="0"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('dimensao')"
      />
      <p v-if="validationErrors.dimensao" class="text-xs text-red-600 mt-1">
        {{ validationErrors.dimensao[0] }}
      </p>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Data de abertura</label>
      <input
        v-model="formData.data_abertura"
        type="date"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="fieldClass('data_abertura')"
      />
      <p v-if="validationErrors.data_abertura" class="text-xs text-red-600 mt-1">
        {{ validationErrors.data_abertura[0] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import municipioService from '@/services/municipioService'
import moedaService from '@/services/moedaService'
import projectoService from '@/services/projectoService'

const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) },
})

const formData = defineModel({ type: Object, required: true })

function fieldClass(name) {
  return props.validationErrors[name] ? 'border-red-500' : ''
}

function parseItems(res) {
  return res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
}

const municipios = ref([])
const moedas = ref([])
const projectos = ref([])

const loadingMunicipios = ref(false)
const loadingMoedas = ref(false)
const loadingProjectos = ref(false)

async function loadMunicipios() {
  loadingMunicipios.value = true
  try {
    const res = await municipioService.listar()
    municipios.value = parseItems(res)
  } finally {
    loadingMunicipios.value = false
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

async function loadProjectos() {
  loadingProjectos.value = true
  try {
    const res = await projectoService.listar()
    projectos.value = parseItems(res)
  } finally {
    loadingProjectos.value = false
  }
}

onMounted(() => {
  loadMunicipios()
  loadProjectos()
  loadMoedas()
})
</script>
