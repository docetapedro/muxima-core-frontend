export function emptyCondominio() {
  return {
    provincia: null,
    municipio: null,
    projecto: null,
    nome: '',
    nome_abreviado: '',
    valor_global: null,
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
    provincia: condominio.municipio.provincia?.id ?? condominio.municipio.provincia ?? condominio.municipio?.provincia?.id ?? condominio.municipio?.provincia ?? null,
    municipio: condominio.municipio?.id ?? condominio.municipio ?? null,
    projecto: condominio.projecto?.id ?? condominio.projecto ?? null,
    nome: condominio.nome ?? '',
    nome_abreviado: condominio.nome_abreviado ?? '',
    valor_global: condominio.valor_global ?? null,
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
    nome: rest.nome,
    nome_abreviado: rest.nome_abreviado,
    valor_global: rest.valor_global,
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
