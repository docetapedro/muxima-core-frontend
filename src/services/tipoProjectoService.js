import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/tipoprojectos', { params })
  },

  criar(data) {
    return http.post('/api/tipoprojectos', data)
  },

  atualizar(id, data) {
    return http.put(`/api/tipoprojectos/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/tipoprojectos/${id}`)
  }
}
