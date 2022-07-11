---
title: Basic Auth Middleware
---

# Basic Auth Middleware

Implementing basic authentication with Cloudflare Workers is more complicated than it seems, but with this, it's a snap.

## Import


{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { basicAuth } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}



## Usage

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})

```


For Fastly Compute@Edge, polyfill `crypto` or use `crypto-js`.

Install:

```
npm i crypto-js
```

Override `hashFunction`:

```js
import { SHA256 } from 'crypto-js'

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
    hashFunction: (d: string) => SHA256(d).toString(), // For Fastly Compute@Edge
  })
)
```
