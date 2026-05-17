import { ref } from 'vue'

export function useApiErrorHandler() {
  function handleApiError(error, validationErrorsRef = null) {
    if (!error.response) {
      return error.request
        ? 'Erro de conexão com o servidor.'
        : 'Erro inesperado. Tenta novamente.'
    }
    
    const { status, data } = error.response
    
    if (status === 422 && data.errors) {
      if (validationErrorsRef) {
        validationErrorsRef.value = data.errors
      }
      return data.message || 'Erro(s) de validação.'
    }
    
    if (validationErrorsRef) {
      validationErrorsRef.value = {}
    }
    
    return data?.message || `Erro ${status}: Operação falhou.`
  }

  return { handleApiError }
}