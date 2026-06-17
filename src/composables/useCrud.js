import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useApiErrorHandler } from './useApiErrorHandler'

export function useCrud(service) {
  const items = ref([])
  const paginacao = ref(null)
  const loading = ref(false)
  const { handleApiError } = useApiErrorHandler()

  async function fetchItems(params = {}) {
    loading.value = true
    try {
      const res = await service.listar(params)
      items.value = res.data?.dados?.items ?? []
      paginacao.value = res.data?.dados?.paginacao ?? null
    } catch (e) {
      console.error(e)
      handleApiError(e)
    } finally {
      loading.value = false
    }
  }

  function removeFromList(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  async function destroy(id, errorRef) {
    try {
      const res = await service.eliminar(id)
      removeFromList(id)
      toast.success(res?.data?.message || 'Registo eliminado com sucesso.')
      return true
    } catch (e) {
      console.error(e)
      if (errorRef) errorRef.value = handleApiError(e)
      else handleApiError(e)
      return false
    }
  }

  return { items, paginacao, loading, fetchItems, removeFromList, destroy, handleApiError }
}
