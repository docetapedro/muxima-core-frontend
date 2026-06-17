export function emptyEntidade() {
  return {
    tipo: 'PESSOA',
    num_entidade: '',
    nome: '',
    email: null,
    num_bi: null,
    num_cartao_residente: null,
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
    provincia: null,
    naturalidade: null,
  }
}

export function entidadeFromRecord(entidade) {
  const naturalidadeRel =
    entidade.naturalidade && typeof entidade.naturalidade === 'object'
      ? entidade.naturalidade
      : entidade.municipio_naturalidade && typeof entidade.municipio_naturalidade === 'object'
        ? entidade.municipio_naturalidade
        : null

  const naturalidadeId =
    naturalidadeRel?.id ??
    (typeof entidade.naturalidade === 'number' || typeof entidade.naturalidade === 'string'
      ? entidade.naturalidade
      : null) ??
    entidade.naturalidade_id ??
    entidade.municipio_naturalidade_id ??
    null

  const provinciaId =
    naturalidadeRel?.provincia?.id ??
    naturalidadeRel?.provincia_id ??
    entidade.provincia_id ??
    (entidade.provincia && typeof entidade.provincia === 'object' ? entidade.provincia.id : entidade.provincia) ??
    null

  return {
    id: entidade.id,
    tipo: entidade.tipo ?? 'PESSOA',
    num_entidade: entidade.num_entidade ?? '',
    estado_civil: entidade.estado_civil ?? null,
    genero: entidade.genero ?? null,
    telefone: entidade.telefone ?? null,
    nome: entidade.nome ?? '',
    email: entidade.user?.email ?? entidade.email ?? null,
    num_bi: entidade.num_bi ?? null,
    num_cartao_residente: entidade.num_cartao_residente ?? null,
    num_passaporte: entidade.num_passaporte ?? null,
    data_emissao: entidade.data_emissao ?? null,
    data_expiracao: entidade.data_expiracao ?? null,
    data_nascimento: entidade.data_nascimento ?? null,
    endereco: entidade.endereco ?? 'Sem endereço',
    nif: entidade.nif ?? null,
    razao_social: entidade.razao_social ?? null,
    provincia: provinciaId != null ? Number(provinciaId) : null,
    naturalidade: naturalidadeId != null ? Number(naturalidadeId) : null,
    _savedProvincia: naturalidadeRel?.provincia
      ? { id: naturalidadeRel.provincia.id, nome: naturalidadeRel.provincia.nome }
      : null,
    _savedNaturalidade: naturalidadeRel
      ? { id: naturalidadeRel.id, nome: naturalidadeRel.nome }
      : null,
  }
}
