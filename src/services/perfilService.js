import http from '@/api/http'

export default {
  obter() {
    return http.get('/api/perfil')
  },

  atualizar(data) {
    return http.put('/api/perfil', data)
  }
}
