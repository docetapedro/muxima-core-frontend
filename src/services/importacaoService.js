import http from '@/api/http'

export default {
  importarEntidades(ficheiro) {
    const formData = new FormData()
    formData.append('ficheiro', ficheiro)

    return http.post('/api/importacao/entidades', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  importarPagamentos(ficheiro) {
    const formData = new FormData()
    formData.append('ficheiro', ficheiro)

    return http.post('/api/importacao/pagamentos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
