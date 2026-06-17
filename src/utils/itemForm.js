export const ITEM_PROTEGIDO_CODIGO = 'IM'

export function isItemProtegido(item) {
  return !!item && item.codigo === ITEM_PROTEGIDO_CODIGO
}

export function emptyItem() {
  return {
    codigo: '',
    nome: '',
    dias_apos_vencimento: null
  }
}

export function itemFromRecord(item) {
  return {
    id: item.id,
    codigo: item.codigo ?? '',
    nome: item.nome ?? '',
    dias_apos_vencimento: item.dias_apos_vencimento ?? null
  }
}
