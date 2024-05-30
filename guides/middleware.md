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
import { Hono } from 'https://deno.land/x/hono@v2.0.0/mod.ts'
import { upgradeWebSocket } from 'https://deno.land/x/hono@v4.1.4/helper.ts'

const app = new Hono()

app.get('/ws', upgradeWebSocket(() => ({
  // ...
})))
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
[`createMiddleware()`](/helpers/factory#createmiddleware) from Hono's factory.

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

## Third-party Middleware

Built-in middleware does not depend on external modules, but third-party middleware can depend on third-party libraries.
So with them, we may make a more complex application.

For example, we have GraphQL Server Middleware, Sentry Middleware, Firebase Auth Middleware, and others.
