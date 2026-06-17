import { toast } from 'vue-sonner'

export function useApiErrorHandler() {
  function handleApiError(error, validationErrorsRef = null, options = {}) {
    const { silent = false } = options

    if (!error.response) {
      const message = error.request
        ? 'Erro de conexão com o servidor.'
        : 'Erro inesperado. Tenta novamente.'
      if (!silent) toast.error(message)
      return message
    }

    const { status, data } = error.response

    if (status === 422 && data?.errors) {
      if (validationErrorsRef) {
        validationErrorsRef.value = data.errors
      }
      const message = data.message || 'Erro(s) de validação.'
      if (!silent) {
        toast.error(message)
        const fields = Object.values(data.errors).flat().slice(0, 5)
        fields.forEach((msg) => {
          if (msg) toast.error(String(msg))
        })
      }
      return message
    }

    if (validationErrorsRef) {
      validationErrorsRef.value = {}
    }

    const message = data?.message || `Erro ${status}: Operação falhou.`
    if (!silent) toast.error(message)
    return message
  }

  return { handleApiError }
}
