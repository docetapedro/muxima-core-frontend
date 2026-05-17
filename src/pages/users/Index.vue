<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Utilizadores</h1>
        <p class="text-muted-foreground text-sm mt-1">Gestão de utilizadores</p>
      </div>
      <button @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        <PlusCircleIcon class="w-4 h-4" />
        Novo
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
      <input v-model="searchTerm" type="text" placeholder="Nome, Usuário, E-mail..."
        class="flex-1 min-w-48 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <select v-model="filterAdministrador"
        class="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">Todos</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <button @click="pesquisar" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Pesquisar
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="border-b border-border bg-muted/50">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Utilizador</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">E-mail</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Administrador</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Superadministrador</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Activo</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Operações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="text-center py-12 text-muted-foreground">
              <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
              A carregar...
            </td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="9" class="text-center py-12 text-muted-foreground">
              Nenhum utilizador encontrado.
            </td>
          </tr>
          <tr v-else v-for="user in items" :key="user.id"
            :class="(user.administrador || user.superadministrador) ? 'border-b border-border last:border-0 hover:bg-muted/30 transition-colors font-bold' : 'border-b border-border last:border-0 hover:bg-muted/30 transition-colors'">
            <td class="px-4 py-3">{{ user.name }}</td>
            <td class="px-4 py-3">{{ user.username }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">{{ user.administrador ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3">{{ user.superadministrador ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3">{{ user.activo ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <button @click="openView(user)" class="text-primary hover:text-primary/80 transition-colors" title="Ver">
                  <EyeIcon class="w-4 h-4" />
                </button>
                <button @click="openEdit(user)" class="text-blue-600 hover:text-blue-700 transition-colors" title="Editar">
                  <Pencil class="w-4 h-4" />
                </button>
                <button @click="openDelete(user)" class="text-red-600 hover:text-red-700 transition-colors" title="Excluir">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserViewModal v-model="showViewModal" :user="selected" />
    <UserFormModal v-model="showCreateModal" mode="create" @success="pesquisar" />
    <UserFormModal v-model="showEditModal" mode="edit" :record="selected" @success="pesquisar" />
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      entity-label="o utilizador"
      :item-name="selected?.name"
      :loading="deleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EyeIcon, Search, Loader2, Pencil, Trash2, PlusCircleIcon } from 'lucide-vue-next'
import { useCrud } from '@/composables/useCrud'
import userService from '@/services/userService'
import UserViewModal from '@/components/users/UserViewModal.vue'
import UserFormModal from '@/components/users/UserFormModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'

const searchTerm = ref('')
const filterAdministrador = ref('')
const { items, loading, fetchItems, destroy } = useCrud(userService)

const showViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selected = ref(null)
const deleting = ref(false)
const deleteError = ref('')

function pesquisar() {
  fetchItems({
    search: searchTerm.value,
    administrador: filterAdministrador.value
  })
}

function openCreate() {
  showCreateModal.value = true
}

function openView(user) {
  selected.value = user
  showViewModal.value = true
}

function openEdit(user) {
  selected.value = user
  showEditModal.value = true
}

function openDelete(user) {
  selected.value = user
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
    showDeleteModal.value = false
    selected.value = null
  }
}

onMounted(pesquisar)
</script>
