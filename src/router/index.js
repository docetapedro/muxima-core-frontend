import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { buildPlaceholderRoutes } from './placeholderRoutes'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { guest: true }
  },

  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/Index.vue'),
      },
      {
        path: 'cambios',
        name: 'cambios',
        component: () => import('@/pages/cambios/Index.vue'),
      },
      {
        path: 'moedas',
        name: 'moedas',
        component: () => import('@/pages/moedas/Index.vue'),
      },
      {
        path: 'entidades',
        name: 'entidades',
        component: () => import('@/pages/entidades/Index.vue'),
      },
      {
        path: 'entidades/:id',
        name: 'entidades.show',
        component: () => import('@/pages/entidades/Show.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/users/Index.vue'),
      },
      {
        path: 'users/:id',
        name: 'users.show',
        component: () => import('@/pages/users/Show.vue'),
      },
      {
        path: 'pagamentos',
        name: 'pagamentos',
        component: () => import('@/pages/pagamentos/Index.vue'),
      },
      {
        path: 'pagamentos/:id',
        name: 'pagamentos.show',
        component: () => import('@/pages/pagamentos/Index.vue'),
      },
      {
        path: 'municipios',
        name: 'municipios',
        component: () => import('@/pages/municipios/Index.vue'),
      },
      {
        path: 'municipios/:id',
        name: 'municipios.show',
        component: () => import('@/pages/municipios/Show.vue'),
      },
      {
        path: 'imoveis',
        name: 'imoveis',
        component: () => import('@/pages/imoveis/Index.vue'),
      },
       {
        path: 'imoveis/:id',
        name: 'imoveis.show',
        component: () => import('@/pages/imoveis/Show.vue'),
      },
      {
        path: 'condominios',
        name: 'condominios',
        component: () => import('@/pages/condominios/Index.vue'),
      },
      {
        path: 'condominios/:id',
        name: 'condominios.show',
        component: () => import('@/pages/condominios/Show.vue'),
      },
      {
        path: 'projectos',
        name: 'projectos',
        component: () => import('@/pages/projectos/Index.vue'),
      },
      {
        path: 'provincias',
        name: 'provincias',
        component: () => import('@/pages/provincias/Index.vue'),
      },
      {
        path: 'modelos',
        name: 'modelos',
        component: () => import('@/pages/modelos/Index.vue'),
      },
      {
        path: 'tipologias',
        name: 'tipologias',
        component: () => import('@/pages/tipologias/Index.vue'),
      },
      {
        path: 'tipoimoveis',
        name: 'tipoimoveis',
        component: () => import('@/pages/tipoimoveis/Index.vue'),
      },
      ...buildPlaceholderRoutes(),
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
