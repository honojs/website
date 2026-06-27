# InferDI

[InferDI](https://github.com/inferdi/inferdi) is a zero-dependency, decorator-free, strongly typed dependency injection container for TypeScript. The [`@inferdi/hono`](https://www.npmjs.com/package/@inferdi/hono) middleware wires it into Hono's request pipeline: it creates one DI scope per request, exposes it on the context as `c.var.di`, and disposes it after the response completes — no decorators, reflection, or route scanning.

The graph _is_ the type: a misordered dependency, a missing key, or a request-scoped value leaking into a singleton are all compile errors, not runtime surprises.

## 🛠️ Installation

```bash
npm install @inferdi/inferdi @inferdi/hono
```

> **Note:**  
> InferDI ships on both npm and JSR. On Deno install it with `deno add jsr:@inferdi/inferdi jsr:@inferdi/hono npm:hono`.

---

## 🚀 Getting Started

### 1. Build a container

Register your services on a root `Container`. Dependencies are passed as a tuple of keys and type-checked positionally against the constructor — a wrong order or type is a compile error. Each registration declares a lifetime: `singleton` (default, one instance per container), `scoped` (one per request), or `transient` (new on every resolve).

```ts
// container.ts
import { Container } from '@inferdi/inferdi'

export function buildRootContainer() {
  return (
    new Container()
      .registerClass('logger', Logger, [])
      // `request` is scoped: a fresh instance per request scope.
      .registerClass('request', RequestContext, [], 'scoped')
      // `users` is scoped too — it depends on the scoped `request`.
      .registerClass('users', UserService, ['logger', 'request'], 'scoped')
  )
}
```

> **Note:**  
> A `singleton` cannot depend on a `scoped` or `transient` service — that would leak a short-lived value into a long-lived one, and InferDI rejects it at compile time. Keep request-bound services `scoped`.

---

### 2. Add the middleware

`inferdiHono` creates a request scope before your handlers run and disposes it afterwards. `InferdiHonoEnv<typeof root>` types `c.var.di` as your concrete scope, so `.get(key)` stays fully typed.

```ts
import { Hono } from 'hono'
import { inferdiHono, type InferdiHonoEnv } from '@inferdi/hono'
import { buildRootContainer } from './container'

const root = buildRootContainer()
const app = new Hono<InferdiHonoEnv<typeof root>>()

app.use('*', inferdiHono({ container: root }))

export default app
```

---

### 3. Hydrate the request scope

Use `setupScope` to fill request-scoped services with per-request data (request id, authenticated user, …) before any handler sees the scope. It runs once per request and may be async.

```ts
app.use('*', inferdiHono({
  container: root,
  setupScope: (scope, c) => {
    const request = scope.get('request')
    request.requestId = crypto.randomUUID()
    request.userId = c.req.header('x-user-id')
  }
}))
```

---

### 4. Resolve services in handlers

Resolve any registered service from the request scope with `c.var.di.get(key)`. The returned value is fully typed, and scoped services share one instance for the whole request.

```ts
app.get('/users/:id', async (c) => {
  const user = await c.var.di.get('users').profile(c.req.param('id'))
  return c.json(user)
})
```

`c.get('di')` is equivalent to `c.var.di`. To use a different context key, pass `key` and reflect it in the env type:

```ts
type AppEnv = InferdiHonoEnv<typeof root, 'container'>

const app = new Hono<AppEnv>()
app.use('*', inferdiHono({ container: root, key: 'container' }))

app.get('/users/:id', (c) =>
  c.json(c.var.container.get('users').profile(c.req.param('id')))
)
```

---

## ⚙️ Options

`inferdiHono` accepts the following options:

| Option           | Default              | Description                                                               |
| ---------------- | -------------------- | ------------------------------------------------------------------------- |
| `container`      | —                    | **Required.** The root container. The middleware never disposes the root. |
| `key`            | `'di'`               | Context variable key used for `c.var[key]` / `c.get(key)`.                |
| `createScope`    | `root.createScope()` | Overrides how the request scope is created. May be async.                 |
| `setupScope`     | —                    | Hydrates the scope before handlers run. May be async.                     |
| `disposeScope`   | `scope.dispose()`    | Overrides request-scope disposal. May be async.                           |
| `autoDispose`    | `true`               | Set to `false` (or return `false`) when application code owns disposal.   |
| `onDisposeError` | `console.error`      | Sink for post-response disposal failures.                                 |

---

## 🌊 Streaming

A streaming response returns before the stream callback finishes, so disable auto-disposal with `skipInferdiDispose(c)` and dispose the scope yourself when the stream ends.

```ts
import { stream } from 'hono/streaming'
import { skipInferdiDispose } from '@inferdi/hono'

app.get('/events', (c) => {
  skipInferdiDispose(c)
  const scope = c.var.di
  const events = scope.get('events')

  return stream(c, async (s) => {
    try {
      for await (const event of events.subscribe()) {
        await s.write(`data: ${JSON.stringify(event)}\n\n`)
      }
    } finally {
      await scope.dispose()
    }
  })
})
```

---

## See also

- [InferDI Hono adapter docs](https://inferdi.com/adapters/hono)
- [`@inferdi/hono` on GitHub](https://github.com/inferdi/inferdi/tree/main/packages/hono)
