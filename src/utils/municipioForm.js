export function emptyMunicipio() {
  return {
    nome: '',
    provincia: null
  }
}

export function municipioFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome,
    provincia: record.provincia?.id ?? record.provincia ?? null
  }
}

export function municipioToPayload(formData) {
  return {
    nome: formData.nome,
    provincia_id: formData.provincia
  }
}
