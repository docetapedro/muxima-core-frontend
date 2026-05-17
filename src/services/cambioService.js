import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/cambios', { params })
  },

  criar(data) {
    return http.post('/api/cambios', data)
  },

  atualizar(id, data) {
    return http.put(`/api/cambios/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/cambios/${id}`)
  }
}
