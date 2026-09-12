# Middleware

Middleware works before/after the endpoint `Handler`. We can get the `Request` before dispatching or manipulate the `Response` after dispatching.

## Definition of Middleware

- Handler - should return `Response` object. Only one handler will be called.
- Middleware - should `await next()` and return nothing to call the next Middleware, **or** return a `Response` to early-exit.

The user can register middleware using `app.use` or using `app.HTTP_METHOD` as well as the handlers. For this feature, it's easy to specify the path and the method.

```ts
// match any method, all routes
app.use(logger())

// specify path
app.use('/posts/*', cors())

// specify method and path
app.post('/posts/*', basicAuth())
```

If the handler returns `Response`, it will be used for the end-user and will stop processing.

```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

In this case, four middleware are processed before dispatching like this:

```ts
logger() -> cors() -> basicAuth() -> *handler*
```

## Execution order

The order in which Middleware is executed is determined by the order in which it is registered.
The process before the `next` of the first registered Middleware is executed first,
and the process after the `next` is executed last.
See below.

```ts
app.use(async (_, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})
app.use(async (_, next) => {
  console.log('middleware 2 start')
  await next()
  console.log('middleware 2 end')
})
app.use(async (_, next) => {
  console.log('middleware 3 start')
  await next()
  console.log('middleware 3 end')
})

app.get('/', (c) => {
  console.log('handler')
  return c.text('Hello!')
})
```

Result is the following.

```
middleware 1 start
  middleware 2 start
    middleware 3 start
      handler
    middleware 3 end
  middleware 2 end
middleware 1 end
```

Note that if the handler or any middleware throws, hono will catch it and either pass it to [your app.onError() callback](/docs/api/hono#error-handling) or automatically convert it to a 500 response before returning it up the chain of middleware. This means that next() will never throw, so there is no need to wrap it in a try/catch/finally.

## Built-in Middleware

Hono has built-in middleware.

```ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

::: warning
In Deno, it is possible to use a different version of middleware than the Hono version, but this can lead to bugs.
For example, this code is not working because the version is different.

```ts
import { Hono } from 'jsr:@hono/hono@4.4.0'
import { upgradeWebSocket } from 'jsr:@hono/hono@4.4.5/deno'

const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    // ...
  }))
)
```

:::

## Custom Middleware

You can write your own middleware directly inside `app.use()`:

```ts
// Custom logger
app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// Add a custom header
app.use('/message/*', async (c, next) => {
  await next()
  c.header('x-message', 'This is middleware!')
})

app.get('/message/hello', (c) => c.text('Hello Middleware!'))
```

However, embedding middleware directly within `app.use()` can limit its reusability. Therefore, we can separate our middleware into different files.

To ensure we don't lose type definitions for `context` and `next`, when separating middleware, we can use [`createMiddleware()`](/docs/helpers/factory#createmiddleware) from Hono's factory. This also allows us to type-safely [access data we've `set` in `Context`](https://hono.dev/docs/api/context#set-get) from downstream handlers.

```ts
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})
```

:::info
Type generics can be used with `createMiddleware`:

```ts
createMiddleware<{Bindings: Bindings}>(async (c, next) =>
```

:::

### Modify the Response After Next

Additionally, middleware can be designed to modify responses if necessary:

```ts
const stripRes = createMiddleware(async (c, next) => {
  await next()
  c.res = undefined
  c.res = new Response('New Response')
})
```

## Context access inside Middleware arguments

To access the context inside middleware arguments, directly use the context parameter provided by `app.use`. See the example below for clarification.

```ts
import { cors } from 'hono/cors'

app.use('*', async (c, next) => {
  const middleware = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return middleware(c, next)
})
```

### Extending the Context in Middleware

To extend the context inside middleware, use `c.set`. You can make this type-safe by passing a `{ Variables: { yourVariable: YourVariableType } }` generic argument to the `createMiddleware` function.

```ts
import { createMiddleware } from 'hono/factory'

const echoMiddleware = createMiddleware<{
  Variables: {
    echo: (str: string) => string
  }
}>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

### Type Inference Across Chained Middleware

When you chain multiple middleware using `.use()`, Hono automatically accumulates the `Variables` types. Route handlers that follow the middleware chain can access all variables from every preceding middleware in a type-safe way:

```ts
import { createMiddleware } from 'hono/factory'

const authMiddleware = createMiddleware<{
  Variables: { user: { id: string; name: string } }
}>(async (c, next) => {
  c.set('user', { id: '123', name: 'Alice' })
  await next()
})

const dbMiddleware = createMiddleware<{
  Variables: { db: { query: (sql: string) => Promise<unknown> } }
}>(async (c, next) => {
  c.set('db', {
    query: async (sql) => {
      /* ... */
    },
  })
  await next()
})

const app = new Hono()
  .use(authMiddleware)
  .use(dbMiddleware)
  .get('/', (c) => {
    // Both `user` and `db` are available and type-safe
    const user = c.var.user // { id: string; name: string }
    const db = c.var.db // { query: (sql: string) => Promise<unknown> }
    return c.json({ user })
  })
```

This works because each `.use()` call returns a new Hono instance with the merged type, so the type grows as middleware is chained. This eliminates the need to manually declare a combined `Env` type upfront for most use cases.

## Middleware Composition

In production applications, multiple middleware functions are often composed together to handle cross-cutting concerns such as logging, CORS headers, authentication, and error handling.

### Composing Multiple Middlewares on a Route

You can pass multiple middlewares directly as arguments into any route method (`app.get()`, `app.post()`, etc.) or `app.use()` before the final handler:

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Compose logger, CORS, and authentication on a single route
app.post(
  '/api/posts',
  logger(),
  cors(),
  bearerAuth({ token: 'secret-token' }),
  async (c) => {
    const body = await c.req.json()
    return c.json({ message: 'Post created', data: body }, 201)
  }
)
```

You can also compose middleware across routes by grouping common middleware at the application level or on sub-routers using `app.route()`:

```ts
const api = new Hono()

// Applied to all routes within this sub-router
api.use(logger())
api.use(cors())

// Applied only to admin endpoints
api.use('/admin/*', bearerAuth({ token: 'secret-token' }))

api.get('/admin/stats', (c) => c.json({ status: 'ok' }))
api.get('/public/feed', (c) => c.json({ feed: [] }))

app.route('/api', api)
```

### Execution Flow and Early Exit

When composing multiple middlewares, they execute according to the **onion model**: each middleware runs its logic before `await next()`, delegates to the next middleware or handler, and then runs its logic after `await next()` in reverse order.

Consider the route with `logger()`, `cors()`, and `bearerAuth()`:

```
Request
  │
  ▼
[logger]       ── (before next: records request start time)
  │
  ▼
[cors]         ── (before next: checks origin and preflight headers)
  │
  ▼
[bearerAuth]   ── (before next: validates bearer token)
  │
  ├─► [Invalid Token] ── early exit: returns 401 Response directly
  │
  ▼  [Valid Token]
[Handler]      ── (executes route logic and returns Response)
  │
  ▼
[bearerAuth]   ── (after next: passes response through)
  │
  ▼
[cors]         ── (after next: appends CORS headers to response)
  │
  ▼
[logger]       ── (after next: logs HTTP status code and response time)
  │
  ▼
Response to Client
```

#### Early Exit

If any middleware returns a `Response` without calling `next()`, execution halts for downstream middlewares and the handler. For example, if an unauthorized request arrives at `/api/posts`:

1. `logger` records the start time and calls `await next()`.
2. `cors` inspects the request and calls `await next()`.
3. `bearerAuth` detects an invalid token and returns a `401 Unauthorized` response without calling `next()`.
4. The route handler is never executed.
5. Execution unwinds: `cors` can still attach necessary headers to the 401 response, and `logger` logs the 401 status and elapsed time.

### Error Handling Middleware

By default, unhandled exceptions in any middleware or handler are caught by Hono and passed to [`app.onError()`](/docs/api/hono#error-handling).

However, you can also write an outer middleware that wraps downstream execution to monitor errors, log telemetry, or customize error responses. When an exception occurs downstream, Hono catches it, attaches the error to `c.error`, and continues unwinding the middleware chain:

```ts
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

// Outer error monitoring and wrapping middleware
const errorTracker = createMiddleware(async (c, next) => {
  await next()

  // Downstream errors caught by Hono are accessible via c.error
  if (c.error) {
    console.error(
      `[Error] ${c.req.method} ${c.req.url}:`,
      c.error.message
    )

    // Optionally customize or override the response
    c.res = c.json(
      {
        success: false,
        error: c.error.message || 'Internal Server Error',
      },
      c.res.status || 500
    )
  }
})

app.use(errorTracker)

app.get('/crash', () => {
  throw new Error('Database connection failed')
})
```

::: tip
Use `app.onError()` for global, application-wide error handling. Use wrapping middleware when you need route-scoped error tracking, custom telemetry, or need to transform error responses within a specific sub-router.
:::

### Reusable Chains and Utilities

- **[`factory.createHandlers()`](/docs/helpers/factory#factory-createhandlers)**: Define a reusable array of middlewares and a handler with complete type safety.
- **[`hono/combine`](/docs/middleware/builtin/combine)**: Combine multiple middlewares conditionally into a single middleware using `every()`, `some()`, or `except()`.

## Third-party Middleware

Built-in middleware does not depend on external modules, but third-party middleware can depend on third-party libraries. So with them, we may make a more complex application.

We can explore a variety of [third-party middleware](https://hono.dev/docs/middleware/third-party).
For example, we have GraphQL Server Middleware, Sentry Middleware, Firebase Auth Middleware, and others.
