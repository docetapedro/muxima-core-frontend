import { collectNavLinks } from '@/config/navigation'
import { isRouteImplemented } from '@/config/implementedRoutes'

const UnderConstruction = () => import('@/pages/common/ModuleUnderConstruction.vue')

export function buildPlaceholderRoutes() {
  return collectNavLinks()
    .filter((link) => !isRouteImplemented(link.to))
    .map((link) => ({
      path: link.to.replace(/^\//, ''),
      name: link.name,
      component: UnderConstruction,
      meta: { moduleTitle: link.label }
    }))
}
