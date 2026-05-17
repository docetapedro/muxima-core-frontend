/** Rotas com páginas reais implementadas */
const EXACT_PATHS = new Set([
  '/',
  '/cambios',
  '/moedas',
  '/entidades',
  '/users',
  '/imoveis',
  '/municipios',
  '/modelos',
  '/provincias',
  '/projectos',
  '/tipologias',
  '/tipoimoveis',
  '/pagamentos'
])

const PATH_PATTERNS = [
  /^\/cambios\/[^/]+$/,
  /^\/moedas\/[^/]+$/,
  /^\/entidades\/[^/]+$/,
  /^\/users\/[^/]+$/,
  /^\/imoveis\/[^/]+$/,
  /^\/municipios\/[^/]+$/,
  /^\/modelos\/[^/]+$/,
  /^\/provincias\/[^/]+$/,
  /^\/projectos\/[^/]+$/,
  /^\/tipologias\/[^/]+$/,
  /^\/tipoimoveis\/[^/]+$/
]

export function isRouteImplemented(path) {
  if (EXACT_PATHS.has(path)) return true
  return PATH_PATTERNS.some((pattern) => pattern.test(path))
}
