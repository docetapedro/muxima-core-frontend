export function emptyModelo() {
  return {
    nome: '',
  }
}

export function modeloFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
  }
}

export function modeloToPayload(formData) {
  const { id, ...rest } = formData
  return {
    nome: rest.nome,
  }
}
