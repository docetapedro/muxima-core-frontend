import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/modelos', { params })
  },

  criar(data) {
    return http.post('/api/modelos', data)
  },

  atualizar(id, data) {
    return http.put(`/api/modelos/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/modelos/${id}`)
  }
}
