export function getTipoEntidadeLabel(value) {
  const tipos = {
    P: 'Pessoa',
    E: 'Empresa',
    1: 'Particular',
    2: 'Empresa',
    3: 'Instituição'
  }

  const key = value == null ? '' : String(value).trim().toUpperCase()
  return tipos[key] || value || '-'
}



export function getMunicipioLabel(value) {
  const municipios = { 1: 'Luanda', 2: 'Benguela', 3: 'Huíla' }
  return municipios[value] || value || '-'
}

export function getEstadoCivilLabel(value) {
  const estados = {
    SO: 'Solteiro(a)',
    CA: 'Casado(a)',
    DI: 'Divorciado(a)',
    VI: 'Viúvo(a)'
  }
  return estados[value] || value || '-'
}

export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-PT')
}
