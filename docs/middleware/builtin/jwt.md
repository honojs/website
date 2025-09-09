# JWT Auth Middleware

The JWT Auth Middleware provides authentication by verifying the token with JWT.
The middleware will check for an `Authorization` header if the `cookie` option is not set. You can customize the header name using the `headerName` option.

:::info
The Authorization header sent from the client must have a specified scheme.

Example: `Bearer my.token.value` or `Basic my.token.value`
:::

## Import

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
```

## Usage

```ts
// Specify the variable types to infer the `c.get('jwtPayload')`:
type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

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

Get payload:

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    issuer: 'my-trusted-issuer',
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022, "iss": "my-trusted-issuer" }
})
```

::: tip

`jwt()` is just a middleware function. If you want to use an environment variable (eg: `c.env.JWT_SECRET`), you can use it as follows:

```js
app.use('/auth/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  })
  return jwtMiddleware(c, next)
})
```

:::

## Options

### <Badge type="danger" text="required" /> secret: `string`

A value of your secret key.

### <Badge type="info" text="optional" /> cookie: `string`

If this value is set, then the value is retrieved from the cookie header using that value as a key, which is then validated as a token.

### <Badge type="info" text="optional" /> alg: `string`

An algorithm type that is used for verifying. The default is `HS256`.

Available types are `HS256` | `HS384` | `HS512` | `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA`.

### <Badge type="info" text="optional" /> headerName: `string`

The name of the header to look for the JWT token. The default is `Authorization`.

```ts
app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    headerName: 'x-custom-auth-header',
  })
)
```

### <Badge type="info" text="optional" /> verifyOptions: `VerifyOptions`

Options controlling verification of the token.

#### <Badge type="info" text="optional" /> verifyOptions.iss: `string | RexExp`

The expected issuer used for token verification. The `iss` claim will **not** be checked if this isn't set.

#### <Badge type="info" text="optional" /> verifyOptions.nbf: `boolean`

The `nbf` (not before) claim will be verified if present and this is set to `true`. The default is `true`.

#### <Badge type="info" text="optional" /> verifyOptions.iat: `boolean`

The `iat` (not before) claim will be verified if present and this is set to `true`. The default is `true`.

#### <Badge type="info" text="optional" /> verifyOptions.exp: `boolean`

The `exp` (not before) claim will be verified if present and this is set to `true`. The default is `true`.
