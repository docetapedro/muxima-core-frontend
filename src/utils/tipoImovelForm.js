export function emptyTipoImovel() {
  return {
    nome: '',
    descricao: '',
  }
}

export function tipoImovelFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
    descricao: record.descricao ?? '',
  }
}

export function tipoImovelToPayload(formData) {
  const { id, ...rest } = formData
  return {
    nome: rest.nome,
    descricao: rest.descricao,
  }
}
