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

## サードパーティーミドルウェア

ビルトインミドルウェアは外部モジュールに依存しません、しかしサードパーティーミドルウェアはサードパーティー製ライブラリに依存している可能性があります。
したがって、それらを使用してより複雑なアプリケーションを作成できると思います。

例えば、 GraphQL サーバーミドルウェア、 Sentry ミドルウェア、 Firebase Auth ミドルウェア等...
