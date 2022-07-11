---
title: Bearer Auth Middleware
---

# Bearer Auth Middleware

Bearer Auth Middleware provides authentication by verifying API tokens in Request header.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { bearerAuth } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}


## Usage

```ts
const app = new Hono()

const token = 'honoiscool'

app.use('/auth/*', bearerAuth({ token }))

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

## Options

```ts
app.use(
  '/auth/*',
  bearerAuth({
    token: 'honoiscool', // Required
    realm: 'example.com',
    prefix: 'Bot'
    hashFunction: (d: string) => SHA256(d).toString(), // For Fastly Compute@Edge
  })
)
```
