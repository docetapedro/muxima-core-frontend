export function emptyModeloEntrega() {
  return {
    codigo: '',
    nome: '',
    descricao: '',
  }
}

export function modeloEntregaFromRecord(record) {
  return {
    id: record.id,
    codigo: record.codigo ?? '',
    nome: record.nome ?? '',
    descricao: record.descricao ?? '',
  }
}

export function modeloEntregaToPayload(formData) {
  return {
    codigo: formData.codigo,
    nome: formData.nome,
    descricao: formData.descricao,
  }
}
