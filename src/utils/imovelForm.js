import { parseValorMonetarioEntrada } from './formatacao'

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
    condominio: imovel.condominio?.id ?? imovel.condominio ?? null,
    quadra: imovel.quadra ?? '',
    lote: imovel.lote ?? '',
    tipo_lote: imovel.tipoLote?.id ?? imovel.tipo_lote?.id ?? imovel.tipo_lote ?? null,
    modelo: imovel.modelo?.id ?? imovel.modelo ?? null,
    tipologia: imovel.tipologia?.id ?? imovel.tipologia ?? null,
    tipo_imovel: imovel.tipoImovel?.id ?? imovel.tipo_imovel?.id ?? imovel.tipo_imovel ?? null,
    placa: imovel.placa ?? '',
    area_lote: parseValorMonetarioEntrada(imovel.area_lote),
    entregue: Boolean(imovel.entregue),
    concluido: Boolean(imovel.concluido),
    estado_entrega: imovel.estado_entrega ?? null,
    estado_imovel: imovel.estado_imovel ?? null,
    valor_obra: parseValorMonetarioEntrada(imovel.valor_obra),
    data_entrega: imovel.data_entrega ?? null,
    latitude: parseValorMonetarioEntrada(imovel.latitude),
    longitude: parseValorMonetarioEntrada(imovel.longitude),
    altitude: parseValorMonetarioEntrada(imovel.altitude),
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
  if (imovel.referencia) return imovel.referencia
  const parts = [imovel.placa, imovel.quadra && imovel.lote ? `${imovel.quadra}/${imovel.lote}` : null]
    .filter(Boolean)
  return parts.join(' · ') || `Imóvel #${imovel.id}`
}
