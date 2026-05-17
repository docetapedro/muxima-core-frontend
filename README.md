# Muxima Frontend — Vue 3 + shadcn-vue

## Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite** — bundler
- **Vue Router 4** — routing com guards de autenticação
- **Pinia** — estado global (auth store)
- **Axios** — HTTP client com refresh token automático
- **Tailwind CSS** — estilos
- **shadcn-vue** — componentes UI
- **lucide-vue-next** — ícones
- **@vueuse/core** — utilitários (dark mode, click outside, etc.)

## Estrutura
```
src/
├── api/
│   ├── http.js          # Axios com Bearer token + refresh automático
│   └── auth.js          # Chamadas de autenticação
├── stores/
│   └── auth.js          # Pinia store (login, logout, permissões)
├── router/
│   └── index.js         # Rotas + guards auth
├── layouts/
│   └── AppLayout.vue    # Sidebar + Topbar
├── pages/
│   ├── auth/Login.vue
│   ├── dashboard/Index.vue
│   ├── clientes/Index.vue
│   ├── imoveis/Index.vue
│   └── NotFound.vue
└── assets/index.css     # Tailwind + CSS variables shadcn
```

## Instalação

```bash
npm install
```

## Configuração

Cria o ficheiro `.env` (já incluído):
```env
VITE_API_URL=http://localhost:8000   # URL da tua API Laravel
VITE_APP_NAME=Muxima
```

## Desenvolvimento

```bash
npm run dev
```

Acede em: http://localhost:5173

## Build para produção

```bash
npm run build
```

## Instalar shadcn-vue (componentes adicionais)

```bash
npx shadcn-vue@latest init
npx shadcn-vue@latest add button table dialog form input select badge card toast
```

## Autenticação

A API usa **Sanctum Bearer Token + Refresh Token**.

O ficheiro `src/api/http.js` já trata automaticamente:
- Injecção do token em cada request (`Authorization: Bearer ...`)
- Renovação automática quando o token expira (401)
- Redirect para `/login` se o refresh token também expirar
- Fila de requests pendentes durante o refresh

## Adicionar novo módulo (exemplo: Negociações)

1. Criar `src/api/negociacoes.js`
2. Criar `src/pages/negociacoes/Index.vue`
3. Adicionar rota em `src/router/index.js`
4. Adicionar item no `navItems` de `AppLayout.vue`
