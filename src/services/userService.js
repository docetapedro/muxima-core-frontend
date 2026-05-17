import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/users', { params })
  },

  criar(data) {
    return http.post('/api/users', data)
  },

  atualizar(id, data) {
    return http.put(`/api/users/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/users/${id}`)
  }
}
