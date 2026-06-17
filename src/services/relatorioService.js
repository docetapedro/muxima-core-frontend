import http from '@/api/http'

export default {
  inadimplenciaPdf(condominioId) {
    return http.get('/api/relatorios/inadimplencia/pdf', {
      params: { condominio_id: condominioId },
      responseType: 'blob'
    })
  },

  negociacaoExtratoDetalhadoPdf(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/extrato/detalhado/pdf`, {
      responseType: 'blob'
    })
  },

  negociacaoExtratoResumoPdf(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/extrato/resumo/pdf`, {
      responseType: 'blob'
    })
  },

  // Simulação / orçamento de uma negociação em estado Rascunho
  negociacaoSimulacaoPdf(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/simulacao/pdf`, {
      responseType: 'blob'
    })
  },

  // Extrato de contas (movimentos débito/crédito) de uma negociação — devolve JSON
  negociacaoExtratoContas(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/extrato-contas`)
  },

  // Contrato da negociação em PDF
  negociacaoContratoPdf(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/contrato/pdf`, {
      responseType: 'blob'
    })
  },

  // Termo de quitação de uma negociação em estado Activa (AC)
  negociacaoTermoQuitacaoPdf(negociacaoId) {
    return http.get(`/api/relatorios/negociacao/${negociacaoId}/termo-quitacao/pdf`, {
      responseType: 'blob'
    })
  },

  // Nota (recibo) de um pagamento em PDF
  pagamentoNotaPdf(pagamentoId) {
    return http.get(`/api/relatorios/pagamento/${pagamentoId}/nota/pdf`, {
      responseType: 'blob'
    })
  },

  agingInadimplenciaPdf(condominioId) {
    return http.get('/api/relatorios/aging-inadimplencia/pdf', {
      params: { condominio_id: condominioId },
      responseType: 'blob'
    })
  },

  mapaCobrancaMensalPdf(ano, condominioId = null) {
    const params = { ano }
    if (condominioId) params.condominio_id = condominioId
    return http.get('/api/relatorios/mapa-cobranca-mensal/pdf', {
      params,
      responseType: 'blob'
    })
  },

  analiseFinanceira() {
    return http.get('/api/relatorios/analise-financeira')
  },

  cashFlowProjectadoPdf(meses, condominioId = null) {
    const params = { meses }
    if (condominioId) params.condominio_id = condominioId
    return http.get('/api/relatorios/cash-flow-projectado/pdf', {
      params,
      responseType: 'blob'
    })
  }
}
