import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/municipios', { params })
  },

  criar(data) {
    return http.post('/api/municipios', data)
  },

  atualizar(id, data) {
    return http.put(`/api/municipios/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/municipios/${id}`)
  }
}
