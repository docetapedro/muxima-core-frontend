import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/modelo-entregas', { params })
  },

  obter(id) {
    return http.get(`/api/modelo-entregas/${id}`)
  },

  criar(data) {
    return http.post('/api/modelo-entregas', data)
  },

  atualizar(id, data) {
    return http.put(`/api/modelo-entregas/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/modelo-entregas/${id}`)
  }
}
