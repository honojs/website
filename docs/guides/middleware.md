# ミドルウェア

ミドルウェアはハンドラの前後で動作します。 ディスパッチ前に `Request` を取得したり、ディスパッチ後に `Response` を操作したりできます。

## ミドルウェアの定義

- ハンドラ - `Response` オブジェクトを返す必要があります。 一つのヘルパーのみが実行されます。
- ミドルウェア - 何も返さないはずです。 `await next()` で次のミドルウェアに進みます。

ミドルウェアの登録には `app.use` か `app.HTTP_METHOD` をハンドラと同じように登録できます。 この方法ではパスや HTTP メソッドを簡単に指定できます。

```ts
// match any method, all routes
app.use(logger())

// specify path
app.use('/posts/*', cors())

// specify method and path
app.post('/posts/*', basicAuth())
```

ハンドラが `Response` を返した場合、エンドユーザのために使用されて、処理が終了します。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

この場合、ディスパッチ前に4つのミドルウェアが使用されます:

```ts
logger() -> cors() -> basicAuth() -> *handler*
```

## 実行順序

ミドルウェアが実行される順序は、ミドルウェアが登録された順序によって決まります。
最初に登録されたミドルウェアの `next` より前の処理が最初に実行され、
`next` 以降の処理が最後に実行されます。
実例を見てください。

```ts
app.use(async (_, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})
app.use(async (_, next) => {
  console.log('middleware 2 start')
  await next()
  console.log('middleware 2 end')
})
app.use(async (_, next) => {
  console.log('middleware 3 start')
  await next()
  console.log('middleware 3 end')
})

app.get('/', (c) => {
  console.log('handler')
  return c.text('Hello!')
})
```

このような結果になります。

```
middleware 1 start
  middleware 2 start
    middleware 3 start
      handler
    middleware 3 end
  middleware 2 end
middleware 1 end
```

## ビルトインミドルウェア

Hono にはビルトインミドルウェアがあります。

```ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

::: warning
In Deno, it is possible to use a different version of middleware than the Hono version, but this can lead to bugs.
For example, this code is not working because the version is different.

```ts
import { Hono } from 'jsr:@hono/hono@4.4.0'
import { upgradeWebSocket } from 'jsr:@hono/hono@4.4.5/deno'

const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    // ...
  }))
)
```

:::

## カスタムミドルウェア

独自のミドルウェアを作成できます。

```ts
// Custom logger
app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// Add a custom header
app.use('/message/*', async (c, next) => {
  await next()
  c.header('x-message', 'This is middleware!')
})

app.get('/message/hello', (c) => c.text('Hello Middleware!'))
```

However, embedding middleware directly within `app.use()` can limit its reusability. Therefore, we can separate our
middleware into different files.

To ensure we don't lose type definitions for `context` and `next`, when separating middleware, we can use
[`createMiddleware()`](/docs/helpers/factory#createmiddleware) from Hono's factory.

```ts
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})
```

:::info
Type generics can be used with `createMiddleware`:

```ts
createMiddleware<{Bindings: Bindings}>(async (c, next) =>
```

:::

### Modify the Response After Next

Additionally, middleware can be designed to modify responses if necessary:

```ts
const stripRes = createMiddleware(async (c, next) => {
  await next()
  c.res = undefined
  c.res = new Response('New Response')
})
```

## Context access inside Middleware arguments

To access the context inside middleware arguments, directly use the context parameter provided by `app.use`. See the example below for clarification.

```ts
import { cors } from 'hono/cors'

app.use('*', async (c, next) => {
  const middleware = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return middleware(c, next)
})
```

## サードパーティーミドルウェア

ビルトインミドルウェアは外部モジュールに依存しません、しかしサードパーティーミドルウェアはサードパーティー製ライブラリに依存している可能性があります。
したがって、それらを使用してより複雑なアプリケーションを作成できると思います。

例えば、 GraphQL サーバーミドルウェア、 Sentry ミドルウェア、 Firebase Auth ミドルウェア等...
