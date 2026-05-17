import http from '@/api/http'

export default {
  listar(params = {}) {
    return http.get('/api/tipoprojectos', { params })
  }
}
