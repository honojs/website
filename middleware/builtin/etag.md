# ETag Middleware

Using this middleware, you can add ETag headers easily.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { etag } from 'hono/etag'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { etag } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.use('/etag/*', etag())
app.get('/etag/abc', (c) => {
  return c.text('Hono is cool')
})
```
