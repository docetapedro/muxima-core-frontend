import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/moedas', { params })
  },

  criar(data) {
    return http.post('/api/moedas', data)
  },

  atualizar(id, data) {
    return http.put(`/api/moedas/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/moedas/${id}`)
  }
}
