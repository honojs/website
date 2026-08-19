# InferDI

[InferDI](https://github.com/inferdi/inferdi) is a dependency
injection container for TypeScript. It has no decorators, reflection,
or runtime dependencies. The
[`@inferdi/hono`](https://www.npmjs.com/package/@inferdi/hono)
middleware creates a request scope for each middleware invocation, exposes it as
`c.var.di`, and disposes it after the route pipeline finishes.

The container carries its dependency graph in its type. TypeScript
reports missing or misordered dependencies and invalid lifetime
relationships.

## Installation

```bash
npm install @inferdi/inferdi @inferdi/hono
```

> [!NOTE]
> InferDI is also available on JSR. With Deno, run
> `deno add jsr:@inferdi/inferdi jsr:@inferdi/hono npm:hono`.

## Getting started

### 1. Build the container

Request data belongs at the HTTP boundary. Define a small application
type instead of putting Hono's `Context` in the dependency graph.

```ts
// container.ts
import { Container } from '@inferdi/inferdi'
import { connectDatabase, UserService } from './services'

export interface RequestContext {
  readonly requestId: string
  readonly userId: string | undefined
}

const config = {
  dsn: 'postgres://localhost/app'
} satisfies { readonly dsn: string }

export const root = new Container()
  .registerValue('config', config)
  .declareScopeInputs<{ request: RequestContext }>()
  .registerAsyncFactory(
    'db',
    (config: typeof config) => connectDatabase(config.dsn),
    ['config']
  )
  .registerClass('users', UserService, ['db', 'request'], 'scoped')
```

`declareScopeInputs()` adds a type-only slot to the graph. It does not
register a value. Because `users` depends on `request`, InferDI does
not allow that service to be resolved until a scope provides the
input. `users` is scoped because a singleton cannot depend on request-scoped data.

### 2. Create the request scope

Use a function to create the concrete scope required by the application:

```ts
const openRequestScope = (request: RequestContext) => root.createScope({ request })

type RequestScope = ReturnType<typeof openRequestScope>
```

### 3. Add the middleware

`InferdiHonoScopeEnv` exposes the concrete, ready `RequestScope` through Hono's context variables.

```ts
import { Hono } from 'hono'
import {
  inferdiHono,
  type InferdiHonoScopeEnv,
} from '@inferdi/hono'

type AppEnv = InferdiHonoScopeEnv<RequestScope>

const app = new Hono<AppEnv>()

const createRequestScope = (userId: string | undefined) =>
  openRequestScope({
    requestId: crypto.randomUUID(),
    userId
  })

app.use(
  '*',
  inferdiHono({
    container: root,
    createScope: (_root, c) => createRequestScope(c.req.header('x-user-id'))
  })
)
```

`InferdiHonoEnv<typeof root>` remains useful when the middleware uses
the type returned by the root's zero-argument `createScope()`. A
custom scope factory can return a more specific type, as it does here,
so this example uses `InferdiHonoScopeEnv<RequestScope>`.

### 4. Resolve services

Use `get()` for ready synchronous keys and `getAsync()` for
declarative async keys. The `request` input is synchronous, while
`users` is async because it depends on `db`.

```ts
app.get('/users/:id', async (c) => {
  const request = c.var.di.get('request') // RequestContext
  const users = await c.var.di.getAsync('users') // UserService
  const user = await users.profile(c.req.param('id'))

  return c.json({ requestId: request.requestId, user })
})

export default app
```

`c.get('di')` is equivalent to `c.var.di` and has the same type.

## Async dependencies

`registerAsyncFactory()` stores the final `Database` type in the
graph, not `Promise<Database>`. Its async status propagates to
`UserService`, so both services are resolved with `getAsync()`.
Although `getAsync()` also accepts ready synchronous keys, use `get()`
for ordinary sync services.

A `registerFactory()` callback that returns a Promise has different
semantics. The Promise itself is the service value, remains a sync
graph entry, and is resolved with `get()`.

## Custom context key

Pass `key` to expose the same scope under another Hono context
variable. The custom scope factory must still provide the declared
request input.

```ts
type CustomEnv = InferdiHonoScopeEnv<RequestScope, 'container'>

const customKeyApp = new Hono<CustomEnv>()

customKeyApp.use(
  '*',
  inferdiHono({
    container: root,
    key: 'container',
    createScope: (_root, c) => createRequestScope(c.req.header('x-user-id'))
  })
)

customKeyApp.get('/users/:id', async (c) => {
  const users = await c.var.container.getAsync('users')
  return c.json(await users.profile(c.req.param('id')))
})
```

## Options

`inferdiHono` accepts these options:

| Option           | Default              | Description                                                                     |
|------------------|----------------------|---------------------------------------------------------------------------------|
| `container`      | Required             | Root container. The middleware never disposes it.                               |
| `key`            | `'di'`               | Context variable used by `c.var[key]` and `c.get(key)`.                         |
| `createScope`    | `root.createScope()` | Creates the request scope. Use it to pass typed inputs from Hono. May be async. |
| `setupScope`     | None                 | Runs after scope creation and before route handlers. May be async.              |
| `disposeScope`   | `scope.dispose()`    | Overrides request-scope disposal. May be async.                                 |
| `autoDispose`    | `true`               | Set to `false`, or return `false`, when application code owns disposal.         |
| `onDisposeError` | `console.error`      | Handles request-scope cleanup failures.                                         |

## Streaming

Hono's `stream()`, `streamText()`, and `streamSSE()` can return a
`Response` before their callbacks finish. Call `skipInferdiDispose()`
before returning the response, then dispose the scope when the stream
ends.

```ts
import { streamText } from 'hono/streaming'
import { skipInferdiDispose } from '@inferdi/hono'

app.get('/users/:id/export', (c) => {
  skipInferdiDispose(c)

  const scope = c.var.di
  const id = c.req.param('id')

  return streamText(c, async (stream) => {
    try {
      const users = await scope.getAsync('users')
      const user = await users.profile(id)
      await stream.write(JSON.stringify(user) ?? 'null')
    } finally {
      await scope.dispose()
    }
  })
})
```

`skipInferdiDispose()` suppresses automatic cleanup only for a
successful response. If the route fails before returning the response,
the middleware still disposes the scope.

## See also

- [InferDI Hono adapter docs](https://inferdi.com/adapters/hono)
- [`@inferdi/hono` on GitHub](https://github.com/inferdi/inferdi/tree/main/packages/hono)
