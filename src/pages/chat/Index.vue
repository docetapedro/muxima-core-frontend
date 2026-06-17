<template>
  <div class="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in">
    <!-- LISTA DE CONVERSAS -->
    <aside class="w-80 shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      <div class="p-3 border-b border-border space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-semibold">Conversas</h2>
          <button @click="openNewConversation"
            class="flex items-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
            title="Nova conversa">
            <PlusCircleIcon class="w-3.5 h-3.5" />
            Nova
          </button>
        </div>

        <input v-model="conversationFilter" type="text" placeholder="Procurar conversa..."
          class="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="loadingConversations && !conversations.length" class="p-6 text-center text-sm text-muted-foreground">
          <Loader2 class="w-5 h-5 animate-spin mx-auto mb-2" />
          A carregar...
        </div>

        <div v-else-if="!filteredConversations.length" class="p-6 text-center text-sm text-muted-foreground">
          Nenhuma conversa.
        </div>

        <button v-for="conv in filteredConversations" :key="conv.id"
          @click="selectConversation(conv)"
          class="w-full text-left px-3 py-3 border-b border-border hover:bg-muted/40 transition-colors"
          :class="{ 'bg-muted/60': activeConversationId === conv.id }">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-blue-200 text-xs font-semibold shrink-0">
                  {{ getInitials(otherUser(conv)) }}
                </div>
                <p class="font-medium text-sm truncate">{{ otherUser(conv)?.name || otherUser(conv)?.username || '—' }}</p>
              </div>
              <p class="text-xs text-muted-foreground truncate mt-1">
                {{ lastMessagePreview(conv) }}
              </p>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[10px] text-muted-foreground">{{ formatTime(conv.updated_at) }}</span>
              <span v-if="conv.nao_lidas > 0"
                class="px-1.5 py-0.5 text-[10px] rounded-full bg-primary text-primary-foreground font-semibold min-w-[20px] text-center">
                {{ conv.nao_lidas }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- PAINEL DA CONVERSA -->
    <section class="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      <div v-if="!activeConversation" class="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <MessageCircle class="w-12 h-12 mb-3 opacity-40" />
        <p class="text-sm">Selecciona uma conversa ou inicia uma nova.</p>
      </div>

      <template v-else>
        <div class="p-3 border-b border-border flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-blue-200 text-sm font-semibold shrink-0">
            {{ getInitials(otherUser(activeConversation)) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold truncate">{{ otherUser(activeConversation)?.name || otherUser(activeConversation)?.username || '—' }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ otherUser(activeConversation)?.email || '' }}</p>
          </div>
        </div>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/10">
          <div v-if="loadingMessages && !messages.length" class="text-center text-sm text-muted-foreground py-6">
            <Loader2 class="w-5 h-5 animate-spin mx-auto mb-2" />
            A carregar mensagens...
          </div>

          <div v-else-if="!messages.length" class="text-center text-sm text-muted-foreground py-6">
            Sem mensagens. Sê o primeiro a dizer olá.
          </div>

          <div v-for="msg in messages" :key="msg.id"
            class="flex" :class="isMine(msg) ? 'justify-end' : 'justify-start'">
            <div class="max-w-[75%] group">
              <div class="rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap shadow-sm"
                :class="isMine(msg)
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-background border border-border rounded-bl-none'">
                <div v-if="editingMessageId === msg.id" class="flex flex-col gap-2 min-w-[200px]">
                  <textarea v-model="editingBody" rows="2"
                    class="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-sm focus:outline-none"
                    @keydown.enter.exact.prevent="saveEdit(msg)"
                    @keydown.escape="cancelEdit"></textarea>
                  <div class="flex items-center justify-end gap-2 text-xs">
                    <button @click="cancelEdit" class="text-muted-foreground hover:text-foreground">Cancelar</button>
                    <button @click="saveEdit(msg)" class="font-medium text-primary hover:underline">Guardar</button>
                  </div>
                </div>
                <span v-else>{{ msg.body }}</span>
              </div>

              <div class="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground"
                :class="isMine(msg) ? 'justify-end' : 'justify-start'">
                <span>{{ formatTime(msg.created_at) }}</span>
                <span v-if="msg.editado_em || msg.updated_at && msg.updated_at !== msg.created_at" class="italic">· editada</span>
                <template v-if="isMine(msg) && editingMessageId !== msg.id">
                  <button @click="startEdit(msg)" class="opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity"
                    title="Editar">
                    <Pencil class="w-3 h-3" />
                  </button>
                  <button @click="deleteMessage(msg)" class="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                    title="Eliminar">
                    <Trash2 class="w-3 h-3" />
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 border-t border-border">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2">
            <textarea v-model="composer" rows="1" placeholder="Escreve uma mensagem..."
              ref="composerRef"
              class="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResizeComposer"></textarea>
            <button type="submit" :disabled="sending || !composer.trim()"
              class="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              <Loader2 v-if="sending" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
              Enviar
            </button>
          </form>
        </div>
      </template>
    </section>

    <!-- MODAL NOVA CONVERSA -->
    <div v-if="showNewConversation"
      class="fixed inset-0 bg-black/65 backdrop-blur-[1px] z-[100] flex items-center justify-center p-4">
      <div
        class="modal-surface w-full max-w-md border border-zinc-300 rounded-xl p-5 space-y-4 shadow-2xl ring-1 ring-black/10"
        style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Nova conversa</h3>
          <button type="button" @click="showNewConversation = false"
            class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>

        <input v-model="userSearch" type="text" placeholder="Procurar utilizador..."
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

        <div class="max-h-80 overflow-y-auto space-y-1">
          <div v-if="loadingUsers" class="p-4 text-center text-sm text-muted-foreground">
            <Loader2 class="w-5 h-5 animate-spin mx-auto" />
          </div>
          <div v-else-if="!filteredUsers.length" class="p-4 text-center text-sm text-muted-foreground">
            Nenhum utilizador encontrado.
          </div>
          <button v-for="user in filteredUsers" :key="user.id" type="button"
            @click.stop="startConversationWith(user)"
            class="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-3 cursor-pointer">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-blue-200 text-xs font-semibold shrink-0">
              {{ getInitials(user) }}
            </div>
            <div class="min-w-0 flex-1 pointer-events-none">
              <p class="text-sm font-medium truncate">{{ user.name || user.username }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ user.email }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Loader2, MessageCircle, Send, PlusCircleIcon, Pencil, Trash2, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import chatService from '@/services/chatService'
import userService from '@/services/userService'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const conversations = ref([])
const loadingConversations = ref(false)
const conversationFilter = ref('')

const activeConversationId = ref(null)
const messages = ref([])
const loadingMessages = ref(false)

const composer = ref('')
const sending = ref(false)
const composerRef = ref(null)
const messagesContainer = ref(null)

const editingMessageId = ref(null)
const editingBody = ref('')

const showNewConversation = ref(false)
const allUsers = ref([])
const loadingUsers = ref(false)
const userSearch = ref('')

const CONVERSATIONS_POLL_MS = 15000
const MESSAGES_POLL_MS = 3500
let conversationsPollHandle = null
let messagesPollHandle = null

const activeConversation = computed(() =>
  conversations.value.find((c) => c.id === activeConversationId.value) || null
)

const filteredConversations = computed(() => {
  const term = conversationFilter.value.trim().toLowerCase()
  if (!term) return conversations.value
  return conversations.value.filter((c) => {
    const u = otherUser(c)
    return (u?.name || '').toLowerCase().includes(term) ||
      (u?.username || '').toLowerCase().includes(term) ||
      (u?.email || '').toLowerCase().includes(term)
  })
})

const filteredUsers = computed(() => {
  const myId = auth.user?.id
  const term = userSearch.value.trim().toLowerCase()
  return allUsers.value
    .filter((u) => u.id !== myId)
    .filter((u) => {
      if (!term) return true
      return (u.name || '').toLowerCase().includes(term) ||
        (u.username || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
    })
})

function parseList(res) {
  return res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? res?.data ?? []
}

function parseSingle(res) {
  return res?.data?.dados ?? res?.data ?? null
}

function otherUser(conv) {
  if (!conv) return null
  // várias formas possíveis: outro_user, other_user, users:[2], participants:[..]
  if (conv.outro_user) return conv.outro_user
  if (conv.other_user) return conv.other_user
  const myId = auth.user?.id
  const participants = conv.users || conv.participants || conv.membros || []
  return participants.find((u) => u.id !== myId) || null
}

function isMine(msg) {
  const myId = auth.user?.id
  if (myId == null) return false
  const senderId =
    msg.user_id ??
    msg.user?.id ??
    msg.sender_id ??
    msg.from_user_id ??
    msg.autor_id ??
    msg.author_id ??
    msg.remetente_id
  if (senderId == null) return false
  return String(senderId) === String(myId)
}

function getInitials(user) {
  if (!user) return '?'
  const name = user.name || user.username || user.email || '?'
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'
}

function lastMessagePreview(conv) {
  const m = conv.ultima_mensagem || conv.last_message || conv.lastMessage
  if (!m) return 'Sem mensagens'
  const body = m.body || m.conteudo || m.mensagem || ''
  return body.length > 60 ? body.slice(0, 60) + '…' : body
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })
}

async function loadConversations({ silent = false } = {}) {
  if (!silent) loadingConversations.value = true
  try {
    const res = await chatService.listarConversas()
    conversations.value = parseList(res)
  } catch (e) {
    console.error(e)
    if (!silent) toast.error('Falha ao carregar conversas.')
  } finally {
    loadingConversations.value = false
  }
}

async function loadMessages(conversationId, { incremental = false } = {}) {
  if (!conversationId) return
  if (!incremental) loadingMessages.value = true
  try {
    const params = { quantidade: 100 }
    if (incremental && messages.value.length) {
      params.since = messages.value[messages.value.length - 1].id
    }
    const res = await chatService.listarMensagens(conversationId, params)
    const newMessages = parseList(res)
    if (!newMessages.length) return

    if (incremental) {
      const existingIds = new Set(messages.value.map((m) => m.id))
      const toAdd = newMessages.filter((m) => !existingIds.has(m.id))
      if (toAdd.length) {
        messages.value.push(...toAdd)
        markAsRead(conversationId)
        await nextTick()
        scrollToBottom()
      }
    } else {
      messages.value = newMessages
      markAsRead(conversationId)
      await nextTick()
      scrollToBottom()
    }
  } catch (e) {
    console.error(e)
    if (!incremental) toast.error('Falha ao carregar mensagens.')
  } finally {
    loadingMessages.value = false
  }
}

function scrollToBottom() {
  const el = messagesContainer.value
  if (el) el.scrollTop = el.scrollHeight
}

async function markAsRead(conversationId) {
  try {
    await chatService.marcarLidas(conversationId)
    const conv = conversations.value.find((c) => c.id === conversationId)
    if (conv) conv.nao_lidas = 0
  } catch (e) {
    console.error(e)
  }
}

async function selectConversation(conv) {
  if (activeConversationId.value === conv.id) return
  activeConversationId.value = conv.id
  messages.value = []
  stopMessagesPolling()
  await loadMessages(conv.id)
  startMessagesPolling()
}

async function sendMessage() {
  const body = composer.value.trim()
  if (!body || !activeConversationId.value) return
  sending.value = true
  const tempId = `temp-${Date.now()}`
  const optimistic = {
    id: tempId,
    body,
    user_id: auth.user?.id,
    created_at: new Date().toISOString(),
    _optimistic: true,
  }
  messages.value.push(optimistic)
  composer.value = ''
  if (composerRef.value) composerRef.value.style.height = 'auto'
  await nextTick()
  scrollToBottom()

  try {
    const res = await chatService.enviarMensagem(activeConversationId.value, { body })
    const saved = parseSingle(res)
    const idx = messages.value.findIndex((m) => m.id === tempId)
    if (saved && idx !== -1) messages.value.splice(idx, 1, saved)
    // refresh da lista para actualizar o preview/timestamp da conversa
    loadConversations({ silent: true })
  } catch (e) {
    console.error(e)
    messages.value = messages.value.filter((m) => m.id !== tempId)
    toast.error('Falha ao enviar a mensagem.')
  } finally {
    sending.value = false
  }
}

function autoResizeComposer(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function startEdit(msg) {
  editingMessageId.value = msg.id
  editingBody.value = msg.body
}

function cancelEdit() {
  editingMessageId.value = null
  editingBody.value = ''
}

async function saveEdit(msg) {
  const newBody = editingBody.value.trim()
  if (!newBody || newBody === msg.body) {
    cancelEdit()
    return
  }
  try {
    const res = await chatService.editarMensagem(msg.id, { body: newBody })
    const updated = parseSingle(res)
    const idx = messages.value.findIndex((m) => m.id === msg.id)
    if (idx !== -1) {
      messages.value.splice(idx, 1, updated || { ...msg, body: newBody, editado_em: new Date().toISOString() })
    }
    cancelEdit()
  } catch (e) {
    console.error(e)
    toast.error('Falha ao editar a mensagem.')
  }
}

async function deleteMessage(msg) {
  if (!confirm('Eliminar esta mensagem?')) return
  try {
    await chatService.eliminarMensagem(msg.id)
    messages.value = messages.value.filter((m) => m.id !== msg.id)
  } catch (e) {
    console.error(e)
    toast.error('Falha ao eliminar a mensagem.')
  }
}

async function openNewConversation() {
  showNewConversation.value = true
  if (allUsers.value.length) return
  loadingUsers.value = true
  try {
    const res = await userService.listar({ quantidade: 100 })
    allUsers.value = parseList(res)
  } catch (e) {
    console.error(e)
    toast.error('Falha ao carregar utilizadores.')
  } finally {
    loadingUsers.value = false
  }
}

async function startConversationWith(user) {
  if (!auth.user?.id) {
    toast.error('Sessão inválida. Volte a fazer login.')
    return
  }

  // se já existe uma conversa com este utilizador, abre-a
  const existing = conversations.value.find((c) => otherUser(c)?.id === user.id)
  if (existing) {
    showNewConversation.value = false
    await selectConversation(existing)
    return
  }

  try {
    const res = await chatService.iniciarConversa({ outro_user_id: user.id })
    const conv = parseSingle(res)
    showNewConversation.value = false
    if (conv?.id) {
      // injecta na lista (no topo) se ainda não estiver
      if (!conversations.value.some((c) => c.id === conv.id)) {
        conversations.value.unshift(conv)
      }
      await selectConversation(conv)
    } else {
      // fallback: o backend pode ter devolvido apenas {message}; refresca e tenta abrir a do user
      await loadConversations()
      const created = conversations.value.find((c) => otherUser(c)?.id === user.id)
      if (created) await selectConversation(created)
    }
  } catch (e) {
    console.error(e)
    const msg = e?.response?.data?.message || 'Falha ao iniciar conversa.'
    toast.error(msg)
  }
}

function startConversationsPolling() {
  stopConversationsPolling()
  conversationsPollHandle = setInterval(() => loadConversations({ silent: true }), CONVERSATIONS_POLL_MS)
}

function stopConversationsPolling() {
  if (conversationsPollHandle) {
    clearInterval(conversationsPollHandle)
    conversationsPollHandle = null
  }
}

function startMessagesPolling() {
  stopMessagesPolling()
  messagesPollHandle = setInterval(() => {
    if (activeConversationId.value) loadMessages(activeConversationId.value, { incremental: true })
  }, MESSAGES_POLL_MS)
}

function stopMessagesPolling() {
  if (messagesPollHandle) {
    clearInterval(messagesPollHandle)
    messagesPollHandle = null
  }
}

// Pausar polling quando o tab fica em background
function onVisibilityChange() {
  if (document.hidden) {
    stopConversationsPolling()
    stopMessagesPolling()
  } else {
    loadConversations({ silent: true })
    startConversationsPolling()
    if (activeConversationId.value) {
      loadMessages(activeConversationId.value, { incremental: true })
      startMessagesPolling()
    }
  }
}

watch(activeConversationId, () => {
  cancelEdit()
})

onMounted(async () => {
  await loadConversations()
  startConversationsPolling()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopConversationsPolling()
  stopMessagesPolling()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>
