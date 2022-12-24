---
title: Hono(API)
weight: 100
---

# Hono(API)

`Hono` is primary object.
It will be imported first and used until the end.

```ts
import { Hono } from 'hono'

const app = new Hono()
//...

export default app // for Cloudflare Workers
```

## Methods

An instance of `Hono` has these methods.

- app.**HTTP_METHOD**(\[path,\]handler|middleware...)
- app.**all**(\[path,\]handler|middleware...)
- app.**on**(method, path, handler|middleware...)
- app.**route**(path, \[app\])
- app.**use**(\[path,\]middleware)
- app.**notFound**(handler)
- app.**onError**(err, handler)
- app.**fire**()
- app.**fetch**(request, env, event)
- app.**request**(path, options)

The first part of them is used for routing, please refer to the [routing section](/docs/api/routing).

## Not Found

`app.notFound` for customizing Not Found Response.

```js
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## Error Handling

`app.onError` handle the error and return the customized Response.

```js
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## fire

`app.fire()` do this.

```ts
addEventListener('fetch', (event) => {
  event.respondWith(this.handleEvent(event))
})
```

## fetch

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

Deno:

```ts
serve(app.fetch)
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

## request

`request` is a useful method for testing.

```js
test('GET /hello is ok', async () => {
  const res = await app.request('http://localhost/hello')
  expect(res.status).toBe(200)
})
```

## router option

The `router` option specify which router is used inside. The default router is `TrieRouter`. If you want to use `RegExpRouter`, write like this:

```ts
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })
```
