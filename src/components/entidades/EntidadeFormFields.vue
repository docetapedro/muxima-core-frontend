<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    <!-- Tipo -->
    <div class="md:col-span-1 lg:col-span-2">
      <label class="text-sm font-medium mb-1 block">Tipo *</label>
      <select v-model="formData.tipo" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.tipo }">
        <option value="P">Pessoa</option>
        <option value="E">Empresa</option>
      </select>
      <p v-if="validationErrors.tipo" class="text-xs text-red-600 mt-1">
        {{ validationErrors.tipo[0] }}
      </p>
    </div>

    <!-- Num entidade -->
    <div class="md:col-span-1 lg:col-span-2">
      <label class="text-sm font-medium mb-1 block">Nº Entidade </label>
      <input v-model="formData.num_entidade" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.num_entidade }" />
      <p v-if="validationErrors.num_entidade" class="text-xs text-red-600 mt-1">
        {{ validationErrors.num_entidade[0] }}
      </p>
    </div>

    <!-- Nome -->
    <div class="md:col-span-1 lg:col-span-4">
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input v-model="formData.nome" type="text" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.nome }" />
      <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">{{ validationErrors.nome[0] }}</p>
    </div>

    <!-- Email -->
    <div class="md:col-span-1 lg:col-span-4">
      <label class="text-sm font-medium mb-1 block">Email *</label>
      <input v-model="formData.email" type="email" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.email }" />
      <p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email[0] }}</p>
    </div>

    <!-- Telefone -->
    <div class="md:col-span-1 lg:col-span-4">
      <label class="text-sm font-medium mb-1 block">Telefone</label>
      <input v-model="formData.telefone" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.telefone }" />
      <p v-if="validationErrors.telefone" class="text-xs text-red-600 mt-1">{{ validationErrors.telefone[0] }}</p>
    </div>

    <!-- Endereço -->


    <!-- Campos Pessoa -->
    <template v-if="formData.tipo === 'P'">

      <!-- Província (filtra naturalidade) -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Província</label>
        <select v-model.number="formData.provincia" @change="onProvinciaChange"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.provincia }">
          <option :value="null">Selecione uma província...</option>
          <option v-for="p in provinciasToShow" :key="p.id" :value="Number(p.id)">
            {{ p.nome ?? p.label ?? p.id }}
          </option>
        </select>
        <p v-if="validationErrors.provincia" class="text-xs text-red-600 mt-1">
          {{ validationErrors.provincia[0] }}
        </p>
        <div v-if="loadingProvincias" class="text-xs text-muted-foreground mt-1">A carregar...</div>
      </div>

      <!-- Naturalidade (município) -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Naturalidade</label>
        <select v-model.number="formData.naturalidade"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.naturalidade }">
          <option :value="null">Selecione a naturalidade...</option>
          <option v-for="m in naturalidadesToShow" :key="m.id" :value="Number(m.id)">
            {{ m.nome ?? m.label ?? m.id }}
          </option>
        </select>
        <p v-if="validationErrors.naturalidade" class="text-xs text-red-600 mt-1">
          {{ validationErrors.naturalidade[0] }}
        </p>
        <div v-if="loadingNaturalidades" class="text-xs text-muted-foreground mt-1">A carregar...</div>
      </div>



      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Data Nascimento</label>
        <div
          class="entidade-datepicker-shell rounded-md border"
          data-vdt-mode="light"
          :class="validationErrors.data_nascimento ? 'border-red-500' : 'border-input'"
        >
          <DatePicker v-model="formData.data_nascimento" locale="en-US" mode="light" theme="neutral" />
        </div>
        <p v-if="validationErrors.data_nascimento" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_nascimento[0] }}
        </p>
      </div>

       <!-- Estado civil -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Estado Civil</label>
        <select v-model="formData.estado_civil"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.estado_civil }">
          <option value="">Selecionar</option>
          <option value="SO">Solteiro(a)</option>
          <option value="CA">Casado(a)</option>
          <option value="DI">Divorciado(a)</option>
          <option value="VI">Viúvo(a)</option>
        </select>
        <p v-if="validationErrors.estado_civil" class="text-xs text-red-600 mt-1">
          {{ validationErrors.estado_civil[0] }}
        </p>
      </div>

      <!-- Género -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Género</label>
        <select v-model="formData.genero"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.genero }">
          <option value="">Selecionar</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
        <p v-if="validationErrors.genero" class="text-xs text-red-600 mt-1">{{ validationErrors.genero[0] }}</p>
      </div>

      <!-- Data nascimento -->
      

      <!-- Nº BI -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Nº BI</label>
        <input v-model="formData.num_bi" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.num_bi }" />
        <p class="text-xs text-muted-foreground mt-1">Indique o Nº BI ou o Nº Cartão de Residente.</p>
        <p v-if="validationErrors.num_bi" class="text-xs text-red-600 mt-1">{{ validationErrors.num_bi[0] }}</p>
      </div>

      <!-- Nº Cartão de Residente -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Nº Cartão de Residente</label>
        <input v-model="formData.num_cartao_residente" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.num_cartao_residente }" />
        <p class="text-xs text-muted-foreground mt-1">Alternativa ao Nº BI.</p>
        <p v-if="validationErrors.num_cartao_residente" class="text-xs text-red-600 mt-1">
          {{ validationErrors.num_cartao_residente[0] }}
        </p>
      </div>

      <!-- Nº Passaporte -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Nº Passaporte</label>
        <input v-model="formData.num_passaporte" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.num_passaporte }" />
        <p v-if="validationErrors.num_passaporte" class="text-xs text-red-600 mt-1">
          {{ validationErrors.num_passaporte[0] }}
        </p>
      </div>

      <!-- Data emissão -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Data Emissão</label>
        <div
          class="entidade-datepicker-shell rounded-md border"
          data-vdt-mode="light"
          :class="validationErrors.data_emissao ? 'border-red-500' : 'border-input'"
        >
          <DatePicker v-model="formData.data_emissao" locale="en-US" mode="light" theme="neutral" />
        </div>
        <p v-if="validationErrors.data_emissao" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_emissao[0] }}
        </p>
      </div>

      <!-- Data expiração -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">Data Expiração</label>
        <div
          class="entidade-datepicker-shell rounded-md border"
          data-vdt-mode="light"
          :class="validationErrors.data_expiracao ? 'border-red-500' : 'border-input'"
        >
          <DatePicker v-model="formData.data_expiracao" locale="en-US" mode="light" theme="neutral" />
        </div>
        <p v-if="validationErrors.data_expiracao" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_expiracao[0] }}
        </p>
      </div>

     
    </template>

    <!-- Campos Entidade -->
    <template v-else-if="formData.tipo === 'E'">

      <!-- NIF (apenas para Empresa) -->
      <div class="md:col-span-1 lg:col-span-4">
        <label class="text-sm font-medium mb-1 block">NIF</label>
        <input v-model="formData.nif" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.nif }" />
        <p v-if="validationErrors.nif" class="text-xs text-red-600 mt-1">
          {{ validationErrors.nif[0] }}
        </p>
      </div>

      <div class="md:col-span-2 lg:col-span-8">
        <label class="text-sm font-medium mb-1 block">Razão Social</label>
        <input v-model="formData.razao_social" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.razao_social }" />
        <p v-if="validationErrors.razao_social" class="text-xs text-red-600 mt-1">
          {{ validationErrors.razao_social[0] }}
        </p>
      </div>
    </template>


      <div class="md:col-span-2 lg:col-span-8">
      <label class="text-sm font-medium mb-1 block">Endereço</label>
      <input v-model="formData.endereco" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.endereco }" />
      <p v-if="validationErrors.endereco" class="text-xs text-red-600 mt-1">{{ validationErrors.endereco[0] }}</p>
    </div>
  </div>
</template>

<script setup>

import { computed, onMounted, ref, watch } from 'vue'
import { DatePicker } from '@tiaohsun/vue-datepicker'
import '@tiaohsun/vue-datepicker/style'
import provinciaService from '@/services/provinciaService'
import municipioService from '@/services/municipioService'
import { getCachedLookup } from '@/composables/useLookupCache'

defineProps({
  validationErrors: { type: Object, default: () => ({}) }
})

const formData = defineModel({ type: Object, required: true })

function parseItems(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && (it.id != null || it.value != null))
}

const provincias = ref([])
const naturalidades = ref([])
const loadingProvincias = ref(false)
const loadingNaturalidades = ref(false)
const provinciasLoaded = ref(false)

async function loadProvincias() {
  if (provinciasLoaded.value) return
  loadingProvincias.value = true
  try {
    provincias.value = await getCachedLookup(
      'lookup:provincias',
      async () => parseItems(await provinciaService.listar({ quantidade: 30 }))
    )
    provinciasLoaded.value = true
  } finally {
    loadingProvincias.value = false
  }
}

async function loadNaturalidades(provinciaId = null) {
  loadingNaturalidades.value = true
  try {
    const cacheKey = `lookup:municipios:${provinciaId || 'all'}`
    naturalidades.value = await getCachedLookup(cacheKey, async () => {
      const params = { quantidade: 30 }
      if (provinciaId) {
        params.provincia_id = provinciaId
        params.provincia = provinciaId
      }
      return parseItems(await municipioService.listar(params))
    })
  } finally {
    loadingNaturalidades.value = false
  }
}

const provinciasToShow = computed(() => {
  const list = [...provincias.value]
  const current = formData.value?.provincia
  const saved = formData.value?._savedProvincia
  if (current && saved && !list.some((p) => Number(p.id) === Number(current))) {
    list.unshift(saved)
  }
  return list
})

const naturalidadesToShow = computed(() => {
  const list = [...naturalidades.value]
  const current = formData.value?.naturalidade
  const saved = formData.value?._savedNaturalidade
  if (current && saved && !list.some((m) => Number(m.id) === Number(current))) {
    list.unshift(saved)
  }
  return list
})

async function onProvinciaChange() {
  formData.value.naturalidade = null
  formData.value._savedNaturalidade = null
  await loadNaturalidades(formData.value.provincia || null)
}

async function ensurePessoaLookups() {
  await Promise.all([
    loadProvincias(),
    loadNaturalidades(formData.value?.provincia || null),
  ])
}

watch(
  () => formData.value?.tipo,
  (tipo) => {
    if (tipo === 'P') ensurePessoaLookups()
  }
)

onMounted(() => {
  if (formData.value?.tipo === 'P') ensurePessoaLookups()
})

</script>

<style scoped>
.entidade-datepicker-shell {
  --color-vdt-surface: #ffffff;
  --color-vdt-surface-secondary: #f3f4f6;
  --color-vdt-surface-elevated: #ffffff;
  --color-vdt-content: #000000;
  --color-vdt-content-secondary: #111827;
  --color-vdt-content-muted: #6b7280;
  --color-vdt-outline: #d1d5db;
  --color-vdt-interactive-hover: #e5e7eb;
  --color-vdt-interactive-active: #dbe1e7;
  background-color: #ffffff;
}

.entidade-datepicker-shell :deep(.date-picker-container) {
  background-color: #ffffff !important;
  color: #000 !important;
}

.entidade-datepicker-shell :deep(*) {
  color: inherit;
}
</style>
