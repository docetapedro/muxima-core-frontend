export function emptyTipologia() {
  return {
    nome: '',
  }
}

export function tipologiaFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
  }
}

export function tipologiaToPayload(formData) {
  const { id, ...rest } = formData
  return {
    nome: rest.nome,
  }
}
