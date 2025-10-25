# Bearer Auth Middleware

The Bearer Auth Middleware provides authentication by verifying an API token in the Request header.
The HTTP clients accessing the endpoint will add the `Authorization` header with `Bearer {token}` as the header value.

Using `curl` from the terminal, it would look like this:

```sh
curl -H 'Authorization: Bearer honoiscool' http://localhost:8787/auth/page
```

## Import

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
```

## Usage

> [!NOTE]
> Your `token` must match the regex `/[A-Za-z0-9._~+/-]+=*/`, otherwise a 400 error will be returned. Notably, this regex accommodates both URL-safe Base64- and standard Base64-encoded JWTs. This middleware does not require the bearer token to be a JWT, just that it matches the above regex.

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

To implement multiple tokens (E.g., any valid token can read but create/update/delete are restricted to a privileged token):

```ts
const app = new Hono()

const readToken = 'read'
const privilegedToken = 'read+write'
const privilegedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

app.on('GET', '/api/page/*', async (c, next) => {
  // List of valid tokens
  const bearer = bearerAuth({ token: [readToken, privilegedToken] })
  return bearer(c, next)
})
app.on(privilegedMethods, '/api/page/*', async (c, next) => {
  // Single valid privileged token
  const bearer = bearerAuth({ token: privilegedToken })
  return bearer(c, next)
})

// Define handlers for GET, POST, etc.
```

If you want to verify the value of the token yourself, specify the `verifyToken` option; returning `true` means it is accepted.

```ts
const app = new Hono()

app.use(
  '/auth-verify-token/*',
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === 'dynamic-token'
    },
  })
)
```

## Options

### <Badge type="danger" text="required" /> token: `string` | `string[]`

The string to validate the incoming bearer token against.

### <Badge type="info" text="optional" /> realm: `string`

The domain name of the realm, as part of the returned WWW-Authenticate challenge header. The default is `""`.
See more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="optional" /> prefix: `string`

The prefix (or known as `schema`) for the Authorization header value. The default is `"Bearer"`.

### <Badge type="info" text="optional" /> headerName: `string`

The header name. The default value is `Authorization`.

### <Badge type="info" text="optional" /> hashFunction: `Function`

A function to handle hashing for safe comparison of authentication tokens.

### <Badge type="info" text="optional" /> verifyToken: `(token: string, c: Context) => boolean | Promise<boolean>`

The function to verify the token.

### <Badge type="info" text="optional" /> noAuthenticationHeaderMessage: `string | object | MessageFunction`

`MessageFunction` is `(c: Context) => string | object | Promise<string | object>`. The custom message if it does not have an authentication header.

### <Badge type="info" text="optional" /> invalidAuthenticationHeaderMessage: `string | object | MessageFunction`

The custom message if the authentication header is invalid.

### <Badge type="info" text="optional" /> invalidTokenMessage: `string | object | MessageFunction`

The custom message if the token is invalid.
