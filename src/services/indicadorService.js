import http from '@/api/http'

export default {
  imoveisPorCondominio() {
    return http.get('/api/indicadores/imoveis-por-condominio')
  }
}
