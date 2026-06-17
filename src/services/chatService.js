import http from '@/api/http'

export default {
  listarConversas(params = {}) {
    return http.get('/api/chat/conversations', { params })
  },

  iniciarConversa(payload) {
    // { outro_user_id, body? }
    return http.post('/api/chat/conversations', payload)
  },

  listarMensagens(conversationId, params = {}) {
    // params: { since?: lastMessageId, quantidade?: 100 }
    return http.get(`/api/chat/conversations/${conversationId}/messages`, { params })
  },

  enviarMensagem(conversationId, payload) {
    // { body }
    return http.post(`/api/chat/conversations/${conversationId}/messages`, payload)
  },

  marcarLidas(conversationId) {
    return http.post(`/api/chat/conversations/${conversationId}/read`)
  },

  editarMensagem(messageId, payload) {
    // { body }
    return http.patch(`/api/chat/messages/${messageId}`, payload)
  },

  eliminarMensagem(messageId) {
    return http.delete(`/api/chat/messages/${messageId}`)
  }
}
