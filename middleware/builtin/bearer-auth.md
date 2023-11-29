# Bearer Auth Middleware

The Bearer Auth Middleware provides authentication by verifying an API token in the Request header.
The HTTP clients accessing the endpoint will add the `Authorization` header with `Bearer {token}` as the header value.

Using `curl` from the terminal, it would look like this:

```
curl -H 'Authorization: Bearer honoiscool' http://localhost:8787/auth/page
```

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { bearerAuth } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

const token = 'honoiscool'

app.use('/api/*', bearerAuth({ token }))

app.get('/api/page', (c) => {
  return c.json({ message: 'You are authorized' })
})
```

To restrict to a specific route + method:

```ts
const app = new Hono()

const token = 'honoiscool'

app.get('/api/page', (c) => {
  return c.json({ message: 'Read posts' })
})

app.post('/api/page', bearerAuth({ token }), (c) => {
  return c.json({ message: 'Created post!' }, 201)
})
```

To implement multiple tokens of varying privilege:

```ts
const app = new Hono()

const rToken = 'read'
const pToken = 'read+write'
const validTokens = [rToken, pToken]

api.use('/posts/:id', async (c, next) => {
  // PATCH and DELETE require the privileged token
  if (c.event.request.method === 'PATCH' || c.event.request.method === 'DELETE') {
    const bearer = bearerAuth({ token: pToken })
    return bearer(c, next)
  }
  // GET works with any valid token
  const bearer = bearerAuth({ token: validTokens })
  return bearer(c, next)
})
```

## Options

- `token`: string | string[] - _required_
  - The string to validate the incoming bearer token against
- `realm`: string
  - The domain name of the realm, as part of the returned WWW-Authenticate challenge header. Default is `""`
  - _See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives_
- `prefix`: string
  - The prefix for the Authorization header value. Default is `"Bearer"`
- `hashFunction`: Function
  - A function to handle hashing for safe comparison of authentication tokens
