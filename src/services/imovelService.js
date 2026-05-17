import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/imoveis', { params })
  },

  criar(data) {
    return http.post('/api/imoveis', data)
  },

  atualizar(id, data) {
    return http.put(`/api/imoveis/${id}`, data)
  },

  eliminar(id) {
    return http.delete(`/api/imoveis/${id}`)
  }
}
