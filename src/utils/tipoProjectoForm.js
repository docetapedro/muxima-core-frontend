export function emptyTipoProjecto() {
  return {
    nome: '',
    descricao: ''
  }
}

export function tipoProjectoFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
    descricao: record.descricao ?? ''
  }
}
