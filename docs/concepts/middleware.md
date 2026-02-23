# ミドルウェア

`Response` を返すプリミティブを "ハンドラ" と呼びます。
"Middleware" はハンドラの前後で使用され `Request` と `Response` を処理します。
玉ねぎのような構造です。

![](/images/onion.png)

例えば、 "X-Response-Time" ヘッダを付与するミドルウェアはこのようになります。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  const start = performance.now()
  await next()
  const end = performance.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

このシンプルな方法によってカスタムミドルウェアを作成したり、ビルドインミドルウェアやサードパーティーミドルウェアを使用できます。
