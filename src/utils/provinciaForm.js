export function emptyProvincia() {
  return {
    nome: '',
  }
}

export function provinciaFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
  }
}

export function provinciaToPayload(formData) {
  const { id, ...rest } = formData
  return {
    nome: rest.nome,
  }
}
