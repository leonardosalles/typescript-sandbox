# Diário de Experimentos — POC DevOps Dashboard

> Seguindo o guia de Deep POC: documente cada experimento, o que você aprendeu,
> e o que ainda quer explorar. Este arquivo cresce com a POC.

---

## Experimento 1 — Setup ElysiaJS + Bun

**Data**: [preencher]
**Duração**: ~2h

### O que fiz
- Configurei o ElysiaJS do zero com Bun como runtime
- Explorei o sistema de plugins (`.use()`)
- Testei validação com TypeBox via parâmetros de rota

### O que aprendi
- Bun inicializa significativamente mais rápido que Node.js
- O TypeBox integrado elimina a necessidade de libs separadas de validação
- O sistema de lifecycle hooks (onRequest, onError) é similar ao Fastify
- `error()` do Elysia retorna HTTP errors tipados — muito elegante

### Código de teste
```typescript
// Testei o que acontece quando o schema de validação falha:
// GET /api/v1/servers/  (id vazio)
// → 422 Validation Error automático, sem código extra
```

### Dúvidas para investigar
- Como o radix tree do Elysia compara com o do Fastify?
- O Eden Treaty funciona bem com monorepos?

---

## Experimento 2 — Redux EntityAdapter

**Data**: [preencher]
**Duração**: ~3h

### O que fiz
- Implementei o serversSlice com EntityAdapter
- Comparei a abordagem de array simples vs. entidades normalizadas
- Testei os seletores gerados automaticamente

### O que aprendi
- `setAll` é perfeito para polling — substitui tudo atomicamente
- `upsertOne` para atualizações incrementais
- Os seletores base (`selectAll`, `selectById`) são memoizados pelo adapter
- O Redux DevTools mostra cada `fetchServers/fulfilled` com o payload completo

### Observação importante
O `selectFiltered` atual NÃO é memoizado — ele recalcula a cada render.
Para produção, usar `createSelector`:

```typescript
import { createSelector } from '@reduxjs/toolkit'

const selectFiltered = createSelector(
  [serversAdapter.getSelectors().selectAll, (state: RootState) => state.servers.filters],
  (servers, filters) => {
    // Esta função só roda quando servers ou filters mudam
    return servers.filter(...)
  }
)
```

### Próximo experimento
Migrar para RTK Query e comparar a quantidade de código necessária.

---

## Experimento 3 — Polling vs WebSockets

**Data**: [preencher — faça este experimento!]

### O que testar
1. Polling atual: `setInterval` a cada 6s
2. RTK Query `pollingInterval`
3. WebSocket com Elysia:

```typescript
// Backend (Elysia):
app.ws('/ws/metrics', {
  message(ws, message) { /* ... */ },
  open(ws) {
    const interval = setInterval(() => {
      ws.send(JSON.stringify(generateServers()))
    }, 2000)
    // cleanup no close
  }
})

// Frontend:
const ws = new WebSocket('ws://localhost:3001/ws/metrics')
ws.onmessage = (e) => dispatch(serversAdapter.setAll(JSON.parse(e.data)))
```

### Perguntas a responder
- Qual abordagem usa menos banda?
- Qual tem menor latência percebida?
- Qual é mais simples de implementar e manter?

---

## Referências para aprofundar

### ElysiaJS
- Source: https://github.com/elysiajs/elysia
- Benchmark: https://github.com/SaltyAom/bun-http-framework-benchmark
- Docs: https://elysiajs.com/

### Redux Toolkit
- Source: https://github.com/reduxjs/redux-toolkit
- EntityAdapter: https://redux-toolkit.js.org/api/createEntityAdapter
- RTK Query: https://redux-toolkit.js.org/rtk-query/overview

### Bun
- Source: https://github.com/oven-sh/bun (escrito em Zig!)
- Benchmark vs Node: https://bun.sh/

### Padrões relacionados
- Flux Architecture (origem do Redux): https://facebook.github.io/flux/
- Immer (usado internamente pelo RTK): https://immerjs.github.io/immer/
- Radix Tree (roteamento do Elysia): https://en.wikipedia.org/wiki/Radix_tree
