import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/tipologias', { params })
  },

  criar(data) {
    return http.post('/api/tipologias', data)
  },

  atualizar(id, data) {
    return http.put(`/api/tipologias/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/tipologias/${id}`)
  }
}
