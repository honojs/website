# JWK Auth Middleware

The JWK Auth Middleware authenticates requests by verifying tokens using JWK (JSON Web Key). It checks for an `Authorization` header and other configured sources, such as cookies, if specified. Specifically, it validates tokens using the provided `keys`, retrieves keys from `jwks_uri` if specified, and supports token extraction from cookies if the `cookie` option is set.

:::info
The Authorization header sent from the client must have a specified scheme.

Example: `Bearer my.token.value` or `Basic my.token.value`
:::

## Import

```ts
import { Hono } from 'hono'
import { jwk } from 'hono/jwk'
```

## Usage

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

Get payload:

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})
```

## Options

### <Badge type="info" text="optional" /> keys: `HonoJsonWebKey[] | (() => Promise<HonoJsonWebKey[]>)`

The values of your public keys, or a function that returns them.

### <Badge type="info" text="optional" /> jwks_uri: `string`

If this value is set, attempt to fetch JWKs from this URI, expecting a JSON response with `keys`, which are added to the provided `keys` option.

### <Badge type="info" text="optional" /> cookie: `string`

If this value is set, then the value is retrieved from the cookie header using that value as a key, which is then validated as a token.
