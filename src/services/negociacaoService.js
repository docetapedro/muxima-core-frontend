import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/negociacaos', { params })
  },

  obter(id) {
    return http.get(`/api/negociacaos/${id}`)
  },

  criar(data) {
    return http.post('/api/negociacaos', data)
  },

  atualizar(id, data) {
    return http.put(`/api/negociacaos/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/negociacaos/${id}`)
  }
}
