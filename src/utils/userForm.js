export function emptyUser() {
  return {
    name: '',
    username: '',
    email: '',
    password: '',
    perfil: '',
    administrador: false,
    superadministrador: false,
    consultor: false,
    activo: true
  }
}

export function userFromRecord(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
    perfil: user.perfil || '',
    administrador: user.administrador,
    superadministrador: user.superadministrador,
    consultor: user.consultor,
    activo: user.activo
  }
}
