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
  '/modelo-entregas',
  '/provincias',
  '/projectos',
  '/tipologias',
  '/tipoimoveis',
  '/tipoprojectos',
  '/items',
  '/chat',
  '/perfil',
  '/relatorios/inadimplencia-condominio',
  '/relatorios/analise-financeira',
  '/relatorios/aging-inadimplencia',
  '/relatorios/mapa-cobranca-mensal',
  '/relatorios/cash-flow-projectado',
  '/pagamentos',
  '/negociacoes',
  '/extrato-contas',
  '/importacao/entidades',
  '/importacao/pagamentos'
])

const PATH_PATTERNS = [
  /^\/cambios\/[^/]+$/,
  /^\/moedas\/[^/]+$/,
  /^\/entidades\/[^/]+$/,
  /^\/users\/[^/]+$/,
  /^\/imoveis\/[^/]+$/,
  /^\/municipios\/[^/]+$/,
  /^\/modelos\/[^/]+$/,
  /^\/modelo-entregas\/[^/]+$/,
  /^\/provincias\/[^/]+$/,
  /^\/projectos\/[^/]+$/,
  /^\/tipologias\/[^/]+$/,
  /^\/tipoimoveis\/[^/]+$/,
  /^\/tipoprojectos\/[^/]+$/,
  /^\/items\/[^/]+$/,
  /^\/relatorios\/negociacoes\/[^/]+\/extrato-contas$/,
  /^\/importacao\/entidades$/
]

export function isRouteImplemented(path) {
  if (EXACT_PATHS.has(path)) return true
  return PATH_PATTERNS.some((pattern) => pattern.test(path))
}
