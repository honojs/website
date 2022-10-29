---
title: JWT Auth Middleware
---

# JWT Middleware

There is also middleware for JWT Authentication.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jwt } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

## Usage

```js
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```
