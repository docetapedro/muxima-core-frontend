import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/provincias', { params })
  },

  obter(id) {
    return http.get(`/api/provincias/${id}`)
  },

  criar(data) {
    return http.post('/api/provincias', data)
  },

  atualizar(id, data) {
    return http.put(`/api/provincias/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/provincias/${id}`)
  }
}
