import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/items', { params })
  },

  criar(data) {
    return http.post('/api/items', data)
  },

  atualizar(id, data) {
    return http.put(`/api/items/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/items/${id}`)
  }
}
