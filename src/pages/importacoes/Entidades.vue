<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Importação de Entidades</h1>
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
              Importar entidades
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
          <h2 class="font-semibold text-lg">Campos obrigatórios da planilha</h2>
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
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Download, Loader2, Upload } from 'lucide-vue-next'
import ExcelJS from 'exceljs'
import importacaoService from '@/services/importacaoService'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

const requiredFields = [
  { name: 'tipo', legend: 'P = Pessoa, E = Empresa' },
  { name: 'nome' },
  { name: 'email' },
  { name: 'num_bi', legend: 'Pessoa: indique num_bi ou num_cartao_residente' },
  { name: 'num_cartao_residente', legend: 'Alternativa ao num_bi (Pessoa)' },
  { name: 'nif' },
  { name: 'data_nascimento' },
  { name: 'data_emissao' },
  { name: 'data_expiracao' },
  { name: 'genero', legend: 'M = Masculino, F = Feminino' },
  { name: 'estado_civil', legend: 'SO = Solteiro(a), CA = Casado(a), DI = Divorciado(a), VI = Viúvo(a)' },
  { name: 'telefone' },
  { name: 'endereco' }
]

const fileInput = ref(null)
const selectedFile = ref(null)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const { handleApiError } = useApiErrorHandler()

const exampleRow = {
  tipo: 'P',
  nome: 'João Exemplo',
  email: 'joao@exemplo.ao',
  num_bi: '000000000LA000',
  num_cartao_residente: '',
  nif: '000000000LA000',
  data_nascimento: '1990-01-31',
  data_emissao: '2020-01-31',
  data_expiracao: '2030-01-31',
  genero: 'M',
  estado_civil: 'SO',
  telefone: '923111000',
  endereco: 'Rua Exemplo, Luanda'
}

async function downloadTemplate() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Muxima'
  wb.created = new Date()

  const ws = wb.addWorksheet('Entidades')
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

  // Legendas anexadas como comentários (notas) nas células do cabeçalho —
  // assim o Excel mostra-as como tooltip e o backend continua a ler apenas
  // as colunas tabulares, sem se confundir com uma segunda folha.
  requiredFields.forEach((f, idx) => {
    if (!f.legend) return
    const cell = headerRow.getCell(idx + 1)
    cell.note = {
      texts: [{ text: f.legend }],
      margins: { insetmode: 'auto' },
    }
  })

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-importacao-entidades.xlsx'
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

async function submit() {
  if (!selectedFile.value) {
    errorMessage.value = 'Selecione um ficheiro antes de importar.'
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await importacaoService.importarEntidades(selectedFile.value)
    successMessage.value = response.data?.message || 'Importação concluída com sucesso.'
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    errorMessage.value = handleApiError(error)
  } finally {
    loading.value = false
  }
}
</script>
