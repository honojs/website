---
title: ETag Middleware
---

# ETag Middleware

Using this middleware, you can add ETag headers easily.

## Import


{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { etag } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}


## Usage

```ts
const app = new Hono()

app.use('/etag/*', etag())
app.get('/etag/abc', (c) => {
  return c.text('Hono is cool')
})
```
