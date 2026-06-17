<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Importação de Pagamentos</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Carregue um ficheiro Excel ou CSV com os campos exigidos.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6">
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" for="ficheiro">
              Ficheiro
            </label>

            <input
              id="ficheiro"
              ref="fileInput"
              type="file"
              accept=".xlsx,.csv"
              @change="onFileChange"
              class="block w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <p class="text-xs text-muted-foreground mt-2">
              Formatos aceites: <strong>.xlsx</strong> e <strong>.csv</strong>.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              :disabled="loading || !selectedFile"
              class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <Upload class="w-4 h-4" />
              Importar pagamentos
            </button>

            <button
              type="button"
              @click="clearFile"
              :disabled="loading && !selectedFile"
              class="px-4 py-2 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              Limpar
            </button>
          </div>
        </form>

        <div v-if="successMessage" class="p-4 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {{ errorMessage }}
        </div>
      </div>

      <aside class="bg-card border border-border rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-semibold text-lg">Campos esperados</h2>
          <button
            type="button"
            @click="downloadTemplate"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs hover:bg-muted transition-colors"
            title="Baixar template com os cabeçalhos"
          >
            <Download class="w-3.5 h-3.5" />
            Template
          </button>
        </div>

        <ul class="space-y-2 text-sm text-muted-foreground">
          <li v-for="field in requiredFields" :key="field.name" class="flex items-start gap-2">
            <Check class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div class="space-y-1">
              <code class="text-foreground">{{ field.name }}</code>
              <div v-if="field.legend" class="text-xs text-muted-foreground">
                {{ field.legend }}
              </div>
            </div>
          </li>
        </ul>

        <div class="pt-2 border-t border-border">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="font-medium text-sm">Tipos de Pagamentos</h3>
               
              </div>

              <div class="space-y-2 max-h-48 overflow-auto pr-1">
                <div
                  v-for="tipo in tiposPagamento"
                  :key="tipo.id"
                  class="rounded-md border border-border bg-muted/10 px-3 py-2 text-xs"
                >
                  <div class="font-medium text-foreground">{{ tipo.codigo || tipo.descricao || `Tipo ${tipo.id}` }}</div>
                  <div class="text-muted-foreground">{{ tipo.nome || tipo.label || '-' }}</div>
                </div>

                <p v-if="!tiposPagamento.length" class="text-xs text-muted-foreground">
                  Nenhum tipo de pagamento carregado.
                </p>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="font-medium text-sm">Itens</h3>
              </div>

              <div class="space-y-2 max-h-48 overflow-auto pr-1">
                <div
                  v-for="item in itemsList"
                  :key="item.id"
                  class="rounded-md border border-border bg-muted/10 px-3 py-2 text-xs"
                >
                  <div class="font-medium text-foreground">{{ getItemLabel(item) }}</div>
                  <div class="text-muted-foreground">{{ item.codigo || item.nome || '-' }}</div>
                </div>

                <p v-if="!itemsList.length" class="text-xs text-muted-foreground">
                  Nenhum item carregado.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
          Use os mesmos nomes de colunas indicados acima.
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Check, Download, Loader2, Upload } from 'lucide-vue-next'
import ExcelJS from 'exceljs'
import http from '@/api/http'
import importacaoService from '@/services/importacaoService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

const requiredFields = [
  { name: 'imovel', legend: 'Referência do imóvel (ex.: ABCD.00001)' },
  { name: 'item', legend: 'Código do item (ex.: IM — ver lista abaixo)' },
  { name: 'tipo_pagamento', legend: 'Código do tipo de pagamento (ex.: NO — ver lista abaixo)' },
  { name: 'valor' },
  { name: 'data', legend: 'Data do pagamento (YYYY-MM-DD)' }
]

const TIPOS_PAGAMENTOS_ENDPOINT = '/api/tipopagamentos'
const ITENS_ENDPOINT = '/api/items'

const fileInput = ref(null)
const selectedFile = ref(null)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const tiposPagamento = ref([])
const itemsList = ref([])

const { handleApiError } = useApiErrorHandler()

const exampleRow = {
  imovel: 'ABCD.00001',
  item: 'IM',
  tipo_pagamento: 'NO',
  valor: 100000,
  data: '2026-05-24'
}

function normalizeItems(payload) {
  const dados = payload?.data?.dados
  return Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
}

function getItemLabel(item) {
  return item?.nome || item?.descricao || item?.codigo || item?.label || `Item ${item?.id ?? ''}`
}

async function downloadTemplate() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Muxima'
  wb.created = new Date()

  const ws = wb.addWorksheet('Pagamentos')
  ws.columns = requiredFields.map((f) => ({
    header: f.name,
    key: f.name,
    width: Math.max(16, f.name.length + 4),
  }))

  ws.addRow(exampleRow)

  const headerRow = ws.getRow(1)
  headerRow.font = { bold: true }
  headerRow.alignment = { vertical: 'middle' }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' },
  }

  requiredFields.forEach((f, idx) => {
    if (!f.legend) return
    const cell = headerRow.getCell(idx + 1)
    cell.note = { texts: [{ text: f.legend }], margins: { insetmode: 'auto' } }
  })

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-importacao-pagamentos.xlsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function onFileChange(event) {
  const file = event.target.files?.[0] || null
  selectedFile.value = file
  successMessage.value = ''
  errorMessage.value = ''
}

function clearFile() {
  selectedFile.value = null
  successMessage.value = ''
  errorMessage.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function loadOptions() {
  const [tiposRes, itensRes] = await Promise.allSettled([
    http.get(TIPOS_PAGAMENTOS_ENDPOINT, { params: { page: 1 } }),
    http.get(ITENS_ENDPOINT, { params: { page: 1 } })
  ])

  tiposPagamento.value = tiposRes.status === 'fulfilled' ? normalizeItems(tiposRes.value) : []
  itemsList.value = itensRes.status === 'fulfilled' ? normalizeItems(itensRes.value) : []
}

async function submit() {
  if (!selectedFile.value) {
    errorMessage.value = 'Selecione um ficheiro antes de importar.'
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await importacaoService.importarPagamentos(selectedFile.value)
    successMessage.value = response.data?.message || 'Importação concluída com sucesso.'
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    errorMessage.value = handleApiError(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOptions()
})
</script>
