# JWT Middleware

There is also middleware for JWT Authentication.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jwt } from 'https://deno.land/x/hono/middleware.ts'
```

:::

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
