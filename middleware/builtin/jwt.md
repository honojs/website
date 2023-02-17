# JWT Auth Middleware

The JWT Auth Middleware provides authentication by verifying the token with JWT.
`Authorization` header value or cookie value specified by the `cookie` option will be used as a token.

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

## Options

- `secret`: string - _required_
  - A value of your secret key.
- `cookie`: string
  - If this value is set, then the value is retrieved from the cookie header using that value as a key, which is then validated as a token.
- `alg`: string
  - An algorithm type that is used for verifying. Available types are `HS256` | `HS384` | `HS512`. Default is `HS256`.
