# Middleware

Middleware works after/before Handler. We can get `Request` before dispatching or manipulate `Response` after dispatching.

## Definition of Middleware

- Handler - should return `Response` object. Only one handler will be called.
- Middleware - should return nothing, will be proceeded to next middleware with `await next()`

The user can register middleware using `app.use` or using `app.HTTP_METHOD` as well as the handlers. For this feature, it's easy to specify the path and the method.

```ts
// match any method, all routes
app.use(logger())

// specify path
app.use('/posts/*', cors())

// specify method and path
app.post('/posts/*', basicAuth())
```

If the handler returns `Response`, it will be used for the end-user, and stopping the processing.

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

However, embedding middleware directly within `app.use()` can limit its reusability. Therefore, we can separate our
middleware into different files.

To ensure we don't lose type definitions for `context` and `next`, when separating middleware, we can use
[`createMiddleware()`](/docs/helpers/factory#createmiddleware) from Hono's factory. This also allows us to type-safely [access data we've `set` in `Context`](https://hono.dev/docs/api/context#set-get) from downstream handlers.

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

## Third-party Middleware

Built-in middleware does not depend on external modules, but third-party middleware can depend on third-party libraries.
So with them, we may make a more complex application.

We can explore a variety of [third-party middleware](https://hono.dev/docs/middleware/third-party).
For example, we have GraphQL Server Middleware, Sentry Middleware, Firebase Auth Middleware, and others.
