# App - Hono

`Hono` は中心的なオブジェクトです。
最初にインポートされ、最後まで使用されます。

```ts
import { Hono } from 'hono'

const app = new Hono()
//...

export default app // for Cloudflare Workers or Bun
```

## メソッド

`Hono` のインスタンスには以下のメソッドがあります。

- app.**HTTP_METHOD**(\[path,\]handler|middleware...)
- app.**all**(\[path,\]handler|middleware...)
- app.**on**(method|method[], path|path[], handler|middleware...)
- app.**use**(\[path,\]middleware)
- app.**route**(path, \[app\])
- app.**basePath**(path)
- app.**notFound**(handler)
- app.**onError**(err, handler)
- app.**mount**(path, anotherApp)
- app.**fire**()
- app.**fetch**(request, env, event)
- app.**request**(path, options)

これらの前半の部分はルーティングで使用されます。 [ルーティング](/api/routing)を読んでください。

## Not Found

`app.notFound` は Not Found レスポンスをカスタマイズできます。
```ts
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## エラーハンドリング

`app.onError` はエラーをハンドルし、カスタマイズしたレスポンスを返すことが出来ます。

```ts
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## fire()

`app.fire()` は自動で `fetch` イベントリスナーを追加します。

これは [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) を使用している [non-ES module Cloudflare Workers](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/) のような環境で上手く機能します。

`app.fire()` はあなたの代わりに以下の作業を行います:

```ts
addEventListener('fetch', (event: FetchEventLike): void => {
  event.respondWith(this.dispatch(...))
})
```

## fetch()

`app.fetch` はアプリケーションのエントリポイントです。

Cloudflare Workers ではこのように使用できます:

```ts
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
}
```

もしくは:

```ts
export default app
```

Bun:

```ts
export default app // [!code --]
export default { // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## request()

`request` はテストに便利なメソッドです。

URL かパスを渡して GET リクエストを送信します。
`app` は `Response` オブジェクトを返します。

```ts
test('GET /hello is ok', async () => {
  const res = await app.request('/hello')
  expect(res.status).toBe(200)
})
```

また、 `Request` オブジェクトを渡すことも出来ます:

```ts
test('POST /message is ok', async () => {
  const req = new Request('Hello!', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
})
```

## mount()

`mount()` は他のフレームワークで書かれたアプリケーションを Hono のアプリケーションにマウントできます。

```ts
import { Router as IttyRouter } from 'itty-router'
import { Hono } from 'hono'

// Create itty-router application
const ittyRouter = IttyRouter()

// Handle `GET /itty-router/hello`
ittyRouter.get('/hello', () => new Response('Hello from itty-router'))

// Hono application
const app = new Hono()

// Mount!
app.mount('/itty-router', ittyRouter.handle)
```

## strict mode

strict mode はデフォルトで `true` で、以下のルートが区別されます。

- `/hello`
- `/hello/`

`app.get('/hello')` は `GET /hello/` にマッチしません。

strict mode を `false` に設定した場合、2つのルートは等しくなります。

```ts
const app = new Hono({ strict: false })
```

## ルーターオプション

`router` オプションはどのルーターを使うか指定できます。 デフォルトでは `SmartRouter` が使われます。 `RegExpRouter` を使いたい場合、このように `Hono` のインスタンスを生成してください。

```ts
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })
```

## ジェネリクス

ジェネリクスを使用して、 `c.set` / `c.get` で使用される Cloudflare Workers バインディングと変数を追加します。

```ts
type Bindings = {
  TOKEN: string
}

type Variables = {
  user: User
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('/auth/*', async (c, next) => {
  const token = c.env.TOKEN // token is `string`
  // ...
  c.set('user', user) // user should be `User`
  await next()
})
```
