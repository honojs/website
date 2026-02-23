# JWT 認証ミドルウェア

JWT 認証ミドルウェアは、 JWT を使ってトークンを検証して認証することができます。
ミドルウェアは、 `cookie` オプションがセットされていない場合に `Authorization` ヘッダを確認します。 ヘッダの名前は `headerName` オプションでカスタマイズすることができます。

:::info
クライアントから送信された Authotization ヘッダには、指定されたスキーマが必要です。

例: `Bearer my.token.value` や `Basic my.token.value` など
:::

## Import

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
```

## 使い方

```ts
// Specify the variable types to infer the `c.get('jwtPayload')`:
type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    alg: 'HS256',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

ペイロードを取得する:

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    alg: 'HS256',
    issuer: 'my-trusted-issuer',
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022, "iss": "my-trusted-issuer" }
})
```

::: tip

`jwt()` は単なるミドルウェア関数です。 環境変数を使いたい場合は、 (例: `c.env.JWT_SECRET`) 、 以下のように使用できます:

```js
app.use('/auth/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
  })
  return jwtMiddleware(c, next)
})
```

:::

## オプション

### <Badge type="danger" text="required" /> secret: `string`

秘密鍵の値。

### <Badge type="danger" text="required" /> alg: `string`

認証に使われるアルゴリズム。

利用可能な型は `HS256` | `HS384` | `HS512` | `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA` です。

### <Badge type="info" text="optional" /> cookie: `string`

この値が設定されている場合は、 Cookie ヘッダから値が取得され、検証されます。

### <Badge type="info" text="optional" /> headerName: `string`

JWT トークンを探すヘッダの名前。 デフォルトは `Authorization` です。

```ts
app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    alg: 'HS256',
    headerName: 'x-custom-auth-header',
  })
)
```

### <Badge type="info" text="optional" /> verifyOptions: `VerifyOptions`

トークンの検証を制御するオプション。

#### <Badge type="info" text="optional" /> verifyOptions.iss: `string | RexExp`

期待される検証トークンの発行者。 この値が設定されていない場合、 `iss` クレームはチェック**されません**。

#### <Badge type="info" text="optional" /> verifyOptions.nbf: `boolean`

`nbf`（not before）クレームは、存在し、かつこれが `true` に設定されている場合に検証されます。 デフォルトは `true` です。

#### <Badge type="info" text="optional" /> verifyOptions.iat: `boolean`

`iat` （not before）クレームは、存在し、かつこれが `true` に設定されている場合に検証されます。 デフォルトは `true` です。

#### <Badge type="info" text="optional" /> verifyOptions.exp: `boolean`

`exp` （not before）クレームは、存在し、かつこれが `true` に設定されている場合に検証されます。 デフォルトは `true` です。
