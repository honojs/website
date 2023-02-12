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

## Options

- `token`: string - _required_
  - The string to validate the incoming bearer token against
- `realm`: string
  - The domain name of the realm, as part of the returned WWW-Authenticate challenge header. Default is `""`
  - _See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives_
- `prefix`: string
  - The prefix for the Authorization header value. Default is `"Bearer"`
- `hashFunction`: Function
  - A function to handle hashing for safe comparison of authentication tokens

## Recipes

### Using on Fastly Compute@Edge

To use this middleware on Compute@Edge, you need to do one of two things:

1. Polyfill the `crypto` module
2. Install the `crypto-js` package, and provide a `hashFunction` to the middleware. (recommended)

Here's how to use this middleware with the `crypto-js` method:

1. Install `crypto-js` via npm:

```
npm i crypto-js
```

2. Provide a `hashFunction`, using the SHA-256 implementation from `crypto-js`, to the middleware:

```ts
import { SHA256 } from 'crypto-js'

app.use(
  '/auth/*',
  bearerAuth({
    token: 'honoiscool', // Required
    hashFunction: (d: string) => SHA256(d).toString(),
  })
)
```
