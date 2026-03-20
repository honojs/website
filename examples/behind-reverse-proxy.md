# Bind a reverse proxy

Suppose you want to run the Hono application behind a reverse proxy. In that case, you may need to reflect the value of the `x-forwarded-proto` header. For example, you need to be able to get the protocol of the URL specified by `x-forwarded-proto` in `c.req.url`.

The best practice for handling this is to create a new `Request` object before Hono's `app.fetch` and pass it to `app.fetch`.

## Cloudflare Workers / Deno / Bun

```ts
import { Hono } from 'hono'

const app = new Hono()

//...

export default {
  fetch: (req: Request) => {
    const url = new URL(req.url)
    url.protocol =
      req.headers.get('x-forwarded-proto') ?? url.protocol
    return app.fetch(new Request(url, req))
  },
}
```

## Node.js

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

serve({
  fetch: (req) => {
    const url = new URL(req.url)
    url.protocol =
      req.headers.get('x-forwarded-proto') ?? url.protocol
    return app.fetch(new Request(url, req))
  },
})
```
