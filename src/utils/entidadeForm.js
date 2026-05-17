export function emptyEntidade() {
  return {
    tipo: 'PESSOA',
    num_entidade: '',
    nome: '',
    email: null,
    num_bi: null,
    num_passaporte: null,
    data_emissao: null,
    data_expiracao: null,
    estado_civil: null,
    genero: null,
    telefone: null,
    data_nascimento: null,
    endereco: 'Sem endereço',
    nif: null,
    razao_social: null,
  }
}

export function entidadeFromRecord(entidade) {
  return {
    id: entidade.id,
    tipo: entidade.tipo ?? 'PESSOA',
    num_entidade: entidade.num_entidade ?? '',
    estado_civil: entidade.estado_civil ?? null,
    genero: entidade.genero ?? null,
    telefone: entidade.telefone ?? null,
    nome: entidade.nome ?? '',
    email: entidade.user?.email ?? null,
    num_bi: entidade.num_bi ?? null,
    num_passaporte: entidade.num_passaporte ?? null,
    data_emissao: entidade.data_emissao ?? null,
    data_expiracao: entidade.data_expiracao ?? null,
    data_nascimento: entidade.data_nascimento ?? null,
    endereco: entidade.endereco ?? 'Sem endereço',
    nif: entidade.nif ?? null,
    razao_social: entidade.razao_social ?? null,
  }
}
