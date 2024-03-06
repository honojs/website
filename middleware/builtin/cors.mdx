---
title: CORS Middleware
---

# CORS Middleware

There are many use cases of Cloudflare Workers as Web APIs and calling them from external front-end application.
For them we have to implement CORS, let's do this with middleware as well.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { cors } from 'hono/cors'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { cors } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.all('/api/abc', (c) => {
  return c.json({ success: true })
})
app.all('/api2/abc', (c) => {
  return c.json({ success: true })
})
```

Multiple origins:

```ts
app.use(
  '/api3/*',
  cors({
    origin: ['https://example.com', 'https://example.org'],
  })
)

// Or you can use "function"
app.use(
  '/api4/*',
  cors({
    origin: (origin) => {
      return origin.endsWith('.example.com') ? origin : 'http://example.com'
    },
  })
)
```

## Options

- `origin`: string | string[] | (origin:string) => string
  - The value of "_Access-Control-Allow-Origin_" CORS header. You can also pass the callback function like `origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')`. Default is `*`
- `allowMethods`: string[]
  - The value of "_Access-Control-Allow-Methods_" CORS header. Default is `['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']`
- `allowHeaders`: string[]
  - The value of "_Access-Control-Allow-Headers_" CORS header. Default is `[]`
- `maxAge`: number
  - The value of "_Access-Control-Max-Age_" CORS header.
- `credentials`: boolean
  - The value of "_Access-Control-Allow-Credentials_" CORS header.
- `exposeHeaders`: string[]
  - The value of "_Access-Control-Expose-Headers_" CORS header. Default is `[]`
