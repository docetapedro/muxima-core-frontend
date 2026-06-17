import http from '@/api/http'

export default {

  listar(params = {}) {
    return http.get('/api/entidades', { params })
  },

  obter(id) {
    return http.get(`/api/entidades/${id}`)
  },

  criar(data) {
    return http.post('/api/entidades', data)
  },

  atualizar(id, data) {
    return http.put(`/api/entidades/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/entidades/${id}`)
  }

}