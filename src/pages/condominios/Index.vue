<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Condomínios</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de condomínios</p>
      </div>
      <button @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        <PlusCircleIcon class="w-4 h-4" />
        Novo
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input v-model="searchTerm" type="text" placeholder="Nome, Descrição, Localização..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <button @click="pesquisar" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Pesquisar
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome abreviado</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Descrição</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Localização</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12 text-muted-foreground">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                A carregar...
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="8" class="text-center py-12 text-muted-foreground">
                Nenhum condomínio encontrado.
              </td>
            </tr>
            <tr v-else v-for="condominio in items" :key="condominio.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td class="px-4 py-3">{{ condominio.nome || '-' }}</td>
              <td class="px-4 py-3">{{ condominio.nome_abreviado ?? '-' }}</td>
              <td class="px-4 py-3">{{ condominio.descricao ?? '-' }}</td>
              <td class="px-4 py-3">{{ condominio.localizacao ?? '-' }}</td>
          
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button @click="openView(condominio)" class="text-primary hover:text-primary/80 transition-colors" title="Ver">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click="openEdit(condominio)" class="text-blue-600 hover:text-blue-700 transition-colors" title="Editar">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button @click="openDelete(condominio)" class="text-red-600 hover:text-red-700 transition-colors" title="Excluir">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CondominioViewModal v-model="showViewModal" :condominio="selected" />
    <CondominioFormModal v-model="showCreateModal" mode="create" @success="pesquisar" />
    <CondominioFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar" />
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="o condomínio"
      :item-name="deleteLabel"
      :loading="deleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCrud } from '@/composables/useCrud'
import condominioService from '@/services/condominioService'
import provinciaService from '@/services/provinciaService'
import municipioService from '@/services/municipioService'
import projectoService from '@/services/projectoService'
import CondominioViewModal from '@/components/condominios/CondominioViewModal.vue'
import CondominioFormModal from '@/components/condominios/CondominioFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import { formatCondominioLabel } from '@/utils/condominioForm'
import { getCachedLookup, invalidateLookup } from '@/composables/useLookupCache'

function parseItems(res) {
  const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
  if (!Array.isArray(raw)) return []
  return raw.filter((it) => it && (it.id != null || it.value != null))
}

function prefetchCondominioLookups() {
  // Disparados em paralelo, sem aguardar — o cache fica quente antes de o
  // utilizador abrir o modal "Novo Condomínio".
  getCachedLookup('lookup:provincias', async () =>
    parseItems(await provinciaService.listar({ quantidade: 30 }))
  )
  getCachedLookup('lookup:municipios:all', async () =>
    parseItems(await municipioService.listar({ quantidade: 30 }))
  )
  getCachedLookup('lookup:projectos', async () =>
    parseItems(await projectoService.listar())
  )
}

const router = useRouter()

const searchTerm = ref('')
const { items, loading, fetchItems, destroy } = useCrud(condominioService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const deleteLabel = computed(() => formatCondominioLabel(selected.value))


function pesquisar() {
  fetchItems({ search: searchTerm.value })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(condominio) {
  router.push({ name: 'condominios.show', params: { id: condominio.id } })
}

async function openEdit(condominio) {
  try {
    const res = await condominioService.obter(condominio.id)
    selected.value = res.data?.dados ?? res.data ?? condominio
  } catch (e) {
    console.error(e)
    selected.value = condominio
  }
  showEditModal.value = true
}

function openDelete(condominio) {
  selected.value = condominio
  deleteError.value = ''
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selected.value) return
  deleting.value = true
  deleteError.value = ''
  const ok = await destroy(selected.value.id, deleteError)
  deleting.value = false
  if (ok) {
    invalidateLookup('lookup:condominios')
    showDeleteModal.value = false
    selected.value = null
  }
}

onMounted(() => {
  pesquisar()
  prefetchCondominioLookups()
})
</script>
