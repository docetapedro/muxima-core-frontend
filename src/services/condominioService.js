import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/condominios', { params })
  },

  obter(id) {
    return http.get(`/api/condominios/${id}`)
  },

  criar(data) {
    return http.post('/api/condominios', data)
  },

  atualizar(id, data) {
    return http.put(`/api/condominios/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/condominios/${id}`)
  }
}
