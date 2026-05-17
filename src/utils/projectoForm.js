export function emptyProjecto() {
  return {
    nome: '',
    descricao: '',
    tipo_projecto: null,
  }
}

export function projectoFromRecord(record) {
  return {
    id: record.id,
    nome: record.nome ?? '',
    descricao: record.descricao ?? '',
    tipo_projecto: record.tipoProjecto?.id ?? null,
  }
}

export function projectoToPayload(formData) {
  const { id, ...rest } = formData
  return {
    nome: rest.nome,
    descricao: rest.descricao,
    tipo_projecto_id: rest.tipo_projecto,
  }
}
