import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/tipoimoveis', { params })
  },
  criar(data) {
    return http.post('/api/tipoimoveis', data)
  },

  atualizar(id, data) {
    return http.put(`/api/tipoimoveis/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/tipoimoveis/${id}`)
  }
}
