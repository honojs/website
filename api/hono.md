# App - Hono

`Hono` is the primary object.
It will be imported first and used until the end.

```ts
import { Hono } from 'hono'

const app = new Hono()
//...

export default app // for Cloudflare Workers or Bun
```

## Methods

An instance of `Hono` has these methods.

- app.**HTTP_METHOD**(\[path,\]handler|middleware...)
- app.**all**(\[path,\]handler|middleware...)
- app.**on**(method|method[], path, handler|middleware...)
- app.**route**(path, \[app\])
- app.**use**(\[path,\]middleware)
- app.**notFound**(handler)
- app.**onError**(err, handler)
- app.**showRoutes**()
- app.**fire**()
- app.**fetch**(request, env, event)
- app.**request**(path, options)

The first part of them is used for routing, please refer to the [routing section](/api/routing).

## Not Found

`app.notFound` for customizing Not Found Response.

```ts
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## Error Handling

`app.onError` handles the error and returns the customized Response.

```ts
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## fire()

`app.fire()` do this.

```ts
addEventListener('fetch', (event) => {
  event.respondWith(this.handleEvent(event))
})
```

## fetch()

`app.fetch` will be entry point of your application.

For Cloudflare Workers, you can write below:

```ts
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
}
```

or just do:

```ts
export default app
```

Bun:

```ts
export default {
  port: 3000,
  fetch: app.fetch,
}
```

Lagon:

```ts
export const handler = app.fetch
```

## request()

`request` is a useful method for testing.

```js
test('GET /hello is ok', async () => {
  const res = await app.request('http://localhost/hello')
  expect(res.status).toBe(200)
})
```

## showRoutes()

`app.showRoutes()` show the registered routes on your console like the below:

```
GET       /v1/posts
GET       /v1/posts/:id
POST      /v1/posts
```

## strict mode

By default, strict mode is `true` and the following paths are treated differently.

- `/hello`
- `/hello/`

`app.get('/hello')` will not match `GET /hello/`.

If you set the `false`, those paths are treated as the same.

```ts
const app = new Hono({ strict: false })
```

## router option

The `router` option specify which router is used inside. The default router is `SmartRouter`. If you want to use `RegExpRouter`, write like this:

```ts
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })
```

## Generics

You can pass the Generics to specify the types of Cloudflare Workers Bindings and the variables used in `c.set`/`c.get`.

```ts
type Bindings = {
  TOKEN: string
}

type Variables = {
  user: User
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('/auth/*', async (c, next) => {
  const token = c.env.TOKEN // token is `string`
  // ...
  c.set('user', user) // user should be `User`
  await next()
})
```
