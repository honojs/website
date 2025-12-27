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
import { verifyWithJwks } from 'hono/jwt'
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

Anonymous access:

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: (c) =>
      `https://${c.env.authServer}/.well-known/jwks.json`,
    allow_anon: true,
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload ?? { message: 'hello anon' })
})
```

## Using `verifyWithJwks` outside of middleware

The `verifyWithJwks` utility function can be used to verify JWT tokens outside of Hono's middleware context, such as in SvelteKit SSR pages or other server-side environments:

```ts
const id_payload = await verifyWithJwks(
  id_token,
  {
    jwks_uri: 'https://your-auth-server/.well-known/jwks.json',
  },
  {
    cf: { cacheEverything: true, cacheTtl: 3600 },
  }
)
```

## Options

### <Badge type="info" text="optional" /> keys: `HonoJsonWebKey[] | (c: Context) => Promise<HonoJsonWebKey[]>`

The values of your public keys, or a function that returns them. The function receives the Context object.

### <Badge type="info" text="optional" /> jwks_uri: `string` | `(c: Context) => Promise<string>`

If this value is set, attempt to fetch JWKs from this URI, expecting a JSON response with `keys`, which are added to the provided `keys` option. You can also pass a callback function to dynamically determine the JWKS URI using the Context.

### <Badge type="info" text="optional" /> allow_anon: `boolean`

If this value is set to `true`, requests without a valid token will be allowed to pass through the middleware. Use `c.get('jwtPayload')` to check if the request is authenticated. The default is `false`.

### <Badge type="info" text="optional" /> cookie: `string`

If this value is set, then the value is retrieved from the cookie header using that value as a key, which is then validated as a token.

### <Badge type="info" text="optional" /> headerName: `string`

The name of the header to look for the JWT token. The default is `Authorization`.
