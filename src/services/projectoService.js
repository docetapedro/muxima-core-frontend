import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/projectos', { params })
  },

  criar(data) {
    return http.post('/api/projectos', data)
  },

  atualizar(id, data) {
    return http.put(`/api/projectos/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/projectos/${id}`)
  }
}
