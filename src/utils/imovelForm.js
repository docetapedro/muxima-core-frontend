export function emptyImovel() {
  return {
    condominio: null,
    quadra: '',
    lote: '',
    tipo_lote: null,
    modelo: null,
    tipologia: null,
    tipo_imovel: null,
    placa: '',
    area_lote: null,
    moeda: null,
    entregue: false,
    concluido: false,
    estado_entrega: null,
    estado_imovel: null,
    valor_obra: null,
    data_entrega: null,
    latitude: null,
    longitude: null,
    altitude: null,
    data_prevista_conclusao: null,
    prazo_entrega: '',
    quantidade:1
  }
}

export function imovelFromRecord(imovel) {
  return {
    id: imovel.id,
    condominio: imovel.condominio?.nome ?? null,
    quadra: imovel.quadra ?? '',
    lote: imovel.lote ?? '',
    tipo_lote: imovel.tipo_lote ?? null,
    modelo: imovel.modelo ?? null,
    tipologia: imovel.tipologia ?? null,
    tipo_imovel: imovel.tipoImovel?.nome ?? null,
    placa: imovel.placa ?? '',
    area_lote: imovel.area_lote ?? null,
    moeda: imovel.moeda ?? null,
    entregue: Boolean(imovel.entregue),
    concluido: Boolean(imovel.concluido),
    estado_entrega: imovel.estado_entrega ?? null,
    estado_imovel: imovel.estado_imovel ?? null,
    valor_obra: imovel.valor_obra ?? null,
    data_entrega: imovel.data_entrega ?? null,
    latitude: imovel.latitude ?? null,
    longitude: imovel.longitude ?? null,
    altitude: imovel.altitude ?? null,
    data_prevista_conclusao: imovel.data_prevista_conclusao ?? null,
    prazo_entrega: imovel.prazo_entrega != null ? String(imovel.prazo_entrega) : '',
    quantidade: imovel.quantidade ?? 1
  }
}

export function imovelToPayload(formData) {
  const { id, ...rest } = formData
  return {
    condominio: rest.condominio,
    quadra: rest.quadra,
    lote: rest.lote,
    tipo_lote: rest.tipo_lote,
    modelo: rest.modelo,
    tipologia: rest.tipologia,
    tipo_imovel: rest.tipo_imovel,
    placa: rest.placa,
    area_lote: rest.area_lote,
    moeda: rest.moeda,
    entregue: rest.entregue,
    concluido: rest.concluido,
    estado_entrega: rest.estado_entrega,
    estado_imovel: rest.estado_imovel,
    valor_obra: rest.valor_obra,
    data_entrega: rest.data_entrega || null,
    latitude: rest.latitude,
    longitude: rest.longitude,
    altitude: rest.altitude,
    data_prevista_conclusao: rest.data_prevista_conclusao || null,
    prazo_entrega: rest.prazo_entrega,
    quantidade: rest.quantidade || 1
  }
}

export function formatImovelLabel(imovel) {
  if (!imovel) return ''
  const parts = [imovel.placa, imovel.quadra && imovel.lote ? `${imovel.quadra}/${imovel.lote}` : null]
    .filter(Boolean)
  return parts.join(' · ') || `Imóvel #${imovel.id}`
}
