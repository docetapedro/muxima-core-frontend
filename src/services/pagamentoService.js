import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/pagamentos', { params })
  },

  criar(data) {
    return http.post('/api/pagamentos', data)
  },

  atualizar(id, data) {
    return http.put(`/api/pagamentos/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/pagamentos/${id}`)
  }
}
