---
title: Bearer Auth Middleware
---

# Bearer Auth Middleware

The Bearer Auth Middleware provides authentication by verifying an API token in the Request header.
The HTTP clients accessing the endpoint will add `Authorization` header with `Bearer {token}` as the header value.

Using `curl` from the terminal, it would look like this:

```
curl -H 'Authorization: Bearer honoiscool' http://localhost:8787/auth/page
```

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

app.use('/api/*', bearerAuth({ token }))

app.get('/api/page', (c) => {
  return c.json({ message: 'You are authorized' })
})
```

## Options

- `token` - _required_
  - The string to validate the incoming bearer token against
- `realm`
  - The domain name of the realm, as part of the returned WWW-Authenticate challenge header. Default is `""`
  - _See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives_
- `prefix`
  - The prefix for the Authorization header value. Default is `"Bearer"`
- `hashFunction`
  - A function to handle hashing for safe comparison of authentication tokens

## Recipes

### Using on Fastly Compute@Edge

_Fastly Compute@Edge_ requires a `hashFunction` to be defined for comparing the incoming Bearer token token with the stored value, as it doesn't provide the standard Web API implementation of the `crypto` module.

```ts
app.use(
  '/auth/*',
  bearerAuth({
    token: 'honoiscool', // Required
    hashFunction: (d: string) => SHA256(d).toString(),
  })
)
```
