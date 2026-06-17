import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ImportIcon,
  Settings,
  BanknoteIcon,
  BarChart2,
  MessageCircle,
  FileStack
} from 'lucide-vue-next'

/** Estrutura alinhada ao menu Laravel (sem permissões por agora) */
export const navigation = [
  { type: 'title', name: 'sec-menu', label: 'Menu' },
  {
    type: 'link',
    name: 'dashboard',
    label: 'Painel Principal',
    to: '/',
    icon: LayoutDashboard
  },

  { type: 'title', name: 'sec-modulos', label: 'Módulos' },

  {
    type: 'group',
    name: 'entidades',
    label: 'Gestão de Entidades',
    icon: Users,
    children: [
      { type: 'link', name: 'entidades', label: 'Entidades', to: '/entidades' }
    ]
  },
  {
    type: 'group',
    name: 'imoveis',
    label: 'Gestão de Imóveis',
    icon: Building2,
    children: [
      { type: 'link', name: 'imoveis-list', label: 'Imóveis', to: '/imoveis' },
      { type: 'link', name: 'condominios', label: 'Condomínios', to: '/condominios' },
      { type: 'link', name: 'entregas', label: 'Entregas', to: '/entregas' },
      { type: 'link', name: 'vistorias', label: 'Vistorias', to: '/vistorias' }
    ]
  },
  {
    type: 'group',
    name: 'contrato',
    label: 'Gestão Contratual',
    icon: FileText,
    children: [
      { type: 'link', name: 'negociacoes', label: 'Negociações', to: '/negociacoes' },
      { type: 'link', name: 'rescisoes', label: 'Rescisões', to: '/rescisoes' }
    ]
  },
  {
    type: 'group',
    name: 'pagamentos',
    label: 'Gestão de Pagamentos',
    icon: BanknoteIcon,
    children: [
      { type: 'link', name: 'pagamentos-list', label: 'Pagamentos', to: '/pagamentos' },
      { type: 'link', name: 'extrato-contas', label: 'Extrato de Contas', to: '/extrato-contas' },
      { type: 'link', name: 'extrato-condominios', label: 'Extrato de Condomínios', to: '/extrato-condominios' },
      { type: 'link', name: 'exploracao', label: 'Exploração', to: '/pagamentos/exploracao' }
    ]
  },
  {
    type: 'group',
    name: 'relatorios',
    label: 'Relatórios',
    icon: BarChart2,
    children: [
      { type: 'link', name: 'analise-financeira', label: 'Análise Financeira', to: '/relatorios/analise-financeira' },
      { type: 'link', name: 'inadimplencia', label: 'Inadimplência por Condomínio', to: '/relatorios/inadimplencia-condominio' },
      { type: 'link', name: 'aging-inadimplencia', label: 'Aging de Inadimplência', to: '/relatorios/aging-inadimplencia' },
      { type: 'link', name: 'mapa-cobranca', label: 'Mapa de Cobrança Mensal', to: '/relatorios/mapa-cobranca-mensal' },
      { type: 'link', name: 'cash-flow', label: 'Cash Flow Projectado', to: '/relatorios/cash-flow-projectado' }
    ]
  },
  {
    type: 'group',
    name: 'importacoes',
    label: 'Importações',
    icon: ImportIcon,
    children: [
      
      { type: 'link', name: 'importacao-entidades', label: 'Entidades', to: '/importacao/entidades' },
      { type: 'link', name: 'importacao-pagamentos', label: 'Pagamentos', to: '/importacao/pagamentos' }
    ]
  },
  {
    type: 'group',
    name: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    children: [
      {
        type: 'group',
        name: 'configuracoes.acesso',
        label: 'Acesso',
        children: [
          { type: 'link', name: 'config-primavera', label: 'Config. Primavera', to: '/configuracao-primavera' },
          { type: 'link', name: 'users', label: 'Utilizadores', to: '/users' },
          { type: 'link', name: 'perfis', label: 'Perfis/Permissões', to: '/perfis' }
        ]
      },
      {
        type: 'group',
        name: 'configuracoes.imovel',
        label: 'Imóvel',
        children: [
          { type: 'link', name: 'modelos', label: 'Modelos', to: '/modelos' },
          { type: 'link', name: 'modelo-entregas', label: 'Modelos de Entrega', to: '/modelo-entregas' },
          { type: 'link', name: 'tipoimoveis', label: 'Tipo Imóveis', to: '/tipoimoveis' },
          { type: 'link', name: 'tipoextras', label: 'Tipo de Extras', to: '/tipo-extras' },
          { type: 'link', name: 'tipolotes', label: 'Tipo de Lotes', to: '/tipo-lotes' },
          { type: 'link', name: 'tipologias', label: 'Tipologias', to: '/tipologias' }
        ]
      },
      {
        type: 'group',
        name: 'configuracoes.pagamento',
        label: 'Pagamento',
        children: [
          { type: 'link', name: 'tipos-pagamentos', label: 'Tipos de Pagamentos', to: '/tipos-pagamentos' },
          { type: 'link', name: 'moedas', label: 'Moedas', to: '/moedas' },
          { type: 'link', name: 'cambios', label: 'Câmbios', to: '/cambios' }
        ]
      },
      { type: 'link', name: 'projectos', label: 'Projectos', to: '/projectos' },
      { type: 'link', name: 'condominios-config', label: 'Condomínios', to: '/condominios' },
      { type: 'link', name: 'tipos-projectos', label: 'Tipos de Proj.', to: '/tipoprojectos' },
      { type: 'link', name: 'items', label: 'Items', to: '/items' },
      {
        type: 'group',
        name: 'configuracoes.suporte',
        label: 'Suporte',
        children: [
      
          { type: 'link', name: 'provincias', label: 'Províncias', to: '/provincias' },
          { type: 'link', name: 'municipios', label: 'Municípios', to: '/municipios' }
        ]
      }
    ]
  },

  {
    type: 'link',
    name: 'logs',
    label: 'Logs',
    to: '/logs',
    icon: FileStack
  },
  {
    type: 'link',
    name: 'chat',
    label: 'Chat',
    to: '/chat',
    icon: MessageCircle
  }
]

export function isPathActive(path, to) {
  if (!to) return false
  if (to === '/') return path === '/'
  return path === to || path.startsWith(`${to}/`)
}

export function isItemActive(path, item) {
  if (item.type === 'link') return isPathActive(path, item.to)
  if (item.type === 'group' && item.children) {
    return item.children.some((child) => isItemActive(path, child))
  }
  return false
}

export function findActiveNavItem(path, items = navigation) {
  for (const item of items) {
    if (item.type === 'link' && isPathActive(path, item.to)) return item
    if (item.children) {
      const found = findActiveNavItem(path, item.children)
      if (found) return found
    }
  }
  return null
}

/** Devolve todos os grupos que devem estar abertos para a rota actual */
/** Todos os links do menu (sem duplicados por `to`) */
export function collectNavLinks(items = navigation) {
  const map = new Map()

  function walk(list) {
    for (const item of list) {
      if (item.type === 'link' && item.to) {
        map.set(item.to, { name: item.name, label: item.label, to: item.to })
      }
      if (item.children) walk(item.children)
    }
  }

  walk(items)
  return [...map.values()]
}

export function findExpandedGroupNames(path, items = navigation, ancestors = []) {
  const names = []
  for (const item of items) {
    if (item.type === 'group' && isItemActive(path, item)) {
      names.push(...ancestors, item.name)
      if (item.children) {
        names.push(...findExpandedGroupNames(path, item.children, [...ancestors, item.name]))
      }
    }
  }
  return names
}
