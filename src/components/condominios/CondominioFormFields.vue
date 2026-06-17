<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <label class="text-sm font-medium mb-1 block">Província</label>

      <select
        v-model="formData.provincia"
        @change="onProvinciaChange"
        :class="fieldClass('provincia')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null">Todas as províncias</option>
        <option v-for="p in provinciasToShow" :key="p.id" :value="Number(p.id)">
          {{ p.nome ?? p.label ?? p.id }}
        </option>
      </select>

      <p v-if="validationErrors.provincia" class="text-xs text-red-600 mt-1">
        {{ validationErrors.provincia[0] }}
      </p>

      <div v-if="loadingProvincias" class="text-xs text-muted-foreground mt-2">
        A carregar...
      </div>
    </div>

    <div>
      <label class="text-sm font-medium mb-1 block">Município *</label>

      <select
        v-model="formData.municipio"
        required
        :class="fieldClass('municipio')"
        class="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring border-input"
      >
        <option :value="null" disabled>Selecione um município...</option>
        <option v-for="m in municipiosToShow" :key="m.id" :value="Number(m.id)">
          {{ m.nome ?? m.label ?? m.id }}
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
      <div class="condominio-datepicker-shell" data-vdt-mode="light">
        <DatePicker
          v-model="formData.data_abertura"
          locale="en-US"
          mode="light"
          theme="neutral"
          :class="fieldClass('data_abertura')"
        />
      </div>
      <p v-if="validationErrors.data_abertura" class="text-xs text-red-600 mt-1">
        {{ validationErrors.data_abertura[0] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DatePicker } from '@tiaohsun/vue-datepicker'
import '@tiaohsun/vue-datepicker/style'
import municipioService from '@/services/municipioService'
import projectoService from '@/services/projectoService'
import provinciaService from '@/services/provinciaService'
import { getCachedLookup } from '@/composables/useLookupCache'

const props = defineProps({
  validationErrors: { type: Object, default: () => ({}) },
  record: { type: Object, default: null },
})

const formData = defineModel({ type: Object, required: true })

function fieldClass(name) {
  return props.validationErrors[name] ? 'border-red-500' : ''
}

function parseItems(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && (it.id != null || it.value != null))
}

const provincias = ref([])
const municipios = ref([])
const projectos = ref([])

const loadingProvincias = ref(false)
const loadingMunicipios = ref(false)
const loadingProjectos = ref(false)
const previousVdtMode = ref('')

async function loadProvincias() {
  loadingProvincias.value = true
  try {
    provincias.value = await getCachedLookup(
      'lookup:provincias',
      async () => parseItems(await provinciaService.listar({ quantidade: 30 }))
    )
  } finally {
    loadingProvincias.value = false
  }
}

async function loadMunicipios(provinciaId = null) {
  loadingMunicipios.value = true
  try {
    const cacheKey = `lookup:municipios:${provinciaId || 'all'}`
    municipios.value = await getCachedLookup(cacheKey, async () => {
      const params = { quantidade: 30 }
      if (provinciaId) {
        params.provincia_id = provinciaId
        params.provincia = provinciaId
      }
      return parseItems(await municipioService.listar(params))
    })
  } finally {
    loadingMunicipios.value = false
  }
}

async function loadProjectos() {
  loadingProjectos.value = true
  try {
    projectos.value = await getCachedLookup(
      'lookup:projectos',
      async () => parseItems(await projectoService.listar())
    )
  } finally {
    loadingProjectos.value = false
  }
}

const savedMunicipio = ref(null)
const savedProvincia = ref(null)

if (props.record?.municipio && typeof props.record.municipio === 'object') {
  savedMunicipio.value = {
    id: props.record.municipio.id,
    nome: props.record.municipio.nome,
  }
  const prov = props.record.municipio.provincia
  if (prov && typeof prov === 'object') {
    savedProvincia.value = { id: prov.id, nome: prov.nome }
  }
}

const provinciasToShow = computed(() => {
  const list = [...provincias.value]
  const current = formData.value?.provincia
  if (current && !list.some((p) => Number(p.id) === Number(current)) && savedProvincia.value) {
    list.unshift(savedProvincia.value)
  }
  return list
})

const municipiosToShow = computed(() => {
  const list = [...municipios.value]
  const current = formData.value?.municipio
  if (current && !list.some((m) => Number(m.id) === Number(current)) && savedMunicipio.value) {
    list.unshift(savedMunicipio.value)
  }
  return list
})

async function onProvinciaChange() {
  formData.value.municipio = null
  savedMunicipio.value = null
  await loadMunicipios(formData.value.provincia || null)
}

onMounted(async () => {
  if (typeof document !== 'undefined') {
    previousVdtMode.value = document.documentElement.getAttribute('data-vdt-mode') || ''
    document.documentElement.setAttribute('data-vdt-mode', 'light')
  }

  await Promise.all([
    loadProvincias(),
    loadMunicipios(formData.value?.provincia || null),
    loadProjectos(),
  ])
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return

  if (previousVdtMode.value) {
    document.documentElement.setAttribute('data-vdt-mode', previousVdtMode.value)
  } else {
    document.documentElement.removeAttribute('data-vdt-mode')
  }
})
</script>

<style scoped>
.condominio-datepicker-shell {
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

.condominio-datepicker-shell :deep(.date-picker-container) {
  background-color: #f9fafb !important;
  color: #000 !important;
}

.condominio-datepicker-shell :deep(*) {
  color: inherit;
}
</style>
