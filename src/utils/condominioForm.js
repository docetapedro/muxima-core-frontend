export function emptyCondominio() {
  return {
    municipio: null,
    projecto: null,
    moeda: null,
    nome: '',
    nome_abreviado: '',
    valor_global: null,
    valor_dolar: null,
    descricao: null,
    localizacao: null,
    latitude: null,
    longitude: null,
    data_abertura: '',
    dimensao: null
  }
}

export function condominioFromRecord(condominio) {
  return {
    id: condominio.id,
    municipio: condominio.municipio ?? null,
    projecto: condominio.projecto ?? null,
    moeda: condominio.moeda ?? null,
    nome: condominio.nome ?? '',
    nome_abreviado: condominio.nome_abreviado ?? '',
    valor_global: condominio.valor_global ?? null,
    valor_dolar: condominio.valor_dolar ?? null,
    descricao: condominio.descricao ?? null,
    localizacao: condominio.localizacao ?? null,
    latitude: condominio.latitude ?? null,
    longitude: condominio.longitude ?? null,
    data_abertura: condominio.data_abertura ?? '',
    dimensao: condominio.dimensao ?? null
  }
}

export function condominioToPayload(formData) {
  const { id, ...rest } = formData

  return {
    municipio: rest.municipio,
    projecto: rest.projecto,
    moeda: rest.moeda,
    nome: rest.nome,
    nome_abreviado: rest.nome_abreviado,
    valor_global: rest.valor_global,
    valor_dolar: rest.valor_dolar,
    descricao: rest.descricao,
    localizacao: rest.localizacao,
    latitude: rest.latitude,
    longitude: rest.longitude,
    data_abertura: rest.data_abertura,
    dimensao: rest.dimensao
  }
}

export function formatCondominioLabel(condominio) {
  if (!condominio) return ''
  const parts = [condominio.nome, condominio.nome_abreviado].filter(Boolean)
  return parts.join(' · ') || `Condomínio #${condominio.id}`
}
