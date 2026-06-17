// Cache em memória para listagens usadas em dropdowns/lookups.
// - Evita refazer o mesmo GET cada vez que um formulário é aberto.
// - Faz "single-flight": pedidos paralelos para a mesma chave partilham a promise.
// - Tem TTL configurável por chave (por defeito 5 min).
// Para forçar o refresh após uma alteração CRUD na entidade, chamar
// invalidateLookup('lookup:<entidade>') no handler de sucesso do FormModal/destroy.

const DEFAULT_TTL_MS = 5 * 60 * 1000

const cache = new Map()
const inflight = new Map()

export async function getCachedLookup(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  if (inflight.has(key)) return inflight.get(key)

  const promise = (async () => {
    try {
      const data = await fetcher()
      cache.set(key, { data, expiresAt: Date.now() + ttlMs })
      return data
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, promise)
  return promise
}

export function invalidateLookup(key) {
  cache.delete(key)
  inflight.delete(key)
}

// Invalida todas as chaves que começam por `prefix` — útil para caches
// parametrizados (ex.: "lookup:municipios:14", "lookup:municipios:7", ...).
export function invalidateLookupPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(prefix)) inflight.delete(key)
  }
}

export function clearLookupCache() {
  cache.clear()
  inflight.clear()
}
